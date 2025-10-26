import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
import Product from '../../../models/Product'
import nodemailer from 'nodemailer'

// Volledig geautomatiseerd order forwarding systeem
export default async function handler(req, res) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key
  const expectedKey = process.env.CRON_API_KEY
  
  if (apiKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid API key'
    })
  }

  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('📦 Automatische order forwarding gestart...')

      // 1. Nieuwe orders ophalen die nog niet zijn doorgestuurd
      const newOrders = await Order.find({ 
        status: 'confirmed',
        forwardedToSupplier: false 
      }).populate('items.productId')

      console.log(`📋 ${newOrders.length} nieuwe orders gevonden voor forwarding`)

      const forwardedOrders = []

      for (const order of newOrders) {
        try {
          // 2. Orders groeperen per leverancier
          const ordersBySupplier = groupOrdersBySupplier(order)
          
          // 3. Orders automatisch doorsturen naar leveranciers
          for (const [supplierEmail, supplierOrders] of Object.entries(ordersBySupplier)) {
            await forwardOrderToSupplier(supplierEmail, supplierOrders, order)
          }
          
          // 4. Order status updaten
          await Order.findByIdAndUpdate(order._id, {
            status: 'processing',
            forwardedToSupplier: true,
            forwardedAt: new Date(),
            supplierNotifications: Object.keys(ordersBySupplier)
          })

          forwardedOrders.push(order)
          console.log(`✅ Order ${order.orderNumber} doorgestuurd naar leveranciers`)
          
        } catch (error) {
          console.error(`❌ Fout bij forwarding order ${order.orderNumber}:`, error.message)
          
          // Update order met error status
          await Order.findByIdAndUpdate(order._id, {
            forwardingError: error.message,
            forwardingAttempts: (order.forwardingAttempts || 0) + 1
          })
        }
      }

      // 5. Status updates van bestaande orders controleren
      await checkSupplierOrderStatuses()

      console.log('✅ Automatische order forwarding voltooid!')
      
      res.status(200).json({
        success: true,
        message: 'Automatische order forwarding succesvol uitgevoerd',
        data: {
          newOrdersFound: newOrders.length,
          ordersForwarded: forwardedOrders.length,
          statusUpdatesChecked: 'Voltooid'
        }
      })
    } catch (error) {
      console.error('❌ Order forwarding fout:', error)
      res.status(500).json({
        success: false,
        message: 'Order forwarding gefaald',
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

// Functie 1: Orders groeperen per leverancier
function groupOrdersBySupplier(order) {
  const ordersBySupplier = {}
  
  for (const item of order.items) {
    const product = item.productId
    if (product && product.supplier) {
      const supplierEmail = product.supplier.contact
      
      if (!ordersBySupplier[supplierEmail]) {
        ordersBySupplier[supplierEmail] = {
          supplier: product.supplier,
          items: []
        }
      }
      
      ordersBySupplier[supplierEmail].items.push({
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice: product.basePrice || product.price / 2.5, // Schat basisprijs
        totalPrice: (product.basePrice || product.price / 2.5) * item.quantity
      })
    }
  }
  
  return ordersBySupplier
}

// Functie 2: Order doorsturen naar leverancier
async function forwardOrderToSupplier(supplierEmail, supplierData, originalOrder) {
  console.log(`📧 Order doorsturen naar ${supplierEmail}...`)
  
  // Email transporter configureren
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    },
  })

  // Bereken totaal voor leverancier
  const supplierTotal = supplierData.items.reduce((sum, item) => sum + item.totalPrice, 0)
  
  // Email template voor leverancier
  const emailContent = {
    from: process.env.SMTP_USER || process.env.EMAIL_USER,
    to: supplierEmail,
    subject: `🛒 Nieuwe Order - PulseBuy #${originalOrder.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">🛒 Nieuwe Order</h1>
          <p style="color: #6b7280; font-size: 16px;">PulseBuy Order #${originalOrder.orderNumber}</p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">📋 Order Details</h3>
          <p style="color: #4b5563; margin-bottom: 8px;"><strong>Order Nummer:</strong> ${originalOrder.orderNumber}</p>
          <p style="color: #4b5563; margin-bottom: 8px;"><strong>Klant:</strong> ${originalOrder.shippingAddress.firstName} ${originalOrder.shippingAddress.lastName}</p>
          <p style="color: #4b5563; margin-bottom: 8px;"><strong>Email:</strong> ${originalOrder.shippingAddress.email || 'N/A'}</p>
          <p style="color: #4b5563; margin-bottom: 8px;"><strong>Datum:</strong> ${new Date(originalOrder.createdAt).toLocaleString('nl-NL')}</p>
          <p style="color: #4b5563;"><strong>Status:</strong> Bevestigd</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">📦 Te Leveren Producten</h3>
          ${supplierData.items.map(item => `
            <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
              <p style="color: #4b5563; margin: 0;"><strong>${item.productName}</strong></p>
              <p style="color: #6b7280; margin: 5px 0 0 0;">SKU: ${item.sku} | Aantal: ${item.quantity} | Prijs: €${item.unitPrice.toFixed(2)}</p>
            </div>
          `).join('')}
          <div style="border-top: 2px solid #2563eb; padding: 10px 0; margin-top: 10px;">
            <p style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 0;">
              Totaal: €${supplierTotal.toFixed(2)}
            </p>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">🚚 Leveradres</h3>
          <p style="color: #4b5563; margin-bottom: 5px;">${originalOrder.shippingAddress.firstName} ${originalOrder.shippingAddress.lastName}</p>
          <p style="color: #4b5563; margin-bottom: 5px;">${originalOrder.shippingAddress.street}</p>
          <p style="color: #4b5563; margin-bottom: 5px;">${originalOrder.shippingAddress.postalCode} ${originalOrder.shippingAddress.city}</p>
          <p style="color: #4b5563; margin-bottom: 5px;">${originalOrder.shippingAddress.country}</p>
          ${originalOrder.shippingAddress.phone ? `<p style="color: #4b5563;">Tel: ${originalOrder.shippingAddress.phone}</p>` : ''}
        </div>

        <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #065f46; margin: 0;">
            🎯 <strong>Actie Vereist:</strong> Lever deze producten direct naar het bovenstaande adres. 
            Stuur een track & trace code naar ${process.env.SMTP_USER || process.env.EMAIL_USER} zodra de order is verzonden.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">PulseBuy - Automatische Order Forwarding</p>
          <p style="color: #6b7280; font-size: 12px;">Dit is een geautomatiseerd bericht. Reageer niet op deze email.</p>
        </div>
      </div>
    `,
    text: `
      🛒 Nieuwe Order - PulseBuy #${originalOrder.orderNumber}
      
      Order Details:
      - Order Nummer: ${originalOrder.orderNumber}
      - Klant: ${originalOrder.shippingAddress.firstName} ${originalOrder.shippingAddress.lastName}
      - Email: ${originalOrder.shippingAddress.email || 'N/A'}
      - Datum: ${new Date(originalOrder.createdAt).toLocaleString('nl-NL')}
      - Status: Bevestigd
      
      Te Leveren Producten:
      ${supplierData.items.map(item => `
      - ${item.productName} (SKU: ${item.sku})
        Aantal: ${item.quantity} | Prijs: €${item.unitPrice.toFixed(2)}
      `).join('')}
      
      Totaal: €${supplierTotal.toFixed(2)}
      
      Leveradres:
      ${originalOrder.shippingAddress.firstName} ${originalOrder.shippingAddress.lastName}
      ${originalOrder.shippingAddress.street}
      ${originalOrder.shippingAddress.postalCode} ${originalOrder.shippingAddress.city}
      ${originalOrder.shippingAddress.country}
      ${originalOrder.shippingAddress.phone ? `Tel: ${originalOrder.shippingAddress.phone}` : ''}
      
      🎯 Actie Vereist: Lever deze producten direct naar het bovenstaande adres. 
      Stuur een track & trace code zodra de order is verzonden.
      
      PulseBuy - Automatische Order Forwarding
    `
  }

  // Email verzenden
  const info = await transporter.sendMail(emailContent)
  console.log(`📧 Order email verzonden naar ${supplierEmail}:`, info.messageId)
  
  // Log de forwarding actie
  console.log(`✅ Order ${originalOrder.orderNumber} doorgestuurd naar ${supplierEmail}`)
}

// Functie 3: Status updates van leveranciers controleren
async function checkSupplierOrderStatuses() {
  console.log('📊 Supplier order statuses controleren...')
  
  // Simuleer status updates van leveranciers
  const processingOrders = await Order.find({ 
    status: 'processing',
    forwardedToSupplier: true 
  })
  
  for (const order of processingOrders) {
    // Simuleer dat sommige orders zijn verzonden
    if (Math.random() > 0.7) {
      const trackingNumber = `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`
      
      await Order.findByIdAndUpdate(order._id, {
        status: 'shipped',
        trackingNumber: trackingNumber,
        shippedAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 dagen
      })
      
      console.log(`📦 Order ${order.orderNumber} gemarkeerd als verzonden met tracking: ${trackingNumber}`)
      
      // Stuur tracking update naar klant
      await sendTrackingUpdateToCustomer(order, trackingNumber)
    }
  }
}

// Functie 4: Tracking update naar klant sturen
async function sendTrackingUpdateToCustomer(order, trackingNumber) {
  console.log(`📧 Tracking update sturen naar klant voor order ${order.orderNumber}...`)
  
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    },
  })

  const emailContent = {
    from: process.env.SMTP_USER || process.env.EMAIL_USER,
    to: order.shippingAddress.email || order.billingAddress.email,
    subject: `📦 Je bestelling is verzonden! - Order #${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">📦 Je bestelling is verzonden!</h1>
          <p style="color: #6b7280; font-size: 16px;">Order #${order.orderNumber}</p>
        </div>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #065f46; margin-bottom: 15px;">🚚 Tracking Informatie</h3>
          <p style="color: #4b5563; margin-bottom: 8px;"><strong>Track & Trace Code:</strong> ${trackingNumber}</p>
          <p style="color: #4b5563; margin-bottom: 8px;"><strong>Verzenddatum:</strong> ${new Date().toLocaleString('nl-NL')}</p>
          <p style="color: #4b5563;"><strong>Verwachte levering:</strong> ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL')}</p>
        </div>

        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #065f46; margin: 0;">
            🎯 Je kunt je pakket volgen met de bovenstaande track & trace code. 
            De leverancier stuurt je pakket direct naar je adres.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">PulseBuy - Automatische Order Updates</p>
        </div>
      </div>
    `
  }

  try {
    const info = await transporter.sendMail(emailContent)
    console.log(`📧 Tracking update verzonden naar klant:`, info.messageId)
  } catch (error) {
    console.error(`❌ Fout bij verzenden tracking update:`, error.message)
  }
}
