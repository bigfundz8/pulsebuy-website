// AliExpress OAuth Authorization URL Generator
// Deze endpoint genereert de OAuth URL waarmee je de autorisatie kunt starten

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const appKey = process.env.ALIEXPRESS_APP_KEY
    let callbackUrl = process.env.ALIEXPRESS_CALLBACK_URL || 'https://pulsebuy.nl/api/aliexpress/callback'

    console.log('🔍 Debug - App Key:', appKey ? '✅ Aanwezig' : '❌ Ontbreekt')
    console.log('🔍 Debug - Callback URL:', callbackUrl)

    if (!appKey) {
      return res.status(400).json({
        success: false,
        message: 'ALIEXPRESS_APP_KEY is niet ingesteld'
      })
    }

    // Valideer appKey (moet een string zijn)
    if (typeof appKey !== 'string' || appKey.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'ALIEXPRESS_APP_KEY moet een geldige string zijn'
      })
    }

    // Valideer en normaliseer callback URL
    try {
      // Trim whitespace
      callbackUrl = callbackUrl.trim()
      
      // Test of URL geldig is
      const testUrl = new URL(callbackUrl)
      callbackUrl = testUrl.toString()
      console.log('✅ Callback URL is geldig:', callbackUrl)
    } catch (urlError) {
      console.error('❌ Invalid callback URL:', callbackUrl, urlError)
      return res.status(400).json({
        success: false,
        message: 'Ongeldige ALIEXPRESS_CALLBACK_URL: ' + callbackUrl + '. Error: ' + urlError.message
      })
    }

    // Genereer OAuth authorization URL
    // Volgens AliExpress documentatie: https://api-sg.aliexpress.com/oauth/authorize
    try {
      const authUrl = new URL('https://api-sg.aliexpress.com/oauth/authorize')
      
      // Valideer dat appKey een geldige string is voordat we het gebruiken
      const cleanAppKey = String(appKey).trim()
      if (!cleanAppKey || cleanAppKey.length === 0) {
        throw new Error('App Key is leeg na trimmen')
      }
      
      authUrl.searchParams.set('client_id', cleanAppKey)
      authUrl.searchParams.set('redirect_uri', callbackUrl)
      authUrl.searchParams.set('response_type', 'code')
      authUrl.searchParams.set('force_auth', 'true') // Belangrijk: force auth volgens documentatie
      authUrl.searchParams.set('state', 'aliexpress_auth_' + Date.now())

      const finalUrl = authUrl.toString()
      console.log('✅ OAuth URL gegenereerd:', finalUrl.substring(0, 100) + '...')
      
      return res.status(200).json({
        success: true,
        data: {
          authUrl: finalUrl
        }
      })
    } catch (urlError) {
      console.error('❌ Error creating OAuth URL:', urlError)
      console.error('❌ Error details:', {
        message: urlError.message,
        stack: urlError.stack,
        appKey: appKey ? 'Aanwezig' : 'Ontbreekt',
        callbackUrl: callbackUrl
      })
      return res.status(500).json({
        success: false,
        message: 'Error creating OAuth URL: ' + urlError.message + '. Check server logs voor details.'
      })
    }
  } catch (error) {
    console.error('❌ Error generating OAuth URL:', error)
    console.error('❌ Error stack:', error.stack)
    return res.status(500).json({
      success: false,
      message: 'Error generating OAuth URL: ' + error.message
    })
  }
}

