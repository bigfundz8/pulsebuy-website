'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { generateToken, verifyToken } from '../../lib/jwt'

interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: 'customer' | 'admin'
  emailVerified: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_USER'; payload: { user: User; token: string } }
  | { type: 'UPDATE_USER'; payload: Partial<User> }

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>
} | null>(null)

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true
      }
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false
      }
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      }
    
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false
      }
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      }
    
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('pulsebuy-token')
        if (token) {
          const decoded = verifyToken(token)
          if (decoded) {
            // Verify token with server
            const response = await fetch('/api/auth/verify', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            
            if (response.ok) {
              const data = await response.json()
              dispatch({
                type: 'LOAD_USER',
                payload: { user: data.user, token }
              })
            } else {
              localStorage.removeItem('pulsebuy-token')
            }
          } else {
            localStorage.removeItem('pulsebuy-token')
          }
        }
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('pulsebuy-token')
      } finally {
        dispatch({ type: 'LOGIN_FAILURE' })
      }
    }

    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('pulsebuy-token', data.token)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: data.user, token: data.token }
        })
        return { success: true, message: 'Succesvol ingelogd!' }
      } else {
        dispatch({ type: 'LOGIN_FAILURE' })
        return { success: false, message: data.message || 'Inloggen gefaald' }
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' })
      return { success: false, message: 'Er is een fout opgetreden' }
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (data.success) {
        return { success: true, message: 'Account succesvol aangemaakt! Je kunt nu inloggen.' }
      } else {
        return { success: false, message: data.message || 'Registratie gefaald' }
      }
    } catch (error) {
      return { success: false, message: 'Er is een fout opgetreden' }
    }
  }

  const logout = () => {
    localStorage.removeItem('pulsebuy-token')
    dispatch({ type: 'LOGOUT' })
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`
        },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (data.success) {
        dispatch({ type: 'UPDATE_USER', payload: userData })
        return { success: true, message: 'Profiel bijgewerkt!' }
      } else {
        return { success: false, message: data.message || 'Bijwerken gefaald' }
      }
    } catch (error) {
      return { success: false, message: 'Er is een fout opgetreden' }
    }
  }

  return (
    <AuthContext.Provider value={{
      state,
      dispatch,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
