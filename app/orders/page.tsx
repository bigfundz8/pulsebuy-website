'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../context/AuthContext'
import { Package, Search, Filter, ArrowRight, Eye, Download } from 'lucide-react'

interface OrderItem {
  _id: string
  product: {
    _id: string
    name: string
    images: Array<{ url: string; alt: string }>
    price: number
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
  }
  shipping: {
    method: string
    cost: number
    trackingNumber?: string
    estimatedDelivery?: string
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

export default function Orders() {
  const { state: authState } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [authState.isAuthenticated])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        setError('Fout bij ophalen bestellingen')
      }
    } catch (error) {
      setError('Er is een fout opgetreden')
    } finally {
      setLoading(false)
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Niet ingelogd</h1>
          <p className="text-gray-600 mb-6">Je moet ingelogd zijn om je bestellingen te bekijken</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mijn Bestellingen</h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Terug naar home
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek op bestelnummer of product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Alle statussen</option>
                <option value="pending">In behandeling</option>
                <option value="confirmed">Bevestigd</option>
                <option value="processing">Wordt verwerkt</option>
                <option value="shipped">Verzonden</option>
                <option value="delivered">Bezorgd</option>
                <option value="cancelled">Geannuleerd</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {searchTerm || statusFilter !== 'all' ? 'Geen bestellingen gevonden' : 'Nog geen bestellingen'}
            </h2>
            <p className="text-gray-600 mb-8">
              {searchTerm || statusFilter !== 'all' 
                ? 'Probeer andere zoektermen of filters' 
                : 'Je hebt nog geen bestellingen geplaatst. Begin met winkelen!'
              }
            </p>
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center"
            >
              Begin met winkelen
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Bestelling #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Geplaatst op {new Date(order.createdAt).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        €{order.totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4">
                        <Image
                          src={item.product.images[0]?.url || 'https://via.placeholder.com/100x100'}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Aantal: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            €{item.price.toFixed(2)} per stuk
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            €{item.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                      <p>Betaalmethode: {order.payment.method}</p>
                      <p>Status: {getPaymentStatusText(order.payment.status)}</p>
                      {order.shipping.trackingNumber && (
                        <p>Tracking: {order.shipping.trackingNumber}</p>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        href={`/orders/${order._id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Link>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-2" />
                        Factuur
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
