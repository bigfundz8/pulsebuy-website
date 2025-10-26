import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'

// Admin Orders API
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'GET') {
    try {
      console.log('📦 Admin orders ophalen...')

      const { limit = 20, status } = req.query

      // Bouw filter
      const filter = {}
      if (status) {
        filter.status = status
      }

      // Haal recente orders op
      const orders = await Order.find(filter)
        .populate('products.product', 'name price costPrice')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))

      console.log(`✅ ${orders.length} orders opgehaald`)

      res.status(200).json({
        success: true,
        data: orders
      })

    } catch (error) {
      console.error('❌ Admin orders fout:', error)
      res.status(500).json({
        success: false,
        message: 'Orders ophalen gefaald',
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