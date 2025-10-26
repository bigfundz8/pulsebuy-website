import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
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

      // Get query parameters
      const { page = 1, limit = 10, status, search } = req.query

      // Build filter
      const filter = { user: decoded.userId }
      if (status && status !== 'all') {
        filter.status = status
      }

      // Build search filter
      if (search) {
        filter.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { 'items.product.name': { $regex: search, $options: 'i' } }
        ]
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit)

      // Get orders with pagination
      const [orders, total] = await Promise.all([
        Order.find(filter)
          .populate('items.product', 'name images price description')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Order.countDocuments(filter)
      ])

      res.status(200).json({
        success: true,
        orders,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      })

    } catch (error) {
      console.error('Error fetching user orders:', error)
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden bij het ophalen van bestellingen'
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
