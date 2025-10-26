import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import { generateToken } from '../../../lib/jwt'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      const { email, password } = req.body

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email en wachtwoord zijn verplicht'
        })
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase() })
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Ongeldige inloggegevens'
        })
      }

      // Check if account is locked
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          message: 'Account is tijdelijk geblokkeerd. Probeer het later opnieuw.'
        })
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        // Increment login attempts
        user.loginAttempts += 1
        if (user.loginAttempts >= 5) {
          user.lockUntil = Date.now() + 2 * 60 * 60 * 1000 // Lock for 2 hours
        }
        await user.save()

        return res.status(401).json({
          success: false,
          message: 'Ongeldige inloggegevens'
        })
      }

      // Reset login attempts on successful login
      user.loginAttempts = 0
      user.lockUntil = undefined
      user.lastLogin = new Date()
      await user.save()

      // Generate JWT token
      const token = generateToken({
        userId: user._id,
        email: user.email,
        role: user.role
      })

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
        message: 'Succesvol ingelogd',
        user: userData,
        token
      })

    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden bij het inloggen'
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