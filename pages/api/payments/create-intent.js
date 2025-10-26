import connectDB from '../../../lib/mongodb'
import Order from '../../../models/Order'
import Product from '../../../models/Product'
import User from '../../../models/User'

// Detecteer test mode op basis van Stripe key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// TEST_MODE = true als er geen key is, of als het een test key is
let TEST_MODE = !stripePublishableKey || stripePublishableKey.includes('pk_test_') || stripePublishableKey === 'pk_test_placeholder'

// Force production mode als er een live key is
if (stripePublishableKey && stripePublishableKey.includes('pk_live_')) {
  TEST_MODE = false
}

// Stripe Payment Intent API voor PulseBuy
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      const { 
        items, 
        shippingAddress, 
        billingAddress, 
        paymentMethod,
        userId,
        totalAmount: frontendTotalAmount,
        selectedBank
      } = req.body

      console.log('💳 Stripe Payment Intent aangemaakt voor:', shippingAddress?.firstName, shippingAddress?.lastName)
      console.log('📊 Request data:', {
        itemsCount: items?.length,
        paymentMethod,
        frontendTotalAmount,
        selectedBank,
        hasShippingAddress: !!shippingAddress,
        hasBillingAddress: !!billingAddress
      })

      // Valideer items
      if (!items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Geen items gevonden in de bestelling'
        })
      }

      // Bereken totaalbedrag
      let totalAmount = 0
      const orderItems = []

      for (const item of items) {
        const product = await Product.findById(item.productId)
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product niet gevonden: ${item.productId}`
          })
        }

        const itemTotal = product.price * item.quantity
        totalAmount += itemTotal

        orderItems.push({
          productId: product._id,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
          image: product.images?.[0]?.url,
          sku: product.sku
        })
      }

      // Gebruik totalAmount van frontend als beschikbaar, anders bereken zelf
      let finalTotal
      let taxAmount
      let shippingCost
      let subtotal
      
      if (frontendTotalAmount && frontendTotalAmount > 0) {
        // Gebruik totalAmount van frontend (inclusief BTW en shipping)
        finalTotal = frontendTotalAmount
        // Voor €15.72: subtotal ~€12.99, BTW ~€2.73, shipping gratis
        subtotal = Math.round(frontendTotalAmount * 0.83) // ~83% voor subtotal
        taxAmount = Math.round(frontendTotalAmount * 0.17) // ~17% voor BTW
        shippingCost = Math.max(0, frontendTotalAmount - subtotal - taxAmount) // rest voor shipping, min 0
      } else {
        // Fallback: bereken zelf
        const taxRate = 0.21
        taxAmount = totalAmount * taxRate
        shippingCost = totalAmount >= 50 ? 0 : 5.99
        subtotal = totalAmount
        finalTotal = subtotal + shippingCost + taxAmount
      }

      // Genereer ordernummer
      const orderNumber = `PB-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

      // Maak Stripe Payment Intent
      const paymentIntentOptions = {
        amount: Math.round(finalTotal * 100), // Stripe gebruikt centen
        currency: 'eur',
        payment_method_types: ['card'], // iDEAL tijdelijk uitgeschakeld totdat het is geactiveerd in Stripe dashboard
        metadata: {
          orderNumber: orderNumber,
          customerEmail: (shippingAddress.email && shippingAddress.email.trim()) || (billingAddress?.email && billingAddress.email.trim()) || 'guest@example.com',
          customerName: `${shippingAddress.firstName || 'Guest'} ${shippingAddress.lastName || 'User'}`,
          itemsCount: items.length.toString(),
          selectedBank: selectedBank || 'abn_amro'
        },
        description: `PulseBuy Order #${orderNumber}`,
        shipping: {
          name: `${shippingAddress.firstName || 'Guest'} ${shippingAddress.lastName || 'User'}`,
          address: {
            line1: shippingAddress.street || 'N/A',
            city: shippingAddress.city || 'N/A',
            postal_code: shippingAddress.postalCode || 'N/A',
            country: shippingAddress.country === 'Nederland' ? 'NL' : (shippingAddress.country || 'NL')
          },
          phone: shippingAddress.phone || 'N/A'
        }
      }

      // Note: Bank selectie wordt gedaan in de frontend bij confirmIdealPayment

      let paymentIntent

      if (TEST_MODE) {
        // Test mode: Simuleer Payment Intent zonder Stripe API call
        console.log('⚠️ Test mode actief - geen echte Stripe API call')
        
        const paymentIntentId = `pi_test_${Date.now()}`
        const secretPart = Math.random().toString(36).substring(2, 15)
        
        paymentIntent = {
          id: paymentIntentId,
          client_secret: `${paymentIntentId}_secret_${secretPart}`,
          status: 'requires_payment_method',
          amount: Math.round(finalTotal * 100), // Stripe gebruikt centen
          currency: 'eur'
        }
      } else {
        // Production mode: Maak echte Stripe Payment Intent
        console.log('💳 Production mode - maak echte Stripe Payment Intent')
        
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
        
        paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions)
      }

      // Maak order in database
      let orderUserId = userId
      
      // Als er geen userId is, zoek of maak een guest user
      if (!orderUserId) {
        // Gebruik fallback waarden voor lege strings
        const userEmail = (shippingAddress.email && shippingAddress.email.trim()) || `guest_${Date.now()}@example.com`
        const userFirstName = (shippingAddress.firstName && shippingAddress.firstName.trim()) || 'Guest'
        const userLastName = (shippingAddress.lastName && shippingAddress.lastName.trim()) || 'User'
        const userPhone = (shippingAddress.phone && shippingAddress.phone.trim()) || 'N/A'
        
        let guestUser = await User.findOne({ email: userEmail })
        
        if (!guestUser) {
          guestUser = new User({
            email: userEmail,
            firstName: userFirstName,
            lastName: userLastName,
            phone: userPhone,
            role: 'customer',
            password: 'guest_' + Date.now() // Temporary password for guest
          })
          await guestUser.save()
          console.log('👤 Nieuwe guest user aangemaakt:', guestUser.email)
        } else {
          console.log('👤 Bestaande user gevonden:', guestUser.email)
        }
        
        orderUserId = guestUser._id
      }

      const order = new Order({
        orderNumber: orderNumber,
        user: orderUserId,
        items: orderItems.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        shippingAddress: {
          firstName: (shippingAddress.firstName && shippingAddress.firstName.trim()) || 'Guest',
          lastName: (shippingAddress.lastName && shippingAddress.lastName.trim()) || 'User',
          street: (shippingAddress.street && shippingAddress.street.trim()) || 'N/A',
          city: (shippingAddress.city && shippingAddress.city.trim()) || 'N/A',
          postalCode: (shippingAddress.postalCode && shippingAddress.postalCode.trim()) || 'N/A',
          country: shippingAddress.country || 'Nederland',
          phone: (shippingAddress.phone && shippingAddress.phone.trim()) || 'N/A'
        },
        billingAddress: billingAddress ? {
          firstName: (billingAddress.firstName && billingAddress.firstName.trim()) || 'Guest',
          lastName: (billingAddress.lastName && billingAddress.lastName.trim()) || 'User',
          street: (billingAddress.street && billingAddress.street.trim()) || 'N/A',
          city: (billingAddress.city && billingAddress.city.trim()) || 'N/A',
          postalCode: (billingAddress.postalCode && billingAddress.postalCode.trim()) || 'N/A',
          country: billingAddress.country || 'Nederland'
        } : {
          firstName: (shippingAddress.firstName && shippingAddress.firstName.trim()) || 'Guest',
          lastName: (shippingAddress.lastName && shippingAddress.lastName.trim()) || 'User',
          street: (shippingAddress.street && shippingAddress.street.trim()) || 'N/A',
          city: (shippingAddress.city && shippingAddress.city.trim()) || 'N/A',
          postalCode: (shippingAddress.postalCode && shippingAddress.postalCode.trim()) || 'N/A',
          country: shippingAddress.country || 'Nederland'
        },
        totals: {
          subtotal: subtotal,
          shipping: shippingCost,
          tax: taxAmount,
          total: finalTotal
        },
        shipping: {
          method: 'standard',
          cost: shippingCost,
          estimatedDays: 3
        },
        payment: {
          method: paymentMethod,
          amount: finalTotal,
          status: 'pending'
        },
        paymentIntentId: paymentIntent.id,
        status: 'pending',
        stripePaymentIntent: paymentIntent.id
      })

      await order.save()

      console.log('✅ Order aangemaakt:', orderNumber, 'Payment Intent:', paymentIntent.id)

      res.status(200).json({
        success: true,
        message: 'Payment Intent succesvol aangemaakt',
        data: {
          orderNumber: orderNumber,
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          totalAmount: finalTotal,
          taxAmount: taxAmount,
          shippingCost: shippingCost,
          subtotal: subtotal,
          orderId: order._id
        }
      })

    } catch (error) {
      console.error('❌ Stripe Payment Intent fout:', error)
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        requestData: {
          itemsCount: req.body?.items?.length,
          paymentMethod: req.body?.paymentMethod,
          totalAmount: req.body?.totalAmount,
          hasShippingAddress: !!req.body?.shippingAddress
        }
      })
      res.status(500).json({
        success: false,
        message: 'Fout bij aanmaken Payment Intent',
        error: error.message
      })
    }
  } else if (req.method === 'PUT') {
    // Webhook voor Stripe events
    try {
      const { paymentIntentId, status } = req.body

      console.log('🔄 Stripe webhook ontvangen:', paymentIntentId, status)

      // Update order status
      const order = await Order.findOne({ paymentIntentId: paymentIntentId })
      if (order) {
        let newStatus = 'pending'
        
        switch (status) {
          case 'succeeded':
            newStatus = 'confirmed'
            break
          case 'requires_payment_method':
          case 'requires_confirmation':
            newStatus = 'pending'
            break
          case 'canceled':
            newStatus = 'cancelled'
            break
          default:
            newStatus = 'pending'
        }

        await Order.findByIdAndUpdate(order._id, {
          status: newStatus,
          paymentStatus: status,
          lastUpdated: new Date()
        })

        console.log('✅ Order status bijgewerkt:', order.orderNumber, '→', newStatus)

        res.status(200).json({
          success: true,
          message: 'Order status bijgewerkt',
          orderNumber: order.orderNumber,
          newStatus: newStatus
        })
      } else {
        res.status(404).json({
          success: false,
          message: 'Order niet gevonden'
        })
      }

    } catch (error) {
      console.error('❌ Webhook fout:', error)
      res.status(500).json({
        success: false,
        message: 'Webhook verwerking gefaald',
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['POST', 'PUT'])
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    })
  }
}