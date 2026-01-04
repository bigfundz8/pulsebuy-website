import connectDB from '../../../lib/mongodb'
import User from '../../../models/User'
import Product from '../../../models/Product'
import { searchProducts, getProductDetails, refreshAccessToken } from '../../../lib/aliexpress'

/**
 * AliExpress Product Import API
 * 
 * GET /api/aliexpress/products?query=led+strips&page=1
 * POST /api/aliexpress/products - Import producten naar database
 */
export default async function handler(req, res) {
  await connectDB()

  try {
    // Haal admin user op met AliExpress tokens
    const adminUser = await User.findOne({ role: 'admin' })

    if (!adminUser || !adminUser.aliexpress?.accessToken) {
      return res.status(401).json({
        success: false,
        message: 'AliExpress niet geautoriseerd. Ga naar /dropshipping om te autoriseren.'
      })
    }

    let accessToken = adminUser.aliexpress.accessToken

    // Check of token expired is en refresh indien nodig
    if (adminUser.aliexpress.expiresAt && new Date() >= new Date(adminUser.aliexpress.expiresAt)) {
      console.log('🔄 Access token expired, refreshing...')
      try {
        const tokenData = await refreshAccessToken(adminUser.aliexpress.refreshToken)
        accessToken = tokenData.accessToken
        
        adminUser.aliexpress.accessToken = tokenData.accessToken
        adminUser.aliexpress.refreshToken = tokenData.refreshToken || adminUser.aliexpress.refreshToken
        adminUser.aliexpress.expiresIn = tokenData.expiresIn
        adminUser.aliexpress.lastRefresh = new Date()
        adminUser.aliexpress.expiresAt = new Date(Date.now() + tokenData.expiresIn * 1000)
        await adminUser.save()
        
        console.log('✅ Access token refreshed')
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError)
        return res.status(401).json({
          success: false,
          message: 'AliExpress token refresh gefaald. Herautoriseer via /dropshipping'
        })
      }
    }

    if (req.method === 'GET') {
      // Zoek producten op AliExpress
      const { query = 'led strips', page = 1, pageSize = 20, sort = 'SALE_PRICE_ASC', categoryId, minPrice, maxPrice } = req.query

      console.log(`🔍 Zoeken naar AliExpress producten: "${query}"`)

      const searchResult = await searchProducts(accessToken, query, {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        sort,
        categoryId,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
      })

      if (searchResult.error_response) {
        return res.status(400).json({
          success: false,
          message: searchResult.error_response.msg,
          code: searchResult.error_response.code
        })
      }

      const products = searchResult.aeop_ae_product_query_response?.result?.products?.product || []
      const totalResults = searchResult.aeop_ae_product_query_response?.result?.total_result_count || 0

      return res.status(200).json({
        success: true,
        products: Array.isArray(products) ? products : [products],
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total: totalResults,
          totalPages: Math.ceil(totalResults / parseInt(pageSize))
        }
      })

    } else if (req.method === 'POST') {
      // Import producten naar database
      const { productIds, category = 'Electronics', profitMargin = 0.5 } = req.body

      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'productIds array is vereist'
        })
      }

      console.log(`📦 Importeren van ${productIds.length} AliExpress producten...`)

      // Haal product details op
      const productDetails = await getProductDetails(accessToken, productIds)

      if (productDetails.error_response) {
        return res.status(400).json({
          success: false,
          message: productDetails.error_response.msg,
          code: productDetails.error_response.code
        })
      }

      const products = productDetails.aeop_ae_product_detail_get_response?.result?.products?.product || []
      const productArray = Array.isArray(products) ? products : [products]

      const importedProducts = []

      for (const aliProduct of productArray) {
        try {
          // Bereken verkoopprijs met winstmarge
          const costPrice = parseFloat(aliProduct.product_price?.amount || aliProduct.product_min_price?.amount || 0)
          const salePrice = costPrice * (1 + parseFloat(profitMargin))

          // Check of product al bestaat
          const existingProduct = await Product.findOne({ 
            $or: [
              { aliexpressId: aliProduct.product_id?.toString() },
              { sku: aliProduct.product_id?.toString() }
            ]
          })

          if (existingProduct) {
            console.log(`⚠️ Product ${aliProduct.product_id} bestaat al, overslaan...`)
            continue
          }

          // Maak nieuw product aan
          const newProduct = new Product({
            name: aliProduct.product_title || 'AliExpress Product',
            description: aliProduct.product_description || aliProduct.product_title || '',
            price: Math.round(salePrice * 100) / 100, // Rond af op 2 decimalen
            costPrice: costPrice,
            images: aliProduct.product_main_image_url ? [aliProduct.product_main_image_url] : [],
            category: category,
            stock: aliProduct.product_stock || 999,
            sku: aliProduct.product_id?.toString() || `ALI-${Date.now()}`,
            aliexpressId: aliProduct.product_id?.toString(),
            aliexpressUrl: aliProduct.product_url || `https://www.aliexpress.com/item/${aliProduct.product_id}.html`,
            isActive: true,
            isDropshipping: true,
            supplier: 'AliExpress'
          })

          await newProduct.save()
          importedProducts.push(newProduct)

          console.log(`✅ Product geïmporteerd: ${newProduct.name}`)
        } catch (productError) {
          console.error(`❌ Fout bij importeren product ${aliProduct.product_id}:`, productError)
        }
      }

      return res.status(200).json({
        success: true,
        message: `${importedProducts.length} producten succesvol geïmporteerd`,
        imported: importedProducts.length,
        products: importedProducts
      })

    } else {
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`
      })
    }

  } catch (error) {
    console.error('❌ AliExpress products API error:', error)
    return res.status(500).json({
      success: false,
      message: 'Fout bij AliExpress API call',
      error: error.message
    })
  }
}

