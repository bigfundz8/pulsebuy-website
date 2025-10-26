import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
import Product from '../../../models/Product'
import axios from 'axios'

// Spocket Order Forwarding
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('📦 Orders doorsturen naar Spocket leveranciers...')

      const SPOCKET_API_KEY = process.env.SPOCKET_API_KEY

      if (!SPOCKET_API_KEY) {
        return res.status(400).json({
          success: false,
          message: 'Spocket API key niet gevonden. Voeg SPOCKET_API_KEY toe aan je .env.local bestand.'
        })
      }

      // Haal alle pending orders op
      const pendingOrders = await Order.find({ 
        status: 'paid',
        dropshipStatus: { $ne: 'completed' }
      }).populate('products.product')

      const forwardedOrders = []

      for (const order of pendingOrders) {
        console.log(`🛒 Verwerken Spocket order: ${order.orderNumber}`)
        
        const spocketItems = []
        let totalCost = 0

        for (const item of order.products) {
          const product = item.product
          
          if (product.supplier && product.supplier.spocketUrl) {
            const itemCost = product.costPrice * item.quantity
            totalCost += itemCost

            spocketItems.push({
              productId: product._id,
              productName: product.name,
              quantity: item.quantity,
              costPrice: product.costPrice,
              totalCost: itemCost,
              spocketUrl: product.supplier.spocketUrl,
              supplier: product.supplier.name
            })

            console.log(`  📦 ${item.quantity}x ${product.name} - €${itemCost.toFixed(2)}`)
          }
        }

        if (spocketItems.length > 0) {
          try {
            // Maak Spocket order via API
            const spocketOrderData = {
              products: spocketItems.map(item => ({
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

            // Echte Spocket API call voor order plaatsing
            const spocketResponse = await axios.post('https://api.spocket.co/api/v1/orders', spocketOrderData, {
              headers: {
                'Authorization': `Bearer ${SPOCKET_API_KEY}`,
                'Content-Type': 'application/json'
              }
            })

            // Bereken winst
            const orderTotal = order.totalAmount
            const profit = orderTotal - totalCost
            const profitMargin = (profit / orderTotal) * 100

            // Update order met Spocket info
            order.dropshipStatus = 'forwarded'
            order.dropshipItems = spocketItems
            order.dropshipCost = totalCost
            order.profit = profit
            order.profitMargin = profitMargin
            order.spocketOrderId = spocketResponse.data.id
            order.dropshipInstructions = generateSpocketInstructions(order, spocketItems, spocketResponse.data)
            
            await order.save()

            forwardedOrders.push({
              orderNumber: order.orderNumber,
              customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
              items: spocketItems.length,
              totalCost: totalCost,
              profit: profit,
              profitMargin: profitMargin,
              spocketOrderId: spocketResponse.data.id,
              status: 'forwarded_to_spocket'
            })

            console.log(`✅ Order ${order.orderNumber} doorgestuurd naar Spocket - Winst: €${profit.toFixed(2)} (${profitMargin.toFixed(1)}%)`)
          } catch (apiError) {
            console.error(`❌ Fout bij Spocket API call voor order ${order.orderNumber}:`, apiError.message)
            
            // Fallback: handmatige instructies
            order.dropshipStatus = 'manual_required'
            order.dropshipInstructions = generateSpocketInstructions(order, spocketItems, null)
            await order.save()
          }
        }
      }

      console.log(`✅ Spocket order forwarding voltooid: ${forwardedOrders.length} orders doorgestuurd`)

      res.status(200).json({
        success: true,
        message: 'Orders succesvol doorgestuurd naar Spocket',
        data: {
          forwardedOrders: forwardedOrders.length,
          totalProfit: forwardedOrders.reduce((sum, order) => sum + order.profit, 0),
          averageProfitMargin: forwardedOrders.length > 0 ? 
            forwardedOrders.reduce((sum, order) => sum + order.profitMargin, 0) / forwardedOrders.length : 0,
          orders: forwardedOrders
        }
      })

    } catch (error) {
      console.error('❌ Spocket order forwarding fout:', error)
      res.status(500).json({
        success: false,
        message: 'Spocket order forwarding gefaald',
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

// Genereer instructies voor Spocket dropshipping
function generateSpocketInstructions(order, spocketItems, spocketOrderData) {
  let instructions = `SPOCKET DROPSHIP INSTRUCTIES VOOR ORDER ${order.orderNumber}\n\n`
  
  if (spocketOrderData) {
    instructions += `✅ ORDER AUTOMATISCH GEÏMPORTEERD IN SPOCKET\n`
    instructions += `Spocket Order ID: ${spocketOrderData.id}\n`
    instructions += `Status: ${spocketOrderData.status}\n\n`
  } else {
    instructions += `⚠️ HANDMATIGE ACTIE VEREIST\n`
    instructions += `Importeer deze order handmatig in Spocket dashboard\n\n`
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
  
  spocketItems.forEach((item, index) => {
    instructions += `${index + 1}. ${item.productName}\n`
    instructions += `   Hoeveelheid: ${item.quantity}x\n`
    instructions += `   Kosten: €${item.totalCost.toFixed(2)}\n`
    instructions += `   Spocket URL: ${item.spocketUrl}\n\n`
  })
  
  instructions += `TOTALE KOSTEN: €${spocketItems.reduce((sum, item) => sum + item.totalCost, 0).toFixed(2)}\n`
  instructions += `VERWACHTE WINST: €${order.profit?.toFixed(2) || '0.00'}\n\n`
  
  instructions += `BELANGRIJK:\n`
  instructions += `- Spocket levert binnen 2-7 dagen\n`
  instructions += `- Gebruik het klantadres als verzendadres\n`
  instructions += `- Verstuur tracking informatie naar de klant\n`
  instructions += `- Update order status naar 'shipped' na verzending\n`
  
  return instructions
}
