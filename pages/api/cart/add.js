import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      const { productId, quantity = 1 } = req.body

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is verplicht'
        })
      }

      // Zoek het product
      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product niet gevonden'
        })
      }

      // Simuleer cart item (in een echte app zou dit in een database of session staan)
      const cartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images?.[0]?.url || 'https://via.placeholder.com/400x400',
        maxStock: product.stock
      }

      res.status(200).json({
        success: true,
        message: 'Product toegevoegd aan winkelwagen',
        data: {
          item: cartItem,
          totalPrice: product.price * quantity
        }
      })

    } catch (error) {
      console.error('❌ Cart add error:', error)
      res.status(500).json({
        success: false,
        message: 'Fout bij toevoegen aan winkelwagen',
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
