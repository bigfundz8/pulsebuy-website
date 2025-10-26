import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star, Truck, Shield, RotateCcw, Heart, Zap, Award, Users } from 'lucide-react'
import AddToCartButton from './AddToCartButton'

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: Array<{ url: string; alt: string }>
  averageRating: number
  totalReviews: number
  stock: number
  isTrending?: boolean
  isFeatured?: boolean
  brand?: string
  tags?: string[]
}

interface HomeContentServerProps {
  products: Product[]
}

export default function HomeContentServer({ products }: HomeContentServerProps) {
  const trendingProducts = products?.filter(p => p.isTrending).slice(0, 6) || []
  const featuredProducts = products?.filter(p => p.isFeatured).slice(0, 6) || []

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Gymshark/Allbirds Style */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                    MODERNE
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                      TECH & LIFESTYLE
                    </span>
                    PRODUCTEN
                  </h1>
                  <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                    Ontdek de nieuwste innovaties in tech, beauty en lifestyle. 
                    Premium kwaliteit tegen onverslaanbare prijzen.
                  </p>
                </div>
                
                {/* Social Proof */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 border-2 border-white"></div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-300">+10.000 tevreden klanten</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="text-yellow-400 text-lg">★</span>
                    ))}
                    <span className="text-sm text-gray-300 ml-2">4.8/5 rating</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/products" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
                    SHOP NU
                  </Link>
                  <Link href="/products" className="border-2 border-white/30 hover:border-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-bold text-lg transition-all">
                    BEKIJK PRODUCTEN
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 pt-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <div className="font-semibold">Gratis Verzending</div>
                      <div className="text-sm text-gray-400">Vanaf €50</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🔒</span>
                    </div>
                    <div>
                      <div className="font-semibold">Veilig Betalen</div>
                      <div className="text-sm text-gray-400">SSL Beveiligd</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">↩</span>
                    </div>
                    <div>
                      <div className="font-semibold">30 Dagen Retour</div>
                      <div className="text-sm text-gray-400">Zonder vragen</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🇳🇱</span>
                    </div>
                    <div>
                      <div className="font-semibold">Nederlandse Support</div>
                      <div className="text-sm text-gray-400">24/7 Hulp</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Hero Image */}
              <div className="relative">
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                    <div className="text-center space-y-6">
                      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        TRENDING NOW
                      </div>
                      <div className="text-6xl font-black text-white">
                        8 PRODUCTEN
                      </div>
                      <div className="text-xl text-gray-300">
                        Premium kwaliteit • Snelle levering • Beste prijzen
                      </div>
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold">
                          🔥 HOT DEALS
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trending Producten
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              De meest populaire producten van dit moment. Ontdek waarom duizenden klanten voor deze items kiezen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
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
                        <span className="text-orange-600 animate-pulse">⚠ Nog {product.stock} stuks!</span>
                      ) : (
                        <span className="text-red-600 animate-pulse">🔥 Nog {product.stock} stuks!</span>
                      )}
                    </div>
                  </div>

                  {/* Urgency Timer */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      ⏰ Beperkte tijd!
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
                <div className="p-6">
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

                  {/* Rating & Social Proof */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.floor(product.averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {product.averageRating} ({product.totalReviews} reviews)
                      </span>
                    </div>
                    <div className="text-xs text-green-600 font-semibold">
                      🔥 {Math.floor(Math.random() * 50) + 20} mensen bekijken dit nu!
                    </div>
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

                  {/* Shipping Info */}
                  <div className="text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 mr-1" />
                      Gratis verzending vanaf €50
                    </div>
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

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/products" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg">
              BEKIJK ALLE PRODUCTEN
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Waarom Kiezen voor PulseBuy?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Wij bieden de beste service en kwaliteit voor onze klanten
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Snelle Levering</h3>
              <p className="text-gray-600">Gratis verzending vanaf €50. Levering binnen 2-5 werkdagen.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Veilig Betalen</h3>
              <p className="text-gray-600">SSL beveiligde betalingen. Alle grote creditcards geaccepteerd.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <RotateCcw className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">30 Dagen Retour</h3>
              <p className="text-gray-600">Niet tevreden? Retourneren binnen 30 dagen zonder vragen.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nederlandse Support</h3>
              <p className="text-gray-600">24/7 Nederlandse klantenservice. Wij helpen je graag!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Klaar om te Beginnen?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ontdek onze collectie van premium producten en ervaar het verschil in kwaliteit en service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-colors">
              SHOP NU
            </Link>
            <Link href="/contact" className="border-2 border-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-lg font-bold text-lg transition-colors">
              CONTACT ONS
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}