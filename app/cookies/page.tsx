import Link from 'next/link'
import { ArrowLeft, Cookie, Settings, Eye, Shield } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">🍪 Cookiebeleid</h1>
            <p className="text-xl text-orange-100">Hoe wij cookies gebruiken om je ervaring te verbeteren</p>
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

        {/* Cookie Policy Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookiebeleid PulseBuy</h2>
            
            <p className="text-gray-600 mb-6">
              <strong>Laatst bijgewerkt:</strong> 25 oktober 2024
            </p>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Wat zijn cookies?</h3>
                <p className="text-gray-600 mb-4">
                  Cookies zijn kleine tekstbestanden die op je computer of mobiele apparaat worden opgeslagen wanneer je onze website bezoekt. 
                  Ze helpen ons je ervaring te verbeteren en de website beter te laten functioneren.
                </p>
                <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                  <Cookie className="h-6 w-6 text-orange-600 mr-3" />
                  <span className="text-orange-800 font-semibold">Cookies maken je ervaring persoonlijker en veiliger</span>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Soorten cookies die wij gebruiken</h3>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🔧 Functionele Cookies</h4>
                    <p className="text-gray-600 mb-2">Deze cookies zijn noodzakelijk voor het functioneren van de website:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Winkelwagen functionaliteit</li>
                      <li>Inloggegevens onthouden</li>
                      <li>Taalvoorkeuren</li>
                      <li>Website instellingen</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">📊 Analytische Cookies</h4>
                    <p className="text-gray-600 mb-2">Deze cookies helpen ons de website te verbeteren:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Google Analytics voor website statistieken</li>
                      <li>Pagina bezoeken meten</li>
                      <li>Populaire producten identificeren</li>
                      <li>Website prestaties monitoren</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">🎯 Marketing Cookies</h4>
                    <p className="text-gray-600 mb-2">Deze cookies worden gebruikt voor gerichte advertenties:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Facebook Pixel voor gerichte advertenties</li>
                      <li>Google Ads voor remarketing</li>
                      <li>Productaanbevelingen</li>
                      <li>Email marketing optimalisatie</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cookie instellingen beheren</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Je kunt cookies beheren via:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Je browser instellingen</li>
                    <li>Onze cookie banner (indien beschikbaar)</li>
                    <li>Advertentie instellingen van derden</li>
                  </ul>
                </div>
                
                <div className="mt-4 flex items-center p-4 bg-blue-50 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-blue-800 font-semibold">Browser instellingen: Chrome, Firefox, Safari, Edge</span>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cookies van derden</h3>
                <p className="text-gray-600 mb-4">
                  Wij gebruiken ook cookies van vertrouwde derde partijen:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
                    <p className="text-gray-600 text-sm">Website statistieken en gebruikersgedrag</p>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Facebook Pixel</h4>
                    <p className="text-gray-600 text-sm">Gerichte advertenties en conversie tracking</p>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Stripe</h4>
                    <p className="text-gray-600 text-sm">Veilige betalingsverwerking</p>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Mailchimp</h4>
                    <p className="text-gray-600 text-sm">Email marketing en nieuwsbrief</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Je rechten</h3>
                <div className="flex items-center p-4 bg-green-50 rounded-lg mb-4">
                  <Shield className="h-6 w-6 text-green-600 mr-3" />
                  <span className="text-green-800 font-semibold">Je hebt volledige controle over je cookie voorkeuren</span>
                </div>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Cookies accepteren of weigeren</li>
                  <li>Cookies verwijderen uit je browser</li>
                  <li>Cookie instellingen wijzigen</li>
                  <li>Informatie over opgeslagen cookies opvragen</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact</h3>
                <p className="text-gray-600 mb-4">
                  Voor vragen over ons cookiebeleid kun je contact met ons opnemen:
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

        {/* Cookie Settings Button */}
        <div className="mt-8 text-center">
          <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center mx-auto">
            <Eye className="h-5 w-5 mr-2" />
            Cookie Instellingen Beheren
          </button>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/privacy"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
          >
            <Shield className="h-4 w-4 mr-2" />
            Privacybeleid
          </Link>
          <Link
            href="/terms"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Algemene Voorwaarden
          </Link>
        </div>
      </div>
    </div>
  )
}
