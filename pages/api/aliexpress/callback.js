import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import { exchangeCodeForToken } from '../../../lib/aliexpress'

// AliExpress OAuth Callback Handler
// Deze endpoint ontvangt de authorization code van AliExpress
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'GET') {
    try {
      const { code, state } = req.query

      console.log('🔐 AliExpress OAuth callback ontvangen')
      console.log('Authorization code:', code ? '✅ Ontvangen' : '❌ Ontbreekt')
      console.log('State:', state || 'Geen state')

      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'Authorization code ontbreekt'
        })
      }

      // Exchange authorization code voor access token
      console.log('🔄 Exchanging authorization code voor access token...')
      const tokenData = await exchangeCodeForToken(code)

      console.log('✅ Access token succesvol verkregen')
      console.log('📝 Token expires in:', tokenData.expiresIn, 'seconds')

      // Opslaan van de tokens in de database (bij de admin user)
      const adminUser = await User.findOne({ role: 'admin' })

      if (adminUser) {
        adminUser.aliexpress = {
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          expiresIn: tokenData.expiresIn,
          tokenType: tokenData.tokenType,
          lastRefresh: new Date(),
          expiresAt: new Date(Date.now() + tokenData.expiresIn * 1000)
        }
        await adminUser.save()
        console.log('✅ AliExpress tokens opgeslagen voor admin user')
      } else {
        console.warn('⚠️ Geen admin user gevonden om AliExpress tokens op te slaan.')
        // Als er geen admin user is, sla het op in een config document of maak een admin user aan
      }

      // Redirect naar success pagina of dashboard
      res.redirect(302, '/dropshipping?aliexpress_auth=success&token=received')
      
    } catch (error) {
      console.error('❌ AliExpress callback error:', error)
      res.redirect(302, `/dropshipping?aliexpress_auth=error&message=${encodeURIComponent(error.message)}`)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    })
  }
}

