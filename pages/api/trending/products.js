import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// Demo API voor trending producten (zonder echte API keys)
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('🔥 Trending producten detecteren en toevoegen...')

      // Simuleer trending producten (in werkelijkheid zou je hier een echte API call maken)
      const trendingProducts = [
        {
          name: 'Smart Ring Fitness Tracker',
          description: 'Revolutionary smart ring with health monitoring, sleep tracking, and NFC payment.',
          costPrice: 45.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=400', alt: 'Smart Ring' }
          ],
          category: 'electronics',
          subcategory: 'wearables',
          brand: 'RingTech',
          stock: 100,
          tags: ['smart-ring', 'fitness', 'health', 'nfc', 'trending'],
          specifications: {
            'Battery': '7 days',
            'Sensors': 'Heart rate, SpO2, Sleep',
            'Payment': 'NFC enabled',
            'Water Resistance': 'IP68'
          },
          weight: 0.01,
          dimensions: { length: 2, width: 2, height: 0.5 },
          freeShipping: true,
          aliExpressUrl: 'https://aliexpress.com/item/smart-ring-fitness',
          rating: 4.8,
          reviews: 3200,
          trendingScore: 95
        },
        {
          name: 'Portable Car Vacuum Cleaner',
          description: 'Powerful 12V car vacuum with LED light, multiple attachments, and cordless operation.',
          costPrice: 28.50,
          images: [
            { url: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?q=80&w=400', alt: 'Car Vacuum' }
          ],
          category: 'home',
          subcategory: 'automotive',
          brand: 'CarClean',
          stock: 150,
          tags: ['car-vacuum', 'portable', '12v', 'led', 'trending'],
          specifications: {
            'Power': '12V DC',
            'Suction': '8000Pa',
            'Battery': 'Rechargeable',
            'Attachments': '4 included'
          },
          weight: 1.2,
          dimensions: { length: 30, width: 15, height: 15 },
          freeShipping: true,
          aliExpressUrl: 'https://aliexpress.com/item/car-vacuum-cleaner',
          rating: 4.6,
          reviews: 2100,
          trendingScore: 88
        },
        {
          name: 'Magnetic Phone Mount for Car',
          description: 'Strong magnetic phone mount with 360° rotation and one-handed operation.',
          costPrice: 12.75,
          images: [
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400', alt: 'Phone Mount' }
          ],
          category: 'electronics',
          subcategory: 'accessories',
          brand: 'MagnetMount',
          stock: 300,
          tags: ['phone-mount', 'magnetic', 'car', '360-rotation', 'trending'],
          specifications: {
            'Magnetic Force': '15N',
            'Rotation': '360°',
            'Compatibility': 'All smartphones',
            'Installation': 'Dashboard/Vent'
          },
          weight: 0.3,
          dimensions: { length: 8, width: 8, height: 3 },
          freeShipping: true,
          aliExpressUrl: 'https://aliexpress.com/item/magnetic-phone-mount',
          rating: 4.7,
          reviews: 4500,
          trendingScore: 92
        },
        {
          name: 'Bluetooth Shower Speaker',
          description: 'Waterproof Bluetooth speaker with LED lights and powerful bass for shower use.',
          costPrice: 18.25,
          images: [
            { url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=400', alt: 'Shower Speaker' }
          ],
          category: 'electronics',
          subcategory: 'audio',
          brand: 'AquaSound',
          stock: 200,
          tags: ['bluetooth-speaker', 'waterproof', 'shower', 'led', 'trending'],
          specifications: {
            'Waterproof': 'IPX7',
            'Battery': '8 hours',
            'Bluetooth': '5.0',
            'LED': 'RGB lights'
          },
          weight: 0.4,
          dimensions: { length: 10, width: 10, height: 5 },
          freeShipping: true,
          aliExpressUrl: 'https://aliexpress.com/item/bluetooth-shower-speaker',
          rating: 4.5,
          reviews: 1800,
          trendingScore: 85
        },
        {
          name: 'Electric Back Massager',
          description: 'Deep tissue electric massager with heat therapy and multiple speed settings.',
          costPrice: 35.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400', alt: 'Back Massager' }
          ],
          category: 'beauty',
          subcategory: 'wellness',
          brand: 'RelaxPro',
          stock: 120,
          tags: ['massager', 'electric', 'heat-therapy', 'back-pain', 'trending'],
          specifications: {
            'Speeds': '5 levels',
            'Heat': 'Adjustable',
            'Power': 'Rechargeable',
            'Timer': '15 minutes'
          },
          weight: 1.5,
          dimensions: { length: 25, width: 15, height: 8 },
          freeShipping: true,
          aliExpressUrl: 'https://aliexpress.com/item/electric-back-massager',
          rating: 4.4,
          reviews: 1600,
          trendingScore: 82
        }
      ]

      const importedProducts = []

      for (const product of trendingProducts) {
        try {
          // Controleer of product al bestaat
          const existingProduct = await Product.findOne({ 
            $or: [
              { name: product.name },
              { 'supplier.aliExpressUrl': product.aliExpressUrl }
            ]
          })

          if (!existingProduct) {
            // Bereken verkoopprijs met marge (50% marge voor dropshipping)
            const costPrice = product.costPrice
            const margin = 0.5 // 50% marge
            const sellingPrice = Math.round(costPrice * (1 + margin) * 100) / 100
            const originalPrice = Math.round(sellingPrice * 1.25 * 100) / 100 // 25% korting

            const newProduct = new Product({
              name: product.name,
              description: product.description,
              price: sellingPrice,
              originalPrice: originalPrice,
              costPrice: costPrice,
              profitMargin: margin * 100,
              images: product.images,
              category: product.category,
              subcategory: product.subcategory,
              brand: product.brand,
              sku: `TREND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              stock: product.stock,
              isActive: true,
              isFeatured: true, // Trending producten zijn altijd featured
              isTrending: true, // Deze zijn trending
              tags: product.tags,
              specifications: product.specifications,
              shipping: {
                weight: product.weight,
                dimensions: product.dimensions,
                freeShipping: product.freeShipping
              },
              supplier: {
                name: 'Trending Dropshipping',
                contact: 'trending@dropshipping.com',
                email: 'trending@dropshipping.com',
                aliExpressUrl: product.aliExpressUrl
              },
              averageRating: product.rating,
              totalReviews: product.reviews,
              aliexpressUrl: product.aliExpressUrl,
              trendingScore: product.trendingScore,
              lastUpdated: new Date()
            })

            await newProduct.save()
            importedProducts.push(newProduct)
            console.log(`✅ Trending product toegevoegd: ${product.name} - Kosten: €${costPrice}, Verkoop: €${sellingPrice}, Trending Score: ${product.trendingScore}`)
          }
        } catch (error) {
          console.error(`❌ Fout bij toevoegen trending product ${product.name}:`, error.message)
        }
      }

      console.log(`✅ Trending producten import voltooid: ${importedProducts.length} nieuwe trending producten`)

      res.status(200).json({
        success: true,
        message: 'Trending producten succesvol geïmporteerd',
        data: {
          importedProducts: importedProducts.length,
          totalProducts: await Product.countDocuments(),
          profitMargin: '50%',
          trendingProducts: importedProducts.map(p => ({
            name: p.name,
            costPrice: p.costPrice,
            sellingPrice: p.price,
            profit: p.price - p.costPrice,
            trendingScore: p.trendingScore
          }))
        }
      })

    } catch (error) {
      console.error('❌ Trending import fout:', error)
      res.status(500).json({
        success: false,
        message: 'Trending import gefaald',
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
