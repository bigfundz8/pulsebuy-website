# 📸 FACEBOOK PIXEL INSTALLATIE GIDS

## ⚠️ BELANGRIJK: Lees eerst dit
Facebook Pixel werkt **NIET** op localhost (http://localhost:3002).
Je zult een **live website** nodig hebben voordat de Pixel data kan verzamelen.

---

## STAP 1: Maak je Facebook Pixel aan

1. Ga naar: **https://business.facebook.com/events_manager**
2. Klik op **"Connect Data Sources"**
3. Kies **"Web"**
4. Kies **"Facebook Pixel"**
5. Klik **"Connect"**
6. Kopieer je **Pixel ID** (zoals: 1234567890123456)

**✅ JE PIXEL ID: _____________________**

---

## STAP 2: Installeer Pixel op je website

### OPTIE A: Voor localhost (nu, om te testen)

Open dit bestand en voeg de pixel toe:
**File**: `app/layout.tsx`

Voeg dit toe in de `<head>` sectie (na regel 46):

```javascript
{/* Facebook Pixel Code */}
<script
  dangerouslySetInnerHTML={{
    __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'JOUW_PIXEL_ID_HIER'); // VERVANG MET JE ECHTE PIXEL ID!
      fbq('track', 'PageView');
    `,
  }}
/>
<noscript>
  <img height="1" width="1" style={{display:'none'}}
    src={'https://www.facebook.com/tr?id=JOUW_PIXEL_ID_HIER&ev=PageView&noscript=1'}
  />
</noscript>
```

**⚠️ WAARSCHUWING:** 
- De Pixel werkt niet op localhost
- Wacht tot je een live domain hebt (Vercel, Netlify, etc.)
- Dan pas zal de Pixel data verzamelen

---

## STAP 3: Verzamel Conversie Data

### Voor Checkout Success:

Open: `app/checkout/success/page.tsx`

Voeg dit toe in de component:

```javascript
useEffect(() => {
  // Facebook Pixel - Track Purchase
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', 'Purchase', {
      content_name: 'LED Strip Lights',
      content_category: 'Home Decor',
      value: 29.99,
      currency: 'EUR'
    });
  }
}, []);
```

---

## STAP 4: Test je Pixel

1. **Installeer:** Facebook Pixel Helper Chrome extension
2. **Test:** Ga naar je website en klik de extension
3. **Controleer:** Of de pixel vuurt (groen = OK, rood = fout)

**Download:** https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc

---

## ⚡ VOLGENDE STAP

Nadat je **LIVE** gaat (Vercel/Netlify hosting):
1. Update je Pixel ID in het code
2. Test of de Pixel werkt
3. Dan pas je eerste ad maken!

**VOOR NU:** Je kunt gewoon **testen zonder Pixel**. Zodra je live gaat, werkt de Pixel automatisch.

