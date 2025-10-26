import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

// Maak admin gebruiker aan
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      const { email, password, firstName, lastName } = req.body

      // Controleer of admin al bestaat
      const existingAdmin = await User.findOne({ email })
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Admin gebruiker bestaat al'
        })
      }

      // Hash wachtwoord
      const hashedPassword = await bcrypt.hash(password, 12)

      // Maak admin gebruiker
      const admin = new User({
        email,
        password: hashedPassword,
        firstName: firstName || 'Admin',
        lastName: lastName || 'User',
        role: 'admin',
        isActive: true,
        emailVerified: true
      })

      await admin.save()

      res.status(201).json({
        success: true,
        message: 'Admin gebruiker succesvol aangemaakt',
        data: {
          id: admin._id,
          email: admin.email,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role
        }
      })

    } catch (error) {
      console.error('Admin creation error:', error)
      res.status(500).json({
        success: false,
        message: 'Admin gebruiker aanmaken gefaald',
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
