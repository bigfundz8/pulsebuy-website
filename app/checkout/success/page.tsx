'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'

export default function CheckoutSuccess() {
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get order number from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const order = urlParams.get('order')
    if (order) {
      setOrderNumber(order)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bestelling Bevestigd!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Bedankt voor je bestelling. Je ontvangt een bevestigingsmail op je email adres.
          </p>
          
          {orderNumber && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Bestelnummer
              </h2>
              <p className="text-2xl font-mono text-blue-600">
                {orderNumber}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-center mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email Bevestiging
              </h3>
              <p className="text-gray-600 text-sm">
                Je ontvangt een bevestigingsmail met alle details van je bestelling.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-center mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Verwerking
              </h3>
              <p className="text-gray-600 text-sm">
                Je bestelling wordt binnen 1-2 werkdagen verwerkt en verzonden.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tracking
              </h3>
              <p className="text-gray-600 text-sm">
                Je ontvangt een tracking code zodra je pakket is verzonden.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Wat gebeurt er nu?
            </h2>
            
            <div className="bg-white rounded-lg shadow-sm p-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Order Bevestiging</h3>
                    <p className="text-sm text-gray-600">Je bestelling is ontvangen en wordt verwerkt</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-semibold text-gray-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Verwerking</h3>
                    <p className="text-sm text-gray-600">We bereiden je bestelling voor verzending voor</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-semibold text-gray-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Verzending</h3>
                    <p className="text-sm text-gray-600">Je pakket wordt verzonden en je krijgt een tracking code</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-semibold text-gray-600">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Levering</h3>
                    <p className="text-sm text-gray-600">Je pakket wordt bij je thuis bezorgd</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              Verder Winkelen
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            
            <Link
              href="/orders"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              Mijn Bestellingen
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>
              Heb je vragen over je bestelling?{' '}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Neem contact met ons op
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
