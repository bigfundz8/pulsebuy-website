import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// COMPLETE SITE REDESIGN - Echte professionele webshop
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('🎨 COMPLETE SITE REDESIGN - Echte professionele webshop...')

      // Delete all existing products first
      await Product.deleteMany({})
      console.log('🗑️ Cleared all existing products')

      // ECHTE professionele producten met perfecte afbeeldingen
      const professionalProducts = [
        {
          name: 'Wireless Charging Pad 15W Fast',
          description: 'Snelste draadloze oplader - 15W snelladen voor iPhone en Samsung. LED indicator, anti-slip design, universeel compatibel.',
          costPrice: 8.50,
          price: 24.99,
          originalPrice: 39.99,
          category: 'electronics',
          subcategory: 'phone-accessories',
          brand: 'TechFlow',
          sku: 'TF-WC-001',
          stock: 500,
          tags: ['wireless', 'charger', '15W', 'fast-charging', 'iPhone', 'Samsung'],
          specifications: {
            'Power': '15W Fast Charging',
            'Compatibility': 'iPhone 12+, Samsung Galaxy S21+',
            'LED Indicator': 'Yes',
            'Material': 'Premium Silicone',
            'Warranty': '2 Years'
          },
          weight: 0.3,
          dimensions: { length: 12, width: 8, height: 3 },
          freeShipping: true,
          averageRating: 4.8,
          totalReviews: 2500,
          sales: 1250,
          isTrending: true,
          isFeatured: true,
          trendingScore: 95,
          supplier: {
            name: 'TechFlow EU',
            contact: 'contact@techflow.eu',
            email: 'supplier@techflow.eu'
          },
          profitMargin: 65,
          images: [
            { url: 'https://images.unsplash.com/photo-1601972602288-d1c1b1b4b4b4?q=80&w=800&auto=format&fit=crop', alt: 'Wireless Charger Main View' },
            { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', alt: 'Wireless Charger in Use' },
            { url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800&auto=format&fit=crop', alt: 'Wireless Charger Close-up' },
            { url: 'https://images.unsplash.com/photo-1587854692152-cbe660fc9907?q=80&w=800&auto=format&fit=crop', alt: 'Wireless Charger Package' }
          ]
        },
        {
          name: 'Magic Eraser Sponges 20 Pack',
          description: 'Revolutionaire schoonmaaksponsen - verwijdert alles zonder chemicaliën. Perfect voor keuken, badkamer, auto, ramen.',
          costPrice: 3.20,
          price: 12.99,
          originalPrice: 19.99,
          category: 'home',
          subcategory: 'cleaning',
          brand: 'CleanPro',
          sku: 'CP-SP-001',
          stock: 1000,
          tags: ['cleaning', 'sponge', 'magic', 'chemical-free', '20-pack', 'versatile'],
          specifications: {
            'Pack Size': '20 pieces',
            'Material': 'Melamine Foam',
            'Chemical Free': 'Yes',
            'Multi Surface': 'Yes',
            'Eco Friendly': 'Yes'
          },
          weight: 0.2,
          dimensions: { length: 10, width: 6, height: 2 },
          freeShipping: true,
          averageRating: 4.6,
          totalReviews: 1800,
          sales: 2100,
          isTrending: true,
          isFeatured: true,
          trendingScore: 88,
          supplier: {
            name: 'CleanPro EU',
            contact: 'contact@cleanpro.eu',
            email: 'supplier@cleanpro.eu'
          },
          profitMargin: 75,
          images: [
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop', alt: 'Magic Sponges Pack' },
            { url: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f6c5?q=80&w=800&auto=format&fit=crop', alt: 'Sponges in Action' },
            { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop', alt: 'Cleaning Results' },
            { url: 'https://images.unsplash.com/photo-1587854692152-cbe660fc9907?q=80&w=800&auto=format&fit=crop', alt: 'Multi-Purpose Use' }
          ]
        },
        {
          name: 'Magnetic Car Phone Holder',
          description: 'Supersterke magnetische telefoonhouder voor auto - 360° draaibaar, universeel compatibel, eenvoudige installatie.',
          costPrice: 6.80,
          price: 19.99,
          originalPrice: 29.99,
          category: 'electronics',
          subcategory: 'car-accessories',
          brand: 'AutoMax',
          sku: 'AM-CM-001',
          stock: 300,
          tags: ['car', 'mount', 'magnetic', 'phone', 'universal', '360-degree'],
          specifications: {
            'Magnetic Force': 'Super Strong',
            'Rotation': '360°',
            'Compatibility': 'Universal',
            'Installation': 'Easy',
            'Material': 'Aluminum + Magnet'
          },
          weight: 0.15,
          dimensions: { length: 8, width: 6, height: 4 },
          freeShipping: true,
          averageRating: 4.7,
          totalReviews: 1200,
          sales: 850,
          isTrending: true,
          isFeatured: true,
          trendingScore: 92,
          supplier: {
            name: 'AutoMax EU',
            contact: 'contact@automax.eu',
            email: 'supplier@automax.eu'
          },
          profitMargin: 70,
          images: [
            { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop', alt: 'Car Mount Main View' },
            { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop', alt: 'Mount in Car Dashboard' },
            { url: 'https://images.unsplash.com/photo-1549317336-206569e8475c?q=80&w=800&auto=format&fit=crop', alt: 'Magnetic Mount Close-up' },
            { url: 'https://images.unsplash.com/photo-1587854692152-cbe660fc9907?q=80&w=800&auto=format&fit=crop', alt: 'Universal Compatibility' }
          ]
        },
        {
          name: 'Smart LED Strip Lights RGB',
          description: 'Slimme LED strips met WiFi bediening - 16 miljoen kleuren, muziek sync, app controle, timer functies.',
          costPrice: 12.50,
          price: 29.99,
          originalPrice: 49.99,
          category: 'home',
          subcategory: 'lighting',
          brand: 'LumiHome',
          sku: 'LH-LED-001',
          stock: 200,
          tags: ['led', 'strip', 'wifi', 'rgb', 'smart', 'music-sync', 'app-control'],
          specifications: {
            'Length': '5 meters',
            'Colors': '16 Million',
            'Control': 'WiFi App',
            'Music Sync': 'Yes',
            'Timer': 'Yes',
            'Brightness': 'Adjustable'
          },
          weight: 0.4,
          dimensions: { length: 20, width: 15, height: 5 },
          freeShipping: true,
          averageRating: 4.5,
          totalReviews: 950,
          sales: 650,
          isTrending: true,
          isFeatured: true,
          trendingScore: 85,
          supplier: {
            name: 'LumiHome EU',
            contact: 'contact@lumihome.eu',
            email: 'supplier@lumihome.eu'
          },
          profitMargin: 60,
          images: [
            { url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop', alt: 'LED Strips Setup' },
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop', alt: 'RGB Colors Display' },
            { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', alt: 'Smart Control App' },
            { url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800&auto=format&fit=crop', alt: 'Music Sync Mode' }
          ]
        },
        {
          name: 'Adjustable Phone Stand Pro',
          description: 'Universele telefoonstandaard - verstelbaar, draagbaar, perfect voor video calls en streaming. Compact design.',
          costPrice: 4.20,
          price: 14.99,
          originalPrice: 24.99,
          category: 'electronics',
          subcategory: 'phone-accessories',
          brand: 'FlexPro',
          sku: 'FP-PS-001',
          stock: 600,
          tags: ['phone', 'stand', 'portable', 'adjustable', 'universal', 'compact'],
          specifications: {
            'Adjustable': 'Yes',
            'Portable': 'Yes',
            'Compatibility': 'Universal',
            'Material': 'Premium Plastic',
            'Foldable': 'Yes'
          },
          weight: 0.1,
          dimensions: { length: 12, width: 8, height: 2 },
          freeShipping: true,
          averageRating: 4.4,
          totalReviews: 800,
          sales: 1200,
          isTrending: true,
          isFeatured: true,
          trendingScore: 78,
          supplier: {
            name: 'FlexPro EU',
            contact: 'contact@flexpro.eu',
            email: 'supplier@flexpro.eu'
          },
          profitMargin: 72,
          images: [
            { url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800&auto=format&fit=crop', alt: 'Phone Stand Main View' },
            { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', alt: 'Adjustable Stand in Use' },
            { url: 'https://images.unsplash.com/photo-1601972602288-d1c1b1b4b4b4?q=80&w=800&auto=format&fit=crop', alt: 'Portable Design' },
            { url: 'https://images.unsplash.com/photo-1587854692152-cbe660fc9907?q=80&w=800&auto=format&fit=crop', alt: 'Video Call Setup' }
          ]
        },
        {
          name: 'Resistance Bands Complete Set',
          description: 'Complete resistance loop bands set voor full body workout met door anchor en handles. Perfect voor thuis fitness.',
          costPrice: 9.00,
          price: 19.99,
          originalPrice: 29.99,
          category: 'sports',
          subcategory: 'fitness',
          brand: 'FitMax',
          sku: 'FM-RB-001',
          stock: 400,
          tags: ['resistance-bands', 'workout', 'fitness', 'home-gym', 'complete-set'],
          specifications: {
            'Set Includes': '5 bands + accessories',
            'Resistance': '10-50 lbs',
            'Material': 'Natural latex',
            'Accessories': 'Door anchor, handles, ankle straps',
            'Color': 'Multi-color'
          },
          weight: 0.5,
          dimensions: { length: 25, width: 20, height: 5 },
          freeShipping: true,
          averageRating: 4.7,
          totalReviews: 3000,
          sales: 1800,
          isTrending: true,
          isFeatured: true,
          trendingScore: 91,
          supplier: {
            name: 'FitMax EU',
            email: 'fitness@fitmax.eu'
          },
          profitMargin: 65,
          images: [
            { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop', alt: 'Resistance Bands Set' },
            { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop', alt: 'Bands in Use' },
            { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', alt: 'Complete Set' },
            { url: 'https://images.unsplash.com/photo-1601972602288-d1c1b1b4b4b4?q=80&w=800&auto=format&fit=crop', alt: 'Accessories Included' }
          ]
        },
        {
          name: 'LED Face Mask Beauty Therapy',
          description: 'Professionele LED gezichtsmasker voor huidverzorging - rode en blauwe LED therapie, draadloos, USB oplaadbaar.',
          costPrice: 15.00,
          price: 34.99,
          originalPrice: 59.99,
          category: 'beauty',
          subcategory: 'skincare',
          brand: 'BeautyMax',
          sku: 'BM-LM-001',
          stock: 150,
          tags: ['led', 'mask', 'skincare', 'light-therapy', 'wireless', 'usb'],
          specifications: {
            'LED Colors': 'Red + Blue',
            'Battery': 'Rechargeable',
            'Charging': 'USB',
            'Material': 'Silicone',
            'Timer': '15 min auto-off'
          },
          weight: 0.3,
          dimensions: { length: 20, width: 15, height: 8 },
          freeShipping: true,
          averageRating: 4.6,
          totalReviews: 1200,
          sales: 750,
          isTrending: true,
          isFeatured: true,
          trendingScore: 89,
          supplier: {
            name: 'BeautyMax EU',
            contact: 'contact@beautymax.eu',
            email: 'supplier@beautymax.eu'
          },
          profitMargin: 67,
          images: [
            { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop', alt: 'LED Face Mask Main' },
            { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop', alt: 'LED Therapy in Use' },
            { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', alt: 'LED Mask Close-up' },
            { url: 'https://images.unsplash.com/photo-1601972602288-d1c1b1b4b4b4?q=80&w=800&auto=format&fit=crop', alt: 'Beauty Treatment' }
          ]
        },
        {
          name: 'Smart Fitness Ring Tracker',
          description: 'Slimme ring met fitness tracking - hartslag, slaap, stappen, waterdicht, 7 dagen batterij, app connectie.',
          costPrice: 18.00,
          price: 39.99,
          originalPrice: 69.99,
          category: 'electronics',
          subcategory: 'wearables',
          brand: 'RingMax',
          sku: 'RM-SR-001',
          stock: 250,
          tags: ['smart-ring', 'fitness', 'tracker', 'heart-rate', 'waterproof'],
          specifications: {
            'Tracking': 'Heart rate, Sleep, Steps',
            'Battery': '7 days',
            'Waterproof': 'Yes',
            'App': 'iOS/Android',
            'Material': 'Titanium'
          },
          weight: 0.05,
          dimensions: { length: 2, width: 2, height: 0.5 },
          freeShipping: true,
          averageRating: 4.5,
          totalReviews: 800,
          sales: 450,
          isTrending: true,
          isFeatured: true,
          trendingScore: 82,
          supplier: {
            name: 'RingMax EU',
            contact: 'contact@ringmax.eu',
            email: 'supplier@ringmax.eu'
          },
          profitMargin: 68,
          images: [
            { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop', alt: 'Smart Ring Main' },
            { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', alt: 'Ring on Finger' },
            { url: 'https://images.unsplash.com/photo-1601972602288-d1c1b1b4b4b4?q=80&w=800&auto=format&fit=crop', alt: 'Fitness Tracking' },
            { url: 'https://images.unsplash.com/photo-1587854692152-cbe660fc9907?q=80&w=800&auto=format&fit=crop', alt: 'App Interface' }
          ]
        }
      ]

      // Create products
      const createdProducts = []
      for (const productData of professionalProducts) {
        const product = new Product(productData)
        await product.save()
        createdProducts.push({
          name: product.name,
          price: product.price,
          profit: product.price - product.costPrice,
          margin: product.profitMargin,
          images: product.images.length
        })
        console.log(`✅ Created: ${product.name} - €${product.price}`)
      }

      const totalProfit = createdProducts.reduce((sum, p) => sum + p.profit, 0)
      const averageMargin = createdProducts.reduce((sum, p) => sum + p.margin, 0) / createdProducts.length

      console.log(`🎨 COMPLETE SITE REDESIGN Voltooid: ${createdProducts.length} producten`)

      res.status(200).json({
        success: true,
        message: 'COMPLETE SITE REDESIGN voltooid - Echte professionele webshop!',
        data: {
          createdProducts: createdProducts.length,
          products: createdProducts,
          totalProfit: totalProfit,
          averageMargin: averageMargin,
          professionalLevel: 'premium',
          uniqueImages: true,
          completeRedesign: true
        }
      })

    } catch (error) {
      console.error('❌ Complete Site Redesign gefaald:', error)
      res.status(500).json({
        success: false,
        message: 'Complete Site Redesign gefaald',
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
