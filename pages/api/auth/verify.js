import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
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

      const token = authHeader.substring(7) // Remove 'Bearer ' prefix
      const decoded = verifyToken(token)

      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: 'Ongeldige of verlopen token'
        })
      }

      // Find user
      const user = await User.findById(decoded.userId)
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Gebruiker niet gevonden'
        })
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is gedeactiveerd'
        })
      }

      // Return user data (without password)
      const userData = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
        phone: user.phone,
        address: user.address
      }

      res.status(200).json({
        success: true,
        user: userData
      })

    } catch (error) {
      console.error('Token verification error:', error)
      res.status(401).json({
        success: false,
        message: 'Token verificatie gefaald'
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
