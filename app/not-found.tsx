'use client'

import Link from 'next/link'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertTriangle className="mx-auto h-24 w-24 text-red-500 mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pagina niet gevonden</h2>
          <p className="text-gray-600 mb-8">
            Sorry, de pagina die je zoekt bestaat niet of is verplaatst.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Terug naar Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="ml-4 inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Ga Terug
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Als je denkt dat dit een fout is, neem dan contact met ons op.</p>
        </div>
      </div>
    </div>
  )
}
