import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// Viral Product Import - Direct Ready
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('🔥 Viral producten importeren...')

      const viralProducts = [
        {
          name: `Wireless Phone Charger Stand ${Date.now()}`,
          description: 'Slimme draadloze oplader met stand - perfect voor thuis en kantoor. 15W snelladen, LED indicator.',
          costPrice: 8.50,
          price: 24.99,
          originalPrice: 39.99,
          images: [
            { url: 'https://images.unsplash.com/photo-1601972602288-d1c1b1b4b4b4?q=80&w=600', alt: 'Wireless Phone Charger Stand' },
            { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600', alt: 'Wireless Charger in Use' },
            { url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=600', alt: 'Wireless Charger Close-up' }
          ],
          category: 'electronics',
          subcategory: 'phone-accessories',
          brand: 'TechPro',
          stock: 500,
          tags: ['wireless', 'charger', 'phone', 'stand', 'fast-charging'],
          specifications: {
            'Power': '15W',
            'Compatibility': 'iPhone, Samsung, Google',
            'LED Indicator': 'Yes',
            'Material': 'Premium Plastic'
          },
          weight: 0.3,
          dimensions: { length: 12, width: 8, height: 3 },
          freeShipping: true,
          averageRating: 4.8,
          totalReviews: 2500,
          isTrending: true,
          isFeatured: true,
          trendingScore: 95,
          supplier: {
            name: 'TechPro EU',
            contact: 'contact@techpro.eu',
            email: 'supplier@techpro.eu'
          },
          profitMargin: 65
        },
        {
          name: `Magic Cleaning Sponge Set ${Date.now()}`,
          description: 'Revolutionaire schoonmaaksponsen - verwijdert alles zonder chemicaliën. Perfect voor keuken, badkamer, auto.',
          costPrice: 3.20,
          price: 12.99,
          originalPrice: 19.99,
          images: [
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600', alt: 'Magic Cleaning Sponges' },
            { url: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f6c5?q=80&w=600', alt: 'Cleaning Sponges in Action' },
            { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600', alt: 'Magic Sponge Set' }
          ],
          category: 'home',
          subcategory: 'cleaning',
          brand: 'CleanMax',
          stock: 1000,
          tags: ['cleaning', 'sponge', 'magic', 'chemical-free', 'versatile'],
          specifications: {
            'Pack Size': '10 pieces',
            'Material': 'Melamine Foam',
            'Chemical Free': 'Yes',
            'Multi Surface': 'Yes'
          },
          weight: 0.2,
          dimensions: { length: 10, width: 6, height: 2 },
          freeShipping: true,
          averageRating: 4.6,
          totalReviews: 1800,
          isTrending: true,
          isFeatured: true,
          trendingScore: 88,
          supplier: {
            name: 'CleanMax EU',
            contact: 'contact@cleanmax.eu',
            email: 'supplier@cleanmax.eu'
          },
          profitMargin: 75
        },
        {
          name: `Car Phone Mount Magnetic ${Date.now()}`,
          description: 'Supersterke magnetische telefoonhouder voor auto - 360° draaibaar, universeel compatibel.',
          costPrice: 6.80,
          price: 19.99,
          originalPrice: 29.99,
          images: [
            { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=600', alt: 'Car Phone Mount' },
            { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=600', alt: 'Phone Mount in Car' },
            { url: 'https://images.unsplash.com/photo-1549317336-206569e8475c?q=80&w=600', alt: 'Magnetic Mount Close-up' }
          ],
          category: 'electronics',
          subcategory: 'car-accessories',
          brand: 'AutoTech',
          stock: 300,
          tags: ['car', 'mount', 'magnetic', 'phone', 'universal'],
          specifications: {
            'Magnetic Force': 'Super Strong',
            'Rotation': '360°',
            'Compatibility': 'Universal',
            'Installation': 'Easy'
          },
          weight: 0.15,
          dimensions: { length: 8, width: 6, height: 4 },
          freeShipping: true,
          averageRating: 4.7,
          totalReviews: 1200,
          isTrending: true,
          isFeatured: true,
          trendingScore: 92,
          supplier: {
            name: 'AutoTech EU',
            contact: 'contact@autotech.eu',
            email: 'supplier@autotech.eu'
          },
          profitMargin: 70
        },
        {
          name: `LED Strip Lights RGB WiFi ${Date.now()}`,
          description: 'Slimme LED strips met WiFi bediening - 16 miljoen kleuren, muziek sync, app controle.',
          costPrice: 12.50,
          price: 29.99,
          originalPrice: 49.99,
          images: [
            { url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=600', alt: 'LED Strip Lights' },
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600', alt: 'RGB LED Setup' },
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600', alt: 'Smart LED Control' }
          ],
          category: 'home',
          subcategory: 'lighting',
          brand: 'LumiSmart',
          stock: 200,
          tags: ['led', 'strip', 'wifi', 'rgb', 'smart', 'music-sync'],
          specifications: {
            'Length': '5 meters',
            'Colors': '16 Million',
            'Control': 'WiFi App',
            'Music Sync': 'Yes'
          },
          weight: 0.4,
          dimensions: { length: 20, width: 15, height: 5 },
          freeShipping: true,
          averageRating: 4.5,
          totalReviews: 950,
          isTrending: true,
          isFeatured: true,
          trendingScore: 85,
          supplier: {
            name: 'LumiSmart EU',
            contact: 'contact@lumismart.eu',
            email: 'supplier@lumismart.eu'
          },
          profitMargin: 60
        },
        {
          name: `Portable Phone Stand Adjustable ${Date.now()}`,
          description: 'Universele telefoonstandaard - verstelbaar, draagbaar, perfect voor video calls en streaming.',
          costPrice: 4.20,
          price: 14.99,
          originalPrice: 24.99,
          images: [
            { url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=600', alt: 'Portable Phone Stand' },
            { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600', alt: 'Adjustable Stand in Use' },
            { url: 'https://images.unsplash.com/photo-1601972602288-d1c1b1b4b4b4?q=80&w=600', alt: 'Phone Stand Close-up' }
          ],
          category: 'electronics',
          subcategory: 'phone-accessories',
          brand: 'FlexStand',
          stock: 600,
          tags: ['phone', 'stand', 'portable', 'adjustable', 'universal'],
          specifications: {
            'Adjustable': 'Yes',
            'Portable': 'Yes',
            'Compatibility': 'Universal',
            'Material': 'Premium Plastic'
          },
          weight: 0.1,
          dimensions: { length: 12, width: 8, height: 2 },
          freeShipping: true,
          averageRating: 4.4,
          totalReviews: 800,
          isTrending: true,
          isFeatured: true,
          trendingScore: 78,
          supplier: {
            name: 'FlexStand EU',
            contact: 'contact@flexstand.eu',
            email: 'supplier@flexstand.eu'
          },
          profitMargin: 72
        }
      ]

      let importedCount = 0
      const importedProducts = []

      for (const productData of viralProducts) {
        const newProduct = new Product({
          ...productData,
          sku: `VIRAL-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          lastUpdated: new Date()
        })

        await newProduct.save()
        importedCount++
        importedProducts.push({
          name: newProduct.name,
          price: newProduct.price,
          profit: newProduct.price - newProduct.costPrice,
          margin: newProduct.profitMargin
        })
      }

      console.log(`🔥 ${importedCount} viral producten geïmporteerd!`)

      res.status(200).json({
        success: true,
        message: 'Viral producten succesvol geïmporteerd',
        data: {
          importedProducts: importedCount,
          products: importedProducts,
          totalProfit: importedProducts.reduce((sum, p) => sum + p.profit, 0),
          averageMargin: importedProducts.reduce((sum, p) => sum + p.margin, 0) / importedProducts.length
        }
      })

    } catch (error) {
      console.error('❌ Viral product import gefaald:', error)
      res.status(500).json({
        success: false,
        message: 'Viral product import gefaald',
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
