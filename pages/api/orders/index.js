import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'

// Orders API - Bekijk alle orders
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'GET') {
    try {
      console.log('📋 Orders ophalen...')

      const orders = await Order.find({})
        .populate('items.product')
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(10)

      console.log(`✅ ${orders.length} orders opgehaald`)

      res.status(200).json({
        success: true,
        message: 'Orders succesvol opgehaald',
        data: {
          orders: orders.map(order => ({
            orderNumber: order.orderNumber,
            status: order.status,
            dropshipStatus: order.dropshipStatus,
            totalAmount: order.totals?.total,
            customerName: order.shippingAddress?.firstName + ' ' + order.shippingAddress?.lastName,
            email: order.email,
            createdAt: order.createdAt,
            items: order.items.map(item => ({
              productName: item.product?.name,
              quantity: item.quantity,
              price: item.price
            }))
          }))
        }
      })

    } catch (error) {
      console.error('❌ Orders ophalen gefaald:', error)
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