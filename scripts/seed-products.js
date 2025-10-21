const mongoose = require('mongoose')
const Product = require('../models/Product')

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/dropshipmotion')

const sampleProducts = [
  {
    name: "Smart Fitness Tracker",
    description: "Geavanceerde fitness tracker met hartslagmeter, GPS en 7 dagen batterijduur. Perfect voor sporters en gezondheidsbewuste mensen.",
    price: 89.99,
    originalPrice: 129.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=800&h=600&fit=crop",
        alt: "Smart Fitness Tracker"
      }
    ],
    category: "electronics",
    subcategory: "wearables",
    brand: "FitTech",
    sku: "FT-SMART-001",
    stock: 50,
    isActive: true,
    isFeatured: true,
    tags: ["fitness", "smartwatch", "health", "tracker"],
    specifications: {
      "Batterijduur": "7 dagen",
      "Waterbestendig": "IP68",
      "Schermgrootte": "1.4 inch",
      "Connectiviteit": "Bluetooth 5.0"
    },
    shipping: {
      weight: 0.05,
      dimensions: {
        length: 4.5,
        width: 3.5,
        height: 1.2
      },
      freeShipping: true
    },
    supplier: {
      name: "TechSuppliers EU",
      contact: "John Doe",
      email: "john@techsuppliers.eu"
    }
  },
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium draadloze oordopjes met noise cancellation en 30 uur speeltijd. Ideaal voor muziekliefhebbers en professionals.",
    price: 59.99,
    originalPrice: 89.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
        alt: "Wireless Bluetooth Headphones"
      }
    ],
    category: "electronics",
    subcategory: "audio",
    brand: "SoundMax",
    sku: "SM-WIRELESS-002",
    stock: 75,
    isActive: true,
    isFeatured: true,
    tags: ["headphones", "bluetooth", "wireless", "music"],
    specifications: {
      "Speeltijd": "30 uur",
      "Noise Cancellation": "Ja",
      "Connectiviteit": "Bluetooth 5.2",
      "Oplaadtijd": "2 uur"
    },
    shipping: {
      weight: 0.3,
      dimensions: {
        length: 20,
        width: 15,
        height: 8
      },
      freeShipping: true
    },
    supplier: {
      name: "AudioSuppliers NL",
      contact: "Sarah Johnson",
      email: "sarah@audiosuppliers.nl"
    }
  },
  {
    name: "Portable Phone Charger",
    description: "Snelle draadloze oplader voor alle smartphones. Compacte design met LED-indicator en veiligheidsbescherming.",
    price: 29.99,
    originalPrice: 49.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1609592807900-4b4b4b4b4b4b?w=800&h=600&fit=crop",
        alt: "Portable Phone Charger"
      }
    ],
    category: "electronics",
    subcategory: "accessories",
    brand: "PowerTech",
    sku: "PT-CHARGER-003",
    stock: 100,
    isActive: true,
    isFeatured: false,
    tags: ["charger", "wireless", "portable", "phone"],
    specifications: {
      "Capaciteit": "10000mAh",
      "Oplaadsnelheid": "15W",
      "Compatibiliteit": "Alle smartphones",
      "LED-indicator": "Ja"
    },
    shipping: {
      weight: 0.2,
      dimensions: {
        length: 10,
        width: 6,
        height: 2
      },
      freeShipping: false
    },
    supplier: {
      name: "PowerSuppliers EU",
      contact: "Mike Chen",
      email: "mike@powersuppliers.eu"
    }
  },
  {
    name: "Smart Watch Series 8",
    description: "De nieuwste smartwatch met geavanceerde gezondheidsmonitoring, ECG en bloedzuurstof meting. Stijlvolle design voor elke gelegenheid.",
    price: 199.99,
    originalPrice: 299.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
        alt: "Smart Watch Series 8"
      }
    ],
    category: "electronics",
    subcategory: "wearables",
    brand: "SmartWear",
    sku: "SW-SERIES8-004",
    stock: 25,
    isActive: true,
    isFeatured: true,
    tags: ["smartwatch", "health", "fitness", "premium"],
    specifications: {
      "Schermgrootte": "1.9 inch",
      "Batterijduur": "18 uur",
      "Waterbestendig": "WR50",
      "Gezondheidsmonitoring": "ECG, SpO2, Hartslag"
    },
    shipping: {
      weight: 0.08,
      dimensions: {
        length: 4.4,
        width: 3.8,
        height: 1.4
      },
      freeShipping: true
    },
    supplier: {
      name: "WearableSuppliers EU",
      contact: "Emma Wilson",
      email: "emma@wearablesuppliers.eu"
    }
  },
  {
    name: "Designer T-Shirt Premium",
    description: "Comfortabele katoenen t-shirt in moderne designs. 100% biologisch katoen met duurzame productie. Beschikbaar in verschillende kleuren.",
    price: 24.99,
    originalPrice: 39.99,
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop",
        alt: "Designer T-Shirt Premium"
      }
    ],
    category: "fashion",
    subcategory: "clothing",
    brand: "EcoWear",
    sku: "EW-TSHIRT-005",
    stock: 200,
    isActive: true,
    isFeatured: false,
    tags: ["t-shirt", "cotton", "sustainable", "designer"],
    specifications: {
      "Materiaal": "100% biologisch katoen",
      "Wasvoorschrift": "Machinewas 30°C",
      "Maatvoering": "EU maten",
      "Duurzaamheid": "GOTS gecertificeerd"
    },
    shipping: {
      weight: 0.15,
      dimensions: {
        length: 30,
        width: 25,
        height: 2
      },
      freeShipping: false
    },
    supplier: {
      name: "FashionSuppliers NL",
      contact: "Lisa van der Berg",
      email: "lisa@fashionsuppliers.nl"
    }
  }
]

async function seedProducts() {
  try {
    console.log('📦 Toevoegen van sample producten...')
    const products = await Product.insertMany(sampleProducts)
    
    console.log(`✅ ${products.length} producten succesvol toegevoegd!`)
    console.log('\n📋 Toegevoegde producten:')
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - €${product.price}`)
    })
    
    console.log('\n🚀 Je kunt nu naar http://localhost:3001/products gaan om je producten te bekijken!')
    
  } catch (error) {
    console.error('❌ Fout bij het toevoegen van producten:', error)
  } finally {
    mongoose.connection.close()
  }
}

seedProducts()
