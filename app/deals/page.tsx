import Link from 'next/link'
import { ArrowLeft, Star, Clock, Tag } from 'lucide-react'
import Image from 'next/image'

async function getDealsProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/products`, {
    cache: 'no-store'
  })
  
  if (!res.ok) {
    return []
  }
  
  const data = await res.json()
  return data.products || []
}

export default async function DealsPage() {
  const allProducts = await getDealsProducts()
  
  // Filter only products with discounts (originalPrice > price)
  const deals = allProducts
    .filter(product => product.originalPrice && product.price < product.originalPrice)
    .map(product => ({
      id: product._id,
      name: product.name,
      originalPrice: product.originalPrice,
      salePrice: product.price,
      discount: Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100),
      image: product.images?.[0]?.url || '',
      rating: product.averageRating || 4.5,
      reviews: product.totalReviews || 0,
      timeLeft: '4 dagen',
      category: product.category || 'Other'
    }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🔥 Mega Aanbiedingen</h1>
            <p className="text-xl text-red-100">
              Beperkte tijd - Tot 50% korting!
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar Home
          </Link>
        </div>

        {/* Urgency Banner */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center">
            <Clock className="h-6 w-6 text-red-500 mr-3" />
            <span className="text-red-700 font-bold text-lg">
              ⚡ Aanbiedingen eindigen binnenkort! Wees er snel bij!
            </span>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              {/* Discount Badge */}
              <div className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{deal.discount}%
                  </div>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {deal.timeLeft}
                  </div>
                </div>
                
                <div className="relative h-64 w-full">
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                    {deal.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {deal.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(deal.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {deal.rating} ({deal.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      €{deal.salePrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      €{deal.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-600 font-semibold">
                      Je bespaart €{(deal.originalPrice - deal.salePrice).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105">
                  🛒 Nu Kopen - Beperkte Voorraad!
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Mis Geen Aanbieding!</h2>
          <p className="text-xl text-purple-100 mb-6">
            Schrijf je in voor onze nieuwsbrief en krijg als eerste toegang tot exclusieve deals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Je email adres"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Inschrijven
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
