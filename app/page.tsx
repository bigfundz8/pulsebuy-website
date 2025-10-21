'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, ShoppingCart, Heart, Eye, Truck, Shield, RotateCcw } from 'lucide-react'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      title: "Ontdek de Toekomst van E-commerce",
      subtitle: "Moderne dropshipping oplossingen die je business naar het volgende niveau tillen",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      cta: "Start Nu"
    },
    {
      title: "Premium Kwaliteit Producten",
      subtitle: "Alleen de beste producten van betrouwbare leveranciers wereldwijd",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      cta: "Bekijk Producten"
    },
    {
      title: "Snelle Levering & Service",
      subtitle: "Gegarandeerde snelle levering en uitstekende klantenservice",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=600&fit=crop",
      cta: "Meer Informatie"
    }
  ]

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-primary-600" />,
      title: "Snelle Levering",
      description: "Gratis verzending binnen 2-5 werkdagen"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: "Veilig Betalen",
      description: "100% veilige betalingen via Stripe"
    },
    {
      icon: <RotateCcw className="h-8 w-8 text-primary-600" />,
      title: "30 Dagen Retour",
      description: "Gratis retourneren binnen 30 dagen"
    }
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
      badge: "Bestseller"
    },
    {
      id: 2,
      name: "Wireless Bluetooth Headphones",
      price: 59.99,
      originalPrice: 89.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      rating: 4.6,
      reviews: 89,
      badge: "Nieuw"
    },
    {
      id: 3,
      name: "Portable Phone Charger",
      price: 29.99,
      originalPrice: 49.99,
      image: "https://images.unsplash.com/photo-1609592807900-4b4b4b4b4b4b?w=400&h=400&fit=crop",
      rating: 4.7,
      reviews: 156,
      badge: "Sale"
    },
    {
      id: 4,
      name: "Smart Watch Series 8",
      price: 199.99,
      originalPrice: 299.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      rating: 4.9,
      reviews: 203,
      badge: "Premium"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroSlides[currentSlide].image}
            alt="Hero Image"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-slide-up">
                {heroSlides[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                  {heroSlides[currentSlide].cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/about" className="btn-secondary text-lg px-8 py-4">
                  Meer Ontdekken
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Waarom Kiezen voor DropshipMotion?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Wij bieden de beste service en kwaliteit voor een onvergetelijke shopping ervaring
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center card hover:scale-105 transition-transform">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Populaire Producten
            </h2>
            <p className="text-lg text-gray-600">
              Ontdek onze best verkochte producten van deze maand
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card group hover:shadow-2xl transition-all duration-300">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
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
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center space-x-1">
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
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary-600">
                      €{product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      €{product.originalPrice}
                    </span>
                  </div>
                  
                  <button className="w-full btn-primary flex items-center justify-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Toevoegen</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary text-lg px-8 py-4">
              Alle Producten Bekijken
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Klaar om te Beginnen?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Sluit je aan bij duizenden tevreden klanten en ontdek waarom DropshipMotion de beste keuze is
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
              Start Winkelen
            </Link>
            <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Contact Opnemen
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
