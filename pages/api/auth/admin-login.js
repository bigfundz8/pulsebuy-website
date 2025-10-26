import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Admin Login API
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      const { email, password } = req.body

      // Zoek admin gebruiker
      const admin = await User.findOne({ 
        email: email,
        role: 'admin' // Alleen admin gebruikers
      })

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Ongeldige inloggegevens'
        })
      }

      // Controleer wachtwoord
      const isValidPassword = await bcrypt.compare(password, admin.password)
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Ongeldige inloggegevens'
        })
      }

      // Genereer JWT token
      const token = jwt.sign(
        { 
          userId: admin._id, 
          email: admin.email, 
          role: admin.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )

      res.status(200).json({
        success: true,
        message: 'Succesvol ingelogd',
        data: {
          token,
          user: {
            id: admin._id,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: admin.role
          }
        }
      })

    } catch (error) {
      console.error('Admin login error:', error)
      res.status(500).json({
        success: false,
        message: 'Login gefaald',
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
