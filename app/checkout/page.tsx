'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import StripeCheckout from '../components/StripeCheckout'
import { ArrowLeft, CreditCard, Lock, CheckCircle, Shield, Truck, RotateCcw } from 'lucide-react'

interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  phone: string
  street: string
  city: string
  postalCode: string
  country: string
  sameAsBilling: boolean
  billingFirstName: string
  billingLastName: string
  billingStreet: string
  billingCity: string
  billingPostalCode: string
  billingCountry: string
  paymentMethod: 'stripe' | 'ideal'
  termsAccepted: boolean
}

interface CheckoutErrors {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  street?: string
  city?: string
  postalCode?: string
  country?: string
  sameAsBilling?: string
  billingFirstName?: string
  billingLastName?: string
  billingStreet?: string
  billingCity?: string
  billingPostalCode?: string
  billingCountry?: string
  paymentMethod?: string
  termsAccepted?: string
}

function CheckoutContent() {
  const { state: cartState, clearCart } = useCart()
  const { state: authState } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPayment, setShowPayment] = useState(true) // DEBUG: Always show payment
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Nederland',
    sameAsBilling: true,
    billingFirstName: '',
    billingLastName: '',
    billingStreet: '',
    billingCity: '',
    billingPostalCode: '',
    billingCountry: 'Nederland',
    paymentMethod: 'stripe',
    termsAccepted: false
  })

  const [errors, setErrors] = useState<CheckoutErrors>({})

  // Test mode: Gebruik hardcoded product voor testing
  const testCartItems = [
    {
      productId: "68fbaff6bcefbe68097f111d",
      name: "Smart Fitness Ring Tracker",
      price: 39.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=800&auto=format&fit=crop",
      maxStock: 15
    }
  ]

  // Check if cart is empty (gebruik test items als cart leeg is)
  const displayItems = cartState.items.length > 0 ? cartState.items : testCartItems

  // Bereken totaalbedrag inclusief BTW
  const subtotal = displayItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const taxRate = 0.21 // 21% BTW voor Nederland
  const taxAmount = subtotal * taxRate
  const totalAmount = subtotal + taxAmount

  useEffect(() => {
    if (cartState.items.length === 0) {
      router.push('/cart')
    }
  }, [cartState.items.length, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name as keyof CheckoutErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = () => {
    const newErrors: CheckoutErrors = {}

    if (!formData.email) newErrors.email = 'Email is verplicht'
    if (!formData.firstName) newErrors.firstName = 'Voornaam is verplicht'
    if (!formData.lastName) newErrors.lastName = 'Achternaam is verplicht'
    if (!formData.phone) newErrors.phone = 'Telefoonnummer is verplicht'
    if (!formData.street) newErrors.street = 'Straat is verplicht'
    if (!formData.city) newErrors.city = 'Stad is verplicht'
    if (!formData.postalCode) newErrors.postalCode = 'Postcode is verplicht'
    if (!formData.termsAccepted) newErrors.termsAccepted = 'Je moet de voorwaarden accepteren'

    if (!formData.sameAsBilling) {
      if (!formData.billingFirstName) newErrors.billingFirstName = 'Factuur voornaam is verplicht'
      if (!formData.billingLastName) newErrors.billingLastName = 'Factuur achternaam is verplicht'
      if (!formData.billingStreet) newErrors.billingStreet = 'Factuur straat is verplicht'
      if (!formData.billingCity) newErrors.billingCity = 'Factuur stad is verplicht'
      if (!formData.billingPostalCode) newErrors.billingPostalCode = 'Factuur postcode is verplicht'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePaymentSuccess = (orderNumber: string) => {
    clearCart()
    router.push(`/checkout/success?order=${orderNumber}`)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    setPaymentError(error)
    setShowErrorModal(true)
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Terug naar winkelwagen
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Afrekenen</h1>
          <p className="text-gray-600 mt-2">Voltooi je bestelling veilig en snel</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {!showPayment ? (
              <>
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contactgegevens</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="je@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{String(errors.email)}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefoonnummer *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="06-12345678"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{String(errors.phone)}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Verzendadres</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voornaam *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Jan"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{String(errors.firstName)}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Achternaam *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Jansen"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{String(errors.lastName)}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Straat en huisnummer *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.street ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Hoofdstraat 123"
                      />
                      {errors.street && <p className="text-red-500 text-sm mt-1">{String(errors.street)}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stad *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Amsterdam"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{String(errors.city)}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postcode *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.postalCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="1234 AB"
                      />
                      {errors.postalCode && <p className="text-red-500 text-sm mt-1">{String(errors.postalCode)}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Land *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Nederland">Nederland</option>
                        <option value="België">België</option>
                        <option value="Duitsland">Duitsland</option>
                        <option value="Frankrijk">Frankrijk</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      Ik accepteer de{' '}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                        algemene voorwaarden
                      </Link>{' '}
                      en{' '}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                        privacybeleid
                      </Link>
                    </label>
                  </div>
                  {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{String(errors.termsAccepted)}</p>}
                </div>

                {/* Continue to Payment Button */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <button
                    onClick={() => {
                      if (validateForm()) {
                        setShowPayment(true)
                      }
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Verder naar betaling
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Payment Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-6">
                    <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Betaling</h2>
                  </div>

                  <StripeCheckout
                    orderData={{
                      items: displayItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity
                      })),
                      shippingAddress: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        street: formData.street,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        country: formData.country,
                        phone: formData.phone,
                        email: formData.email
                      },
                      billingAddress: formData.sameAsBilling ? {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        street: formData.street,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        country: formData.country
                      } : {
                        firstName: formData.billingFirstName,
                        lastName: formData.billingLastName,
                        street: formData.billingStreet,
                        city: formData.billingCity,
                        postalCode: formData.billingPostalCode,
                        country: formData.billingCountry
                      },
                      paymentMethod: formData.paymentMethod,
                      userId: authState.user?._id,
                      totalAmount: totalAmount || 0
                    }}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>

                {/* Back Button */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <button
                    onClick={() => setShowPayment(false)}
                    className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Terug naar gegevens
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Besteloverzicht</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {displayItems.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">Aantal: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotaal</span>
                  <span>€{(subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>BTW (21%)</span>
                  <span>€{(taxAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Verzendkosten</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-200 pt-3">
                  <span>Totaal</span>
                  <span>€{(totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  <span>Veilig betalen met Stripe</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Gratis verzending</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <RotateCcw className="h-4 w-4 mr-2 text-purple-500" />
                  <span>30 dagen retourrecht</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Betaling gefaald</h3>
              <p className="text-gray-600 mb-6">
                {paymentError || 'Er is een onbekende fout opgetreden tijdens de betaling.'}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowErrorModal(false)
                    setPaymentError(null)
                    setShowPayment(false)
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Opnieuw proberen
                </button>
                <button
                  onClick={() => {
                    setShowErrorModal(false)
                    setPaymentError(null)
                    router.push('/cart')
                  }}
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Terug naar winkelwagen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default function Checkout() {
  return <CheckoutContent />
}
