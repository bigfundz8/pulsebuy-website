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

      const { id } = req.query

      // Find order
      const order = await Order.findOne({
        _id: id,
        user: decoded.userId
      })
      .populate('items.product', 'name images price description')
      .lean()

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Bestelling niet gevonden'
        })
      }

      res.status(200).json({
        success: true,
        order
      })

    } catch (error) {
      console.error('Error fetching order:', error)
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden bij het ophalen van de bestelling'
      })
    }
  } else if (req.method === 'PUT') {
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

      const { id } = req.query
      const { status, trackingNumber } = req.body

      // Find order
      const order = await Order.findOne({
        _id: id,
        user: decoded.userId
      })

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Bestelling niet gevonden'
        })
      }

      // Update order
      if (status) {
        order.status = status
      }
      if (trackingNumber) {
        order.shipping.trackingNumber = trackingNumber
      }

      await order.save()

      res.status(200).json({
        success: true,
        message: 'Bestelling bijgewerkt',
        order
      })

    } catch (error) {
      console.error('Error updating order:', error)
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden bij het bijwerken van de bestelling'
      })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT'])
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    })
  }
}
