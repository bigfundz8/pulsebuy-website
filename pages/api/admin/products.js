import connectDB from '../../../lib/mongodb'
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

      // Get query parameters
      const { page = 1, limit = 12, category, search } = req.query

      // Build filter
      const filter = {}
      if (category && category !== 'all') {
        filter.category = category
      }

      // Build search filter
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit)

      // Get products with pagination
      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Product.countDocuments(filter)
      ])

      res.status(200).json({
        success: true,
        products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      })

    } catch (error) {
      console.error('Error fetching admin products:', error)
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden bij het ophalen van producten'
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
