import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
import Product from '../../../models/Product'
import User from '../../../models/User'
import { verifyToken } from '../../../lib/jwt'

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Geen geldige autorisatie token'
        })
      }

      const token = authHeader.substring(7)
      const decoded = verifyToken(token)

      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: 'Ongeldige of verlopen token'
        })
      }

      // Check if user is admin
      const user = await User.findById(decoded.userId)
      if (!user || user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Geen admin rechten'
        })
      }

      // Get dashboard statistics
      const [
        totalOrders,
        totalRevenue,
        totalProducts,
        totalUsers,
        recentOrders,
        topProducts
      ] = await Promise.all([
        Order.countDocuments(),
        Order.aggregate([
          { $match: { 'payment.status': 'paid' } },
          { $group: { _id: null, total: { $sum: '$totals.total' } } }
        ]),
        Product.countDocuments(),
        User.countDocuments(),
        Order.find()
          .populate('user', 'firstName lastName email')
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
        Product.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .lean()
      ])

      // Calculate monthly revenue for the last 6 months
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const monthlyRevenue = await Order.aggregate([
        {
          $match: {
            'payment.status': 'paid',
            createdAt: { $gte: sixMonthsAgo }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            revenue: { $sum: '$totals.total' }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ])

      // Format monthly revenue data
      const revenueData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - (5 - i))
        const monthData = monthlyRevenue.find(
          item => item._id.year === date.getFullYear() && item._id.month === date.getMonth() + 1
        )
        return monthData ? monthData.revenue : 0
      })

      res.status(200).json({
        success: true,
        stats: {
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalProducts,
          totalUsers,
          recentOrders,
          topProducts: topProducts.map(product => ({
            ...product,
            sales: Math.floor(Math.random() * 100) // Mock sales data
          })),
          monthlyRevenue: revenueData
        }
      })

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden bij het ophalen van dashboard gegevens'
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
