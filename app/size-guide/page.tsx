import Link from 'next/link'

export default function SizeGuidePage() {
  const sizeGuides = [
    {
      category: 'Kleding',
      icon: '👕',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      measurements: {
        'XS': 'Bust: 80-84cm, Waist: 60-64cm',
        'S': 'Bust: 84-88cm, Waist: 64-68cm',
        'M': 'Bust: 88-92cm, Waist: 68-72cm',
        'L': 'Bust: 92-96cm, Waist: 72-76cm',
        'XL': 'Bust: 96-100cm, Waist: 76-80cm',
        'XXL': 'Bust: 100-104cm, Waist: 80-84cm'
      }
    },
    {
      category: 'Schoenen',
      icon: '👟',
      sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
      measurements: {
        '36': 'Voetlengte: 23cm',
        '37': 'Voetlengte: 23.5cm',
        '38': 'Voetlengte: 24cm',
        '39': 'Voetlengte: 24.5cm',
        '40': 'Voetlengte: 25cm',
        '41': 'Voetlengte: 25.5cm',
        '42': 'Voetlengte: 26cm',
        '43': 'Voetlengte: 26.5cm',
        '44': 'Voetlengte: 27cm',
        '45': 'Voetlengte: 27.5cm'
      }
    },
    {
      category: 'Accessoires',
      icon: '⌚',
      sizes: ['One Size', 'S/M', 'M/L', 'L/XL'],
      measurements: {
        'One Size': 'Universeel passend',
        'S/M': 'Polsomtrek: 15-17cm',
        'M/L': 'Polsomtrek: 17-19cm',
        'L/XL': 'Polsomtrek: 19-21cm'
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">📏 Maattabel</h1>
            <p className="text-xl text-purple-100">Kies de juiste maat voor de perfecte pasvorm</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <span className="mr-2">←</span>
            Terug naar Home
          </Link>
        </div>

        {/* How to Measure */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hoe meet je jezelf?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📏</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Gebruik een meetlint</h3>
              <p className="text-gray-600">Gebruik een flexibel meetlint voor nauwkeurige metingen</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👕</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Meet over je huid</h3>
              <p className="text-gray-600">Meet direct over je huid, niet over kleding</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📐</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Houd het meetlint recht</h3>
              <p className="text-gray-600">Zorg dat het meetlint horizontaal en niet te strak zit</p>
            </div>
          </div>
        </div>

        {/* Size Guides */}
        <div className="space-y-8">
          {sizeGuides.map((guide, index) => {
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <span className="text-2xl">{guide.icon}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{guide.category}</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Maat</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Metingen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guide.sizes.map((size, sIndex) => (
                        <tr key={sIndex} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-semibold text-gray-900">{size}</td>
                          <td className="py-3 px-4 text-gray-600">{guide.measurements[size]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white mt-12">
          <h2 className="text-2xl font-bold mb-4">💡 Tips voor de juiste maat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-2">
              <li>• Meet jezelf 's ochtends voor de meest accurate metingen</li>
              <li>• Als je tussen twee maten zit, kies dan de grotere maat</li>
              <li>• Verschillende merken kunnen verschillende maten hebben</li>
            </ul>
            <ul className="space-y-2">
              <li>• Bekijk altijd de specifieke maattabel van het product</li>
              <li>• Twijfel je? Neem contact met ons op voor advies</li>
              <li>• Ons retourbeleid maakt het makkelijk om te ruilen</li>
            </ul>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Nog vragen over maten?</p>
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Contact Opnemen
          </Link>
        </div>
      </div>
    </div>
  )
}
