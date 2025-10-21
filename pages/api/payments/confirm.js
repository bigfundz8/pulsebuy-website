import Stripe from 'stripe'
import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      const { paymentIntentId, orderId } = req.body

      // Verify payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      if (paymentIntent.status === 'succeeded') {
        // Update order status
        const order = await Order.findById(orderId)
        if (!order) {
          return res.status(404).json({
            success: false,
            message: 'Order not found'
          })
        }

        order.payment.status = 'paid'
        order.status = 'confirmed'
        await order.updateStatus('confirmed', 'Payment successful, order confirmed')

        // Update product sales
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { sales: item.quantity } }
          )
        }

        res.status(200).json({
          success: true,
          message: 'Payment successful',
          data: {
            orderNumber: order.orderNumber,
            status: order.status
          }
        })
      } else {
        res.status(400).json({
          success: false,
          message: 'Payment not successful',
          status: paymentIntent.status
        })
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      res.status(500).json({
        success: false,
        message: 'Error confirming payment',
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
