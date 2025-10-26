import Link from 'next/link'
import { ArrowLeft, Smartphone, Home, Dumbbell, Sparkles, Car, Gamepad2 } from 'lucide-react'

export default function CategoriesPage() {
  const categories = [
    {
      name: 'Electronics',
      icon: Smartphone,
      description: 'Telefoons, gadgets en tech accessoires',
      count: '4 producten',
      href: '/products?category=electronics',
      color: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Home & Living',
      icon: Home,
      description: 'Huishoudelijke artikelen en verlichting',
      count: '2 producten',
      href: '/products?category=home',
      color: 'from-green-500 to-teal-600'
    },
    {
      name: 'Sports & Fitness',
      icon: Dumbbell,
      description: 'Fitness apparatuur en sportartikelen',
      count: '1 product',
      href: '/products?category=sports',
      color: 'from-orange-500 to-red-600'
    },
    {
      name: 'Beauty & Health',
      icon: Sparkles,
      description: 'Schoonheid en gezondheidsproducten',
      count: '1 product',
      href: '/products?category=beauty',
      color: 'from-pink-500 to-rose-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🛍️ Product Categorieën</h1>
            <p className="text-xl text-purple-100">Ontdek onze uitgebreide collectie</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar Home
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Link
                key={index}
                href={category.href}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className={`h-32 bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                  <IconComponent className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-semibold">{category.count}</span>
                    <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                      Bekijk →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Niet gevonden wat je zoekt?</h2>
          <p className="text-xl text-purple-100 mb-6">Neem contact met ons op voor persoonlijk advies</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Contact Opnemen
          </Link>
        </div>
      </div>
    </div>
  )
}