import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// Q4 2024 WINNING PRODUCTS - Netherlands Market
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('🎯 Q4 WINNERS - Adding proven winning products...')

      const winningProducts = [
        {
          name: 'LED Strip Lights 5m - Alexa Compatible RGB',
          description: 'Transformeer je ruimte met deze slimme LED strip lights! Perfect voor je slaapkamer, woonkamer of gaming setup. Werkt met Alexa en Google Home. 16 miljoen kleuren, bediening via app, muzieksync en timer. Gemakkelijk te installeren met plakstrip. GRATIS VERZENDING!',
          costPrice: 3.50,
          price: 29.99,
          originalPrice: 49.99,
          category: 'home',
          subcategory: 'home-decor',
          brand: 'SmartHome',
          sku: 'LED-STRIP-5M-001',
          stock: 1000,
          tags: ['led', 'smart-home', 'rgb', 'alexa', 'home-decor', 'gaming', 'christmas', 'trending'],
          specifications: {
            'Length': '5 meter',
            'Compatibility': 'Alexa, Google Home',
            'Colors': '16 million RGB',
            'Control': 'App + Remote',
            'Music Sync': 'Yes',
            'Timer': 'Yes',
            'Installation': 'Sticky tape included'
          },
          shipping: {
            weight: 0.5,
            dimensions: { length: 28, width: 4, height: 3 },
            freeShipping: true
          },
          averageRating: 4.7,
          totalReviews: 3200,
          sales: 1800,
          isTrending: true,
          isFeatured: true,
          trendingScore: 98,
          supplier: {
            name: 'LED Pro EU',
            contact: '+31612345678',
            email: 'supplier@ledpro.eu'
          },
          profitMargin: 85,
          images: [
            { url: 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?w=800&h=800&fit=crop', alt: 'LED Strip Lights instaleren' },
            { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop', alt: 'LED Strip in slaapkamer' },
            { url: 'https://images.unsplash.com/photo-1545893832-65b31a9d9f11?w=800&h=800&fit=crop', alt: 'RGB LED gaming setup' }
          ]
        },
        {
          name: 'Phone Ring Holder - MagSafe Compatible',
          description: 'Zet je telefoon NEER! Deze revolutionaire phone ring holder houdt je telefoon perfect vast. Werkt met alle moderne smartphones, ook iPhone met MagSafe. Draai de ring weg wanneer je de telefoon gebruikt, draai weer terug voor stevig grip. Perfect voor bediening met één hand. GRATIS VERZENDING!',
          costPrice: 1.25,
          price: 19.99,
          originalPrice: 29.99,
          category: 'electronics',
          subcategory: 'phone-accessories',
          brand: 'GripPro',
          sku: 'PHONE-RING-HOLDER-001',
          stock: 2000,
          tags: ['phone', 'ring', 'grip', 'magsafe', 'must-have', 'trending', 'gadget', 'protection'],
          specifications: {
            'Compatibility': 'iPhone 12-15, Samsung, alle moderne telefoons',
            'MagSafe': 'Ja, ook zonder',
            'Rotation': '360 graden',
            'Material': 'Premium metal + rubber coating',
            'Color': 'Verschillende kleuren beschikbaar',
            'Protection': 'Shock absorbing design'
          },
          shipping: {
            weight: 0.05,
            dimensions: { length: 5, width: 5, height: 1 },
            freeShipping: true
          },
          averageRating: 4.9,
          totalReviews: 8900,
          sales: 4200,
          isTrending: true,
          isFeatured: true,
          trendingScore: 99,
          supplier: {
            name: 'GripPro EU',
            contact: '+31687654321',
            email: 'orders@grippro.eu'
          },
          profitMargin: 93,
          images: [
            { url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=800&fit=crop', alt: 'Phone ring holder detail' },
            { url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop', alt: 'Phone met ring holder' },
            { url: 'https://images.unsplash.com/photo-1565843708714-8e6ea3b0ba8e?w=800&h=800&fit=crop', alt: 'Telefoon grip in gebruik' }
          ]
        },
        {
          name: 'Cable Organizer Box - Cord Management System',
          description: 'Stop met verwarde kabels! Deze elegante cable organizer houdt al je kabels netjes bij elkaar. Perfect voor thuiswerken, gaming setup of TV meubel. Moderne design, handige opening voor easy access. Deze organizer is ONMISBAAR voor een opgeruimd huis. GRATIS VERZENDING!',
          costPrice: 2.00,
          price: 24.99,
          originalPrice: 39.99,
          category: 'home',
          subcategory: 'organization',
          brand: 'NeatHome',
          sku: 'CABLE-ORGANIZER-001',
          stock: 800,
          tags: ['cables', 'organization', 'home-office', 'gaming', 'must-have', 'trending', 'modern'],
          specifications: {
            'Size': 'Medium (30cm x 10cm)',
            'Material': 'Durable plastic + fabric',
            'Cable Holes': '2 aan elke kant',
            'Color': 'Modern wit/grijs',
            'Installation': 'Geen gereedschap nodig',
            'Capacity': '15-20 kabels'
          },
          shipping: {
            weight: 0.3,
            dimensions: { length: 30, width: 10, height: 8 },
            freeShipping: true
          },
          averageRating: 4.8,
          totalReviews: 2100,
          sales: 950,
          isTrending: true,
          isFeatured: true,
          trendingScore: 92,
          supplier: {
            name: 'NeatHome EU',
            contact: '+31655544433',
            email: 'supplier@neathome.eu'
          },
          profitMargin: 91,
          images: [
            { url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=800&fit=crop', alt: 'Cable organizer op bureau' },
            { url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=800&fit=crop', alt: 'Netjes georganiseerde kabels' },
            { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=800&fit=crop', alt: 'Home office setup' }
          ]
        }
      ]

      // Add winning products
      const products = await Product.insertMany(winningProducts)
      console.log(`✅ Added ${products.length} Q4 WINNING products`)

      res.status(200).json({
        success: true,
        message: `Successfully added ${products.length} Q4 winning products`,
        products: products.map(p => ({
          name: p.name,
          price: p.price,
          profitMargin: p.profitMargin,
          sales: p.sales,
          isTrending: p.isTrending
        }))
      })

    } catch (error) {
      console.error('Error adding winning products:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to add winning products',
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
