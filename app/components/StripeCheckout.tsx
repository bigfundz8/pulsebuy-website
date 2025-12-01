'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js'
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react'

// Stripe configuratie
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey).catch((error) => {
  console.error('❌ Stripe load error:', error)
  return null
}) : null

// StripeCheckoutForm component
function StripeCheckoutForm({ orderData, onSuccess, onError, isTestMode = false }) {
  const stripe = !isTestMode ? useStripe() : null
  const elements = !isTestMode ? useElements() : null
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('ideal')
  const [selectedBank, setSelectedBank] = useState('ing')
  const [paymentRequest, setPaymentRequest] = useState<any>(null)
  const [canUseApplePay, setCanUseApplePay] = useState(false)
  const [stripeReady, setStripeReady] = useState(false)

  // Check of Stripe correct is geladen
  useEffect(() => {
    if (isTestMode) {
      setStripeReady(true)
      return
    }

    if (stripe && elements) {
      console.log('✅ Stripe en Elements zijn geladen')
      setStripeReady(true)
      setError(null)
    } else {
      console.log('⏳ Wachten op Stripe...', { stripe: !!stripe, elements: !!elements })
      // Wacht even en check opnieuw
      const timer = setTimeout(() => {
        if (!stripe || !elements) {
          console.error('❌ Stripe kon niet worden geladen na 3 seconden')
          setError('Stripe kon niet worden geladen. Controleer je internetverbinding en probeer het opnieuw. Als het probleem aanhoudt, controleer of NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY correct is ingesteld.')
          setStripeReady(false)
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [stripe, elements, isTestMode])

  // Apple Pay / Payment Request tijdelijk uitgeschakeld
  // Wordt alleen gebruikt als Apple Pay is geactiveerd in Stripe Dashboard
  // Uncomment onderstaande code als Apple Pay is geactiveerd:
  /*
  useEffect(() => {
    if (isTestMode || !stripe || !orderData?.totalAmount) {
      return
    }

    const pr = stripe.paymentRequest({
      country: 'NL',
      currency: 'eur',
      total: {
        label: 'PulseBuy Bestelling',
        amount: Math.round((orderData.totalAmount || 0) * 100),
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
    })

    pr.canMakePayment().then((result: any) => {
      if (result) {
        setCanUseApplePay(true)
        setPaymentRequest(pr)
      }
    })

    pr.on('paymentmethod', async (ev: any) => {
      try {
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: orderData.items,
            shippingAddress: orderData.shippingAddress,
            totalAmount: orderData.totalAmount,
            paymentMethod: 'apple_pay',
          }),
        })

        const result = await response.json()
        if (!result.success) {
          ev.complete('fail')
          throw new Error(result.error || 'Payment Intent kon niet worden aangemaakt')
        }

        const { clientSecret } = result.data
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        )

        if (confirmError) {
          ev.complete('fail')
          setError(confirmError.message || 'Betaling gefaald')
          onError?.(confirmError.message || 'Betaling gefaald')
        } else {
          ev.complete('success')
          if (paymentIntent.status === 'succeeded') {
            setSuccess(true)
            onSuccess?.(paymentIntent)
          }
        }
      } catch (error: any) {
        ev.complete('fail')
        const errorMessage = error instanceof Error ? error.message : 'Onbekende fout'
        setError(errorMessage)
        onError?.(errorMessage)
      }
    })
  }, [stripe, orderData?.totalAmount, isTestMode, onSuccess, onError])
  */

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

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Payment intent API error:', response.status, errorText)
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('💳 Payment intent response:', result)

      if (!result.success) {
        console.error('❌ Payment intent failed:', result.error)
        throw new Error(result.error || result.message || 'Payment Intent kon niet worden aangemaakt')
      }

      if (!result.data || !result.data.clientSecret) {
        console.error('❌ No client secret in response:', result)
        throw new Error('Geen client secret ontvangen van de server')
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
      } else if (paymentMethod === 'apple_pay') {
        // Apple Pay is tijdelijk uitgeschakeld
        throw new Error('Apple Pay is momenteel niet beschikbaar')
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
      let errorMessage = 'Onbekende fout'
      
      if (error instanceof Error) {
        errorMessage = error.message
        // Verbeter error messages voor gebruiker
        if (errorMessage.includes('Load failed') || errorMessage.includes('Failed to load')) {
          errorMessage = 'Stripe kon niet worden geladen. Probeer de pagina te vernieuwen of controleer je internetverbinding.'
        } else if (errorMessage.includes('API error')) {
          errorMessage = 'Server error. Probeer het opnieuw of neem contact op met support.'
        } else if (errorMessage.includes('Stripe niet geladen')) {
          errorMessage = 'Stripe is nog niet geladen. Wacht even en probeer het opnieuw.'
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      console.error('❌ Final error message:', errorMessage)
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
      {/* Apple Pay Button (bovenaan als beschikbaar) */}
      {canUseApplePay && paymentRequest && !isTestMode && (
        <div className="mb-6">
          <div className="bg-black rounded-xl p-4">
            <PaymentRequestButtonElement
              options={{
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    theme: 'dark',
                    height: '48px',
                  },
                },
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">of</p>
          </div>
        </div>
      )}

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
          {!stripeReady ? (
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-600 text-sm">Stripe wordt geladen...</p>
                </div>
              </div>
            </div>
          ) : stripe && elements ? (
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
          ) : (
            <div className="p-4 border rounded-lg bg-red-50">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span>Stripe kon niet worden geladen. Probeer de pagina te vernieuwen.</span>
              </div>
            </div>
          )}
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
          disabled={isProcessing || (paymentMethod === 'card' && !isTestMode && (!stripeReady || !stripe || !elements))}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-colors ${
            isProcessing || (paymentMethod === 'card' && !isTestMode && (!stripeReady || !stripe || !elements))
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
  console.log('🔍 Stripe publishable key:', stripePublishableKey ? `${stripePublishableKey.substring(0, 20)}...` : 'NOT SET')
  console.log('🔍 Order data:', orderData)
  
  // Als er geen Stripe key is, render gewoon de form zonder Elements wrapper
  if (!stripePublishableKey || stripePublishableKey === 'pk_test_placeholder') {
    console.log('🧪 Rendering in test mode')
    return <StripeCheckoutForm orderData={orderData} onSuccess={onSuccess} onError={onError} isTestMode={true} />
  }

  // Check of stripePromise null is (als loadStripe is gefaald)
  if (!stripePromise) {
    console.error('❌ Stripe promise is null - Stripe kon niet worden geladen')
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-800 font-medium">Stripe kon niet worden geladen</span>
        </div>
        <p className="text-red-700 mt-1">
          Controleer of NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY correct is ingesteld in Railway.
        </p>
      </div>
    )
  }

  console.log('💳 Rendering in production mode')
  return (
    <Elements stripe={stripePromise} options={{ locale: 'nl' }}>
      <StripeCheckoutForm orderData={orderData} onSuccess={onSuccess} onError={onError} isTestMode={false} />
    </Elements>
  )
}