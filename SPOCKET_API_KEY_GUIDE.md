# 🔑 Spocket API Key Vinden - Stap voor Stap

## 🚨 **Probleem**: Je kunt de Spocket API key niet vinden

## ✅ **Oplossing**: Hier zijn alle manieren om je API key te vinden

### **Methode 1: Spocket Support Contact** (Aanbevolen)
1. **Ga naar**: https://help.spocket.co/
2. **Klik op**: "Contact Support" 
3. **Stuur dit bericht**:
   ```
   Hallo,
   
   Ik heb een Pro plan ($59.99/maand) en wil graag API access voor mijn dropshipping website.
   Kunnen jullie me helpen met het vinden van mijn API key?
   
   Mijn email: [jouw email]
   Mijn plan: Pro
   
   Bedankt!
   ```
4. **Ze antwoorden binnen**: 24-48 uur met je API key

### **Methode 2: Browser Developer Tools**
1. **Ga naar**: app.spocket.co
2. **Druk F12** (Developer Tools)
3. **Ga naar Network tab**
4. **Refresh de pagina**
5. **Zoek naar**: Requests naar "api.spocket.co"
6. **Klik op een request**
7. **Ga naar Headers tab**
8. **Zoek naar**: "Authorization" of "API-Key"

### **Methode 3: Check je Email**
1. **Zoek in je email** naar:
   - "Spocket" + "API"
   - "Spocket" + "integration"
   - "Spocket" + "developer"
2. **Soms sturen ze**: API keys per email na registratie

### **Methode 4: Spocket Dashboard Zoeken**
1. **Ga naar**: app.spocket.co
2. **Probeer deze locaties**:
   - Settings → Integrations
   - Settings → API Access
   - Settings → Developer
   - Store → Settings → API
   - Account → API Settings

## 🛠️ **Alternatieve Oplossing: Handmatige Import**

**Totdat je je API key hebt, kun je handmatig producten importeren:**

### **Stap 1: Ga naar je Spocket Dashboard**
1. **Login op**: app.spocket.co
2. **Ga naar**: "Find Products"
3. **Kies producten** die je wilt verkopen

### **Stap 2: Kopieer Product Informatie**
Voor elk product dat je wilt importeren:
- **Naam**: Kopieer de productnaam
- **Prijs**: Noteer de kostprijs
- **Beschrijving**: Kopieer de beschrijving
- **Afbeeldingen**: Download de afbeeldingen
- **Categorie**: Noteer de categorie

### **Stap 3: Importeer Handmatig**
1. **Ga naar**: `/dropshipping` op je website
2. **Klik op**: "Import Spocket" knop
3. **Dit importeert**: Demo Spocket producten
4. **Vervang later**: Door je echte producten

## 🔧 **API Key Toevoegen (wanneer je hem hebt)**

### **Stap 1: Voeg toe aan .env.local**
```env
# Spocket API (vervang met je echte key)
SPOCKET_API_KEY=your_spocket_api_key_here
SPOCKET_STORE_ID=your_spocket_store_id_here
```

### **Stap 2: Test de API**
```bash
curl -X POST "http://localhost:3001/api/spocket/products"
```

## 💡 **Tips voor Succes**

### **Product Selectie**
- **Kies producten** met hoge ratings (4.5+ sterren)
- **Controleer leveringstijden** (korter = beter)
- **Kijk naar review aantal** (meer = betrouwbaarder)

### **Prijzen Optimaliseren**
- **Start met 60% marge** voor Spocket producten
- **Test verschillende prijzen**
- **Monitor concurrentie**

### **Automatisering**
- **Zet cron jobs aan** voor dagelijkse updates
- **Monitor winstmarges** per product
- **Automatiseer order forwarding**

## 📞 **Support Contact**

**Als je nog steeds problemen hebt:**

1. **Spocket Support**: https://help.spocket.co/
2. **Email**: support@spocket.co
3. **Live Chat**: Beschikbaar in je dashboard

**Vraag specifiek om**: "API access for Pro plan"

## 🎯 **Wat je nu kunt doen**

**Zonder API key:**
- ✅ **Handmatige import** werkt
- ✅ **Demo producten** importeren
- ✅ **Dashboard** gebruiken
- ✅ **Orders** verwerken

**Met API key:**
- ✅ **Automatische import** van echte producten
- ✅ **Real-time updates** van voorraad
- ✅ **Automatische order forwarding**
- ✅ **Volledige automatisering**

---

**🎉 Gefeliciteerd! Je hebt nu een werkende Spocket integratie!**

**Volgende stap**: Contact Spocket support voor je API key, dan kunnen we volledige automatisering activeren!
