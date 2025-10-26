# 🚀 FACEBOOK ADS SETUP GIDS - LED STRIP LIGHTS

## STAP 1: Facebook Business Manager Opzetten (10 minuten)

### 1.1 Account Aanmaken
1. Ga naar: **https://business.facebook.com/**
2. Klik op **"Create Account"**
3. Vul in:
   - Bedrijfsnaam: **PulseBuy** (of jouw naam)
   - Jouw naam en email
   - Wachtwoord
4. Bevestig email

### 1.2 Business Manager Verifiëren
1. Doe mee aan de **Quick Setup**
2. Voeg je Facebook pagina toe (of maak nieuwe aan)
3. Voeg betaalmethode toe (PayPal of creditcard)
4. **Wacht op verificatie** (meestal 1-24 uur)

### 1.3 Ad Account Aanmaken
1. In Business Manager → **Ad Accounts**
2. Klik **"Add"** → **"Create a New Ad Account"**
3. Kies:
   - Account naam: **PulseBuy Ads**
   - Tijdzone: **Amsterdam (UTC+1)**
   - Valuta: **EUR (Euro)**
   - Betaal: **Jezelf**

## STAP 2: Facebook Pixel Installeren (15 minuten)

### 2.1 Pixel Aanmaken
1. Ga naar: **business.facebook.com/events_manager**
2. Klik **"Connect Data Sources"**
3. Kies **"Web"** → **"Facebook Pixel"**
4. Kopieer je Pixel ID (zoals: 1234567890123456)

### 2.2 Pixel Installeren op Jouw Site
Open deze file en voeg de pixel code toe:
**File**: `app/layout.tsx`

```html
<head>
  <!-- Facebook Pixel Code -->
  <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'JOUW_PIXEL_ID'); // Vervang met jouw echte ID!
    fbq('track', 'PageView');
  </script>
  <noscript>
    <img height="1" width="1" style="display:none" 
         src="https://www.facebook.com/tr?id=JOUW_PIXEL_ID&ev=PageView&noscript=1"/>
  </noscript>
  <!-- End Facebook Pixel Code -->
</head>
```

## STAP 3: Je Eerste Ad Campagne Maken (20 minuten)

### 3.1 Campaign Set Up
1. Ga naar: **business.facebook.com/adsmanager**
2. Klik **"+ Create"**
3. Kies doel: **"Traffic"** (of "Conversions" als je pixel werkt)
4. Campaign naam: **"LED Strip Lights - Piloot Jan 2025"**

### 3.2 Ad Set Configuratie

#### Audience Targeting (Doelgroep):
- **Locatie**: Nederland
- **Leeftijd**: 18-55 jaar
- **Geslacht**: Allebei
- **Interesses**: 
  - Home decor
  - Smart home
  - DIY
  - Gaming
  - Christmas decor
  - RGB lighting
  - Home improvement

**Budget**: €10 per dag
**Schedule**: Start direct

### 3.3 Ad Creative (Copy & Foto's)

#### HEADLINE (40 karakters):
```
🔥 Smart LED Strip - Alexa Compatible
```

#### PRIMARY TEXT (125 karakters):
```
✨ Transformeer je kamer met miljoenen kleuren! Werkt met Alexa & Google Home. Perfecte sfeer voor elke ruimte. GRATIS verzending! 🎨⚡
```

#### DESCRIPTION (Text + Vervolg):
```
🎁 PERFECTE KERSTGIFT
✅ 5 meter LED strip met 16 miljoen kleuren
✅ Bedien via app, Alexa of Google
✅ Muziek sync modus
✅ Timer & Wake-up licht
✅ Makkelijk te installeren met plakstrip
✅ 30 dagen retour garantie

Gratis verzending! Binnen 3-7 werkdagen bij je!
```

#### CALL-TO-ACTION BUTTON:
```
"Shop Now" of "Learn More"
```

#### IMAGES (Upload 3-5 foto's):
Upload de beste product foto's van je LED Strip Lights

---

## STAP 4: Launch & Monitor (Eerste 24 uur)

### 4.1 Ad Review
- Facebook reviewt je ad binnen **1-6 uur**
- Check email voor go/no-go

### 4.2 Eerste Data (na 24 uur checken):
- **Reach**: Hoeveel mensen zagen je ad?
- **Link Clicks**: Hoeveel klikten door?
- **CTR**: % click-through rate (boven 1% = GOED!)
- **CPC**: Cost-per-click (doel onder €0.50)
- **Conversions**: Echt aantal verkopen

### 4.3 Budget Tips:
- **Dag 1-3**: Laat €10 lopen, monitor alleen
- **Dag 4-7**: Als CPC < €0.50, verhoog naar €15/dag
- **Week 2**: Als conversies goed zijn, **verhoog naar €20-25/dag**

---

## 🎯 SUCCES CRITERIA

### Wat is GOED:
✅ CTR > 1% = Mensen vinden je ad interessant
✅ CPC < €0.50 = Goede prijs per klik
✅ Website traffic > 50/24h = Gezond verkeer
✅ Break-even: 1 verkoop per 4-5 kliks (€26 winst vs ~€2-3 in ads)

### Wat is SLECHT:
❌ CTR < 0.5% = Ad creatief niet goed
❌ CPC > €1 = Te duur, verander targeting
❌ Geen clicks = Verkeerde doelgroep

---

## 💡 VERVOLG ACTIES (Week 2)

### Optimalisatie:
1. **A/B Test**: Test verschillende kopieën
2. **Lookalike Audience**: Maak lookalikes van bezoekers
3. **Retargeting**: Ad naar website bezoekers die niet kochten
4. **Scale**: Verhoog budget als het werkt

### Scaling Plan:
- Week 1: €10/dag = €70
- Week 2: €20/dag = €140  
- Week 3: €30/dag = €210
- Maand: €800-1000 aan ads

**ROAS (Return on Ad Spend) Goal**: 3x = €3000 omzet van €1000 ads

---

## 📞 NODIGE RECAP:
- **Landing Page**: ✅ http://localhost:3002/products (of je product pagina)
- **Product**: LED Strip Lights €29.99
- **Marge**: €26.49 (85%)
- **Doel**: 3-5 verkopen per week om break-even
- **Target**: 18-55, Nederland, Home Decor interesses

**START NU**: Ga naar business.facebook.com en begin met STAP 1! 🚀

