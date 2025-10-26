import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import { emailService } from '../../../lib/emailService'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      const { email, password, firstName, lastName, phone } = req.body

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'Alle verplichte velden moeten worden ingevuld'
        })
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Er bestaat al een account met dit email adres'
        })
      }

      // Validate password strength
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Wachtwoord moet minimaal 6 karakters bevatten'
        })
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create user
      const user = new User({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || '',
        role: 'customer',
        emailVerified: false
      })

      await user.save()

      // Send welcome email
      try {
        await emailService.sendWelcomeEmail({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        })
        console.log('Welcome email sent successfully')
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError)
        // Don't fail registration if email fails
      }

      // Return success (without password)
      res.status(201).json({
        success: true,
        message: 'Account succesvol aangemaakt',
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified
        }
      })

    } catch (error) {
      console.error('Registration error:', error)
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Er bestaat al een account met dit email adres'
        })
      }

      res.status(500).json({
        success: false,
        message: 'Er is een fout opgetreden bij het aanmaken van het account'
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
