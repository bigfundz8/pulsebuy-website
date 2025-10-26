'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../context/CartContext'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'

function CartContent() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    setIsUpdating(id)
    updateQuantity(id, newQuantity)
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API call
    setIsUpdating(null)
  }

  const handleRemoveItem = async (id: string) => {
    setIsUpdating(id)
    removeFromCart(id)
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsUpdating(null)
  }

  const handleClearCart = () => {
    if (confirm('Weet je zeker dat je alle items uit je winkelwagen wilt verwijderen?')) {
      clearCart()
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Je winkelwagen is leeg</h1>
            <p className="text-lg text-gray-600 mb-8">
              Voeg wat producten toe om te beginnen met winkelen
            </p>
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Verder Winkelen
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Winkelwagen</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-medium flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Winkelwagen legen
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Producten ({state.itemCount} {state.itemCount === 1 ? 'item' : 'items'})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {state.items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          €{item.price.toFixed(2)} per stuk
                        </p>
                        <p className="text-sm text-gray-500">
                          Max. {item.maxStock} op voorraad
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUpdating === item.id}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          
                          <span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">
                            {isUpdating === item.id ? '...' : item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock || isUpdating === item.id}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating === item.id}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bestelling Overzicht</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotaal</span>
                  <span className="text-gray-900">€{state.total.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Verzending</span>
                  <span className="text-gray-900">
                    {state.total >= 50 ? 'Gratis' : '€5.99'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">BTW (21%)</span>
                  <span className="text-gray-900">€{(state.total * 0.21).toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Totaal</span>
                    <span className="text-gray-900">
                      €{((state.total + (state.total >= 50 ? 0 : 5.99)) * 1.21).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-center block"
                >
                  Naar Checkout
                </Link>
                
                <Link
                  href="/products"
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 text-center block"
                >
                  Verder Winkelen
                </Link>
              </div>
              
              <div className="mt-6 text-xs text-gray-500">
                <p>✓ Gratis verzending vanaf €50</p>
                <p>✓ 30 dagen retourrecht</p>
                <p>✓ Veilige betaling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Cart() {
  return <CartContent />
}
