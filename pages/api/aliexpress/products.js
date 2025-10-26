import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// Handmatige AliExpress Product Import (zonder API key)
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('🛍️ Handmatige AliExpress producten importeren...')

      // Handmatige AliExpress producten (kopieer deze van je AliExpress dropshipping center)
      const manualAliExpressProducts = [
        {
          name: `Wireless Bluetooth Earbuds Pro ${Date.now()}`,
          description: 'High-quality wireless earbuds with noise cancellation and long battery life.',
          costPrice: 8.50,
          images: [
            { url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=400', alt: 'Wireless Earbuds' }
          ],
          category: 'Electronics',
          subcategory: 'Audio',
          brand: 'TechPro',
          stock: 200,
          tags: ['wireless', 'earbuds', 'bluetooth', 'noise-cancellation'],
          specifications: {
            'Battery Life': '6 hours + 24h case',
            'Connectivity': 'Bluetooth 5.0',
            'Noise Cancellation': 'Active',
            'Water Resistance': 'IPX5'
          },
          weight: 0.05,
          dimensions: { length: 4, width: 2, height: 1 },
          freeShipping: true,
          aliexpressUrl: `https://aliexpress.com/item/wireless-earbuds-pro-${Date.now()}`,
          rating: 4.6,
          reviewsCount: 1500,
          isFeatured: true,
          isTrending: true,
          trendingScore: 90,
          supplierEmail: 'supplier@techpro.com'
        },
        {
          name: `Smart Fitness Tracker Watch ${Date.now()}`,
          description: 'Advanced fitness tracker with heart rate monitor, GPS, and 7-day battery life.',
          costPrice: 12.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400', alt: 'Fitness Tracker' }
          ],
          category: 'Electronics',
          subcategory: 'Wearables',
          brand: 'FitMax',
          stock: 150,
          tags: ['smartwatch', 'fitness', 'health', 'gps', 'heart-rate'],
          specifications: {
            'Display': '1.3 inch LCD',
            'Battery': '7 days',
            'Sensors': 'Heart rate, SpO2, GPS',
            'Water Resistance': 'IP68'
          },
          weight: 0.04,
          dimensions: { length: 3, width: 3, height: 1 },
          freeShipping: true,
          aliexpressUrl: `https://aliexpress.com/item/fitness-tracker-watch-${Date.now()}`,
          rating: 4.5,
          reviewsCount: 2200,
          isFeatured: true,
          isTrending: true,
          trendingScore: 85,
          supplierEmail: 'supplier@fitmax.com'
        },
        {
          name: 'LED Strip Lights RGB WiFi',
          description: 'Smart LED strip lights with WiFi control, music sync, and 16 million colors.',
          costPrice: 6.25,
          images: [
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400', alt: 'LED Strip Lights' }
          ],
          category: 'Home & Garden',
          subcategory: 'Lighting',
          brand: 'LightMax',
          stock: 300,
          tags: ['led', 'smart', 'wifi', 'rgb', 'home-automation'],
          specifications: {
            'Length': '5 meters',
            'Colors': '16 million',
            'Control': 'WiFi + App',
            'Music Sync': 'Yes'
          },
          weight: 0.3,
          dimensions: { length: 5, width: 0.1, height: 0.1 },
          freeShipping: true,
          aliexpressUrl: 'https://aliexpress.com/item/led-strip-wifi',
          rating: 4.7,
          reviewsCount: 3200,
          isFeatured: false,
          isTrending: true,
          trendingScore: 92,
          supplierEmail: 'supplier@lightmax.com'
        },
        {
          name: 'Electric Air Fryer 5L',
          description: 'Large capacity air fryer with digital display, 8 cooking presets, and non-stick coating.',
          costPrice: 35.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=400', alt: 'Air Fryer' }
          ],
          category: 'Home & Garden',
          subcategory: 'Kitchen',
          brand: 'CookPro',
          stock: 80,
          tags: ['air-fryer', 'kitchen', 'digital', 'healthy-cooking'],
          specifications: {
            'Capacity': '5 liters',
            'Power': '1500W',
            'Display': 'Digital',
            'Presets': '8 cooking modes'
          },
          weight: 4.0,
          dimensions: { length: 28, width: 24, height: 28 },
          freeShipping: true,
          aliexpressUrl: 'https://aliexpress.com/item/air-fryer-5l',
          rating: 4.5,
          reviewsCount: 1800,
          isFeatured: true,
          isTrending: false,
          trendingScore: 75,
          supplierEmail: 'supplier@cookpro.com'
        },
        {
          name: 'Premium Yoga Mat',
          description: 'Non-slip yoga mat with alignment lines, carrying strap, and eco-friendly TPE material.',
          costPrice: 12.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400', alt: 'Yoga Mat' }
          ],
          category: 'Sports & Outdoors',
          subcategory: 'Fitness',
          brand: 'FlexFit',
          stock: 250,
          tags: ['yoga', 'mat', 'fitness', 'eco-friendly', 'non-slip'],
          specifications: {
            'Material': 'TPE',
            'Thickness': '6mm',
            'Size': '183x61cm',
            'Alignment': 'Lines included'
          },
          weight: 1.0,
          dimensions: { length: 183, width: 61, height: 0.6 },
          freeShipping: true,
          aliexpressUrl: 'https://aliexpress.com/item/yoga-mat-premium',
          rating: 4.6,
          reviewsCount: 2100,
          isFeatured: true,
          isTrending: true,
          trendingScore: 88,
          supplierEmail: 'supplier@flexfit.com'
        },
        {
          name: 'Resistance Bands Set',
          description: 'Complete resistance bands set with door anchor, handles, and ankle straps.',
          costPrice: 9.50,
          images: [
            { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400', alt: 'Resistance Bands' }
          ],
          category: 'Sports & Outdoors',
          subcategory: 'Fitness',
          brand: 'PowerFlex',
          stock: 200,
          tags: ['resistance-bands', 'fitness', 'home-workout', 'exercise'],
          specifications: {
            'Set Includes': '5 bands + accessories',
            'Resistance': '10-50 lbs',
            'Material': 'Natural latex',
            'Accessories': 'Door anchor, handles, ankle straps'
          },
          weight: 0.8,
          dimensions: { length: 20, width: 15, height: 5 },
          freeShipping: true,
          aliexpressUrl: 'https://aliexpress.com/item/resistance-bands-set',
          rating: 4.5,
          reviewsCount: 1900,
          isFeatured: false,
          isTrending: true,
          trendingScore: 82,
          supplierEmail: 'supplier@powerflex.com'
        },
        {
          name: 'Facial Cleansing Brush',
          description: 'Electric facial cleansing brush with 3 speeds, waterproof design, and 2 brush heads.',
          costPrice: 15.20,
          images: [
            { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400', alt: 'Facial Brush' }
          ],
          category: 'Beauty & Health',
          subcategory: 'Skincare',
          brand: 'BeautyTech',
          stock: 180,
          tags: ['facial-brush', 'skincare', 'electric', 'waterproof'],
          specifications: {
            'Speeds': '3 speed settings',
            'Design': 'Waterproof',
            'Brush Heads': '2 included',
            'Battery': 'Rechargeable'
          },
          weight: 0.3,
          dimensions: { length: 15, width: 5, height: 5 },
          freeShipping: true,
          aliexpressUrl: 'https://aliexpress.com/item/facial-cleansing-brush',
          rating: 4.4,
          reviewsCount: 1600,
          isFeatured: true,
          isTrending: false,
          trendingScore: 70,
          supplierEmail: 'supplier@beautytech.com'
        }
      ]

      const importedProducts = []

      for (const product of manualAliExpressProducts) {
        try {
          // Controleer of product al bestaat
          const existingProduct = await Product.findOne({ 
            $or: [
              { name: product.name },
              { 'supplier.aliexpressUrl': product.aliexpressUrl }
            ]
          })

          if (!existingProduct) {
            // Bereken verkoopprijs met marge (50% marge voor AliExpress)
            const costPrice = product.costPrice
            const margin = 0.5 // 50% marge voor AliExpress producten
            const sellingPrice = Math.round(costPrice * (1 + margin) * 100) / 100
            const originalPrice = Math.round(sellingPrice * 1.3 * 100) / 100 // 30% korting

            const newProduct = new Product({
              name: product.name,
              description: product.description,
              price: sellingPrice,
              originalPrice: originalPrice,
              costPrice: costPrice,
              profitMargin: margin * 100,
              images: product.images,
              category: mapAliExpressCategory(product.category),
              subcategory: product.subcategory.toLowerCase(),
              brand: product.brand,
              sku: `AE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
              supplier: {
                name: 'AliExpress Supplier',
                contact: product.supplierEmail,
                email: product.supplierEmail,
                aliexpressUrl: product.aliexpressUrl
              },
              averageRating: product.rating,
              totalReviews: product.reviewsCount,
              aliexpressUrl: product.aliexpressUrl,
              trendingScore: product.trendingScore,
              lastUpdated: new Date()
            })

            await newProduct.save()
            importedProducts.push(newProduct)
            console.log(`✅ Handmatig AliExpress product toegevoegd: ${product.name} - Kosten: €${costPrice}, Verkoop: €${sellingPrice}, Winst: €${(sellingPrice - costPrice).toFixed(2)}`)
          }
        } catch (error) {
          console.error(`❌ Fout bij toevoegen AliExpress product ${product.name}:`, error.message)
        }
      }

      console.log(`✅ Handmatige AliExpress import voltooid: ${importedProducts.length} nieuwe producten`)

      res.status(200).json({
        success: true,
        message: 'Handmatige AliExpress producten succesvol geïmporteerd',
        data: {
          importedProducts: importedProducts.length,
          totalProducts: await Product.countDocuments(),
          profitMargin: '50%',
          source: 'AliExpress Manual',
          note: 'Dit zijn handmatig geïmporteerde AliExpress producten. Je kunt deze vervangen door echte producten uit je AliExpress dropshipping center.',
          products: importedProducts.map(p => ({
            name: p.name,
            costPrice: p.costPrice,
            sellingPrice: p.price,
            profit: p.price - p.costPrice,
            supplier: 'AliExpress Manual'
          }))
        }
      })

    } catch (error) {
      console.error('❌ Handmatige AliExpress import fout:', error)
      res.status(500).json({
        success: false,
        message: 'Handmatige AliExpress import gefaald',
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

// Map AliExpress categorieën naar onze categorieën
function mapAliExpressCategory(aliexpressCategory) {
  const categoryMap = {
    'Electronics': 'electronics',
    'Home & Garden': 'home',
    'Sports & Outdoors': 'sports',
    'Beauty & Health': 'beauty',
    'Fashion': 'fashion',
    'Automotive': 'electronics',
    'Toys & Hobbies': 'other',
    'Jewelry & Watches': 'fashion'
  }
  
  return categoryMap[aliexpressCategory] || 'other'
}