import Link from 'next/link'
import { ArrowLeft, HelpCircle, Truck, Ruler, Package, MessageCircle } from 'lucide-react'

export default function HelpPage() {
  const helpTopics = [
    {
      icon: Package,
      title: 'Bestellingen',
      description: 'Hoe plaats ik een bestelling? Hoe kan ik mijn bestelling volgen?',
      questions: [
        'Hoe plaats ik een bestelling?',
        'Kan ik mijn bestelling wijzigen?',
        'Hoe volg ik mijn bestelling?',
        'Wanneer wordt mijn bestelling verzonden?'
      ]
    },
    {
      icon: Truck,
      title: 'Verzending & Levering',
      description: 'Verzendkosten, levertijden en leveringsopties',
      questions: [
        'Wat zijn de verzendkosten?',
        'Hoe lang duurt de levering?',
        'Kan ik mijn pakketje volgen?',
        'Leveren jullie ook buiten Nederland?'
      ]
    },
    {
      icon: MessageCircle,
      title: 'Retourneren',
      description: 'Hoe kan ik een product retourneren? Wat is het retourbeleid?',
      questions: [
        'Hoe kan ik een product retourneren?',
        'Wat is het retourbeleid?',
        'Hoe lang heb ik om te retourneren?',
        'Krijg ik mijn geld terug?'
      ]
    },
    {
      icon: HelpCircle,
      title: 'Account & Betaling',
      description: 'Account beheer, betalingsmethoden en facturen',
      questions: [
        'Hoe maak ik een account aan?',
        'Welke betalingsmethoden accepteren jullie?',
        'Kan ik een factuur krijgen?',
        'Is mijn betaling veilig?'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">❓ Help Center</h1>
            <p className="text-xl text-blue-100">Vind snel antwoorden op je vragen</p>
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

        {/* Search Bar */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Zoek naar hulp..."
                className="w-full px-6 py-4 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <HelpCircle className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Help Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {helpTopics.map((topic, index) => {
            const IconComponent = topic.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{topic.title}</h3>
                    <p className="text-gray-600">{topic.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {topic.questions.map((question, qIndex) => (
                    <li key={qIndex} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      • {question}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Nog steeds hulp nodig?</h2>
          <p className="text-xl text-blue-100 mb-6">Ons team staat klaar om je te helpen</p>
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
