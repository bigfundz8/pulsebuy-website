# DropshipMotion - Moderne E-commerce Website

Een complete dropship/e-commerce oplossing gebouwd met Next.js, MongoDB en Stripe.

## 🚀 Features

- **Moderne UI/UX**: Gebouwd met Tailwind CSS en Framer Motion
- **Responsive Design**: Werkt perfect op alle apparaten
- **Product Management**: Volledig beheer van producten en categorieën
- **Betalingen**: Veilige betalingen via Stripe
- **Gebruikersbeheer**: Registratie, login en profielbeheer
- **Order Tracking**: Volledige order tracking en status updates
- **Admin Dashboard**: Beheer van orders, producten en gebruikers
- **SEO Geoptimaliseerd**: Meta tags en structured data

## 📋 Vereisten

- Node.js 18+ 
- MongoDB (lokaal of Atlas)
- Stripe account
- Git

## 🛠️ Installatie

1. **Clone de repository**
   ```bash
   git clone <repository-url>
   cd dropship-motion
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variabelen**
   ```bash
   cp env.example .env.local
   ```
   
   Vul de volgende variabelen in:
   - `MONGODB_URI`: Je MongoDB connection string
   - `STRIPE_SECRET_KEY`: Je Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY`: Je Stripe publishable key
   - `JWT_SECRET`: Een willekeurige secret key
   - `EMAIL_USER` & `EMAIL_PASS`: Voor email notificaties

4. **Start de development server**
   ```bash
   npm run dev
   ```

5. **Open je browser**
   Ga naar [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### MongoDB Atlas (Aanbevolen)
1. Maak een account op [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Maak een nieuwe cluster
3. Voeg je IP toe aan de whitelist
4. Maak een database gebruiker
5. Kopieer de connection string naar je `.env.local`

### Lokale MongoDB
```bash
# Install MongoDB (macOS met Homebrew)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Of met Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 💳 Stripe Setup

1. Maak een account op [Stripe](https://stripe.com)
2. Ga naar Developers > API Keys
3. Kopieer je Test keys naar `.env.local`
4. Voor productie, gebruik je Live keys

## 📁 Project Structuur

```
dropship-motion/
├── app/                    # Next.js App Router
│   ├── components/        # React componenten
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── models/                # MongoDB models
├── pages/api/             # API routes
├── lib/                   # Utility functions
└── public/                # Static assets
```

## 🎨 Customization

### Kleuren Aanpassen
Bewerk `tailwind.config.js` om je eigen kleuren toe te voegen:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Je eigen kleuren
      }
    }
  }
}
```

### Logo en Branding
- Vervang logo in `app/components/Header.tsx`
- Update favicon in `public/`
- Wijzig bedrijfsnaam in alle componenten

## 🚀 Deployment

### Vercel (Aanbevolen)
1. Push je code naar GitHub
2. Verbind je repository met Vercel
3. Voeg environment variabelen toe
4. Deploy!

### Andere Platforms
- **Netlify**: Gebruik `npm run build` en `npm run start`
- **Railway**: Automatische deployment vanuit GitHub
- **DigitalOcean**: Gebruik App Platform

## 📊 Analytics & Monitoring

### Google Analytics
Voeg je GA tracking ID toe aan `app/layout.tsx`:

```javascript
// Google Analytics
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
  strategy="afterInteractive"
/>
```

### Error Monitoring
Overweeg Sentry voor error tracking:

```bash
npm install @sentry/nextjs
```

## 🔒 Security

- Alle API routes zijn beveiligd
- JWT tokens voor authenticatie
- Input validatie en sanitization
- Rate limiting op API endpoints
- HTTPS enforced in productie

## 📈 Performance

- Image optimization met Next.js
- Lazy loading van componenten
- Database indexing
- CDN voor static assets
- Caching strategieën

## 🛡️ Backup & Recovery

### Database Backup
```bash
# MongoDB backup
mongodump --uri="your-mongodb-uri" --out=backup/

# Restore
mongorestore --uri="your-mongodb-uri" backup/
```

## 📞 Support

Voor vragen of problemen:
- Check de [Issues](https://github.com/your-repo/issues) pagina
- Raadpleeg de [Documentatie](https://your-docs-site.com)
- Neem contact op via email

## 📄 Licentie

Dit project is gelicenseerd onder de MIT License.

---

**Veel succes met je dropship business! 🎉**
