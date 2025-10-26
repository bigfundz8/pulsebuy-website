import Link from 'next/link'
import { ArrowLeft, Users, Target, Award, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Over PulseBuy</h1>
            <p className="text-xl text-purple-100">
              De snelste weg naar de nieuwste tech en lifestyle producten
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Statement */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Onze Missie</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bij PulseBuy geloven we dat iedereen toegang moet hebben tot de nieuwste technologie en lifestyle producten. 
            We maken het mogelijk om de coolste gadgets en innovatieve producten te ontdekken tegen eerlijke prijzen.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">10.000+</h3>
            <p className="text-gray-600">Tevreden Klanten</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">Unieke Producten</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">4.8/5</h3>
            <p className="text-gray-600">Klantbeoordeling</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">24/7</h3>
            <p className="text-gray-600">Klantenservice</p>
          </div>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ons Verhaal</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                PulseBuy is ontstaan uit de passie voor technologie en innovatie. Als tech-enthusiasten 
                merkten we dat het moeilijk was om de nieuwste en coolste producten te vinden tegen 
                betaalbare prijzen.
              </p>
              <p>
                Daarom hebben we PulseBuy opgericht - een platform waar je de nieuwste trends kunt 
                ontdekken, van draadloze opladers tot slimme fitness trackers. We werken direct samen 
                met leveranciers om je de beste prijzen te kunnen bieden.
              </p>
              <p>
                Vandaag de dag helpen we duizenden klanten om hun leven te verbeteren met innovatieve 
                producten die echt werken.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Waarom PulseBuy?</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Directe leveranciersrelaties voor de beste prijzen</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Nederlandse klantenservice die je begrijpt</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Snelle levering binnen 2-5 werkdagen</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-gray-700">30 dagen retourrecht zonder vragen</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Alleen geteste en kwaliteitsproducten</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Values */}
        <div className="bg-gray-50 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Onze Waarden</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kwaliteit</h3>
              <p className="text-gray-600">
                We verkopen alleen producten die we zelf zouden kopen. Elke product wordt 
                zorgvuldig geselecteerd op kwaliteit en functionaliteit.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Snelheid</h3>
              <p className="text-gray-600">
                Van bestelling tot bezorging - we zorgen ervoor dat je zo snel mogelijk 
                je nieuwe producten in handen hebt.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Service</h3>
              <p className="text-gray-600">
                Onze Nederlandse klantenservice staat altijd voor je klaar. 
                Geen vragen te gek, geen probleem te groot.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Klaar om te Beginnen?</h2>
          <p className="text-xl text-purple-100 mb-6">
            Ontdek onze collectie van premium producten
          </p>
          <Link href="/products" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Bekijk Onze Producten
          </Link>
        </div>
      </div>
    </div>
  )
}