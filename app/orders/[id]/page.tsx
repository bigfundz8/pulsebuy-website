'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../../context/AuthContext'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Download } from 'lucide-react'

interface OrderItem {
  _id: string
  product: {
    _id: string
    name: string
    images: Array<{ url: string; alt: string }>
    price: number
    description: string
  }
  quantity: number
  price: number
  total: number
}

interface Order {
  _id: string
  orderNumber: string
  items: OrderItem[]
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment: {
    method: string
    status: 'pending' | 'paid' | 'failed' | 'refunded'
    amount: number
    transactionId?: string
  }
  shipping: {
    method: string
    cost: number
    trackingNumber?: string
    estimatedDelivery?: string
    actualDelivery?: string
  }
  shippingAddress: {
    firstName: string
    lastName: string
    street: string
    city: string
    postalCode: string
    country: string
    phone?: string
  }
  billingAddress: {
    firstName: string
    lastName: string
    street: string
    city: string
    postalCode: string
    country: string
  }
  totals: {
    subtotal: number
    shipping: number
    tax: number
    total: number
  }
  createdAt: string
  updatedAt: string
}

interface OrderDetailProps {
  params: {
    id: string
  }
}

export default function OrderDetail({ params }: OrderDetailProps) {
  const { state: authState } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchOrder()
    } else {
      setLoading(false)
    }
  }, [authState.isAuthenticated, params.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else if (response.status === 404) {
        setError('Bestelling niet gevonden')
      } else {
        setError('Fout bij ophalen bestelling')
      }
    } catch (error) {
      setError('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />
      case 'confirmed': return <CheckCircle className="h-5 w-5" />
      case 'processing': return <Package className="h-5 w-5" />
      case 'shipped': return <Truck className="h-5 w-5" />
      case 'delivered': return <CheckCircle className="h-5 w-5" />
      case 'cancelled': return <Clock className="h-5 w-5" />
      default: return <Clock className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'In behandeling'
      case 'confirmed': return 'Bevestigd'
      case 'processing': return 'Wordt verwerkt'
      case 'shipped': return 'Verzonden'
      case 'delivered': return 'Bezorgd'
      case 'cancelled': return 'Geannuleerd'
      default: return status
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'In behandeling'
      case 'paid': return 'Betaald'
      case 'failed': return 'Mislukt'
      case 'refunded': return 'Terugbetaald'
      default: return status
    }
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Niet ingelogd</h1>
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Inloggen
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Bestelling niet gevonden'}
          </h1>
          <Link
            href="/orders"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Terug naar bestellingen
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link
            href="/orders"
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Terug naar bestellingen
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Bestelling #{order.orderNumber}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bestelling Status</h2>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {getStatusText(order.status)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.status === 'shipped' && order.shipping.trackingNumber
                      ? `Tracking: ${order.shipping.trackingNumber}`
                      : `Geplaatst op ${new Date(order.createdAt).toLocaleDateString('nl-NL')}`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bestelde Producten</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <Image
                      src={item.product.images[0]?.url || 'https://via.placeholder.com/100x100'}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.product.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Aantal: {item.quantity} × €{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        €{item.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Verzendadres
              </h2>
              <div className="text-gray-700">
                <p className="font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.postalCode} {order.shippingAddress.city}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="mt-2">Tel: {order.shippingAddress.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bestelling Overzicht</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotaal</span>
                  <span className="text-gray-900">€{order.totals.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Verzending</span>
                  <span className="text-gray-900">€{order.shipping.cost.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">BTW (21%)</span>
                  <span className="text-gray-900">€{order.totals.tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Totaal</span>
                    <span className="text-gray-900">€{order.totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Betaling
                </h3>
                <p className="text-sm text-gray-600">
                  Methode: {order.payment.method}
                </p>
                <p className="text-sm text-gray-600">
                  Status: {getPaymentStatusText(order.payment.status)}
                </p>
                {order.payment.transactionId && (
                  <p className="text-sm text-gray-600">
                    Transactie: {order.payment.transactionId}
                  </p>
                )}
              </div>

              {/* Shipping Info */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Verzending
                </h3>
                <p className="text-sm text-gray-600">
                  Methode: {order.shipping.method}
                </p>
                {order.shipping.estimatedDelivery && (
                  <p className="text-sm text-gray-600">
                    Geschatte levering: {new Date(order.shipping.estimatedDelivery).toLocaleDateString('nl-NL')}
                  </p>
                )}
                {order.shipping.actualDelivery && (
                  <p className="text-sm text-gray-600">
                    Bezorgd op: {new Date(order.shipping.actualDelivery).toLocaleDateString('nl-NL')}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Factuur Downloaden
                </button>
                
                {order.shipping.trackingNumber && (
                  <button className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                    Tracking Bekijken
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
