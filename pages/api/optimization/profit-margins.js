import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// Product Optimalisatie API - Verhoog winstmarges
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('💰 Product winstmarges optimaliseren...')

      // Haal alle producten op
      const products = await Product.find({ isActive: true })

      let optimizedCount = 0
      let totalProfitIncrease = 0

      for (const product of products) {
        const originalPrice = product.price
        const costPrice = product.costPrice || (product.price * 0.6) // Schatting als geen costPrice
        
        // Optimaliseer winstmarge op basis van categorie
        let optimalMargin = 0.5 // 50% standaard
        
        switch (product.category) {
          case 'electronics':
            optimalMargin = 0.6 // 60% voor elektronica
            break
          case 'fashion':
            optimalMargin = 0.7 // 70% voor fashion
            break
          case 'beauty':
            optimalMargin = 0.8 // 80% voor beauty
            break
          case 'home':
            optimalMargin = 0.65 // 65% voor home
            break
          case 'sports':
            optimalMargin = 0.55 // 55% voor sports
            break
          default:
            optimalMargin = 0.5 // 50% standaard
        }

        // Bereken nieuwe prijs
        const newPrice = Math.round(costPrice * (1 + optimalMargin) * 100) / 100
        const originalPriceWithDiscount = Math.round(newPrice * 1.2 * 100) / 100

        // Update product
        product.price = newPrice
        product.originalPrice = originalPriceWithDiscount
        product.profitMargin = optimalMargin * 100
        product.costPrice = costPrice

        await product.save()

        const profitIncrease = newPrice - originalPrice
        totalProfitIncrease += profitIncrease
        optimizedCount++

        console.log(`✅ ${product.name}: €${originalPrice} → €${newPrice} (+€${profitIncrease.toFixed(2)})`)
      }

      console.log(`💰 Optimalisatie voltooid: ${optimizedCount} producten, +€${totalProfitIncrease.toFixed(2)} winst`)

      res.status(200).json({
        success: true,
        message: 'Product winstmarges succesvol geoptimaliseerd',
        data: {
          optimizedProducts: optimizedCount,
          totalProfitIncrease: totalProfitIncrease,
          averageMarginIncrease: optimizedCount > 0 ? (totalProfitIncrease / optimizedCount) : 0,
          categories: {
            electronics: '60% marge',
            fashion: '70% marge',
            beauty: '80% marge',
            home: '65% marge',
            sports: '55% marge'
          }
        }
      })

    } catch (error) {
      console.error('❌ Product optimalisatie fout:', error)
      res.status(500).json({
        success: false,
        message: 'Product optimalisatie gefaald',
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
