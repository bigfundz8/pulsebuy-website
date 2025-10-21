import Stripe from 'stripe'
import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
import Product from '../../../models/Product'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      const { items, shippingAddress, billingAddress, userId } = req.body

      // Validate items
      if (!items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No items provided'
        })
      }

      // Calculate totals
      let subtotal = 0
      const processedItems = []

      for (const item of items) {
        const product = await Product.findById(item.productId)
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${item.productId} not found`
          })
        }

        const itemTotal = product.price * item.quantity
        subtotal += itemTotal

        processedItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
          total: itemTotal
        })
      }

      const shippingCost = subtotal > 50 ? 0 : 5.99 // Free shipping over €50
      const tax = subtotal * 0.21 // 21% VAT
      const total = subtotal + shippingCost + tax

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: 'eur',
        metadata: {
          userId: userId || 'guest',
          orderItems: JSON.stringify(processedItems.map(item => ({
            productId: item.product.toString(),
            quantity: item.quantity
          })))
        }
      })

      // Create order in database
      const order = new Order({
        user: userId || null,
        items: processedItems,
        shippingAddress,
        billingAddress,
        payment: {
          method: 'stripe',
          status: 'pending',
          transactionId: paymentIntent.id,
          amount: total
        },
        shipping: {
          method: 'standard',
          cost: shippingCost
        },
        totals: {
          subtotal,
          shipping: shippingCost,
          tax,
          total
        },
        status: 'pending'
      })

      await order.save()

      res.status(200).json({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          orderId: order._id,
          orderNumber: order.orderNumber
        }
      })
    } catch (error) {
      console.error('Error creating payment intent:', error)
      res.status(500).json({
        success: false,
        message: 'Error creating payment intent',
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
