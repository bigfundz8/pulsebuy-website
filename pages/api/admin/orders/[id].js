import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
import User from '../../../models/User'
import { emailService } from '../../../lib/emailService'
import { verifyToken } from '../../../lib/jwt'

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'PUT') {
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

      const { id } = req.query
      const { status, trackingNumber, notes } = req.body

      // Find order
      const order = await Order.findById(id)
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name images price')
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Bestelling niet gevonden'
        })
      }

      const oldStatus = order.status

      // Update order
      if (status) {
        order.status = status
        order.trackingEvents.push({
          status,
          message: `Status gewijzigd naar ${status}`,
          timestamp: new Date()
        })
      }
      if (trackingNumber) {
        order.shipping.trackingNumber = trackingNumber
      }
      if (notes) {
        order.notes = notes
      }

      await order.save()

      // Send email notification if status changed
      if (status && status !== oldStatus && order.user) {
        try {
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

          // Send appropriate email based on status
          if (status === 'shipped') {
            await emailService.sendOrderShipped(orderData)
          } else if (status === 'delivered') {
            await emailService.sendOrderDelivered(orderData)
          }
          
          console.log(`Email notification sent for order ${order.orderNumber} status: ${status}`)
        } catch (emailError) {
          console.error('Error sending status email:', emailError)
          // Don't fail the update if email fails
        }
      }

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
    res.setHeader('Allow', ['PUT'])
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    })
  }
}
