import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
import User from '../../../models/User'
import { emailService } from '../../../lib/emailService'
import { verifyToken } from '../../../lib/jwt'

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
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

      const { orderId, type } = req.body

      if (!orderId || !type) {
        return res.status(400).json({
          success: false,
          message: 'Order ID en type zijn verplicht'
        })
      }

      // Find order
      const order = await Order.findById(orderId)
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images price')

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Bestelling niet gevonden'
        })
      }

      // Prepare order data for email
      const orderData = {
        _id: order._id,
        orderNumber: order.orderNumber,
        customerName: `${order.user.firstName} ${order.user.lastName}`,
        customerEmail: order.user.email,
        items: order.items.map(item => ({
          product: {
            name: item.product.name
          },
          quantity: item.quantity,
          total: item.total
        })),
        totals: order.totals,
        status: order.status,
        shipping: order.shipping,
        createdAt: order.createdAt
      }

      let emailResult

      // Send appropriate email based on type
      switch (type) {
        case 'confirmation':
          emailResult = await emailService.sendOrderConfirmation(orderData)
          break
        case 'shipped':
          emailResult = await emailService.sendOrderShipped(orderData)
          break
        case 'delivered':
          emailResult = await emailService.sendOrderDelivered(orderData)
          break
        default:
          return res.status(400).json({
            success: false,
            message: 'Ongeldig email type'
          })
      }

      if (emailResult.success) {
        res.status(200).json({
          success: true,
          message: 'Email succesvol verzonden',
          messageId: emailResult.messageId
        })
      } else {
        res.status(500).json({
          success: false,
          message: 'Fout bij verzenden email',
          error: emailResult.error
        })
      }

    } catch (error) {
      console.error('Error sending email notification:', error)
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden bij het verzenden van de email'
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
