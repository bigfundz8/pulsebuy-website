'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, Heart, Eye, Filter, Grid, List, ChevronDown } from 'lucide-react'

export default function Products() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Alle Producten' },
    { id: 'electronics', name: 'Elektronica' },
    { id: 'fashion', name: 'Mode' },
    { id: 'home', name: 'Huis & Tuin' },
    { id: 'sports', name: 'Sport & Fitness' },
    { id: 'beauty', name: 'Beauty & Verzorging' }
  ]

  const products = [
    {
      id: 1,
      name: "Smart Fitness Tracker",
      price: 89.99,
      originalPrice: 129.99,
      image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 124,
      category: 'electronics',
      badge: "Bestseller",
      description: "Geavanceerde fitness tracker met hartslagmeter en GPS"
    },
    {
      id: 2,
      name: "Wireless Bluetooth Headphones",
      price: 59.99,
      originalPrice: 89.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 89,
      category: 'electronics',
      badge: "Nieuw",
      description: "Premium geluidskwaliteit met noise cancellation"
    },
    {
      id: 3,
      name: "Portable Phone Charger",
      price: 29.99,
      originalPrice: 49.99,
      image: "https://images.unsplash.com/photo-1609592807900-4b4b4b4b4b4b?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 156,
      category: 'electronics',
      badge: "Sale",
      description: "Snelle draadloze oplader voor alle smartphones"
    },
    {
      id: 4,
      name: "Smart Watch Series 8",
      price: 199.99,
      originalPrice: 299.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 203,
      category: 'electronics',
      badge: "Premium",
      description: "De nieuwste smartwatch met geavanceerde gezondheidsmonitoring"
    },
    {
      id: 5,
      name: "Designer T-Shirt",
      price: 24.99,
      originalPrice: 39.99,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      rating: 4.5,
      reviews: 67,
      category: 'fashion',
      badge: "Trending",
      description: "Comfortabele katoenen t-shirt in moderne designs"
    },
    {
      id: 6,
      name: "Yoga Mat Premium",
      price: 34.99,
      originalPrice: 49.99,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 98,
      category: 'sports',
      badge: "Bestseller",
      description: "Anti-slip yoga mat van hoogwaardig materiaal"
    }
  ]

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    return categoryMatch && priceMatch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Onze Producten</h1>
              <p className="text-gray-600 mt-2">
                Ontdek onze uitgebreide collectie van kwaliteitsproducten
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} producten gevonden
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categorie</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Prijsbereik</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    €{priceRange[0]} - €{priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Sorteren op</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="popular">Populair</option>
                  <option value="price-low">Prijs: Laag naar Hoog</option>
                  <option value="price-high">Prijs: Hoog naar Laag</option>
                  <option value="rating">Beoordeling</option>
                  <option value="newest">Nieuwste</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${
                        viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${
                        viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Pagina 1 van 1
                </div>
              </div>
            </div>

            {/* Products */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <div key={product.id} className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}>
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' ? 'w-1/3 h-48' : 'h-64'
                  }`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {product.badge}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex flex-col space-y-2">
                        <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                          <Heart className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                          <Eye className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {viewMode === 'list' && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary-600">
                          €{product.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          €{product.originalPrice}
                        </span>
                      </div>
                      <button className="btn-primary flex items-center space-x-2 text-sm px-4 py-2">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Toevoegen</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                  Vorige
                </button>
                <button className="px-3 py-2 bg-primary-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                  Volgende
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
