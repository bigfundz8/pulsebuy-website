'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, X, ShoppingCart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ToastProps {
  isVisible: boolean
  onClose: () => void
  product: {
    name: string
    price: number
    image: string
  }
  cartCount: number
}

export default function Toast({ isVisible, onClose, product, cartCount }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Auto close after 5 seconds
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 max-w-sm w-full backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">✅ Toegevoegd!</h3>
              <p className="text-xs text-gray-500 font-medium">{cartCount} {cartCount === 1 ? 'item' : 'items'} in winkelwagen</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 relative flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {product.name}
            </h4>
            <p className="text-sm text-gray-600">
              €{product.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            href="/cart"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
            onClick={onClose}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            🛒 Winkelwagen
          </Link>
          <Link
            href="/checkout"
            className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 text-sm font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center border border-gray-300"
            onClick={onClose}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            💳 Afrekenen
          </Link>
        </div>
      </div>
    </div>
  )
}
