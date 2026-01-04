import crypto from 'crypto'
import axios from 'axios'

/**
 * AliExpress Open Platform API Helper
 * Documentatie: https://developers.aliexpress.com/en/doc.htm
 */

const ALIEXPRESS_API_URL = 'https://api-sg.aliexpress.com/sync'
const ALIEXPRESS_OAUTH_URL = 'https://oauth.aliexpress.com/token'

/**
 * Genereer AliExpress API signature
 */
export function generateSignature(params, appSecret) {
  // Sorteer parameters alfabetisch
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}${params[key]}`)
    .join('')
  
  // Voeg app secret toe
  const stringToSign = `${appSecret}${sortedParams}${appSecret}`
  
  // Genereer HMAC-SHA256 hash
  const signature = crypto
    .createHmac('sha256', appSecret)
    .update(stringToSign)
    .digest('hex')
    .toUpperCase()
  
  return signature
}

/**
 * Maak AliExpress API request parameters
 */
export function createApiParams(method, accessToken, additionalParams = {}) {
  const appKey = process.env.ALIEXPRESS_APP_KEY
  const appSecret = process.env.ALIEXPRESS_APP_SECRET
  
  if (!appKey || !appSecret) {
    throw new Error('ALIEXPRESS_APP_KEY en ALIEXPRESS_APP_SECRET moeten ingesteld zijn')
  }

  const params = {
    method,
    app_key: appKey,
    timestamp: new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + '000',
    format: 'json',
    v: '2.0',
    sign_method: 'sha256',
    access_token: accessToken,
    ...additionalParams
  }

  // Genereer signature
  const signature = generateSignature(params, appSecret)
  params.sign = signature

  return params
}

/**
 * Exchange authorization code voor access token
 */
export async function exchangeCodeForToken(code) {
  const appKey = process.env.ALIEXPRESS_APP_KEY
  const appSecret = process.env.ALIEXPRESS_APP_SECRET
  const callbackUrl = process.env.ALIEXPRESS_CALLBACK_URL || 'https://pulsebuy.nl/api/aliexpress/callback'

  if (!appKey || !appSecret) {
    throw new Error('ALIEXPRESS_APP_KEY en ALIEXPRESS_APP_SECRET moeten ingesteld zijn')
  }

  try {
    const params = {
      grant_type: 'authorization_code',
      code,
      client_id: appKey,
      client_secret: appSecret,
      redirect_uri: callbackUrl
    }

    const response = await axios.post(ALIEXPRESS_OAUTH_URL, null, {
      params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (response.data.error) {
      throw new Error(`AliExpress OAuth error: ${response.data.error_description || response.data.error}`)
    }

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
      tokenType: response.data.token_type || 'Bearer'
    }
  } catch (error) {
    console.error('❌ AliExpress token exchange error:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken) {
  const appKey = process.env.ALIEXPRESS_APP_KEY
  const appSecret = process.env.ALIEXPRESS_APP_SECRET

  if (!appKey || !appSecret) {
    throw new Error('ALIEXPRESS_APP_KEY en ALIEXPRESS_APP_SECRET moeten ingesteld zijn')
  }

  try {
    const params = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: appKey,
      client_secret: appSecret
    }

    const response = await axios.post(ALIEXPRESS_OAUTH_URL, null, {
      params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (response.data.error) {
      throw new Error(`AliExpress refresh error: ${response.data.error_description || response.data.error}`)
    }

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token || refreshToken,
      expiresIn: response.data.expires_in
    }
  } catch (error) {
    console.error('❌ AliExpress token refresh error:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Maak AliExpress API call
 */
export async function callAliExpressAPI(method, accessToken, params = {}) {
  try {
    const apiParams = createApiParams(method, accessToken, params)
    
    const response = await axios.post(ALIEXPRESS_API_URL, null, {
      params: apiParams,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (response.data.error_response) {
      throw new Error(
        `AliExpress API error: ${response.data.error_response.msg} (Code: ${response.data.error_response.code})`
      )
    }

    return response.data
  } catch (error) {
    console.error('❌ AliExpress API call error:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Zoek producten op AliExpress
 */
export async function searchProducts(accessToken, query, options = {}) {
  const {
    page = 1,
    pageSize = 20,
    sort = 'SALE_PRICE_ASC',
    categoryId,
    minPrice,
    maxPrice
  } = options

  const params = {
    keywords: query,
    page_no: page,
    page_size: pageSize,
    sort: sort,
    ...(categoryId && { category_id: categoryId }),
    ...(minPrice && { start_price: minPrice }),
    ...(maxPrice && { end_price: maxPrice })
  }

  return await callAliExpressAPI('aliexpress.affiliate.product.query', accessToken, params)
}

/**
 * Haal product details op
 */
export async function getProductDetails(accessToken, productIds) {
  const productIdList = Array.isArray(productIds) ? productIds.join(',') : productIds

  const params = {
    product_ids: productIdList,
    target_currency: 'EUR',
    target_language: 'NL',
    country: 'NL'
  }

  return await callAliExpressAPI('aliexpress.affiliate.productdetail.get', accessToken, params)
}

/**
 * Maak order aan op AliExpress
 */
export async function createOrder(accessToken, orderData) {
  const params = {
    product_id: orderData.productId,
    quantity: orderData.quantity,
    shipping_address: JSON.stringify(orderData.shippingAddress),
    ...(orderData.skuId && { sku_id: orderData.skuId })
  }

  return await callAliExpressAPI('aliexpress.dropshipping.order.create', accessToken, params)
}

/**
 * Haal order tracking op
 */
export async function getOrderTracking(accessToken, orderId) {
  const params = {
    order_id: orderId
  }

  return await callAliExpressAPI('aliexpress.dropshipping.order.tracking.get', accessToken, params)
}

/**
 * Haal order status op
 */
export async function getOrderStatus(accessToken, orderId) {
  const params = {
    order_id: orderId
  }

  return await callAliExpressAPI('aliexpress.dropshipping.order.status.get', accessToken, params)
}

