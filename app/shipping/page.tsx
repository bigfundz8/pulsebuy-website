import Link from 'next/link'
import { ArrowLeft, Truck, RotateCcw, Clock, Shield } from 'lucide-react'

export default function ShippingPage() {
  const shippingInfo = [
    {
      icon: Truck,
      title: 'Verzending',
      details: [
        'Gratis verzending vanaf €50',
        'Standaard verzending: €5.95',
        'Express verzending: €9.95',
        'Verzending binnen 1-2 werkdagen'
      ]
    },
    {
      icon: Clock,
      title: 'Levertijden',
      details: [
        'Nederland: 2-3 werkdagen',
        'België: 3-5 werkdagen',
        'Duitsland: 4-6 werkdagen',
        'Andere EU landen: 5-7 werkdagen'
      ]
    },
    {
      icon: RotateCcw,
      title: 'Retourneren',
      details: [
        '30 dagen retourrecht',
        'Gratis retourlabel',
        'Geld terug binnen 5 werkdagen',
        'Eenvoudig retourproces'
      ]
    },
    {
      icon: Shield,
      title: 'Garantie',
      details: [
        '2 jaar fabrieksgarantie',
        'Gratis reparatie of vervanging',
        'Nederlandse klantenservice',
        'Veilige betaling'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🚚 Verzending & Retour</h1>
            <p className="text-xl text-green-100">Alles wat je moet weten over levering en retourneren</p>
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

        {/* Shipping Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {shippingInfo.map((info, index) => {
            const IconComponent = info.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <IconComponent className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{info.title}</h3>
                </div>
                <ul className="space-y-2">
                  {info.details.map((detail, dIndex) => (
                    <li key={dIndex} className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Veelgestelde Vragen</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hoe kan ik mijn pakketje volgen?</h3>
              <p className="text-gray-600">Na verzending ontvang je een tracking code per email. Je kunt je pakketje volgen via onze website of de website van de vervoerder.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Wat als mijn pakketje beschadigd aankomt?</h3>
              <p className="text-gray-600">Neem direct contact met ons op via email of telefoon. We regelen een nieuwe verzending of volledige terugbetaling.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kan ik mijn bestelling annuleren?</h3>
              <p className="text-gray-600">Ja, je kunt je bestelling annuleren zolang deze nog niet is verzonden. Neem contact met ons op voor snelle hulp.</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Nog vragen?</h2>
          <p className="text-xl text-green-100 mb-6">Ons team helpt je graag verder</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Contact Opnemen
          </Link>
        </div>
      </div>
    </div>
  )
}
