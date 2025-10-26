import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// Handmatige Spocket Product Import (zonder API key)
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('🛍️ Handmatige Spocket producten importeren...')

      // Handmatige Spocket producten (kopieer deze van je Spocket dashboard)
      const manualSpocketProducts = [
        {
          name: 'Premium Wireless Earbuds Pro',
          description: 'High-end wireless earbuds with active noise cancellation and premium sound quality.',
          costPrice: 25.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=400', alt: 'Wireless Earbuds Pro' }
          ],
          category: 'Electronics',
          subcategory: 'Audio',
          brand: 'SoundPro',
          stock: 150,
          tags: ['wireless', 'earbuds', 'noise-cancellation', 'premium'],
          specifications: {
            'Battery Life': '8 hours + 24h case',
            'Connectivity': 'Bluetooth 5.2',
            'Noise Cancellation': 'Active',
            'Water Resistance': 'IPX5'
          },
          weight: 0.08,
          dimensions: { length: 5, width: 3, height: 2 },
          freeShipping: true,
          spocketUrl: 'https://spocket.co/product/premium-wireless-earbuds',
          rating: 4.8,
          reviewsCount: 3200,
          isFeatured: true,
          isTrending: true,
          trendingScore: 95,
          supplierEmail: 'supplier@soundpro.com'
        },
        {
          name: 'Smart Fitness Watch Premium',
          description: 'Advanced fitness watch with health monitoring, GPS, and 7-day battery life.',
          costPrice: 45.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400', alt: 'Smart Fitness Watch' }
          ],
          category: 'Electronics',
          subcategory: 'Wearables',
          brand: 'FitMax',
          stock: 100,
          tags: ['smartwatch', 'fitness', 'health', 'gps', 'premium'],
          specifications: {
            'Display': '1.4 inch AMOLED',
            'Battery': '7 days',
            'Sensors': 'Heart rate, SpO2, GPS',
            'Water Resistance': 'IP68'
          },
          weight: 0.06,
          dimensions: { length: 4, width: 4, height: 1 },
          freeShipping: true,
          spocketUrl: 'https://spocket.co/product/smart-fitness-watch',
          rating: 4.7,
          reviewsCount: 2100,
          isFeatured: true,
          isTrending: true,
          trendingScore: 92,
          supplierEmail: 'supplier@fitmax.com'
        },
        {
          name: 'LED Strip Lights Smart WiFi',
          description: 'Smart LED strip lights with WiFi control, music sync, and 16 million colors.',
          costPrice: 15.00,
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
          weight: 0.4,
          dimensions: { length: 5, width: 0.1, height: 0.1 },
          freeShipping: true,
          spocketUrl: 'https://spocket.co/product/led-strip-wifi',
          rating: 4.6,
          reviewsCount: 1800,
          isFeatured: false,
          isTrending: true,
          trendingScore: 88,
          supplierEmail: 'supplier@lightmax.com'
        },
        {
          name: 'Electric Air Fryer Digital',
          description: 'Large capacity air fryer with digital display, 8 cooking presets, and non-stick coating.',
          costPrice: 65.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=400', alt: 'Air Fryer Digital' }
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
          weight: 4.2,
          dimensions: { length: 30, width: 25, height: 30 },
          freeShipping: true,
          spocketUrl: 'https://spocket.co/product/air-fryer-digital',
          rating: 4.5,
          reviewsCount: 1200,
          isFeatured: true,
          isTrending: false,
          trendingScore: 75,
          supplierEmail: 'supplier@cookpro.com'
        },
        {
          name: 'Premium Yoga Mat Pro',
          description: 'Professional yoga mat with alignment lines, carrying strap, and eco-friendly TPE material.',
          costPrice: 22.00,
          images: [
            { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400', alt: 'Yoga Mat Pro' }
          ],
          category: 'Sports & Outdoors',
          subcategory: 'Fitness',
          brand: 'FlexFit',
          stock: 200,
          tags: ['yoga', 'mat', 'fitness', 'eco-friendly', 'professional'],
          specifications: {
            'Material': 'TPE',
            'Thickness': '6mm',
            'Size': '183x61cm',
            'Alignment': 'Lines included'
          },
          weight: 1.2,
          dimensions: { length: 183, width: 61, height: 0.6 },
          freeShipping: true,
          spocketUrl: 'https://spocket.co/product/yoga-mat-pro',
          rating: 4.7,
          reviewsCount: 1500,
          isFeatured: true,
          isTrending: true,
          trendingScore: 85,
          supplierEmail: 'supplier@flexfit.com'
        }
      ]

      const importedProducts = []

      for (const product of manualSpocketProducts) {
        try {
          // Controleer of product al bestaat
          const existingProduct = await Product.findOne({ 
            $or: [
              { name: product.name },
              { 'supplier.spocketUrl': product.spocketUrl }
            ]
          })

          if (!existingProduct) {
            // Bereken verkoopprijs met marge (60% marge voor Spocket - hoger vanwege kwaliteit)
            const costPrice = product.costPrice
            const margin = 0.6 // 60% marge voor Spocket producten
            const sellingPrice = Math.round(costPrice * (1 + margin) * 100) / 100
            const originalPrice = Math.round(sellingPrice * 1.2 * 100) / 100 // 20% korting

            const newProduct = new Product({
              name: product.name,
              description: product.description,
              price: sellingPrice,
              originalPrice: originalPrice,
              costPrice: costPrice,
              profitMargin: margin * 100,
              images: product.images,
              category: mapSpocketCategory(product.category),
              subcategory: product.subcategory.toLowerCase(),
              brand: product.brand,
              sku: `SP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
                name: 'Spocket Supplier',
                contact: product.supplierEmail,
                email: product.supplierEmail,
                spocketUrl: product.spocketUrl
              },
              averageRating: product.rating,
              totalReviews: product.reviewsCount,
              spocketUrl: product.spocketUrl,
              trendingScore: product.trendingScore,
              lastUpdated: new Date()
            })

            await newProduct.save()
            importedProducts.push(newProduct)
            console.log(`✅ Handmatig Spocket product toegevoegd: ${product.name} - Kosten: €${costPrice}, Verkoop: €${sellingPrice}, Winst: €${(sellingPrice - costPrice).toFixed(2)}`)
          }
        } catch (error) {
          console.error(`❌ Fout bij toevoegen Spocket product ${product.name}:`, error.message)
        }
      }

      console.log(`✅ Handmatige Spocket import voltooid: ${importedProducts.length} nieuwe producten`)

      res.status(200).json({
        success: true,
        message: 'Handmatige Spocket producten succesvol geïmporteerd',
        data: {
          importedProducts: importedProducts.length,
          totalProducts: await Product.countDocuments(),
          profitMargin: '60%',
          source: 'Spocket Manual',
          note: 'Dit zijn handmatig geïmporteerde Spocket producten. Je kunt deze vervangen door echte producten uit je Spocket dashboard.',
          products: importedProducts.map(p => ({
            name: p.name,
            costPrice: p.costPrice,
            sellingPrice: p.price,
            profit: p.price - p.costPrice,
            supplier: 'Spocket Manual'
          }))
        }
      })

    } catch (error) {
      console.error('❌ Handmatige Spocket import fout:', error)
      res.status(500).json({
        success: false,
        message: 'Handmatige Spocket import gefaald',
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

// Map Spocket categorieën naar onze categorieën
function mapSpocketCategory(spocketCategory) {
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
  
  return categoryMap[spocketCategory] || 'other'
}