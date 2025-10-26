import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
import Product from '../../../models/Product'
import axios from 'axios'

// AliExpress Order Forwarding
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('📦 Orders doorsturen naar AliExpress leveranciers...')

      const ALIEXPRESS_APP_KEY = process.env.ALIEXPRESS_APP_KEY
      const ALIEXPRESS_APP_SECRET = process.env.ALIEXPRESS_APP_SECRET

      if (!ALIEXPRESS_APP_KEY || !ALIEXPRESS_APP_SECRET) {
        return res.status(400).json({
          success: false,
          message: 'AliExpress API credentials niet gevonden. Voeg ALIEXPRESS_APP_KEY en ALIEXPRESS_APP_SECRET toe aan je .env.local bestand.'
        })
      }

      // Haal alle pending orders op
      const pendingOrders = await Order.find({ 
        status: 'paid',
        dropshipStatus: { $ne: 'completed' }
      }).populate('products.product')

      const forwardedOrders = []

      for (const order of pendingOrders) {
        console.log(`🛒 Verwerken AliExpress order: ${order.orderNumber}`)
        
        const aliexpressItems = []
        let totalCost = 0

        for (const item of order.products) {
          const product = item.product
          
          if (product.supplier && product.supplier.aliexpressUrl) {
            const itemCost = product.costPrice * item.quantity
            totalCost += itemCost

            aliexpressItems.push({
              productId: product._id,
              productName: product.name,
              quantity: item.quantity,
              costPrice: product.costPrice,
              totalCost: itemCost,
              aliexpressUrl: product.supplier.aliexpressUrl,
              supplier: product.supplier.name
            })

            console.log(`  📦 ${item.quantity}x ${product.name} - €${itemCost.toFixed(2)}`)
          }
        }

        if (aliexpressItems.length > 0) {
          try {
            // Maak AliExpress order via API
            const aliexpressOrderData = {
              products: aliexpressItems.map(item => ({
                product_id: item.productId,
                quantity: item.quantity,
                price: item.costPrice
              })),
              shipping_address: {
                first_name: order.shippingAddress.firstName,
                last_name: order.shippingAddress.lastName,
                address1: order.shippingAddress.street,
                city: order.shippingAddress.city,
                zip: order.shippingAddress.postalCode,
                country: order.shippingAddress.country,
                phone: order.shippingAddress.phone
              },
              customer_email: order.email,
              order_number: order.orderNumber
            }

            // Echte AliExpress API call voor order plaatsing
            const aliexpressResponse = await axios.post('https://api-sg.aliexpress.com/sync', {
              method: 'aliexpress.affiliate.order.create',
              app_key: ALIEXPRESS_APP_KEY,
              sign_method: 'sha256',
              timestamp: Date.now(),
              format: 'json',
              v: '2.0',
              order_data: JSON.stringify(aliexpressOrderData)
            }, {
              timeout: 10000
            })

            // Bereken winst
            const orderTotal = order.totalAmount
            const profit = orderTotal - totalCost
            const profitMargin = (profit / orderTotal) * 100

            // Update order met AliExpress info
            order.dropshipStatus = 'forwarded'
            order.dropshipItems = aliexpressItems
            order.dropshipCost = totalCost
            order.profit = profit
            order.profitMargin = profitMargin
            order.aliexpressOrderId = aliexpressResponse.data.order_id
            order.dropshipInstructions = generateAliExpressInstructions(order, aliexpressItems, aliexpressResponse.data)
            
            await order.save()

            forwardedOrders.push({
              orderNumber: order.orderNumber,
              customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
              items: aliexpressItems.length,
              totalCost: totalCost,
              profit: profit,
              profitMargin: profitMargin,
              aliexpressOrderId: aliexpressResponse.data.order_id,
              status: 'forwarded_to_aliexpress'
            })

            console.log(`✅ Order ${order.orderNumber} doorgestuurd naar AliExpress - Winst: €${profit.toFixed(2)} (${profitMargin.toFixed(1)}%)`)
          } catch (apiError) {
            console.error(`❌ Fout bij AliExpress API call voor order ${order.orderNumber}:`, apiError.message)
            
            // Fallback: handmatige instructies
            order.dropshipStatus = 'manual_required'
            order.dropshipInstructions = generateAliExpressInstructions(order, aliexpressItems, null)
            await order.save()
          }
        }
      }

      console.log(`✅ AliExpress order forwarding voltooid: ${forwardedOrders.length} orders doorgestuurd`)

      res.status(200).json({
        success: true,
        message: 'Orders succesvol doorgestuurd naar AliExpress',
        data: {
          forwardedOrders: forwardedOrders.length,
          totalProfit: forwardedOrders.reduce((sum, order) => sum + order.profit, 0),
          averageProfitMargin: forwardedOrders.length > 0 ? 
            forwardedOrders.reduce((sum, order) => sum + order.profitMargin, 0) / forwardedOrders.length : 0,
          orders: forwardedOrders
        }
      })

    } catch (error) {
      console.error('❌ AliExpress order forwarding fout:', error)
      res.status(500).json({
        success: false,
        message: 'AliExpress order forwarding gefaald',
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    })
  }
}

// Genereer instructies voor AliExpress dropshipping
function generateAliExpressInstructions(order, aliexpressItems, aliexpressOrderData) {
  let instructions = `ALIEXPRESS DROPSHIP INSTRUCTIES VOOR ORDER ${order.orderNumber}\n\n`
  
  if (aliexpressOrderData) {
    instructions += `✅ ORDER AUTOMATISCH GEÏMPORTEERD IN ALIEXPRESS\n`
    instructions += `AliExpress Order ID: ${aliexpressOrderData.order_id}\n`
    instructions += `Status: ${aliexpressOrderData.status}\n\n`
  } else {
    instructions += `⚠️ HANDMATIGE ACTIE VEREIST\n`
    instructions += `Importeer deze order handmatig in AliExpress\n\n`
  }
  
  instructions += `KLANT INFORMATIE:\n`
  instructions += `Naam: ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}\n`
  instructions += `Email: ${order.email}\n`
  instructions += `Telefoon: ${order.shippingAddress.phone}\n\n`
  
  instructions += `VERZEND ADRES:\n`
  instructions += `${order.shippingAddress.street}\n`
  instructions += `${order.shippingAddress.postalCode} ${order.shippingAddress.city}\n`
  instructions += `${order.shippingAddress.country}\n\n`
  
  instructions += `TE BESTELLEN PRODUCTEN:\n`
  
  aliexpressItems.forEach((item, index) => {
    instructions += `${index + 1}. ${item.productName}\n`
    instructions += `   Hoeveelheid: ${item.quantity}x\n`
    instructions += `   Kosten: €${item.totalCost.toFixed(2)}\n`
    instructions += `   AliExpress URL: ${item.aliexpressUrl}\n\n`
  })
  
  instructions += `TOTALE KOSTEN: €${aliexpressItems.reduce((sum, item) => sum + item.totalCost, 0).toFixed(2)}\n`
  instructions += `VERWACHTE WINST: €${order.profit?.toFixed(2) || '0.00'}\n\n`
  
  instructions += `BELANGRIJK:\n`
  instructions += `- AliExpress levert binnen 7-15 dagen\n`
  instructions += `- Gebruik het klantadres als verzendadres\n`
  instructions += `- Verstuur tracking informatie naar de klant\n`
  instructions += `- Update order status naar 'shipped' na verzending\n`
  
  return instructions
}