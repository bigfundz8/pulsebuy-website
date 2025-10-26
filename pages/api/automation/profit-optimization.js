import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// Winstgevendheid Optimalisatie Systeem
export default async function handler(req, res) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key
  const expectedKey = process.env.CRON_API_KEY
  
  if (apiKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid API key'
    })
  }

  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('💰 Winstgevendheid optimalisatie gestart...')

      // 1. Dynamische prijs optimalisatie
      const priceOptimization = await optimizePricesForProfit()
      
      // 2. Trending producten detecteren en prijzen verhogen
      const trendingOptimization = await optimizeTrendingProducts()
      
      // 3. Bundle deals creëren voor hogere winst
      const bundleDeals = await createBundleDeals()
      
      // 4. Upsell producten identificeren
      const upsellProducts = await identifyUpsellProducts()
      
      // 5. Voorraad optimalisatie voor winst
      const inventoryOptimization = await optimizeInventoryForProfit()

      console.log('✅ Winstgevendheid optimalisatie voltooid!')
      
      res.status(200).json({
        success: true,
        message: 'Winstgevendheid optimalisatie succesvol uitgevoerd',
        data: {
          priceOptimization: priceOptimization.productsUpdated,
          trendingOptimization: trendingOptimization.productsOptimized,
          bundleDeals: bundleDeals.bundlesCreated,
          upsellProducts: upsellProducts.productsIdentified,
          inventoryOptimization: inventoryOptimization.stockOptimized,
          estimatedProfitIncrease: `${priceOptimization.profitIncrease}%`
        }
      })
    } catch (error) {
      console.error('❌ Winstgevendheid optimalisatie fout:', error)
      res.status(500).json({
        success: false,
        message: 'Winstgevendheid optimalisatie gefaald',
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

// Functie 1: Dynamische prijs optimalisatie voor maximale winst
async function optimizePricesForProfit() {
  console.log('💰 Prijzen optimaliseren voor maximale winst...')
  
  const products = await Product.find({})
  let productsUpdated = 0
  let totalProfitIncrease = 0

  for (const product of products) {
    try {
      // Bereken optimale prijs gebaseerd op verschillende factoren
      const basePrice = product.basePrice || (product.price / 2.5) // Schat basisprijs
      const currentMargin = (product.price - basePrice) / product.price
      
      // Optimaliseer prijs gebaseerd op:
      // 1. Product populariteit (rating * reviews)
      const popularityScore = (product.rating || 4) * Math.log10((product.reviews || 1) + 1)
      
      // 2. Voorraad niveau (lage voorraad = hogere prijs)
      const stockFactor = product.stock < 10 ? 1.2 : product.stock < 50 ? 1.1 : 1.0
      
      // 3. Trending status
      const trendingFactor = product.isTrending ? 1.15 : 1.0
      
      // 4. Featured status
      const featuredFactor = product.isFeatured ? 1.1 : 1.0
      
      // 5. Categorie premium factor
      const categoryFactors = {
        'electronics': 1.3,
        'home': 1.2,
        'fashion': 1.1,
        'sports': 1.15,
        'beauty': 1.25
      }
      const categoryFactor = categoryFactors[product.category] || 1.0
      
      // Bereken nieuwe optimale prijs
      const optimalMargin = Math.min(0.7, Math.max(0.3, 0.4 + (popularityScore / 20))) // 30-70% marge
      const newPrice = Math.round((basePrice / (1 - optimalMargin)) * stockFactor * trendingFactor * featuredFactor * categoryFactor * 100) / 100
      
      // Alleen updaten als de nieuwe prijs significant anders is
      if (Math.abs(newPrice - product.price) > 0.5) {
        await Product.findByIdAndUpdate(product._id, {
          price: newPrice,
          originalPrice: newPrice * 1.2, // 20% korting simuleren
          lastPriceOptimization: new Date(),
          profitMargin: optimalMargin,
          priceOptimizationScore: popularityScore
        })
        
        const profitIncrease = ((newPrice - basePrice) - (product.price - basePrice)) / (product.price - basePrice) * 100
        totalProfitIncrease += profitIncrease
        productsUpdated++
        
        console.log(`💰 ${product.name}: €${product.price} → €${newPrice} (+${profitIncrease.toFixed(1)}% winst)`)
      }
    } catch (error) {
      console.error(`❌ Fout bij prijs optimalisatie voor ${product.name}:`, error.message)
    }
  }

  return {
    productsUpdated,
    profitIncrease: productsUpdated > 0 ? (totalProfitIncrease / productsUpdated).toFixed(1) : 0
  }
}

// Functie 2: Trending producten optimaliseren voor hogere winst
async function optimizeTrendingProducts() {
  console.log('🔥 Trending producten optimaliseren...')
  
  const trendingProducts = await Product.find({ isTrending: true })
  let productsOptimized = 0

  for (const product of trendingProducts) {
    try {
      // Trending producten krijgen hogere prijzen
      const currentPrice = product.price
      const trendingPrice = Math.round(currentPrice * 1.1 * 100) / 100 // 10% verhoging
      
      await Product.findByIdAndUpdate(product._id, {
        price: trendingPrice,
        originalPrice: trendingPrice * 1.15, // 15% korting simuleren
        trendingPriceBoost: 1.1,
        lastTrendingOptimization: new Date()
      })
      
      productsOptimized++
      console.log(`🔥 Trending boost: ${product.name} €${currentPrice} → €${trendingPrice}`)
    } catch (error) {
      console.error(`❌ Fout bij trending optimalisatie:`, error.message)
    }
  }

  return { productsOptimized }
}

// Functie 3: Bundle deals creëren voor hogere winst
async function createBundleDeals() {
  console.log('📦 Bundle deals creëren...')
  
  const products = await Product.find({}).limit(20)
  const bundlesCreated = []

  // Creëer automatische bundles gebaseerd op categorieën
  const categoryGroups = {}
  products.forEach(product => {
    if (!categoryGroups[product.category]) {
      categoryGroups[product.category] = []
    }
    categoryGroups[product.category].push(product)
  })

  for (const [category, categoryProducts] of Object.entries(categoryGroups)) {
    if (categoryProducts.length >= 2) {
      // Selecteer 2-3 producten voor bundle
      const bundleProducts = categoryProducts.slice(0, Math.min(3, categoryProducts.length))
      const bundlePrice = bundleProducts.reduce((sum, product) => sum + product.price, 0) * 0.85 // 15% korting
      
      const bundle = {
        name: `${category.charAt(0).toUpperCase() + category.slice(1)} Bundle Deal`,
        description: `Complete ${category} set met ${bundleProducts.length} premium producten`,
        products: bundleProducts.map(p => ({
          productId: p._id,
          name: p.name,
          price: p.price
        })),
        bundlePrice: Math.round(bundlePrice * 100) / 100,
        originalPrice: bundleProducts.reduce((sum, product) => sum + product.price, 0),
        savings: Math.round((bundleProducts.reduce((sum, product) => sum + product.price, 0) - bundlePrice) * 100) / 100,
        category: category,
        isBundle: true,
        createdAt: new Date()
      }
      
      bundlesCreated.push(bundle)
      console.log(`📦 Bundle gemaakt: ${bundle.name} - €${bundle.bundlePrice} (bespaar €${bundle.savings})`)
    }
  }

  return { bundlesCreated: bundlesCreated.length }
}

// Functie 4: Upsell producten identificeren
async function identifyUpsellProducts() {
  console.log('⬆️ Upsell producten identificeren...')
  
  const products = await Product.find({})
  let productsIdentified = 0

  for (const product of products) {
    try {
      // Identificeer upsell mogelijkheden
      const upsellScore = calculateUpsellScore(product)
      
      if (upsellScore > 0.7) {
        await Product.findByIdAndUpdate(product._id, {
          isUpsellCandidate: true,
          upsellScore: upsellScore,
          suggestedUpsells: generateUpsellSuggestions(product),
          lastUpsellAnalysis: new Date()
        })
        
        productsIdentified++
        console.log(`⬆️ Upsell kandidaat: ${product.name} (score: ${upsellScore.toFixed(2)})`)
      }
    } catch (error) {
      console.error(`❌ Fout bij upsell analyse:`, error.message)
    }
  }

  return { productsIdentified }
}

// Helper functie voor upsell score berekening
function calculateUpsellScore(product) {
  let score = 0
  
  // Hoge rating = goede upsell kandidaat
  if (product.rating >= 4.5) score += 0.3
  else if (product.rating >= 4.0) score += 0.2
  
  // Veel reviews = populaire upsell
  if (product.reviews >= 100) score += 0.2
  else if (product.reviews >= 50) score += 0.1
  
  // Trending = perfecte upsell
  if (product.isTrending) score += 0.2
  
  // Featured = goede upsell
  if (product.isFeatured) score += 0.1
  
  // Hoge prijs = goede upsell (premium producten)
  if (product.price >= 50) score += 0.2
  
  return Math.min(1.0, score)
}

// Helper functie voor upsell suggesties
function generateUpsellSuggestions(product) {
  const suggestions = []
  
  if (product.category === 'electronics') {
    suggestions.push('Extended warranty', 'Premium accessories', 'Protection plan')
  } else if (product.category === 'home') {
    suggestions.push('Matching accessories', 'Care kit', 'Extended warranty')
  } else if (product.category === 'fashion') {
    suggestions.push('Matching items', 'Care products', 'Premium packaging')
  }
  
  return suggestions
}

// Functie 5: Voorraad optimalisatie voor winst
async function optimizeInventoryForProfit() {
  console.log('📊 Voorraad optimaliseren voor winst...')
  
  const products = await Product.find({})
  let stockOptimized = 0

  for (const product of products) {
    try {
      // Optimaliseer voorraad gebaseerd op verkoop potentieel
      const salesPotential = calculateSalesPotential(product)
      const optimalStock = Math.max(10, Math.min(200, Math.round(salesPotential * 2)))
      
      if (Math.abs(optimalStock - product.stock) > 5) {
        await Product.findByIdAndUpdate(product._id, {
          stock: optimalStock,
          optimalStockLevel: optimalStock,
          lastStockOptimization: new Date(),
          salesPotential: salesPotential
        })
        
        stockOptimized++
        console.log(`📊 Voorraad geoptimaliseerd: ${product.name} ${product.stock} → ${optimalStock}`)
      }
    } catch (error) {
      console.error(`❌ Fout bij voorraad optimalisatie:`, error.message)
    }
  }

  return { stockOptimized }
}

// Helper functie voor verkoop potentieel berekening
function calculateSalesPotential(product) {
  let potential = 0
  
  // Rating impact
  potential += (product.rating || 4) * 10
  
  // Reviews impact
  potential += Math.log10((product.reviews || 1) + 1) * 5
  
  // Trending boost
  if (product.isTrending) potential += 20
  
  // Featured boost
  if (product.isFeatured) potential += 15
  
  // Prijs impact (goedkope producten verkopen beter)
  if (product.price < 25) potential += 10
  else if (product.price < 50) potential += 5
  
  return Math.max(10, Math.min(100, potential))
}
