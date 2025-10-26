'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from '../components/AddToCartButton'
import { useCart } from '../context/CartContext'
import { Star, ShoppingCart, Heart, Eye, Filter, Grid, List, ChevronDown, TrendingUp, Search, ArrowLeft } from 'lucide-react'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: Array<{ url: string; alt: string }>
  category: string
  subcategory?: string
  rating?: number
  reviews?: number
  isTrending?: boolean
  isFeatured?: boolean
  stock: number
  brand?: string
  tags?: string[]
  averageRating?: number
  totalReviews?: number
  createdAt: Date
  updatedAt: Date
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { state: cartState } = useCart()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // Haal producten op van de database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products for products page...')
        const response = await fetch('/api/products')
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Products data:', data)
        
        if (data.success && data.products) {
          setProducts(data.products)
        } else {
          console.error('No products found in response:', data)
          setProducts([])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter en sorteer producten
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || 
                             product.category === selectedCategory ||
                             product.subcategory === selectedCategory
      
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max
      
      return matchesSearch && matchesCategory && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0)
        case 'trending':
          return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0)
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  // Unieke categorieën voor filter
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Producten laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-black mb-4">Alle Producten</h1>
            <p className="text-xl text-purple-100 mb-8">
              Ontdek onze complete collectie van premium tech en lifestyle producten
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-purple-100">{filteredProducts.length} producten beschikbaar</span>
              </div>
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
                <span className="text-purple-100 ml-2">4.8/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Header */}
      <div className="bg-white shadow-lg border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {filteredProducts.length} van {products.length} producten
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Zoeken</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Zoek producten..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Alle Categorieën</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Prijs Range</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sorteren op</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="newest">Nieuwste eerst</option>
                  <option value="price-low">Prijs: Laag naar Hoog</option>
                  <option value="price-high">Prijs: Hoog naar Laag</option>
                  <option value="rating">Hoogste Rating</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Geen producten gevonden</h3>
                <p className="text-gray-600">Probeer je zoektermen aan te passen of filters te wijzigen.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProducts.map((product) => (
                  <div key={product._id} className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group ${viewMode === 'list' ? 'flex' : ''}`}>
                    {/* Product Image */}
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 h-64' : 'h-64'}`}>
                      {product.images && product.images.length > 0 && (
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.isTrending && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            🔥 TRENDING
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            ⭐ FEATURED
                          </span>
                        )}
                      </div>

                      {/* Stock Indicator */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                          {product.stock > 50 ? (
                            <span className="text-green-600">✓ Op voorraad</span>
                          ) : product.stock > 10 ? (
                            <span className="text-orange-600">⚠ Laag voorraad</span>
                          ) : (
                            <span className="text-red-600">❌ Bijna uitverkocht</span>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
                          <Heart className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        {product.brand && (
                          <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                        )}
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.floor(product.averageRating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {product.averageRating || 0} ({product.totalReviews || 0} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            €{product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-lg text-gray-500 line-through">
                              €{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <AddToCartButton 
                        productId={product._id}
                        productName={product.name}
                        price={product.price}
                        image={product.images[0]?.url || "https://via.placeholder.com/400x400"}
                        maxStock={product.stock}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}