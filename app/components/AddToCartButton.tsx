'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Toast from './Toast'

interface AddToCartButtonProps {
  productId: string
  productName: string
  price: number
  image?: string
  maxStock?: number
}

export default function AddToCartButton({ 
  productId, 
  productName, 
  price, 
  image = "https://via.placeholder.com/400x400",
  maxStock = 100
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const { addToCart, showToast } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    try {
      // Add to cart context
      const cartItem = {
        productId,
        name: productName,
        price,
        image,
        quantity: 1,
        maxStock
      }
      
      addToCart(cartItem)
      
      // Show toast notification
      showToast({
        id: `${productId}-${Date.now()}`,
        ...cartItem
      })
      
      // Simuleer het toevoegen aan winkelwagen
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (error) {
      console.error('Fout bij toevoegen aan winkelwagen:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <button 
        onClick={handleAddToCart}
        disabled={isAdding || added}
        className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
          added 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
            : isAdding 
            ? 'bg-gray-400 text-white cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Toevoegen...</span>
          </>
        ) : added ? (
          <>
            <span className="text-lg">✓</span>
            <span>Toegevoegd!</span>
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            <span>🛒 In Winkelwagen</span>
          </>
        )}
      </button>
      
      <Toast
        isVisible={added}
        onClose={() => setAdded(false)}
        product={{
          name: productName,
          price: price,
          image: image
        }}
        cartCount={0} // We kunnen dit later uitbreiden
      />
    </>
  )
}
