import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import Order from '../../../models/Order'
import { createOrder, getOrderTracking, getOrderStatus, refreshAccessToken } from '../../../lib/aliexpress'

/**
 * AliExpress Order Management API
 * 
 * POST /api/aliexpress/orders - Forward order naar AliExpress
 * GET /api/aliexpress/orders/[orderId]/tracking - Haal tracking op
 * GET /api/aliexpress/orders/[orderId]/status - Haal order status op
 */
export default async function handler(req, res) {
  await connectDB()

  try {
    // Haal admin user op met AliExpress tokens
    const adminUser = await User.findOne({ role: 'admin' })

    if (!adminUser || !adminUser.aliexpress?.accessToken) {
      return res.status(401).json({
        success: false,
        message: 'AliExpress niet geautoriseerd. Ga naar /dropshipping om te autoriseren.'
      })
    }

    let accessToken = adminUser.aliexpress.accessToken

    // Check of token expired is en refresh indien nodig
    if (adminUser.aliexpress.expiresAt && new Date() >= new Date(adminUser.aliexpress.expiresAt)) {
      console.log('🔄 Access token expired, refreshing...')
      try {
        const tokenData = await refreshAccessToken(adminUser.aliexpress.refreshToken)
        accessToken = tokenData.accessToken
        
        adminUser.aliexpress.accessToken = tokenData.accessToken
        adminUser.aliexpress.refreshToken = tokenData.refreshToken || adminUser.aliexpress.refreshToken
        adminUser.aliexpress.expiresIn = tokenData.expiresIn
        adminUser.aliexpress.lastRefresh = new Date()
        adminUser.aliexpress.expiresAt = new Date(Date.now() + tokenData.expiresIn * 1000)
        await adminUser.save()
        
        console.log('✅ Access token refreshed')
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError)
        return res.status(401).json({
          success: false,
          message: 'AliExpress token refresh gefaald. Herautoriseer via /dropshipping'
        })
      }
    }

    if (req.method === 'POST') {
      // Forward order naar AliExpress
      const { orderId, productId, quantity, skuId, shippingAddress } = req.body

      if (!orderId || !productId || !quantity || !shippingAddress) {
        return res.status(400).json({
          success: false,
          message: 'orderId, productId, quantity en shippingAddress zijn vereist'
        })
      }

      // Haal order op uit database
      const order = await Order.findById(orderId)
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order niet gevonden'
        })
      }

      console.log(`📦 Forwarding order ${orderId} naar AliExpress...`)

      // Maak order aan op AliExpress
      const aliOrder = await createOrder(accessToken, {
        productId,
        quantity: parseInt(quantity),
        skuId,
        shippingAddress: {
          contact_person: shippingAddress.name || order.shippingAddress.name,
          mobile: shippingAddress.phone || order.shippingAddress.phone,
          country: shippingAddress.country || order.shippingAddress.country || 'NL',
          province: shippingAddress.state || order.shippingAddress.state || '',
          city: shippingAddress.city || order.shippingAddress.city,
          address: shippingAddress.address || order.shippingAddress.address,
          zip: shippingAddress.postalCode || order.shippingAddress.postalCode
        }
      })

      if (aliOrder.error_response) {
        return res.status(400).json({
          success: false,
          message: aliOrder.error_response.msg,
          code: aliOrder.error_response.code
        })
      }

      const aliOrderId = aliOrder.aeop_ae_order_create_response?.result?.order_id

      // Update order in database
      order.aliexpressOrderId = aliOrderId
      order.status = 'processing'
      order.dropshipStatus = 'forwarded'
      order.dropshipForwardedAt = new Date()
      await order.save()

      console.log(`✅ Order ${orderId} succesvol doorgestuurd naar AliExpress (Order ID: ${aliOrderId})`)

      return res.status(200).json({
        success: true,
        message: 'Order succesvol doorgestuurd naar AliExpress',
        orderId: orderId,
        aliexpressOrderId: aliOrderId,
        order: order
      })

    } else {
      res.setHeader('Allow', ['POST'])
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      })
    }

  } catch (error) {
    console.error('❌ AliExpress orders API error:', error)
    return res.status(500).json({
      success: false,
      message: 'Fout bij AliExpress order API call',
      error: error.message
    })
  }
}

/**
 * GET /api/aliexpress/orders/[orderId]/tracking
 */
export async function getTracking(req, res) {
  await connectDB()

  try {
    const adminUser = await User.findOne({ role: 'admin' })
    if (!adminUser || !adminUser.aliexpress?.accessToken) {
      return res.status(401).json({
        success: false,
        message: 'AliExpress niet geautoriseerd'
      })
    }

    const { orderId } = req.query
    const order = await Order.findById(orderId)

    if (!order || !order.aliexpressOrderId) {
      return res.status(404).json({
        success: false,
        message: 'Order of AliExpress order ID niet gevonden'
      })
    }

    const tracking = await getOrderTracking(adminUser.aliexpress.accessToken, order.aliexpressOrderId)

    if (tracking.error_response) {
      return res.status(400).json({
        success: false,
        message: tracking.error_response.msg
      })
    }

    // Update order tracking in database
    const trackingInfo = tracking.aeop_ae_order_tracking_get_response?.result
    if (trackingInfo) {
      order.trackingNumber = trackingInfo.tracking_number
      order.trackingUrl = trackingInfo.tracking_url
      order.trackingCarrier = trackingInfo.carrier
      await order.save()
    }

    return res.status(200).json({
      success: true,
      tracking: trackingInfo
    })

  } catch (error) {
    console.error('❌ AliExpress tracking error:', error)
    return res.status(500).json({
      success: false,
      message: 'Fout bij ophalen tracking',
      error: error.message
    })
  }
}

