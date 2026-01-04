import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'

// Check AliExpress authorization status
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    await connectDB()

    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' })

    if (!adminUser) {
      return res.status(200).json({
        authorized: false,
        message: 'Geen admin user gevonden'
      })
    }

    // Check if AliExpress tokens exist and are valid
    const hasTokens = adminUser.aliexpress && 
                     adminUser.aliexpress.accessToken && 
                     adminUser.aliexpress.refreshToken

    if (!hasTokens) {
      return res.status(200).json({
        authorized: false,
        message: 'Geen AliExpress tokens gevonden'
      })
    }

    // Check if token is expired
    const isExpired = adminUser.aliexpress.expiresAt && 
                     new Date(adminUser.aliexpress.expiresAt) < new Date()

    return res.status(200).json({
      authorized: !isExpired,
      expiresAt: adminUser.aliexpress.expiresAt,
      lastRefresh: adminUser.aliexpress.lastRefresh,
      message: isExpired ? 'Token is verlopen, refresh nodig' : 'AliExpress is geautoriseerd'
    })
  } catch (error) {
    console.error('❌ Error checking AliExpress status:', error)
    return res.status(500).json({
      authorized: false,
      message: 'Error checking authorization status: ' + error.message
    })
  }
}

