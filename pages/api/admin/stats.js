import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'
import Order from '../../../models/Order'

// Admin Dashboard Stats API
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'GET') {
    try {
      console.log('📊 Admin stats ophalen...')

      // Haal alle statistieken op
      const [
        totalProducts,
        totalOrders,
        completedOrders,
        pendingOrders,
        allOrders
      ] = await Promise.all([
        Product.countDocuments({ isActive: true }),
        Order.countDocuments(),
        Order.countDocuments({ status: 'completed' }),
        Order.countDocuments({ status: { $in: ['paid', 'processing'] } }),
        Order.find({}, 'totalAmount profit')
      ])

      // Bereken totale omzet en winst
      const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      const totalProfit = allOrders.reduce((sum, order) => sum + (order.profit || 0), 0)

      const stats = {
        totalProducts,
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue,
        totalProfit,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        averageProfitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
      }

      console.log('✅ Admin stats opgehaald:', stats)

      res.status(200).json({
        success: true,
        data: stats
      })

    } catch (error) {
      console.error('❌ Admin stats fout:', error)
      res.status(500).json({
        success: false,
        message: 'Stats ophalen gefaald',
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    })
  }
}
