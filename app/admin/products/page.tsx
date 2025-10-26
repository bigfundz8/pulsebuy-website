'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../../context/AuthContext'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  ArrowLeft,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: Array<{ url: string; alt: string }>
  category: string
  stock: number
  isTrending?: boolean
  isFeatured?: boolean
  createdAt: string
}

export default function AdminProducts() {
  const { state: authState } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (authState.isAuthenticated && authState.user?.role === 'admin') {
      fetchProducts()
    } else {
      setLoading(false)
    }
  }, [authState.isAuthenticated, authState.user, currentPage, categoryFilter])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/admin/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setTotalPages(data.pagination?.pages || 1)
      } else {
        setError('Fout bij ophalen producten')
      }
    } catch (error) {
      setError('Er is een fout opgetreden')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchProducts()
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      })

      if (response.ok) {
        // Refresh products
        fetchProducts()
      } else {
        setError('Fout bij verwijderen product')
      }
    } catch (error) {
      setError('Er is een fout opgetreden')
    }
  }

  const toggleProductStatus = async (productId: string, field: 'isTrending' | 'isFeatured') => {
    try {
      const product = products.find(p => p._id === productId)
      if (!product) return

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({ [field]: !product[field] })
      })

      if (response.ok) {
        // Refresh products
        fetchProducts()
      } else {
        setError('Fout bij bijwerken product')
      }
    } catch (error) {
      setError('Er is een fout opgetreden')
    }
  }

  if (!authState.isAuthenticated || authState.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Geen toegang</h1>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Terug naar home
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Producten Beheren</h1>
            </div>
            <Link
              href="/admin/products/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nieuw Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Zoek producten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Alle categorieën</option>
                <option value="Electronics">Electronics</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Fashion">Fashion</option>
                <option value="Sports">Sports</option>
                <option value="Beauty">Beauty</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Zoeken
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                <Image
                  src={product.images[0]?.url || 'https://via.placeholder.com/300x200'}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex space-x-1">
                  {product.isTrending && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      Trending
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  {product.stock < 10 && (
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Laag
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-lg font-bold text-gray-900">
                      €{product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        €{product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="h-4 w-4 mr-1" />
                    {product.stock}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 capitalize">
                    {product.category}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleProductStatus(product._id, 'isTrending')}
                      className={`p-1 rounded ${
                        product.isTrending 
                          ? 'bg-orange-100 text-orange-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      title="Toggle Trending"
                    >
                      <TrendingUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleProductStatus(product._id, 'isFeatured')}
                      className={`p-1 rounded ${
                        product.isFeatured 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      title="Toggle Featured"
                    >
                      <Package className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between">
                  <Link
                    href={`/admin/products/${product._id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow-sm">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Vorige
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Volgende
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Pagina <span className="font-medium">{currentPage}</span> van{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Vorige
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Volgende
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
