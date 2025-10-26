"use strict";exports.id=2206,exports.ids=[2206],exports.modules={2206:(e,t,i)=>{i.d(t,{yo:()=>s});var n=i(5184),r=i.n(n);let a=()=>r().createTransporter({host:process.env.SMTP_HOST||"smtp.gmail.com",port:parseInt(process.env.SMTP_PORT||"587"),secure:!1,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}}),o={orderConfirmation:e=>({subject:`Bestelling Bevestiging - ${e.orderNumber}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bestelling Bevestiging</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .product-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; font-size: 18px; color: #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bestelling Bevestigd!</h1>
            <p>Bedankt voor je bestelling bij PulseBuy</p>
          </div>
          <div class="content">
            <h2>Hallo ${e.customerName},</h2>
            <p>Je bestelling is succesvol ontvangen en wordt zo snel mogelijk verwerkt.</p>
            
            <div class="order-details">
              <h3>Bestelling Details</h3>
              <p><strong>Bestelnummer:</strong> ${e.orderNumber}</p>
              <p><strong>Datum:</strong> ${new Date(e.createdAt).toLocaleDateString("nl-NL")}</p>
              <p><strong>Status:</strong> ${e.status}</p>
              
              <h4>Producten:</h4>
              ${e.items.map(e=>`
                <div class="product-item">
                  <span>${e.product.name} (${e.quantity}x)</span>
                  <span>€${e.total.toFixed(2)}</span>
                </div>
              `).join("")}
              
              <div class="product-item total">
                <span>Totaal:</span>
                <span>€${e.totals.total.toFixed(2)}</span>
              </div>
            </div>
            
            <p>Je kunt je bestelling volgen via: <a href="http://localhost:3000/orders/${e._id}">Bekijk bestelling</a></p>
            
            <div class="footer">
              <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
              <p>Voor vragen kun je contact opnemen via: support@pulsebuy.nl</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `}),orderShipped:e=>({subject:`Je bestelling is verzonden! - ${e.orderNumber}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bestelling Verzonden</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .tracking { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .tracking-number { font-size: 24px; font-weight: bold; color: #4CAF50; margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚚 Je bestelling is onderweg!</h1>
            <p>Bestelling ${e.orderNumber} is verzonden</p>
          </div>
          <div class="content">
            <h2>Hallo ${e.customerName},</h2>
            <p>Geweldig nieuws! Je bestelling is verzonden en komt binnenkort aan.</p>
            
            <div class="tracking">
              <h3>Tracking Informatie</h3>
              <p><strong>Verzendmethode:</strong> ${e.shipping.method}</p>
              ${e.shipping.trackingNumber?`
                <p><strong>Tracking nummer:</strong></p>
                <div class="tracking-number">${e.shipping.trackingNumber}</div>
              `:""}
              ${e.shipping.estimatedDelivery?`
                <p><strong>Geschatte levering:</strong> ${new Date(e.shipping.estimatedDelivery).toLocaleDateString("nl-NL")}</p>
              `:""}
            </div>
            
            <p>Je kunt je bestelling volgen via: <a href="http://localhost:3000/orders/${e._id}">Bekijk bestelling</a></p>
            
            <div class="footer">
              <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
              <p>Voor vragen kun je contact opnemen via: support@pulsebuy.nl</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `}),orderDelivered:e=>({subject:`Je bestelling is bezorgd! - ${e.orderNumber}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bestelling Bezorgd</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF6B6B 0%, #ee5a52 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .review-section { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Bestelling Bezorgd!</h1>
            <p>Je bestelling ${e.orderNumber} is succesvol bezorgd</p>
          </div>
          <div class="content">
            <h2>Hallo ${e.customerName},</h2>
            <p>Fantastisch! Je bestelling is succesvol bezorgd. We hopen dat je tevreden bent met je aankoop.</p>
            
            <div class="review-section">
              <h3>💬 Laat een review achter</h3>
              <p>Help andere klanten door een review achter te laten voor je producten.</p>
              <a href="http://localhost:3000/orders/${e._id}" style="background: #FF6B6B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
                Review Schrijven
              </a>
            </div>
            
            <p>Bekijk je bestelling: <a href="http://localhost:3000/orders/${e._id}">Bekijk bestelling</a></p>
            
            <div class="footer">
              <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
              <p>Voor vragen kun je contact opnemen via: support@pulsebuy.nl</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `}),welcomeEmail:e=>({subject:"Welkom bij PulseBuy! \uD83C\uDF89",html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welkom bij PulseBuy</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .welcome-section { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welkom bij PulseBuy!</h1>
            <p>De beste tech en lifestyle producten</p>
          </div>
          <div class="content">
            <h2>Hallo ${e.firstName},</h2>
            <p>Welkom bij PulseBuy! We zijn blij dat je je bij ons hebt aangesloten.</p>
            
            <div class="welcome-section">
              <h3>🚀 Wat kun je verwachten?</h3>
              <ul style="text-align: left; display: inline-block;">
                <li>De nieuwste tech en lifestyle producten</li>
                <li>Snelle en gratis verzending</li>
                <li>Uitstekende klantenservice</li>
                <li>Exclusieve deals en aanbiedingen</li>
              </ul>
            </div>
            
            <p>Begin met winkelen: <a href="http://localhost:3000/products">Bekijk onze producten</a></p>
            
            <div class="footer">
              <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
              <p>Voor vragen kun je contact opnemen via: support@pulsebuy.nl</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `})},s={async sendEmail(e,t,i){try{let n=a(),r={from:`"PulseBuy" <${process.env.SMTP_USER}>`,to:e,subject:t,html:i},o=await n.sendMail(r);return console.log("Email sent successfully:",o.messageId),{success:!0,messageId:o.messageId}}catch(e){return console.error("Error sending email:",e),{success:!1,error:e.message}}},async sendOrderConfirmation(e){let t=o.orderConfirmation(e);return await this.sendEmail(e.customerEmail,t.subject,t.html)},async sendOrderShipped(e){let t=o.orderShipped(e);return await this.sendEmail(e.customerEmail,t.subject,t.html)},async sendOrderDelivered(e){let t=o.orderDelivered(e);return await this.sendEmail(e.customerEmail,t.subject,t.html)},async sendWelcomeEmail(e){let t=o.welcomeEmail(e);return await this.sendEmail(e.email,t.subject,t.html)}}}};