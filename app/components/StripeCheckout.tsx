'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react'

// Stripe configuratie
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

// StripeCheckoutForm component
function StripeCheckoutForm({ orderData, onSuccess, onError, isTestMode = false }) {
  const stripe = !isTestMode ? useStripe() : null
  const elements = !isTestMode ? useElements() : null
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('ideal')
  const [selectedBank, setSelectedBank] = useState('ing')

  const handlePayment = async () => {
    console.log('🚀 handlePayment called')
    console.log('🚀 isTestMode:', isTestMode)
    console.log('🚀 stripePublishableKey:', stripePublishableKey)
    
    setIsProcessing(true)
    setError(null)

    try {
      console.log('💳 Starting payment process...')
      console.log('📊 Order data:', orderData)
      console.log('🏦 Selected bank:', selectedBank)
      console.log('💳 Payment method:', paymentMethod)

      // Check of we in test mode zijn (geen echte Stripe key)
      if (isTestMode || !stripePublishableKey || stripePublishableKey === 'pk_test_placeholder') {
        console.log('🧪 Test mode: Simuleer succesvolle betaling')
        
        // Simuleer een succesvolle betaling
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        console.log('✅ Test payment successful')
        setSuccess(true)
        onSuccess?.({ id: 'test_payment_' + Date.now() })
        return
      }

      // Echte Stripe betaling
      if (!stripe || !elements) {
        throw new Error('Stripe niet geladen')
      }

      console.log('💳 Creating payment intent...')
      
      // Maak Payment Intent aan
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderData.items,
          shippingAddress: orderData.shippingAddress,
          totalAmount: orderData.totalAmount,
          paymentMethod: paymentMethod,
          selectedBank: selectedBank
        }),
      })

      const result = await response.json()
      console.log('💳 Payment intent response:', result)

      if (!result.success) {
        throw new Error(result.error || 'Payment Intent kon niet worden aangemaakt')
      }

      const { clientSecret } = result.data
      console.log('💳 Client secret:', clientSecret)

      // Bevestig de betaling
      let confirmResult
      if (paymentMethod === 'ideal') {
        confirmResult = await stripe.confirmIdealPayment(clientSecret, {
          payment_method: {
            ideal: {
              bank: selectedBank,
            },
          },
          return_url: `${window.location.origin}/checkout/success`,
        })
      } else {
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) {
          throw new Error('Card element niet gevonden')
        }

        confirmResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        })
      }

      console.log('💳 Confirm result:', confirmResult)

      if (confirmResult.error) {
        throw new Error(confirmResult.error.message)
      }

      if (confirmResult.paymentIntent.status === 'succeeded') {
        console.log('✅ Payment successful')
        setSuccess(true)
        onSuccess?.(confirmResult.paymentIntent)
      } else {
        throw new Error('Betaling niet voltooid')
      }

    } catch (error) {
      console.error('❌ Payment error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Onbekende fout'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Betaling succesvol!</h3>
        <p className="text-gray-600">Je bestelling is bevestigd en wordt verwerkt.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Betaalmethode</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="ideal"
              checked={paymentMethod === 'ideal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span className="font-medium">iDEAL</span>
            </div>
          </label>
          
          <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Creditcard</span>
            </div>
          </label>
        </div>
      </div>

      {/* iDEAL Bank Selection */}
      {paymentMethod === 'ideal' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecteer je bank</h3>
          <div className="grid grid-cols-2 gap-3">
            {['ing', 'abn', 'rabobank', 'sns', 'asn', 'bunq'].map((bank) => (
              <label key={bank} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="bank"
                  value={bank}
                  checked={selectedBank === bank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="font-medium capitalize">{bank}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Credit Card Form */}
      {paymentMethod === 'card' && !isTestMode && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Creditcard gegevens</h3>
          <div className="p-4 border rounded-lg bg-gray-50">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Test Mode Notice for Credit Card */}
      {paymentMethod === 'card' && isTestMode && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-800 font-medium">Test Mode</span>
            </div>
            <p className="text-yellow-700 mt-1">
              Creditcard betalingen worden gesimuleerd in test mode. Geen echte betalingen worden verwerkt.
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-800 font-medium">Betaling gefaald</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {/* Payment Button */}
      <div className="pt-6">
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-colors ${
            isProcessing
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Bezig met betalen...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Betaal €{orderData.totalAmount?.toFixed(2) || '0.00'}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}

// Hoofdcomponent
export default function StripeCheckout({ orderData, onSuccess, onError }) {
  console.log('🔍 StripeCheckout component loaded')
  console.log('🔍 Stripe publishable key:', stripePublishableKey)
  console.log('🔍 Order data:', orderData)
  
  // Als er geen Stripe key is, render gewoon de form zonder Elements wrapper
  if (!stripePublishableKey || stripePublishableKey === 'pk_test_placeholder') {
    console.log('🧪 Rendering in test mode')
    return <StripeCheckoutForm orderData={orderData} onSuccess={onSuccess} onError={onError} isTestMode={true} />
  }

  console.log('💳 Rendering in production mode')
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm orderData={orderData} onSuccess={onSuccess} onError={onError} isTestMode={false} />
    </Elements>
  )
}