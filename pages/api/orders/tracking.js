import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'

// Order Tracking System
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'GET') {
    try {
      const { orderNumber } = req.query

      if (!orderNumber) {
        return res.status(400).json({
          success: false,
          message: 'Order nummer is verplicht'
        })
      }

      console.log(`📊 Tracking info ophalen voor order: ${orderNumber}`)

      const order = await Order.findOne({ orderNumber })
        .populate('items.product')
        .populate('user', 'firstName lastName email')

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order niet gevonden'
        })
      }

      // Genereer tracking status
      const trackingInfo = {
        orderNumber: order.orderNumber,
        status: order.status,
        dropshipStatus: order.dropshipStatus,
        customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        email: order.email,
        totalAmount: order.totals.total,
        estimatedDelivery: order.shipping.estimatedDelivery,
        trackingNumber: order.shipping.trackingNumber || 'Wordt gegenereerd',
        items: order.items.map(item => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: order.shippingAddress,
        trackingEvents: order.trackingEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        profit: order.profit || 0,
        profitMargin: order.profitMargin || 0
      }

      console.log(`✅ Tracking info opgehaald voor order ${orderNumber}`)

      res.status(200).json({
        success: true,
        message: 'Tracking info succesvol opgehaald',
        data: trackingInfo
      })

    } catch (error) {
      console.error('❌ Tracking info ophalen gefaald:', error)
      res.status(500).json({
        success: false,
        message: 'Tracking info ophalen gefaald',
        error: error.message
      })
    }
  } else if (req.method === 'POST') {
    try {
      const { orderNumber, status, message, trackingNumber } = req.body

      if (!orderNumber || !status) {
        return res.status(400).json({
          success: false,
          message: 'Order nummer en status zijn verplicht'
        })
      }

      console.log(`📊 Status update voor order: ${orderNumber} naar ${status}`)

      const order = await Order.findOne({ orderNumber })

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order niet gevonden'
        })
      }

      // Update order status
      order.status = status
      
      if (trackingNumber) {
        order.shipping.trackingNumber = trackingNumber
      }

      // Voeg tracking event toe
      order.trackingEvents.push({
        status: status,
        message: message || `Status gewijzigd naar ${status}`,
        timestamp: new Date()
      })

      // Update dropship status op basis van order status
      if (status === 'shipped') {
        order.dropshipStatus = 'shipped'
      } else if (status === 'delivered') {
        order.dropshipStatus = 'completed'
      }

      await order.save()

      console.log(`✅ Status update voltooid voor order ${orderNumber}`)

      res.status(200).json({
        success: true,
        message: 'Status succesvol bijgewerkt',
        data: {
          orderNumber: order.orderNumber,
          status: order.status,
          dropshipStatus: order.dropshipStatus,
          trackingNumber: order.shipping.trackingNumber,
          lastUpdate: new Date()
        }
      })

    } catch (error) {
      console.error('❌ Status update gefaald:', error)
      res.status(500).json({
        success: false,
        message: 'Status update gefaald',
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    })
  }
}
