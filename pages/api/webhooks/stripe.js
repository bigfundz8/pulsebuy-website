import Stripe from 'stripe'
import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

// Stripe Webhook voor automatische order updates
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  await connectDB()

  try {
    const sig = req.headers['stripe-signature']
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
    } catch (err) {
      console.error('❌ Webhook signature verificatie gefaald:', err.message)
      return res.status(400).json({ message: 'Webhook signature verificatie gefaald' })
    }

    console.log('🔔 Stripe webhook ontvangen:', event.type)

    // Handle verschillende Stripe events
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object)
        break

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object)
        break

      case 'payment_intent.requires_action':
        await handlePaymentRequiresAction(event.data.object)
        break

      default:
        console.log(`⚠️ Onbekend event type: ${event.type}`)
    }

    res.status(200).json({ received: true })

  } catch (error) {
    console.error('❌ Webhook verwerking fout:', error)
    res.status(500).json({ message: 'Webhook verwerking gefaald' })
  }
}

// Functie 1: Betaling succesvol
async function handlePaymentSuccess(paymentIntent) {
  console.log('✅ Betaling succesvol:', paymentIntent.id)
  
  try {
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id })
    
    if (order) {
      await Order.findByIdAndUpdate(order._id, {
        status: 'confirmed',
        paymentStatus: 'succeeded',
        paidAt: new Date(),
        lastUpdated: new Date()
      })

      console.log('✅ Order bevestigd:', order.orderNumber)
      
      // Stuur bevestigingsemail naar klant
      await sendOrderConfirmationEmail(order)
      
      // Forward order naar leveranciers
      await forwardOrderToSuppliers(order)
      
    } else {
      console.error('❌ Order niet gevonden voor Payment Intent:', paymentIntent.id)
    }
  } catch (error) {
    console.error('❌ Fout bij verwerken succesvolle betaling:', error.message)
  }
}

// Functie 2: Betaling gefaald
async function handlePaymentFailed(paymentIntent) {
  console.log('❌ Betaling gefaald:', paymentIntent.id)
  
  try {
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id })
    
    if (order) {
      await Order.findByIdAndUpdate(order._id, {
        status: 'payment_failed',
        paymentStatus: 'failed',
        paymentFailureReason: paymentIntent.last_payment_error?.message,
        lastUpdated: new Date()
      })

      console.log('❌ Order gemarkeerd als gefaald:', order.orderNumber)
      
      // Stuur email naar klant over gefaalde betaling
      await sendPaymentFailedEmail(order)
      
    } else {
      console.error('❌ Order niet gevonden voor gefaalde Payment Intent:', paymentIntent.id)
    }
  } catch (error) {
    console.error('❌ Fout bij verwerken gefaalde betaling:', error.message)
  }
}

// Functie 3: Betaling geannuleerd
async function handlePaymentCanceled(paymentIntent) {
  console.log('🚫 Betaling geannuleerd:', paymentIntent.id)
  
  try {
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id })
    
    if (order) {
      await Order.findByIdAndUpdate(order._id, {
        status: 'cancelled',
        paymentStatus: 'canceled',
        cancelledAt: new Date(),
        lastUpdated: new Date()
      })

      console.log('🚫 Order geannuleerd:', order.orderNumber)
      
    } else {
      console.error('❌ Order niet gevonden voor geannuleerde Payment Intent:', paymentIntent.id)
    }
  } catch (error) {
    console.error('❌ Fout bij verwerken geannuleerde betaling:', error.message)
  }
}

// Functie 4: Betaling vereist actie
async function handlePaymentRequiresAction(paymentIntent) {
  console.log('⚠️ Betaling vereist actie:', paymentIntent.id)
  
  try {
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id })
    
    if (order) {
      await Order.findByIdAndUpdate(order._id, {
        status: 'requires_action',
        paymentStatus: 'requires_action',
        lastUpdated: new Date()
      })

      console.log('⚠️ Order vereist actie:', order.orderNumber)
      
    } else {
      console.error('❌ Order niet gevonden voor Payment Intent die actie vereist:', paymentIntent.id)
    }
  } catch (error) {
    console.error('❌ Fout bij verwerken Payment Intent die actie vereist:', error.message)
  }
}

// Helper functie: Stuur order bevestigingsemail
async function sendOrderConfirmationEmail(order) {
  console.log('📧 Order bevestigingsemail verzenden voor:', order.orderNumber)
  
  // Deze functie gebruikt je bestaande email service
  try {
    const { sendOrderConfirmationEmail } = await import('../../../lib/emailService')
    await sendOrderConfirmationEmail(order)
    console.log('✅ Order bevestigingsemail verzonden')
  } catch (error) {
    console.error('❌ Fout bij verzenden order bevestigingsemail:', error.message)
  }
}

// Helper functie: Forward order naar leveranciers
async function forwardOrderToSuppliers(order) {
  console.log('📦 Order doorsturen naar leveranciers voor:', order.orderNumber)
  
  try {
    // Gebruik je bestaande order forwarding API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/automation/auto-order-forwarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CRON_API_KEY
      },
      body: JSON.stringify({ orderId: order._id })
    })
    
    if (response.ok) {
      console.log('✅ Order doorgestuurd naar leveranciers')
    } else {
      console.error('❌ Fout bij doorsturen order naar leveranciers')
    }
  } catch (error) {
    console.error('❌ Fout bij order forwarding:', error.message)
  }
}

// Helper functie: Stuur gefaalde betaling email
async function sendPaymentFailedEmail(order) {
  console.log('📧 Gefaalde betaling email verzenden voor:', order.orderNumber)
  
  try {
    const nodemailer = await import('nodemailer')
    
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
      to: order.shippingAddress.email,
      subject: `⚠️ Betaling gefaald - Order #${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626;">⚠️ Betaling Gefaald</h1>
          <p>Hallo ${order.shippingAddress.firstName},</p>
          <p>Helaas is de betaling voor je bestelling #${order.orderNumber} gefaald.</p>
          <p><strong>Reden:</strong> ${order.paymentFailureReason || 'Onbekend'}</p>
          <p>Je kunt je bestelling opnieuw proberen te betalen via de volgende link:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/checkout?retry=${order.orderNumber}" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Opnieuw Betalen
          </a>
          <p>Als je vragen hebt, neem dan contact met ons op.</p>
          <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
        </div>
      `
    }

    await transporter.sendMail(emailContent)
    console.log('✅ Gefaalde betaling email verzonden')
  } catch (error) {
    console.error('❌ Fout bij verzenden gefaalde betaling email:', error.message)
  }
}
