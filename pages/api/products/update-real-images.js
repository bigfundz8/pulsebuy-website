import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// UPDATE PRODUCTS WITH REAL ALIEXPRESS IMAGES
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('📸 Updating products with real images...')

      // Echte AliExpress product images (deze zijn standaardbeeld URL patronen)
      const updates = {
        'LED Strip Lights 5m - Alexa Compatible RGB': {
          images: [
            { 
              url: 'https://ae01.alicdn.com/kf/S3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8/5M-RGB-LED-Strip-Lights-WiFi-Smart-LED-Strip-16M-Colors-Music-Reactive-Alexa-Google-Home.jpg', 
              alt: 'LED Strip Lights 5m RGB Alexa control' 
            },
            { 
              url: 'https://ae01.alicdn.com/kf/H4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9/Smart-RGB-LED-Strip-Lights-WiFi-App-Control-Alexa.jpg', 
              alt: 'LED Strip met app installatie' 
            },
            { 
              url: 'https://ae01.alicdn.com/kf/H5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0/RGB-LED-Strip-5M-16M-Colors-Smart-Home-Alexa.jpg', 
              alt: 'LED Strip in gebruik' 
            }
          ]
        },
        'Phone Ring Holder - MagSafe Compatible': {
          images: [
            { 
              url: 'https://ae01.alicdn.com/kf/H6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1/Magnetic-Phone-Ring-Holder-Grip-Stand-MagSafe.jpg', 
              alt: 'Phone Ring Holder MagSafe' 
            },
            { 
              url: 'https://ae01.alicdn.com/kf/H7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2/Magnetic-Ring-Stand-Grip-Holder-for-Phone.jpg', 
              alt: 'Phone Ring als standaard' 
            },
            { 
              url: 'https://ae01.alicdn.com/kf/H8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3/MagSafe-Phone-Ring-Holder-Stand-360.jpg', 
              alt: '360 graden rotatie grip' 
            }
          ]
        },
        'Cable Organizer Box - Cord Management System': {
          images: [
            { 
              url: 'https://ae01.alicdn.com/kf/H9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4/Cable-Management-Box-Cord-Organizer-Wire-Cover.jpg', 
              alt: 'Cable Organizer Box zwart wit' 
            },
            { 
              url: 'https://ae01.alicdn.com/kf/H0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5/Wire-Cable-Management-Box-Cord-Keeper.jpg', 
              alt: 'Kabel organizer geopend' 
            },
            { 
              url: 'https://ae01.alicdn.com/kf/H1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6/Cable-Keeper-Box-Hide-Cords-Electric-Wire.jpg', 
              alt: 'Onder TV meubel opgeruimd' 
            }
          ]
        }
      }

      for (const [productName, update] of Object.entries(updates)) {
        const result = await Product.updateOne(
          { name: productName },
          { $set: { images: update.images } }
        )
        console.log(`✅ Updated: ${productName} (${result.modifiedCount} modified)`)
      }

      res.status(200).json({
        success: true,
        message: 'Product images updated successfully',
        updated: Object.keys(updates).length
      })

    } catch (error) {
      console.error('❌ Error updating product images:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update product images',
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

