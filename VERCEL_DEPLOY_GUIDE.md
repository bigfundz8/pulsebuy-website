# 🚀 VERCEL DEPLOY GIDS

## STAP 1: Push naar GitHub (5 minuten)

### 1.1 Maak GitHub account aan (als je die nog niet hebt)
1. Ga naar: https://github.com
2. Maak account aan
3. Log in

### 1.2 Push je code naar GitHub

```bash
# In je terminal, voer deze commando's uit:

# 1. Ga naar je project folder
cd "/Users/tristenvanbronckhorst/dropship motion"

# 2. Initialiseer Git (als nog niet gedaan)
git init

# 3. Voeg alle bestanden toe
git add .

# 4. Commit je code
git commit -m "Ready for launch - Q4 winning products"

# 5. Maak een nieuwe repository op GitHub
# Ga naar: https://github.com/new
# Naam: "pulsebuy-store"
# Kies: "Public" (gratis)

# 6. Link je lokale repo naar GitHub
git remote add origin https://github.com/JOUW_GITHUB_USERNAME/pulsebuy-store.git

# 7. Push naar GitHub
git branch -M main
git push -u origin main
```

---

## STAP 2: Deploy naar Vercel (10 minuten)

### 2.1 Vercel Account
1. Ga naar: **https://vercel.com**
2. Klik **"Sign Up"**
3. Login met je **GitHub account**
4. Geef toegang tot je GitHub repos

### 2.2 Import Project
1. Klik **"+ New Project"**
2. Selecteer je **"pulsebuy-store"** repo
3. Klik **"Import"**

### 2.3 Configure Environment Variables

**VUL DEZE IN:**

```
# Stripe (Live Keys)
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE

# Database
MONGODB_URI=mongodb+srv://tristenvanbronckhorst_db_user:fBZZ4MWCiTaIfvXW@pulsebuy.16bfkxt.mongodb.net/pulsebuy?retryWrites=true&w=majority

# Email
EMAIL_USER=pulsebuy.store@gmail.com
EMAIL_PASS=xsnezxfujxwgnjzo
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=pulsebuy.store@gmail.com
SMTP_PASS=xsnezxfujxwgnjzo

# App URLs
NEXT_PUBLIC_APP_URL=https://jouw-domein.vercel.app
```

### 2.4 Deploy
1. Klik **"Deploy"**
2. Wacht 2-5 minuten
3. **DONE!** 🎉

---

## STAP 3: Test je live site

Je krijgt een URL zoals: **https://pulsebuy-store.vercel.app**

Test:
- [ ] Homepage laadt
- [ ] Producten tonen
- [ ] Checkout werkt
- [ ] Betaling werkt (met echte kaart)

---

## STAP 4: Custom Domain (optioneel)

### 4.1 Koop domain (bij Namecheap, GoDaddy, etc.)
Bijvoorbeeld: **pulsebuy.nl** (€10-15/jaar)

### 4.2 Koppel aan Vercel
1. Ga naar Vercel dashboard
2. Klik je project → **Settings** → **Domains**
3. Voeg je domain toe
4. Volg DNS instellingen

---

## ✅ VOLGENDE STAP NA DEPLOY

**Install Facebook Pixel:**
1. Je live URL is klaar
2. Maak Pixel aan in Facebook Business Manager
3. Installeer Pixel code op live site (zie `FACEBOOK_PIXEL_INSTALLATION.md`)
4. Test met Pixel Helper
5. **DAAN** maak je je eerste ad!

