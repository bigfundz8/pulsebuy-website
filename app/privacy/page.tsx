import Link from 'next/link'
import { ArrowLeft, Shield, FileText, Cookie } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🔒 Privacybeleid</h1>
            <p className="text-xl text-blue-100">Hoe wij je gegevens beschermen</p>
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

        {/* Privacy Policy Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacybeleid PulseBuy</h2>
            
            <p className="text-gray-600 mb-6">
              <strong>Laatst bijgewerkt:</strong> 25 oktober 2024
            </p>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Inleiding</h3>
                <p className="text-gray-600 mb-4">
                  Bij PulseBuy respecteren wij je privacy en zijn wij toegewijd aan het beschermen van je persoonlijke gegevens. 
                  Dit privacybeleid legt uit hoe wij je gegevens verzamelen, gebruiken en beschermen wanneer je onze website gebruikt.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Gegevens die wij verzamelen</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Persoonlijke gegevens:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Naam en contactgegevens</li>
                    <li>Email adres</li>
                    <li>Telefoonnummer</li>
                    <li>Verzendadres</li>
                    <li>Betalingsgegevens (via veilige betalingsproviders)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Hoe wij je gegevens gebruiken</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Bestellingen verwerken en verzenden</li>
                    <li>Klantenservice bieden</li>
                    <li>Productaanbevelingen doen</li>
                    <li>Website verbeteren</li>
                    <li>Marketing communicatie (met toestemming)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Gegevensbescherming</h3>
                <p className="text-gray-600 mb-4">
                  Wij gebruiken industriestandaard beveiligingsmaatregelen om je gegevens te beschermen tegen ongeautoriseerde toegang, 
                  wijziging, openbaarmaking of vernietiging.
                </p>
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600 mr-3" />
                  <span className="text-green-800 font-semibold">SSL-versleuteling en veilige betalingsverwerking</span>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Je rechten</h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-600 mb-2">Je hebt het recht om:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Toegang te krijgen tot je gegevens</li>
                    <li>Je gegevens te corrigeren</li>
                    <li>Je gegevens te verwijderen</li>
                    <li>Bezwaar te maken tegen verwerking</li>
                    <li>Gegevens te exporteren</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies</h3>
                <p className="text-gray-600 mb-4">
                  Wij gebruiken cookies om je ervaring op onze website te verbeteren. 
                  Je kunt cookies uitschakelen in je browserinstellingen.
                </p>
                <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                  <Cookie className="h-6 w-6 text-yellow-600 mr-3" />
                  <span className="text-yellow-800">Cookies helpen ons de website te verbeteren</span>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Contact</h3>
                <p className="text-gray-600 mb-4">
                  Voor vragen over dit privacybeleid kun je contact met ons opnemen:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    <strong>Email:</strong> pulsebuy.store@gmail.com<br/>
                    <strong>Telefoon:</strong> +31 6 78912345<br/>
                    <strong>Adres:</strong> Amsterdam, Nederland
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/terms"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Algemene Voorwaarden
          </Link>
          <Link
            href="/cookies"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center"
          >
            <Cookie className="h-4 w-4 mr-2" />
            Cookiebeleid
          </Link>
        </div>
      </div>
    </div>
  )
}