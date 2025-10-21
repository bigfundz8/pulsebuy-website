import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'
import sampleProducts from '../../../data/sample-products'

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      // Voeg alle sample producten toe
      const products = await Product.insertMany(sampleProducts)
      
      res.status(201).json({
        success: true,
        message: `${products.length} producten succesvol toegevoegd!`,
        data: products
      })
    } catch (error) {
      console.error('Error adding products:', error)
      res.status(500).json({
        success: false,
        message: 'Error adding products',
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
