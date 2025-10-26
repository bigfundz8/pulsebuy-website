import connectDB from '../../../lib/mongodb'
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

      // Find user
      const user = await User.findById(decoded.userId)
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Gebruiker niet gevonden'
        })
      }

      const { firstName, lastName, phone, address } = req.body

      // Update user data
      if (firstName) user.firstName = firstName.trim()
      if (lastName) user.lastName = lastName.trim()
      if (phone !== undefined) user.phone = phone.trim()
      if (address) user.address = address

      await user.save()

      // Return updated user data (without password)
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
        message: 'Profiel succesvol bijgewerkt',
        user: userData
      })

    } catch (error) {
      console.error('Profile update error:', error)
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden bij het bijwerken van het profiel'
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
