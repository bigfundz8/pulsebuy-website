import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../../lib/jwt'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email en wachtwoord zijn verplicht'
      })
    }

    // Zoek gebruiker
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Ongeldige email of wachtwoord'
      })
    }

    // Check of gebruiker admin is
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Geen toegang. Alleen admin gebruikers kunnen inloggen.'
      })
    }

    // Check of account gelocked is
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is tijdelijk geblokkeerd. Probeer later opnieuw.'
      })
    }

    // Check wachtwoord
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      // Verhoog login attempts
      await user.incLoginAttempts()
      return res.status(401).json({
        success: false,
        message: 'Ongeldige email of wachtwoord'
      })
    }

    // Reset login attempts bij succesvolle login
    await user.resetLoginAttempts()

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Genereer JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    }, '24h')

    // Return success met token en user data
    res.status(200).json({
      success: true,
      message: 'Login succesvol',
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    })

  } catch (error) {
    console.error('❌ Admin login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error tijdens login',
      error: error.message
    })
  }
}

