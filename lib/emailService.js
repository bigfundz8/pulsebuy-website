import nodemailer from 'nodemailer'

// Email transporter configuratie
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true voor 465, false voor andere poorten
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

// Email templates
export const emailTemplates = {
  orderConfirmation: (orderData) => ({
    subject: `Bestelling Bevestiging - ${orderData.orderNumber}`,
    html: `
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
            <h2>Hallo ${orderData.customerName},</h2>
            <p>Je bestelling is succesvol ontvangen en wordt zo snel mogelijk verwerkt.</p>
            
            <div class="order-details">
              <h3>Bestelling Details</h3>
              <p><strong>Bestelnummer:</strong> ${orderData.orderNumber}</p>
              <p><strong>Datum:</strong> ${new Date(orderData.createdAt).toLocaleDateString('nl-NL')}</p>
              <p><strong>Status:</strong> ${orderData.status}</p>
              
              <h4>Producten:</h4>
              ${orderData.items.map(item => `
                <div class="product-item">
                  <span>${item.product.name} (${item.quantity}x)</span>
                  <span>€${item.total.toFixed(2)}</span>
                </div>
              `).join('')}
              
              <div class="product-item total">
                <span>Totaal:</span>
                <span>€${orderData.totals.total.toFixed(2)}</span>
              </div>
            </div>
            
            <p>Je kunt je bestelling volgen via: <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderData._id}">Bekijk bestelling</a></p>
            
            <div class="footer">
              <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
              <p>Voor vragen kun je contact opnemen via: support@pulsebuy.nl</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderShipped: (orderData) => ({
    subject: `Je bestelling is verzonden! - ${orderData.orderNumber}`,
    html: `
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
            <p>Bestelling ${orderData.orderNumber} is verzonden</p>
          </div>
          <div class="content">
            <h2>Hallo ${orderData.customerName},</h2>
            <p>Geweldig nieuws! Je bestelling is verzonden en komt binnenkort aan.</p>
            
            <div class="tracking">
              <h3>Tracking Informatie</h3>
              <p><strong>Verzendmethode:</strong> ${orderData.shipping.method}</p>
              ${orderData.shipping.trackingNumber ? `
                <p><strong>Tracking nummer:</strong></p>
                <div class="tracking-number">${orderData.shipping.trackingNumber}</div>
              ` : ''}
              ${orderData.shipping.estimatedDelivery ? `
                <p><strong>Geschatte levering:</strong> ${new Date(orderData.shipping.estimatedDelivery).toLocaleDateString('nl-NL')}</p>
              ` : ''}
            </div>
            
            <p>Je kunt je bestelling volgen via: <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderData._id}">Bekijk bestelling</a></p>
            
            <div class="footer">
              <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
              <p>Voor vragen kun je contact opnemen via: support@pulsebuy.nl</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  orderDelivered: (orderData) => ({
    subject: `Je bestelling is bezorgd! - ${orderData.orderNumber}`,
    html: `
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
            <p>Je bestelling ${orderData.orderNumber} is succesvol bezorgd</p>
          </div>
          <div class="content">
            <h2>Hallo ${orderData.customerName},</h2>
            <p>Fantastisch! Je bestelling is succesvol bezorgd. We hopen dat je tevreden bent met je aankoop.</p>
            
            <div class="review-section">
              <h3>💬 Laat een review achter</h3>
              <p>Help andere klanten door een review achter te laten voor je producten.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderData._id}" style="background: #FF6B6B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
                Review Schrijven
              </a>
            </div>
            
            <p>Bekijk je bestelling: <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderData._id}">Bekijk bestelling</a></p>
            
            <div class="footer">
              <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
              <p>Voor vragen kun je contact opnemen via: support@pulsebuy.nl</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  welcomeEmail: (userData) => ({
    subject: 'Welkom bij PulseBuy! 🎉',
    html: `
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
            <h2>Hallo ${userData.firstName},</h2>
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
            
            <p>Begin met winkelen: <a href="${process.env.NEXT_PUBLIC_APP_URL}/products">Bekijk onze producten</a></p>
            
            <div class="footer">
              <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
              <p>Voor vragen kun je contact opnemen via: support@pulsebuy.nl</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  })
}

// Email service functies
export const emailService = {
  async sendEmail(to, subject, html) {
    try {
      const transporter = createTransporter()
      
      const mailOptions = {
        from: `"PulseBuy" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
      }

      const result = await transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', result.messageId)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error.message }
    }
  },

  async sendOrderConfirmation(orderData) {
    const template = emailTemplates.orderConfirmation(orderData)
    return await this.sendEmail(orderData.customerEmail, template.subject, template.html)
  },

  async sendOrderShipped(orderData) {
    const template = emailTemplates.orderShipped(orderData)
    return await this.sendEmail(orderData.customerEmail, template.subject, template.html)
  },

  async sendOrderDelivered(orderData) {
    const template = emailTemplates.orderDelivered(orderData)
    return await this.sendEmail(orderData.customerEmail, template.subject, template.html)
  },

  async sendWelcomeEmail(userData) {
    const template = emailTemplates.welcomeEmail(userData)
    return await this.sendEmail(userData.email, template.subject, template.html)
  }
}

export default emailService
