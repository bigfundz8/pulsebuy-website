# 🔑 API Keys Integratie Instructies

## 📋 **Overzicht**
Dit bestand legt uit hoe je echte API keys kunt integreren voor volledige automatische dropshipping.

## 🚀 **Stap 1: Registreer voor API Keys**

### **AliExpress Dropshipping Center** (Aanbevolen - Gratis)
1. Ga naar: https://dropshipping.aliexpress.com/
2. Registreer als dropshipper
3. Verifieer je account
4. Krijg je API credentials

### **Oberlo** (€29.90/maand)
1. Ga naar: https://www.oberlo.com/
2. Kies een plan
3. Krijg API access na betaling

### **Spocket** (€19.99-49.99/maand)
1. Ga naar: https://www.spocket.co/
2. Kies een plan
3. Krijg API credentials

## 🔧 **Stap 2: API Keys Toevoegen aan .env.local**

Voeg deze variabelen toe aan je `.env.local` bestand:

```env
# AliExpress API (vervang met je echte keys)
ALIEXPRESS_API_KEY=your_aliexpress_api_key_here
ALIEXPRESS_SECRET_KEY=your_aliexpress_secret_key_here
ALIEXPRESS_APP_KEY=your_aliexpress_app_key_here

# Oberlo API (als je Oberlo gebruikt)
OBERLO_API_KEY=your_oberlo_api_key_here
OBERLO_SHOP_ID=your_oberlo_shop_id_here

# Spocket API (als je Spocket gebruikt)
SPOCKET_API_KEY=your_spocket_api_key_here
SPOCKET_STORE_ID=your_spocket_store_id_here

# DSers API (als je DSers gebruikt)
DSERS_API_KEY=your_dsers_api_key_here
DSERS_USER_ID=your_dsers_user_id_here
```

## 🛠️ **Stap 3: Echte API Integratie**

### **AliExpress API Integratie**
```javascript
// pages/api/aliexpress/real-products.js
import axios from 'axios'

const ALIEXPRESS_API_KEY = process.env.ALIEXPRESS_API_KEY
const ALIEXPRESS_SECRET_KEY = process.env.ALIEXPRESS_SECRET_KEY

export default async function handler(req, res) {
  try {
    // Echte AliExpress API call
    const response = await axios.get('https://api-sg.aliexpress.com/sync', {
      params: {
        app_key: ALIEXPRESS_API_KEY,
        method: 'aliexpress.affiliate.product.smartmatch',
        sign_method: 'sha256',
        timestamp: Date.now(),
        // ... andere parameters
      }
    })
    
    // Verwerk echte producten
    const products = response.data.aeop_ae_product_display_dto_list
    
    // Importeer naar database
    for (const product of products) {
      // ... product import logica
    }
    
    res.status(200).json({
      success: true,
      message: 'Echte AliExpress producten geïmporteerd',
      data: { importedProducts: products.length }
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AliExpress API error',
      error: error.message
    })
  }
}
```

### **Oberlo API Integratie**
```javascript
// pages/api/oberlo/products.js
const OBERLO_API_KEY = process.env.OBERLO_API_KEY
const OBERLO_SHOP_ID = process.env.OBERLO_SHOP_ID

export default async function handler(req, res) {
  try {
    const response = await axios.get(`https://app.oberlo.com/api/v1/products`, {
      headers: {
        'Authorization': `Bearer ${OBERLO_API_KEY}`,
        'X-Shop-ID': OBERLO_SHOP_ID
      }
    })
    
    // Verwerk Oberlo producten
    const products = response.data.data
    
    res.status(200).json({
      success: true,
      message: 'Oberlo producten geïmporteerd',
      data: { importedProducts: products.length }
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Oberlo API error',
      error: error.message
    })
  }
}
```

## 📊 **Stap 4: Automatische Cron Jobs**

Update je `vercel.json` met echte API calls:

```json
{
  "crons": [
    {
      "path": "/api/aliexpress/real-products?api_key=your_cron_key",
      "schedule": "0 3 * * *"
    },
    {
      "path": "/api/oberlo/sync-products?api_key=your_cron_key", 
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/trending/detect?api_key=your_cron_key",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

## 🎯 **Stap 5: Test je Integratie**

1. **Test API Keys**:
```bash
curl -X POST "http://localhost:3001/api/aliexpress/real-products"
```

2. **Controleer Producten**:
```bash
curl "http://localhost:3001/api/products?limit=5"
```

3. **Test Trending Detectie**:
```bash
curl -X POST "http://localhost:3001/api/trending/detect"
```

## 💡 **Tips voor Succes**

### **Product Selectie**
- Kies producten met hoge ratings (4.5+ sterren)
- Controleer leveringstijden (korter = beter)
- Kijk naar review aantal (meer = betrouwbaarder)

### **Prijzen Optimaliseren**
- Start met 30-40% marge
- Test verschillende prijzen
- Monitor concurrentie

### **Automatisering**
- Zet cron jobs aan voor dagelijkse updates
- Monitor winstmarges per product
- Automatiseer order forwarding

## 🚨 **Belangrijke Opmerkingen**

1. **API Limits**: Respecteer rate limits van leveranciers
2. **Error Handling**: Implementeer proper error handling
3. **Backup**: Maak regelmatig backups van je database
4. **Monitoring**: Monitor je API usage en kosten

## 📞 **Support**

Als je hulp nodig hebt met API integratie:
1. Check de documentatie van je leverancier
2. Test eerst met kleine datasets
3. Implementeer geleidelijk meer automatisering

---

**🎉 Gefeliciteerd! Je hebt nu een volledig geautomatiseerde dropshipping website!**
