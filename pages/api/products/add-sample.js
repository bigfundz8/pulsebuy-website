import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await connectDB()

    // Sample products
    const sampleProducts = [
      {
        name: "iPhone 15 Pro Max",
        description: "De nieuwste iPhone met titanium behuizing en A17 Pro chip. Perfect voor professioneel gebruik en gaming.",
        price: 1299.99,
        originalPrice: 1399.99,
        images: [
          { url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop", alt: "iPhone 15 Pro Max" }
        ],
        category: "electronics",
        subcategory: "Smartphones",
        averageRating: 4.8,
        totalReviews: 1247,
        isTrending: true,
        isFeatured: true,
        stock: 25,
        tags: ["smartphone", "apple", "premium", "camera"],
        specifications: {
          "Display": "6.7 inch Super Retina XDR",
          "Processor": "A17 Pro chip",
          "Storage": "256GB",
          "Camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto"
        }
      },
      {
        name: "MacBook Air M3",
        description: "Ultra-dunne laptop met M3 chip voor maximale prestaties en batterijduur. Perfect voor werk en creativiteit.",
        price: 1199.99,
        originalPrice: 1299.99,
        images: [
          { url: "https://images.unsplash.com/photo-1517336714730-49689c8a967b?w=400&h=400&fit=crop", alt: "MacBook Air M3" }
        ],
        category: "electronics",
        subcategory: "Laptops",
        averageRating: 4.9,
        totalReviews: 892,
        isTrending: true,
        isFeatured: true,
        stock: 15,
        tags: ["laptop", "apple", "m3", "portable"],
        specifications: {
          "Display": "13.6 inch Liquid Retina",
          "Processor": "Apple M3 chip",
          "Memory": "8GB unified memory",
          "Storage": "256GB SSD"
        }
      },
      {
        name: "Sony WH-1000XM5 Headphones",
        description: "Premium noise-cancelling headphones met uitstekende geluidskwaliteit en 30 uur batterijduur.",
        price: 399.99,
        originalPrice: 449.99,
        images: [
          { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", alt: "Sony WH-1000XM5" }
        ],
        category: "electronics",
        subcategory: "Audio",
        averageRating: 4.7,
        totalReviews: 2156,
        isTrending: true,
        stock: 50,
        tags: ["headphones", "sony", "noise-cancelling", "wireless"],
        specifications: {
          "Driver": "30mm dynamic drivers",
          "Battery": "30 hours",
          "Connectivity": "Bluetooth 5.2",
          "Noise Cancelling": "Industry-leading"
        }
      },
      {
        name: "Nike Air Max 270",
        description: "Iconische sneakers met maximale comfort en stijl. Perfect voor dagelijks gebruik en sport.",
        price: 149.99,
        originalPrice: 179.99,
        images: [
          { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", alt: "Nike Air Max 270" }
        ],
        category: "fashion",
        subcategory: "Shoes",
        averageRating: 4.5,
        totalReviews: 3421,
        isTrending: true,
        stock: 100,
        tags: ["sneakers", "nike", "comfort", "sport"],
        specifications: {
          "Upper": "Mesh and synthetic",
          "Sole": "Air Max unit",
          "Weight": "Lightweight",
          "Colors": "Multiple options"
        }
      },
      {
        name: "Dyson V15 Detect Vacuum",
        description: "Revolutionaire stofzuiger met laser detectie en intelligente reiniging. Ziet vuil dat je niet kunt zien.",
        price: 699.99,
        originalPrice: 799.99,
        images: [
          { url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop", alt: "Dyson V15 Detect" }
        ],
        category: "home",
        subcategory: "Cleaning",
        averageRating: 4.6,
        totalReviews: 1876,
        isTrending: true,
        stock: 30,
        tags: ["vacuum", "dyson", "cordless", "smart"],
        specifications: {
          "Runtime": "60 minutes",
          "Suction": "230 AW",
          "Filtration": "HEPA",
          "Weight": "3.0 kg"
        }
      },
      {
        name: "Apple Watch Series 9",
        description: "De meest geavanceerde Apple Watch met S9 chip, altijd-aan display en geavanceerde gezondheidsfuncties.",
        price: 429.99,
        originalPrice: 499.99,
        images: [
          { url: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop", alt: "Apple Watch Series 9" }
        ],
        category: "electronics",
        subcategory: "Wearables",
        averageRating: 4.8,
        totalReviews: 1567,
        isTrending: true,
        isFeatured: true,
        stock: 40,
        tags: ["smartwatch", "apple", "health", "fitness"],
        specifications: {
          "Display": "Always-On Retina",
          "Processor": "S9 chip",
          "Battery": "18 hours",
          "Water Resistance": "50 meters"
        }
      },
      {
        name: "Samsung 55\" QLED 4K TV",
        description: "Crystal UHD 4K Smart TV met Quantum Dot technologie voor levendige kleuren en scherpe details.",
        price: 899.99,
        originalPrice: 1099.99,
        images: [
          { url: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop", alt: "Samsung QLED TV" }
        ],
        category: "electronics",
        subcategory: "TV & Audio",
        averageRating: 4.4,
        totalReviews: 987,
        isTrending: true,
        stock: 20,
        tags: ["tv", "samsung", "4k", "smart"],
        specifications: {
          "Screen Size": "55 inch",
          "Resolution": "4K UHD",
          "Smart Platform": "Tizen OS",
          "HDR": "HDR10+"
        }
      },
      {
        name: "Tesla Model 3 Accessories Kit",
        description: "Complete accessoires set voor Tesla Model 3 inclusief matten, console organizer en screen protector.",
        price: 199.99,
        originalPrice: 249.99,
        images: [
          { url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=400&fit=crop", alt: "Tesla Accessories" }
        ],
        category: "other",
        subcategory: "Accessories",
        averageRating: 4.3,
        totalReviews: 456,
        isTrending: false,
        stock: 75,
        tags: ["tesla", "accessories", "car", "premium"],
        specifications: {
          "Compatibility": "Tesla Model 3",
          "Materials": "Premium materials",
          "Installation": "Easy install",
          "Warranty": "1 year"
        }
      }
    ]

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Add sample products
    const products = await Product.insertMany(sampleProducts)
    console.log(`Added ${products.length} sample products`)

    res.status(200).json({
      success: true,
      message: `Successfully added ${products.length} sample products`,
      products: products.length
    })

  } catch (error) {
    console.error('Error adding sample products:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add sample products',
      error: error.message
    })
  }
}
