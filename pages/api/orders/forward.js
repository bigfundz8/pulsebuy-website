import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
import Product from '../../../models/Product'

// Order Forwarding API - Automatische leverancier communicatie
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('📤 Order forwarding gestart...')

      // Haal alle betaalde orders op die nog niet zijn doorgestuurd
      const pendingOrders = await Order.find({
        status: 'paid',
        $or: [
          { dropshipStatus: { $in: ['pending', 'failed'] } },
          { dropshipStatus: null }
        ]
      }).populate('items.product')

      const forwardedOrders = []
      const failedOrders = []

      for (const order of pendingOrders) {
        try {
          console.log(`📦 Verwerken order: ${order.orderNumber}`)

          // Groepeer items per leverancier
          const supplierGroups = new Map()

          for (const item of order.items) {
            const product = item.product
            const supplierName = product.supplier?.name || 'Unknown Supplier'
            
            if (!supplierGroups.has(supplierName)) {
              supplierGroups.set(supplierName, {
                supplier: product.supplier,
                items: [],
                totalCost: 0
              })
            }

            const costPrice = product.costPrice || (product.price * 0.6) // Schatting als geen costPrice
            const itemCost = costPrice * item.quantity

            supplierGroups.get(supplierName).items.push({
              productName: product.name,
              quantity: item.quantity,
              costPrice: costPrice,
              totalCost: itemCost,
              productUrl: product.supplier?.aliexpressUrl || product.supplier?.spocketUrl
            })

            supplierGroups.get(supplierName).totalCost += itemCost
          }

          // Genereer forwarding instructies voor elke leverancier
          let forwardingInstructions = `ORDER FORWARDING INSTRUCTIES\n`
          forwardingInstructions += `Order: ${order.orderNumber}\n`
          forwardingInstructions += `Datum: ${new Date().toISOString()}\n\n`

          forwardingInstructions += `KLANT INFORMATIE:\n`
          forwardingInstructions += `Naam: ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}\n`
          forwardingInstructions += `Email: ${order.email}\n`
          forwardingInstructions += `Telefoon: ${order.shippingAddress.phone || 'N/A'}\n\n`

          forwardingInstructions += `VERZEND ADRES:\n`
          forwardingInstructions += `${order.shippingAddress.street}\n`
          forwardingInstructions += `${order.shippingAddress.postalCode} ${order.shippingAddress.city}\n`
          forwardingInstructions += `${order.shippingAddress.country}\n\n`

          let totalOrderCost = 0
          let supplierCount = 0

          for (const [supplierName, group] of supplierGroups) {
            supplierCount++
            forwardingInstructions += `LEVERANCIER ${supplierCount}: ${supplierName}\n`
            forwardingInstructions += `Contact: ${group.supplier?.email || 'N/A'}\n\n`

            forwardingInstructions += `TE BESTELLEN PRODUCTEN:\n`
            group.items.forEach((item, index) => {
              forwardingInstructions += `${index + 1}. ${item.productName}\n`
              forwardingInstructions += `   Hoeveelheid: ${item.quantity}x\n`
              forwardingInstructions += `   Kosten: €${item.totalCost.toFixed(2)}\n`
              if (item.productUrl) {
                forwardingInstructions += `   URL: ${item.productUrl}\n`
              }
              forwardingInstructions += `\n`
            })

            forwardingInstructions += `Subtotaal ${supplierName}: €${group.totalCost.toFixed(2)}\n\n`
            totalOrderCost += group.totalCost
          }

          // Bereken winst
          const profit = order.totals.total - totalOrderCost
          const profitMargin = (profit / order.totals.total) * 100

          forwardingInstructions += `TOTALE KOSTEN: €${totalOrderCost.toFixed(2)}\n`
          forwardingInstructions += `VERWACHTE WINST: €${profit.toFixed(2)} (${profitMargin.toFixed(1)}%)\n\n`

          forwardingInstructions += `BELANGRIJK:\n`
          forwardingInstructions += `- Gebruik het klantadres als verzendadres\n`
          forwardingInstructions += `- Verstuur tracking informatie naar: ${order.email}\n`
          forwardingInstructions += `- Update order status naar 'shipped' na verzending\n`
          forwardingInstructions += `- Bewaar deze instructies voor referentie\n`

          // Update order
          order.dropshipStatus = 'forwarded'
          order.dropshipInstructions = forwardingInstructions
          order.dropshipCost = totalOrderCost
          order.profit = profit
          order.profitMargin = profitMargin
          order.trackingEvents.push({
            status: 'forwarded',
            message: `Order doorgestuurd naar ${supplierCount} leverancier(s)`,
            timestamp: new Date()
          })

          await order.save()

          forwardedOrders.push({
            orderNumber: order.orderNumber,
            customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            suppliers: supplierCount,
            totalCost: totalOrderCost,
            profit: profit,
            profitMargin: profitMargin,
            status: 'forwarded'
          })

          console.log(`✅ Order ${order.orderNumber} doorgestuurd naar ${supplierCount} leverancier(s) - Winst: €${profit.toFixed(2)}`)

        } catch (error) {
          console.error(`❌ Fout bij order ${order.orderNumber}:`, error.message)
          
          order.dropshipStatus = 'failed'
          order.trackingEvents.push({
            status: 'failed',
            message: `Forwarding gefaald: ${error.message}`,
            timestamp: new Date()
          })
          await order.save()

          failedOrders.push({
            orderNumber: order.orderNumber,
            error: error.message
          })
        }
      }

      console.log(`📤 Order forwarding voltooid: ${forwardedOrders.length} succesvol, ${failedOrders.length} gefaald`)

      res.status(200).json({
        success: true,
        message: 'Order forwarding voltooid',
        data: {
          forwardedOrders: forwardedOrders.length,
          failedOrders: failedOrders.length,
          totalProfit: forwardedOrders.reduce((sum, order) => sum + order.profit, 0),
          averageProfitMargin: forwardedOrders.length > 0 ? 
            forwardedOrders.reduce((sum, order) => sum + order.profitMargin, 0) / forwardedOrders.length : 0,
          orders: forwardedOrders,
          failures: failedOrders
        }
      })

    } catch (error) {
      console.error('❌ Order forwarding gefaald:', error)
      res.status(500).json({
        success: false,
        message: 'Order forwarding gefaald',
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
