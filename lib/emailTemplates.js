import nodemailer from 'nodemailer'

// Email templates voor conversion optimization
const emailTemplates = {
  welcome: {
    subject: '🎉 Welkom bij PulseBuy - Je eerste bestelling krijgt 10% korting!',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welkom bij PulseBuy!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">De nieuwste tech & lifestyle producten</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-top: 0;">🎁 Speciaal voor jou: 10% korting!</h2>
          <p style="color: #666; line-height: 1.6;">
            Bedankt voor je interesse in PulseBuy! Als welkomstgeschenk krijg je <strong>10% korting</strong> op je eerste bestelling.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #333; margin: 0 0 10px 0;">Gebruik code: WELKOM10</h3>
            <p style="color: #666; margin: 0;">Geldig tot 48 uur na ontvangst van deze email</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pulsebuy.nl/products" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              🛍️ Nu Winkelen met Korting
            </a>
          </div>
          
          <h3 style="color: #333;">🔥 Trending Nu:</h3>
          <ul style="color: #666; line-height: 1.8;">
            <li>Wireless Charging Pad - €24.99 (was €39.99)</li>
            <li>Magic Eraser Sponges - €12.99 (was €19.99)</li>
            <li>Smart LED Strip Lights - €29.99 (was €49.99)</li>
          </ul>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #2d5a2d; margin: 0; font-weight: bold;">
              ✅ Gratis verzending vanaf €50<br>
              ✅ 30 dagen retourrecht<br>
              ✅ Nederlandse klantenservice
            </p>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>PulseBuy - Moderne Tech & Lifestyle</p>
          <p>Amsterdam, Nederland | info@pulsebuy.nl</p>
        </div>
      </div>
    `
  },
  
  abandonedCart: {
    subject: '🛒 Je hebt iets achtergelaten - 15% extra korting!',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Wacht! Je bent iets vergeten</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Je winkelwagen wacht op je</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-top: 0;">🛒 Je winkelwagen is nog niet leeg</h2>
          <p style="color: #666; line-height: 1.6;">
            We zien dat je producten hebt toegevoegd aan je winkelwagen, maar je bestelling nog niet hebt afgerond. 
            Geen probleem! We hebben iets speciaals voor je...
          </p>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #ffc107;">
            <h3 style="color: #856404; margin: 0 0 10px 0;">🎁 Extra korting: 15%!</h3>
            <p style="color: #856404; margin: 0;">Gebruik code: CART15 - Geldig voor 24 uur</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pulsebuy.nl/cart" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              🛒 Bestelling Afronden
            </a>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Waarom kiezen voor PulseBuy?</h3>
            <ul style="color: #666; line-height: 1.8; margin: 0;">
              <li>🚚 Gratis verzending vanaf €50</li>
              <li>🔒 100% veilige betaling</li>
              <li>↩️ 30 dagen retourrecht</li>
              <li>🇳🇱 Nederlandse klantenservice</li>
            </ul>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #2d5a2d; margin: 0; font-weight: bold;">
              ⏰ Beperkte tijd! Deze korting is alleen geldig voor de komende 24 uur.
            </p>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>PulseBuy - Moderne Tech & Lifestyle</p>
          <p>Amsterdam, Nederland | info@pulsebuy.nl</p>
        </div>
      </div>
    `
  },
  
  orderConfirmation: {
    subject: '✅ Bestelling Bevestigd - Bedankt voor je vertrouwen!',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Bestelling Bevestigd! 🎉</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Bedankt voor je vertrouwen</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-top: 0;">Je bestelling is succesvol geplaatst</h2>
          <p style="color: #666; line-height: 1.6;">
            Bedankt voor je bestelling! Je ontvangt je producten binnen 2-5 werkdagen. 
            We houden je op de hoogte van de verzendstatus.
          </p>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d5a2d; margin-top: 0;">📦 Verzendinformatie</h3>
            <p style="color: #2d5a2d; margin: 0;">
              • Verwachte levering: 2-5 werkdagen<br>
              • Je ontvangt een tracking code per SMS<br>
              • Bezorging tussen 9:00 - 18:00
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pulsebuy.nl/track-order" style="background: linear-gradient(135deg, #00b894 0%, #00a085 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              📍 Bestelling Volgen
            </a>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">💡 Meer ontdekken?</h3>
            <p style="color: #666; margin: 0;">
              Bekijk onze andere populaire producten en profiteer van onze dagelijkse aanbiedingen!
            </p>
            <div style="text-align: center; margin-top: 15px;">
              <a href="https://pulsebuy.nl/products" style="background: #6c757d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                🛍️ Meer Winkelen
              </a>
            </div>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>PulseBuy - Moderne Tech & Lifestyle</p>
          <p>Amsterdam, Nederland | info@pulsebuy.nl</p>
        </div>
      </div>
    `
  }
}

export default emailTemplates
