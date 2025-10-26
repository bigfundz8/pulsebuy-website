import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'
import User from '../../../models/User'
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
      const updateData = req.body

      // Find and update product
      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      )

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product niet gevonden'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Product bijgewerkt',
        product
      })

    } catch (error) {
      console.error('Error updating product:', error)
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden bij het bijwerken van het product'
      })
    }
  } else if (req.method === 'DELETE') {
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

      // Find and delete product
      const product = await Product.findByIdAndDelete(id)

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product niet gevonden'
        })
      }

      res.status(200).json({
        success: true,
        message: 'Product verwijderd'
      })

    } catch (error) {
      console.error('Error deleting product:', error)
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden bij het verwijderen van het product'
      })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    })
  }
}
