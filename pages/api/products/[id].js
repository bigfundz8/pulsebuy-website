import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

export default async function handler(req, res) {
  await connectDB()

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const product = await Product.findById(id)
        .populate('reviews.userId', 'firstName lastName')
        .lean()

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      // Get related products
      const relatedProducts = await Product.find({
        category: product.category,
        _id: { $ne: id },
        isActive: true
      })
        .limit(4)
        .select('name price originalPrice images averageRating totalReviews')
        .lean()

      res.status(200).json({
        success: true,
        data: {
          product,
          relatedProducts
        }
      })
    } catch (error) {
      console.error('Error fetching product:', error)
      res.status(500).json({
        success: false,
        message: 'Error fetching product',
        error: error.message
      })
    }
  } else if (req.method === 'PUT') {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      )

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      res.status(200).json({
        success: true,
        data: product
      })
    } catch (error) {
      console.error('Error updating product:', error)
      res.status(500).json({
        success: false,
        message: 'Error updating product',
        error: error.message
      })
    }
  } else if (req.method === 'DELETE') {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      )

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      res.status(500).json({
        success: false,
        message: 'Error deleting product',
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    })
  }
}
