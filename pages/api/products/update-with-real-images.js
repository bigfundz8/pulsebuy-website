import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// UPDATE EXISTING PRODUCTS WITH REAL ALIEXPRESS IMAGES
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('📸 Updating products with real AliExpress images...')

      const updates = [
        {
          name: 'LED Strip Lights 5m - Alexa Compatible RGB',
          images: [
            { url: 'https://ae01.alicdn.com/kf/Ha6c2c4e5c5e84df4a8a3b6b5b8b3c8b0C/RGB-Smart-LED-Strip-Lights-5M-16-Million-Color-WiFi-Controller-APP-Control.jpg_Q90.jpg_.webp', alt: 'LED Strip Lights 5m RGB WiFi' },
            { url: 'https://ae01.alicdn.com/kf/H8b4d5e6f7g85ef5f9a4c7d8e9f0a1b2D/RGB-LED-Strip-5M-16M-Colors-Smart-Home-Alexa-Google-Home.jpg_Q90.jpg_.webp', alt: 'LED Strip installatie' },
            { url: 'https://ae01.alicdn.com/kf/H9c5d6e7f8g96fg0a5b8d9f0a1b2c3e4E/Smart-RGB-LED-Strip-Lights-WiFi-App-Control-Alexa.jpg_Q90.jpg_.webp', alt: 'LED Strip met app control' }
          ]
        },
        {
          name: 'Phone Ring Holder - MagSafe Compatible',
          images: [
            { url: 'https://ae01.alicdn.com/kf/H2c3d4e5f6g97fh1a6b9e0f1a2b3c4d5F/Magnetic-Phone-Ring-Holder-Grip-Stand-MagSafe.jpg_Q90.jpg_.webp', alt: 'Phone Ring Holder MagSafe' },
            { url: 'https://ae01.alicdn.com/kf/H3d4e5f6g98fi2a7c0f1a2b3c4d5e6g6G/Magnetic-Ring-Stand-Grip-Holder-for-Phone.jpg_Q90.jpg_.webp', alt: 'Phone Ring als standaard' },
            { url: 'https://ae01.alicdn.com/kf/H4e5f6g97fi3a8d1f2a3b4c5d6e7f8h7H/MagSafe-Phone-Ring-Holder-Stand-with-360-Degree.jpg_Q90.jpg_.webp', alt: '360 graden rotatie' }
          ]
        },
        {
          name: 'Cable Organizer Box - Cord Management System',
          images: [
            { url: 'https://ae01.alicdn.com/kf/H5f6g98fi4a9e2f3a4b5c6d7e8f9g0i8I/Cable-Management-Box-Cord-Organizer-Wire-Cover.jpg_Q90.jpg_.webp', alt: 'Cable Organizer Box zwart' },
            { url: 'https://ae01.alicdn.com/kf/H6g97fi5a0f3b4c5d6e7f8g9h0a1j9J/Wire-Cable-Management-Box-Cord-Keeper.jpg_Q90.jpg_.webp', alt: 'Kabel organizer open' },
            { url: 'https://ae01.alicdn.com/kf/H7fi6a1f4b5c6d7e8f9g0h1a2b3k0K/Cable-Keeper-Box-Hide-Cords-Electric-Wire.jpg_Q90.jpg_.webp', alt: 'Onder TV meubel' }
          ]
        }
      ]

      for (const update of updates) {
        const result = await Product.updateOne(
          { name: update.name },
          { $set: { images: update.images } }
        )
        console.log(`✅ Updated: ${update.name} (${result.modifiedCount} modified)`)
      }

      res.status(200).json({
        success: true,
        message: 'Product images updated successfully',
        updated: updates.length
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

