'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Home, RefreshCw, AlertTriangle } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertTriangle className="mx-auto h-24 w-24 text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Er is iets misgegaan</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Onverwachte fout</h2>
          <p className="text-gray-600 mb-8">
            Er is een onverwachte fout opgetreden. Probeer het opnieuw of ga terug naar de homepage.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-left">
              <p className="text-sm text-red-800 font-mono">
                {error.message}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Probeer Opnieuw
          </button>
          
          <Link
            href="/"
            className="ml-4 inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Terug naar Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Als het probleem aanhoudt, neem dan contact met ons op.</p>
        </div>
      </div>
    </div>
  )
}
