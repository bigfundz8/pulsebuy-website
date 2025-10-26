'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  maxStock: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isOpen: boolean
  showToast: boolean
  lastAddedItem: CartItem | null
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SHOW_TOAST'; payload: CartItem }
  | { type: 'HIDE_TOAST' }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (item: Omit<CartItem, 'id'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  showToast: (item: CartItem) => void
  hideToast: () => void
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.productId === action.payload.productId)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: Math.min(item.quantity + action.payload.quantity, item.maxStock) }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      } else {
        const newItem = {
          ...action.payload,
          id: `${action.payload.productId}-${Date.now()}`
        }
        const updatedItems = [...state.items, newItem]
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        }
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.min(Math.max(action.payload.quantity, 0), item.maxStock) }
          : item
      ).filter(item => item.quantity > 0)
      
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      }
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      }
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }
    
    case 'LOAD_CART': {
      const items = action.payload
      return {
        ...state,
        items,
        total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
      }
    }

    case 'SHOW_TOAST':
      return {
        ...state,
        showToast: true,
        lastAddedItem: action.payload
      }

    case 'HIDE_TOAST':
      return {
        ...state,
        showToast: false,
        lastAddedItem: null
      }
    
    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
  showToast: false,
  lastAddedItem: null
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('pulsebuy-cart')
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart)
          dispatch({ type: 'LOAD_CART', payload: cartItems })
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
          localStorage.removeItem('pulsebuy-cart')
        }
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pulsebuy-cart', JSON.stringify(state.items))
    }
  }, [state.items])

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const showToast = (item: CartItem) => {
    dispatch({ type: 'SHOW_TOAST', payload: item })
  }

  const hideToast = () => {
    dispatch({ type: 'HIDE_TOAST' })
  }

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCart,
      showToast,
      hideToast
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
