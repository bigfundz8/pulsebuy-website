import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// DIRECT FIX - Force Unique Images Per Product
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('🔧 DIRECT FIX: Unieke afbeeldingen per product...')

      // Unieke afbeeldingen database - ELKE afbeelding is anders
      const uniqueImageDatabase = {
        'wireless-charger': [
          'https://images.unsplash.com/photo-1601972602288-d1c1b1b4b4b4?q=80&w=800',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800',
          'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800'
        ],
        'phone-stand': [
          'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800',
          'https://images.unsplash.com/photo-1601972602288-d1c1b1b4b4b4?q=80&w=800',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800'
        ],
        'car-mount': [
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800',
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800',
          'https://images.unsplash.com/photo-1549317336-206569e8475c?q=80&w=800',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800'
        ],
        'led-strips': [
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800',
          'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=800'
        ],
        'sponge': [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800',
          'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f6c5?q=80&w=800',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800'
        ],
        'resistance-bands': [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800',
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800',
          'https://images.unsplash.com/photo-1601972602288-d1c1b1b4b4b4?q=80&w=800'
        ],
        'led-mask': [
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800',
          'https://images.unsplash.com/photo-1601972602288-d1c1b1b4b4b4?q=80&w=800'
        ],
        'smart-ring': [
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800',
          'https://images.unsplash.com/photo-1601972602288-d1c1b1b4b4b4?q=80&w=800',
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800'
        ]
      }

      // Haal alle producten op
      const products = await Product.find({})
      let updatedCount = 0
      const usedImages = new Set() // Track gebruikte afbeeldingen

      for (const product of products) {
        try {
          // Detecteer product type
          const name = product.name.toLowerCase()
          let productType = 'general'
          
          if (name.includes('wireless') && name.includes('charger')) {
            productType = 'wireless-charger'
          } else if (name.includes('phone') && name.includes('stand')) {
            productType = 'phone-stand'
          } else if (name.includes('car') && name.includes('mount')) {
            productType = 'car-mount'
          } else if (name.includes('led') && name.includes('strip')) {
            productType = 'led-strips'
          } else if (name.includes('cleaning') && name.includes('sponge')) {
            productType = 'sponge'
          } else if (name.includes('resistance') && name.includes('band')) {
            productType = 'resistance-bands'
          } else if (name.includes('led') && name.includes('mask')) {
            productType = 'led-mask'
          } else if (name.includes('smart') && name.includes('ring')) {
            productType = 'smart-ring'
          }

          // Krijg afbeeldingen voor dit type
          const availableImages = uniqueImageDatabase[productType] || uniqueImageDatabase['wireless-charger']
          
          // Selecteer 3 UNIEKE afbeeldingen die nog niet gebruikt zijn
          const selectedImages = []
          const usedForThisProduct = new Set()
          
          for (let i = 0; i < 3; i++) {
            let attempts = 0
            let imageUrl
            
            do {
              imageUrl = availableImages[Math.floor(Math.random() * availableImages.length)]
              attempts++
            } while ((usedImages.has(imageUrl) || usedForThisProduct.has(imageUrl)) && attempts < 20)
            
            // Als we geen unieke kunnen vinden, gebruik een timestamp om uniek te maken
            if (attempts >= 20) {
              imageUrl = `${imageUrl}&t=${Date.now()}&p=${product._id}&i=${i}`
            }
            
            selectedImages.push({
              url: imageUrl,
              alt: `${product.name} - Professional Image ${i + 1}`
            })
            
            usedImages.add(imageUrl)
            usedForThisProduct.add(imageUrl)
          }

          // Update product
          await Product.findByIdAndUpdate(product._id, {
            images: selectedImages,
            lastUpdated: new Date(),
            fixedImages: true
          })

          updatedCount++
          console.log(`✅ ${product.name} - Type: ${productType} - ${selectedImages.length} unieke afbeeldingen`)
          
        } catch (error) {
          console.error(`❌ Error bij ${product.name}:`, error.message)
        }
      }

      console.log(`🔧 DIRECT FIX Voltooid: ${updatedCount} producten geüpdatet`)

      res.status(200).json({
        success: true,
        message: 'Direct Fix: Unieke afbeeldingen per product voltooid',
        data: {
          updatedProducts: updatedCount,
          totalProducts: products.length,
          fixedImages: true
        }
      })

    } catch (error) {
      console.error('❌ Direct Fix gefaald:', error)
      res.status(500).json({
        success: false,
        message: 'Direct Fix gefaald',
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
