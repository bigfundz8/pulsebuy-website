import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
import nodemailer from 'nodemailer'

// Customer Notifications API
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('📧 Customer notifications gestart...')

      const { orderNumber, notificationType } = req.body

      if (!orderNumber || !notificationType) {
        return res.status(400).json({
          success: false,
          message: 'Order nummer en notification type zijn verplicht'
        })
      }

      const order = await Order.findOne({ orderNumber })
        .populate('items.product')

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order niet gevonden'
        })
      }

      // Email transporter configuratie
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      })

      let emailSubject = ''
      let emailContent = ''

      switch (notificationType) {
        case 'order_confirmation':
          emailSubject = `Order Bevestiging - ${order.orderNumber}`
          emailContent = generateOrderConfirmationEmail(order)
          break

        case 'order_shipped':
          emailSubject = `Je bestelling is verzonden - ${order.orderNumber}`
          emailContent = generateOrderShippedEmail(order)
          break

        case 'order_delivered':
          emailSubject = `Je bestelling is bezorgd - ${order.orderNumber}`
          emailContent = generateOrderDeliveredEmail(order)
          break

        case 'tracking_update':
          emailSubject = `Tracking Update - ${order.orderNumber}`
          emailContent = generateTrackingUpdateEmail(order)
          break

        default:
          return res.status(400).json({
            success: false,
            message: 'Ongeldige notification type'
          })
      }

      // Verstuur email
      const mailOptions = {
        from: `"PulseBuy" <${process.env.SMTP_USER}>`,
        to: order.email,
        subject: emailSubject,
        html: emailContent
      }

      await transporter.sendMail(mailOptions)

      // Log notification
      order.trackingEvents.push({
        status: 'notification_sent',
        message: `${notificationType} email verzonden naar ${order.email}`,
        timestamp: new Date()
      })

      await order.save()

      console.log(`✅ ${notificationType} email verzonden naar ${order.email}`)

      res.status(200).json({
        success: true,
        message: 'Notification succesvol verzonden',
        data: {
          orderNumber: order.orderNumber,
          email: order.email,
          notificationType: notificationType,
          sentAt: new Date()
        }
      })

    } catch (error) {
      console.error('❌ Customer notification gefaald:', error)
      res.status(500).json({
        success: false,
        message: 'Customer notification gefaald',
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    })
  }
}

function generateOrderConfirmationEmail(order) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Bevestiging</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { border-bottom: 1px solid #e5e7eb; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; color: #2563eb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bedankt voor je bestelling!</h1>
          <p>Order: ${order.orderNumber}</p>
        </div>
        
        <div class="content">
          <p>Hallo ${order.shippingAddress.firstName},</p>
          <p>Bedankt voor je bestelling bij PulseBuy! We hebben je bestelling ontvangen en gaan er direct mee aan de slag.</p>
          
          <div class="order-details">
            <h3>📦 Je bestelling:</h3>
            ${order.items.map(item => `
              <div class="item">
                <strong>${item.product.name}</strong><br>
                Hoeveelheid: ${item.quantity}x<br>
                Prijs: €${item.price.toFixed(2)} per stuk<br>
                Totaal: €${item.total.toFixed(2)}
              </div>
            `).join('')}
            
            <div class="total">
              <p>Totaal: €${order.totals.total.toFixed(2)}</p>
            </div>
          </div>
          
          <h3>🚚 Verzending:</h3>
          <p><strong>Verzendadres:</strong><br>
          ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.postalCode} ${order.shippingAddress.city}<br>
          ${order.shippingAddress.country}</p>
          
          <p><strong>Verwachte levering:</strong> ${new Date(order.shipping.estimatedDelivery).toLocaleDateString('nl-NL')}</p>
          
          <p>Je ontvangt een email zodra je bestelling is verzonden met tracking informatie.</p>
        </div>
        
        <div class="footer">
          <p>Met vriendelijke groet,<br>Het PulseBuy team</p>
          <p>Heb je vragen? Neem contact met ons op via support@pulsebuy.com</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateOrderShippedEmail(order) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bestelling Verzonden</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .tracking { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #059669; }
        .footer { text-align: center; padding: 20px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚚 Je bestelling is onderweg!</h1>
          <p>Order: ${order.orderNumber}</p>
        </div>
        
        <div class="content">
          <p>Hallo ${order.shippingAddress.firstName},</p>
          <p>Geweldig nieuws! Je bestelling is verzonden en is onderweg naar je toe.</p>
          
          <div class="tracking">
            <h3>📦 Tracking Informatie:</h3>
            <p class="tracking-number">${order.shipping.trackingNumber || 'Wordt binnenkort beschikbaar'}</p>
            <p>Verwachte levering: ${new Date(order.shipping.estimatedDelivery).toLocaleDateString('nl-NL')}</p>
          </div>
          
          <p>Je kunt je bestelling volgen via de tracking code hierboven op de website van de vervoerder.</p>
        </div>
        
        <div class="footer">
          <p>Met vriendelijke groet,<br>Het PulseBuy team</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateOrderDeliveredEmail(order) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bestelling Bezorgd</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Je bestelling is bezorgd!</h1>
          <p>Order: ${order.orderNumber}</p>
        </div>
        
        <div class="content">
          <p>Hallo ${order.shippingAddress.firstName},</p>
          <p>Fantastisch! Je bestelling is succesvol bezorgd. We hopen dat je er veel plezier van hebt!</p>
          
          <p>Als je tevreden bent over je aankoop, zouden we het enorm waarderen als je een review achterlaat. Dit helpt andere klanten bij het maken van hun keuze.</p>
          
          <p>Heb je vragen over je bestelling of ben je niet tevreden? Neem gerust contact met ons op.</p>
        </div>
        
        <div class="footer">
          <p>Met vriendelijke groet,<br>Het PulseBuy team</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateTrackingUpdateEmail(order) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tracking Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Tracking Update</h1>
          <p>Order: ${order.orderNumber}</p>
        </div>
        
        <div class="content">
          <p>Hallo ${order.shippingAddress.firstName},</p>
          <p>Er is een update voor je bestelling beschikbaar.</p>
          
          <p><strong>Huidige status:</strong> ${order.status}</p>
          <p><strong>Tracking nummer:</strong> ${order.shipping.trackingNumber || 'Nog niet beschikbaar'}</p>
        </div>
        
        <div class="footer">
          <p>Met vriendelijke groet,<br>Het PulseBuy team</p>
        </div>
      </div>
    </body>
    </html>
  `
}
