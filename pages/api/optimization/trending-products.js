import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// Trending Producten Importeren - Hoge winst potentieel
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('🔥 Trending producten importeren voor maximale winst...')

      // Trending producten met hoge winstmarges
      const trendingProducts = [
        {
          name: `Smart Ring Fitness Tracker ${Date.now()}`,
          description: 'Revolutionary smart ring that tracks health metrics, sleep, and activity with 7-day battery life.',
          costPrice: 18.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=400', alt: 'Smart Ring' }
          ],
          category: 'electronics',
          subcategory: 'wearables',
          brand: 'RingTech',
          stock: 150,
          tags: ['smart-ring', 'fitness', 'health', 'trending', 'viral'],
          specifications: {
            'Battery': '7 days',
            'Sensors': 'Heart rate, SpO2, Temperature',
            'Water Resistance': 'IP68',
            'Compatibility': 'iOS & Android'
          },
          weight: 0.02,
          dimensions: { length: 2, width: 2, height: 0.5 },
          freeShipping: true,
          supplier: {
            name: 'Trending Supplier',
            email: 'trending@supplier.com'
          },
          averageRating: 4.8,
          totalReviews: 2500,
          trendingScore: 95,
          isTrending: true,
          isFeatured: true,
          profitMargin: 75 // 75% marge voor trending
        },
        {
          name: `LED Face Mask Light Therapy ${Date.now()}`,
          description: 'Professional LED face mask with red and blue light therapy for anti-aging and acne treatment.',
          costPrice: 25.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400', alt: 'LED Face Mask' }
          ],
          category: 'beauty',
          subcategory: 'skincare',
          brand: 'BeautyTech',
          stock: 100,
          tags: ['led-mask', 'light-therapy', 'anti-aging', 'skincare', 'trending'],
          specifications: {
            'LED Colors': 'Red & Blue',
            'Treatment Time': '10-20 minutes',
            'Battery': 'Rechargeable',
            'Safety': 'FDA Approved'
          },
          weight: 0.3,
          dimensions: { length: 20, width: 15, height: 5 },
          freeShipping: true,
          supplier: {
            name: 'Beauty Supplier',
            email: 'beauty@supplier.com'
          },
          averageRating: 4.7,
          totalReviews: 1800,
          trendingScore: 92,
          isTrending: true,
          isFeatured: true,
          profitMargin: 80 // 80% marge voor beauty
        },
        {
          name: `Portable Car Jump Starter ${Date.now()}`,
          description: 'Compact car jump starter with air compressor, LED flashlight, and USB charging ports.',
          costPrice: 35.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400', alt: 'Jump Starter' }
          ],
          category: 'electronics',
          subcategory: 'automotive',
          brand: 'PowerMax',
          stock: 80,
          tags: ['jump-starter', 'car', 'emergency', 'portable', 'trending'],
          specifications: {
            'Power': '20000mAh',
            'Jump Start': 'Up to 7L engines',
            'Features': 'Air compressor, LED light, USB ports',
            'Safety': 'Overcharge protection'
          },
          weight: 1.2,
          dimensions: { length: 20, width: 15, height: 8 },
          freeShipping: true,
          supplier: {
            name: 'Auto Supplier',
            email: 'auto@supplier.com'
          },
          averageRating: 4.6,
          totalReviews: 3200,
          trendingScore: 88,
          isTrending: true,
          isFeatured: true,
          profitMargin: 70 // 70% marge voor automotive
        },
        {
          name: `Magnetic Phone Car Mount ${Date.now()}`,
          description: 'Strong magnetic phone mount for car dashboard with wireless charging capability.',
          costPrice: 12.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=400', alt: 'Phone Mount' }
          ],
          category: 'electronics',
          subcategory: 'automotive',
          brand: 'MagnetPro',
          stock: 200,
          tags: ['phone-mount', 'magnetic', 'wireless-charging', 'car', 'trending'],
          specifications: {
            'Magnetic Force': 'Strong neodymium magnets',
            'Charging': 'Qi wireless charging',
            'Compatibility': 'All smartphones',
            'Installation': 'Dashboard mount'
          },
          weight: 0.2,
          dimensions: { length: 8, width: 6, height: 3 },
          freeShipping: true,
          supplier: {
            name: 'Tech Supplier',
            email: 'tech@supplier.com'
          },
          averageRating: 4.5,
          totalReviews: 4500,
          trendingScore: 85,
          isTrending: true,
          isFeatured: false,
          profitMargin: 75 // 75% marge voor trending tech
        },
        {
          name: `Resistance Loop Bands Set ${Date.now()}`,
          description: 'Complete resistance loop bands set for full body workout with door anchor and handles.',
          costPrice: 8.50,
          images: [
            { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400', alt: 'Resistance Bands' }
          ],
          category: 'sports',
          subcategory: 'fitness',
          brand: 'FlexFit',
          stock: 300,
          tags: ['resistance-bands', 'workout', 'fitness', 'home-gym', 'trending'],
          specifications: {
            'Set Includes': '5 bands + accessories',
            'Resistance': '10-50 lbs',
            'Material': 'Natural latex',
            'Accessories': 'Door anchor, handles, ankle straps'
          },
          weight: 0.8,
          dimensions: { length: 20, width: 15, height: 5 },
          freeShipping: true,
          supplier: {
            name: 'Fitness Supplier',
            email: 'fitness@supplier.com'
          },
          averageRating: 4.6,
          totalReviews: 2800,
          trendingScore: 90,
          isTrending: true,
          isFeatured: true,
          profitMargin: 80 // 80% marge voor fitness trending
        }
      ]

      const importedProducts = []

      for (const product of trendingProducts) {
        try {
          // Controleer of product al bestaat
          const existingProduct = await Product.findOne({ 
            name: product.name
          })

          if (!existingProduct) {
            // Bereken verkoopprijs met hoge marge
            const costPrice = product.costPrice
            const margin = product.profitMargin / 100
            const sellingPrice = Math.round(costPrice * (1 + margin) * 100) / 100
            const originalPrice = Math.round(sellingPrice * 1.3 * 100) / 100 // 30% korting

            const newProduct = new Product({
              name: product.name,
              description: product.description,
              price: sellingPrice,
              originalPrice: originalPrice,
              costPrice: costPrice,
              profitMargin: product.profitMargin,
              images: product.images,
              category: product.category,
              subcategory: product.subcategory,
              brand: product.brand,
              sku: `TREND-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              stock: product.stock,
              isActive: true,
              isFeatured: product.isFeatured,
              isTrending: product.isTrending,
              tags: product.tags,
              specifications: product.specifications,
              shipping: {
                weight: product.weight,
                dimensions: product.dimensions,
                freeShipping: product.freeShipping
              },
              supplier: product.supplier,
              averageRating: product.averageRating,
              totalReviews: product.totalReviews,
              trendingScore: product.trendingScore,
              lastUpdated: new Date()
            })

            await newProduct.save()
            importedProducts.push(newProduct)
            console.log(`🔥 Trending product toegevoegd: ${product.name} - Kosten: €${costPrice}, Verkoop: €${sellingPrice}, Winst: €${(sellingPrice - costPrice).toFixed(2)} (${product.profitMargin}%)`)
          }
        } catch (error) {
          console.error(`❌ Fout bij toevoegen trending product ${product.name}:`, error.message)
        }
      }

      console.log(`🔥 Trending import voltooid: ${importedProducts.length} nieuwe producten`)

      res.status(200).json({
        success: true,
        message: 'Trending producten succesvol geïmporteerd',
        data: {
          importedProducts: importedProducts.length,
          totalProducts: await Product.countDocuments(),
          averageProfitMargin: '75%',
          source: 'Trending Products',
          note: 'Deze producten hebben hoge winstmarges en zijn trending op social media',
          products: importedProducts.map(p => ({
            name: p.name,
            costPrice: p.costPrice,
            sellingPrice: p.price,
            profit: p.price - p.costPrice,
            profitMargin: p.profitMargin,
            supplier: 'Trending Supplier'
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
