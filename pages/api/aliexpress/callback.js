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
      console.log('📝 Token data:', {
        hasAccessToken: !!tokenData.accessToken,
        hasRefreshToken: !!tokenData.refreshToken,
        expiresIn: tokenData.expiresIn,
        tokenType: tokenData.tokenType
      })

      // Opslaan van de tokens in de database (bij de admin user)
      const adminUser = await User.findOne({ role: 'admin' })

      console.log('🔍 Debug - Admin user gevonden voor token opslag:', adminUser ? '✅ Ja' : '❌ Nee')
      if (adminUser) {
        console.log('🔍 Debug - Admin user email:', adminUser.email)
        console.log('🔍 Debug - Admin user ID:', adminUser._id)
      }

      if (!adminUser) {
        console.error('❌ Geen admin user gevonden om AliExpress tokens op te slaan.')
        return res.redirect(302, `/dropshipping?aliexpress_auth=error&message=${encodeURIComponent('Geen admin user gevonden. Maak eerst een admin account aan.')}`)
      }

      // Bereken expiresAt (fallback naar 3600 seconden als expiresIn undefined is)
      const expiresInSeconds = tokenData.expiresIn || 3600
      const expiresAt = new Date(Date.now() + expiresInSeconds * 1000)

      console.log('🔍 Debug - Token opslag data:', {
        hasAccessToken: !!tokenData.accessToken,
        hasRefreshToken: !!tokenData.refreshToken,
        expiresIn: expiresInSeconds,
        expiresAt: expiresAt.toISOString()
      })

      // Update admin user met tokens
      adminUser.aliexpress = {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
        expiresIn: expiresInSeconds,
        tokenType: tokenData.tokenType || 'Bearer',
        lastRefresh: new Date(),
        expiresAt: expiresAt
      }

      try {
        await adminUser.save()
        console.log('✅ AliExpress tokens opgeslagen voor admin user')
        
        // Verifieer dat tokens zijn opgeslagen
        const verifyUser = await User.findById(adminUser._id)
        console.log('🔍 Debug - Verificatie na opslag:', {
          hasAliExpress: !!verifyUser.aliexpress,
          hasAccessToken: !!verifyUser.aliexpress?.accessToken,
          hasRefreshToken: !!verifyUser.aliexpress?.refreshToken,
          expiresAt: verifyUser.aliexpress?.expiresAt
        })
      } catch (saveError) {
        console.error('❌ Error bij opslaan tokens:', saveError)
        return res.redirect(302, `/dropshipping?aliexpress_auth=error&message=${encodeURIComponent('Fout bij opslaan tokens: ' + saveError.message)}`)
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

