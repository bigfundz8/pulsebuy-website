import connectDB from '../../../lib/mongodb';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Simuleer AliExpress API data (in werkelijkheid zou je echte API calls maken)
    const aliExpressProducts = [
      {
        name: "Wireless Charging Pad 15W",
        description: "Snelle draadloze oplader met 15W power delivery. Compatibel met iPhone en Samsung. LED-indicator en oververhitting bescherming.",
        price: 19.99,
        originalPrice: 34.99,
        images: [
          {
            url: "https://images.unsplash.com/photo-1609592807900-4b4b4b4b4b4b?w=800&h=600&fit=crop",
            alt: "Wireless Charging Pad 15W"
          }
        ],
        category: "electronics",
        subcategory: "phone-accessories",
        brand: "PowerTech",
        sku: `AE-WIRELESS-${Date.now()}`,
        stock: 500,
        isActive: true,
        isFeatured: true,
        tags: ["wireless-charger", "15w", "fast-charging", "auto-sync"],
        specifications: {
          "Power": "15W",
          "Compatibiliteit": "iPhone 12+, Samsung Galaxy",
          "LED-indicator": "Ja",
          "Bescherming": "Oververhitting, kortsluiting"
        },
        shipping: {
          weight: 0.2,
          dimensions: {
            length: 10,
            width: 10,
            height: 1
          },
          freeShipping: true
        },
        supplier: {
          name: "AliExpress Auto Supplier",
          contact: "Auto Supplier",
          email: "auto@aliexpress.com",
          aliExpressUrl: "https://www.aliexpress.com/item/1005001234567890.html",
          cost: 6.50,
          shippingTime: "7-14 days",
          autoOrder: true // Kan automatisch besteld worden
        },
        isRealProduct: true,
        isAutoSynced: true,
        profitMargin: 67,
        lastSynced: new Date()
      },
      {
        name: "Smart LED Strip 10M RGB",
        description: "10 meter slimme LED strip met 16 miljoen kleuren, app-besturing en muzieksynchronisatie. Perfect voor gaming en sfeer.",
        price: 24.99,
        originalPrice: 39.99,
        images: [
          {
            url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&h=600&fit=crop",
            alt: "Smart LED Strip 10M RGB"
          }
        ],
        category: "home",
        subcategory: "lighting",
        brand: "SmartLED",
        sku: `AE-LED-${Date.now()}`,
        stock: 300,
        isActive: true,
        isFeatured: true,
        tags: ["led-strip", "smart", "rgb", "10m", "auto-sync"],
        specifications: {
          "Lengte": "10 meter",
          "Kleuren": "16 miljoen",
          "App-besturing": "Ja",
          "Muzieksync": "Ja"
        },
        shipping: {
          weight: 0.8,
          dimensions: {
            length: 50,
            width: 20,
            height: 5
          },
          freeShipping: true
        },
        supplier: {
          name: "AliExpress LED Supplier",
          contact: "LED Supplier",
          email: "led@aliexpress.com",
          aliExpressUrl: "https://www.aliexpress.com/item/1005002345678901.html",
          cost: 8.50,
          shippingTime: "7-14 days",
          autoOrder: true
        },
        isRealProduct: true,
        isAutoSynced: true,
        profitMargin: 66,
        lastSynced: new Date()
      }
    ];

    let addedCount = 0;
    let updatedCount = 0;

    for (const productData of aliExpressProducts) {
      // Controleer of product al bestaat (op basis van naam en leverancier)
      const existingProduct = await Product.findOne({
        name: productData.name,
        'supplier.name': productData.supplier.name
      });
      
      if (!existingProduct) {
        const product = new Product(productData);
        await product.save();
        addedCount++;
        console.log(`✅ Nieuw product gesynchroniseerd: ${productData.name}`);
      } else {
        // Update bestaand product met nieuwe data
        existingProduct.price = productData.price;
        existingProduct.stock = productData.stock;
        existingProduct.lastSynced = new Date();
        existingProduct.isAutoSynced = true;
        await existingProduct.save();
        updatedCount++;
        console.log(`🔄 Product bijgewerkt: ${productData.name}`);
      }
    }

    res.status(200).json({
      success: true,
      message: `AliExpress sync voltooid! ${addedCount} nieuw, ${updatedCount} bijgewerkt.`,
      added: addedCount,
      updated: updatedCount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Fout bij AliExpress sync:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Fout bij AliExpress sync',
      error: error.message 
    });
  }
}
