import Link from 'next/link'
import { ArrowLeft, Package, Search, Calendar } from 'lucide-react'

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">📦 Bestelling Volgen</h1>
            <p className="text-xl text-blue-100">Volg je bestelling in real-time</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug naar Home
          </Link>
        </div>

        {/* Track Order Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Zoek je bestelling</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bestelnummer
              </label>
              <input
                type="text"
                placeholder="Voer je bestelnummer in (bijv. PB-123456)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email adres
              </label>
              <input
                type="email"
                placeholder="Voer je email adres in"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Search className="h-5 w-5 mr-2" />
              Bestelling Zoeken
            </button>
          </div>
        </div>

        {/* Order Status Example */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Voorbeeld: Bestelling Status</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4">
                <Package className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Bestelling ontvangen</p>
                <p className="text-sm text-gray-600">Je bestelling is bevestigd en wordt voorbereid</p>
                <p className="text-xs text-gray-500">25 oktober 2024, 14:30</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                <Package className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Verzonden</p>
                <p className="text-sm text-gray-600">Je pakket is onderweg</p>
                <p className="text-xs text-gray-500">26 oktober 2024, 09:15</p>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-4">
                <Package className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Bezorgd</p>
                <p className="text-sm text-gray-600">Verwacht: 28 oktober 2024</p>
                <p className="text-xs text-gray-500">Tussen 09:00 - 17:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Veelgestelde Vragen</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Waar vind ik mijn bestelnummer?</h4>
              <p className="text-gray-600">Je bestelnummer staat in de bevestigingsemail die je hebt ontvangen na je bestelling.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Hoe lang duurt het voordat mijn bestelling wordt verzonden?</h4>
              <p className="text-gray-600">De meeste bestellingen worden binnen 1-2 werkdagen verzonden.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Kan ik mijn bestelling wijzigen?</h4>
              <p className="text-gray-600">Zolang je bestelling nog niet is verzonden, kunnen we deze meestal nog wijzigen. Neem contact met ons op.</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Hulp nodig?</h2>
          <p className="text-xl text-blue-100 mb-6">Ons team helpt je graag verder</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Contact Opnemen
            </Link>
            <a
              href="mailto:pulsebuy.store@gmail.com"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Email Sturen
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
