import Link from 'next/link'
import { ArrowLeft, FileText, Scale, AlertTriangle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">📋 Algemene Voorwaarden</h1>
            <p className="text-xl text-green-100">Onze voorwaarden voor het gebruik van onze diensten</p>
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

        {/* Terms Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Algemene Voorwaarden PulseBuy</h2>
            
            <p className="text-gray-600 mb-6">
              <strong>Laatst bijgewerkt:</strong> 25 oktober 2024
            </p>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Algemene Bepalingen</h3>
                <p className="text-gray-600 mb-4">
                  Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen PulseBuy en de klant. 
                  Door het plaatsen van een bestelling ga je akkoord met deze voorwaarden.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Bestellingen</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Alle bestellingen zijn onder voorbehoud van voorraad</li>
                    <li>Wij behouden ons het recht voor om bestellingen te weigeren</li>
                    <li>Prijzen kunnen zonder voorafgaande kennisgeving worden gewijzigd</li>
                    <li>Bestellingen worden bevestigd per email</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Betaling</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Betaalmethoden:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Creditcard (Visa, Mastercard)</li>
                    <li>iDEAL</li>
                    <li>PayPal</li>
                    <li>Bancontact</li>
                  </ul>
                  <p className="text-gray-600 mt-2">
                    Alle betalingen worden veilig verwerkt via gecertificeerde betalingsproviders.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Levering</h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Levertijd: 2-7 werkdagen (Nederland)</li>
                    <li>Gratis verzending vanaf €50</li>
                    <li>Verzendkosten: €5.95 (onder €50)</li>
                    <li>Express levering mogelijk tegen meerprijs</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Retourneren</h3>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Retourbeleid:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>30 dagen retourrecht</li>
                    <li>Producten moeten in originele staat zijn</li>
                    <li>Gratis retourlabel beschikbaar</li>
                    <li>Geld terug binnen 5 werkdagen</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Garantie</h3>
                <div className="flex items-center p-4 bg-green-50 rounded-lg mb-4">
                  <Scale className="h-6 w-6 text-green-600 mr-3" />
                  <span className="text-green-800 font-semibold">2 jaar fabrieksgarantie op alle producten</span>
                </div>
                <p className="text-gray-600">
                  Alle producten worden geleverd met fabrieksgarantie. Defecten door normaal gebruik worden kosteloos gerepareerd of vervangen.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Aansprakelijkheid</h3>
                <div className="flex items-center p-4 bg-red-50 rounded-lg mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                  <span className="text-red-800 font-semibold">Beperkte aansprakelijkheid</span>
                </div>
                <p className="text-gray-600">
                  Onze aansprakelijkheid is beperkt tot de waarde van de bestelling. Wij zijn niet aansprakelijk voor indirecte schade.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Geschillen</h3>
                <p className="text-gray-600 mb-4">
                  Geschillen worden zoveel mogelijk in onderling overleg opgelost. 
                  Nederlandse wet is van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Amsterdam.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">9. Contact</h3>
                <p className="text-gray-600 mb-4">
                  Voor vragen over deze voorwaarden kun je contact met ons opnemen:
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
            href="/privacy"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Privacybeleid
          </Link>
          <Link
            href="/contact"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Contact Opnemen
          </Link>
        </div>
      </div>
    </div>
  )
}