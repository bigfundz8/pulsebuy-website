'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, MapPin, Edit3, Save, X, ArrowLeft } from 'lucide-react'

export default function Profile() {
  const { state, updateProfile, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Netherlands'
  })

  useEffect(() => {
    if (state.user) {
      setFormData({
        firstName: state.user.firstName || '',
        lastName: state.user.lastName || '',
        email: state.user.email || '',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'Netherlands'
      })
    }
  }, [state.user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      })

      if (result.success) {
        setSuccess(result.message)
        setIsEditing(false)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Er is een fout opgetreden')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (state.user) {
      setFormData({
        firstName: state.user.firstName || '',
        lastName: state.user.lastName || '',
        email: state.user.email || '',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'Netherlands'
      })
    }
    setIsEditing(false)
    setError('')
  }

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Niet ingelogd</h1>
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Inloggen
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Terug naar home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Mijn Profiel</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Persoonlijke Gegevens</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Bewerken
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Opslaan
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center text-gray-600 hover:text-gray-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Annuleren
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Voornaam
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{state.user.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Achternaam
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{state.user.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{state.user.email}</p>
                  <p className="text-sm text-gray-500">Email kan niet worden gewijzigd</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefoonnummer
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="06-12345678"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.phone || 'Niet opgegeven'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Adresgegevens</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Straat en huisnummer
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.street || 'Niet opgegeven'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stad
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.city || 'Niet opgegeven'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postcode
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1234AB"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.postalCode || 'Niet opgegeven'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Informatie</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rol</p>
                    <p className="text-sm text-gray-500 capitalize">{state.user.role}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Status</p>
                    <p className="text-sm text-gray-500">
                      {state.user.emailVerified ? 'Geverifieerd' : 'Niet geverifieerd'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Land</p>
                    <p className="text-sm text-gray-500">{formData.country}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={logout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Uitloggen
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Snelle Acties</h2>
              
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                >
                  Mijn Bestellingen
                </Link>
                
                <Link
                  href="/wishlist"
                  className="block w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                >
                  Mijn Verlanglijst
                </Link>
                
                <Link
                  href="/support"
                  className="block w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                >
                  Klantenservice
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
