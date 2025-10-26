'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BarChart3, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Lock,
  Mail
} from 'lucide-react'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalProfit: number
  pendingOrders: number
  completedOrders: number
}

interface Order {
  _id: string
  orderNumber: string
  status: string
  dropshipStatus: string
  totalAmount: number
  profit: number
  profitMargin: number
  createdAt: string
  shippingAddress: {
    firstName: string
    lastName: string
    city: string
  }
}

export default function DropshippingDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken')
      const user = localStorage.getItem('adminUser')
      
      if (token && user) {
        try {
          const userData = JSON.parse(user)
          if (userData.role === 'admin') {
            setIsAuthenticated(true)
            fetchDashboardData()
          } else {
            router.push('/admin-login')
          }
        } catch (error) {
          router.push('/admin-login')
        }
      } else {
        router.push('/admin-login')
      }
    }
    setCheckingAuth(false)
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats')
      const statsData = await statsResponse.json()
      setStats(statsData.data)

      // Fetch recent orders
      const ordersResponse = await fetch('/api/admin/orders')
      const ordersData = await ordersResponse.json()
      setOrders(ordersData.data || [])
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const importAliExpressProducts = async () => {
    try {
      setActionLoading('import')
      const response = await fetch('/api/aliexpress/products', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ ${data.data.importedProducts} nieuwe producten geïmporteerd!`)
        fetchDashboardData()
      } else {
        alert('❌ Import gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Import error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const importSpocketProducts = async () => {
    try {
      setActionLoading('spocket')
      const response = await fetch('/api/spocket/products', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ ${data.data.importedProducts} Spocket producten geïmporteerd! Totale winst: €${data.data.products.reduce((sum, p) => sum + p.profit, 0).toFixed(2)}`)
        fetchDashboardData()
      } else {
        alert('❌ Spocket import gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Spocket import error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const forwardOrders = async () => {
    try {
      setActionLoading('forward')
      const response = await fetch('/api/orders/forward', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`📤 Order Forwarding Voltooid!\n\nDoorgestuurd: ${data.data.forwardedOrders}\nGefaald: ${data.data.failedOrders}\nTotale winst: €${data.data.totalProfit.toFixed(2)}\nGemiddelde marge: ${data.data.averageProfitMargin.toFixed(1)}%`)
        fetchDashboardData()
      } else {
        alert('❌ Order forwarding gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Order forwarding error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const forwardSpocketOrders = async () => {
    try {
      setActionLoading('spocket-forward')
      const response = await fetch('/api/spocket/forward-orders', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`✅ ${data.data.forwardedOrders} Spocket orders doorgestuurd! Totale winst: €${data.data.totalProfit.toFixed(2)}`)
        fetchDashboardData()
      } else {
        alert('❌ Spocket order forwarding gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Spocket order forwarding error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const importTrendingProducts = async () => {
    try {
      setActionLoading('trending')
      const response = await fetch('/api/optimization/trending-products', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`🔥 ${data.data.importedProducts} trending producten geïmporteerd! Totale winst: €${data.data.products.reduce((sum, p) => sum + p.profit, 0).toFixed(2)}`)
        fetchDashboardData()
      } else {
        alert('❌ Trending import gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Trending import error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const runSystemTest = async () => {
    try {
      setActionLoading('system-test')
      const response = await fetch('/api/test/order-flow', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        const score = data.data.overallScore
        const status = data.data.status
        const recommendations = data.data.recommendations.join('\n• ')
        
        alert(`🧪 Systeem Test Voltooid!\n\nScore: ${score.toFixed(1)}%\nStatus: ${status}\n\nAanbevelingen:\n• ${recommendations}`)
        fetchDashboardData()
      } else {
        alert('❌ Systeem test gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Systeem test error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const checkInventory = async () => {
    try {
      setActionLoading('inventory-check')
      const response = await fetch('/api/test/inventory-check', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        const report = data.data
        alert(`📦 Inventory Check Voltooid!\n\nBeschikbare producten: ${report.availableProducts}/${report.totalProducts}\nUitverkocht: ${report.outOfStockProducts}\nLage voorraad: ${report.lowStockProducts}\n\nAanbevelingen:\n• ${report.recommendations.join('\n• ')}`)
        fetchDashboardData()
      } else {
        alert('❌ Inventory check gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Inventory check error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const testSuppliers = async () => {
    try {
      setActionLoading('supplier-test')
      const response = await fetch('/api/test/supplier-integration', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        const report = data.data
        alert(`🏭 Supplier Test Voltooid!\n\nTotaal leveranciers: ${report.totalSuppliers}\nAliExpress: ${report.aliExpressSuppliers}\nSpocket: ${report.spocketSuppliers}\nGemiddelde levering: ${report.averageDeliveryTime} dagen\n\nAanbevelingen:\n• ${report.recommendations.join('\n• ')}`)
        fetchDashboardData()
      } else {
        alert('❌ Supplier test gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Supplier test error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const optimizeProfitMargins = async () => {
    try {
      setActionLoading('optimize')
      const response = await fetch('/api/optimization/profit-margins', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`💰 ${data.data.optimizedProducts} producten geoptimaliseerd! Totale winst toename: €${data.data.totalProfitIncrease.toFixed(2)}`)
        fetchDashboardData()
      } else {
        alert('❌ Optimalisatie gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Optimalisatie error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const sendOrderNotifications = async () => {
    try {
      setActionLoading('notifications')
      const response = await fetch('/api/orders/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderNumber: 'ORD-1234567890-TEST',
          notificationType: 'order_confirmation'
        })
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`📧 Notification Test Voltooid!\n\nType: ${data.data.notificationType}\nEmail: ${data.data.email}\nVerzonden: ${new Date(data.data.sentAt).toLocaleString('nl-NL')}`)
      } else {
        alert('❌ Notification test gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Notification test error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const importViralProducts = async () => {
    try {
      setActionLoading('viral-import')
      const response = await fetch('/api/products/viral-import', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`🔥 ${data.data.importedProducts} Viral Producten Geïmporteerd!\n\nTotale winst: €${data.data.totalProfit.toFixed(2)}\nGemiddelde marge: ${data.data.averageMargin.toFixed(1)}%\n\nProducten:\n• ${data.data.products.map(p => `${p.name} - €${p.price}`).join('\n• ')}`)
        fetchDashboardData()
      } else {
        alert('❌ Viral import gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Viral import error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const updateProductImages = async () => {
    try {
      setActionLoading('update-images')
      const response = await fetch('/api/products/update-images', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`🎨 ${data.data.updatedProducts} Producten Geüpdatet!\n\nAlle producten hebben nu professionele afbeeldingen\nTotaal producten: ${data.data.totalProducts}`)
        fetchDashboardData()
      } else {
        alert('❌ Afbeelding update gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Afbeelding update error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const runAIImageAutomation = async () => {
    try {
      setActionLoading('ai-automation')
      const response = await fetch('/api/products/ai-image-automation', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`🤖 AI Image Automation Voltooid!\n\n${data.data.updatedProducts} producten geüpdatet\nAI-geoptimaliseerd: ${data.data.aiOptimized}\n\nResultaten:\n• ${data.data.results.map(r => `${r.name} (${r.type})`).join('\n• ')}`)
        fetchDashboardData()
      } else {
        alert('❌ AI Automation gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ AI Automation error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const runAdvancedResearch = async () => {
    try {
      setActionLoading('advanced-research')
      const response = await fetch('/api/products/advanced-research', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`🔍 Advanced Research Voltooid!\n\n${data.data.importedProducts} nieuwe producten\nTotale winst: €${data.data.totalProfit.toFixed(2)}\nGemiddelde marge: ${data.data.averageMargin.toFixed(1)}%\nGemiddelde afbeeldingen: ${data.data.averageImages.toFixed(1)}\n\nAI-geoptimaliseerd: ${data.data.aiOptimized}`)
        fetchDashboardData()
      } else {
        alert('❌ Advanced Research gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Advanced Research error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const runDirectImageFix = async () => {
    try {
      setActionLoading('direct-fix')
      const response = await fetch('/api/products/direct-fix-images', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`🔧 DIRECT FIX Voltooid!\n\n${data.data.updatedProducts} producten geüpdatet\nTotaal producten: ${data.data.totalProducts}\n\n✅ Alle producten hebben nu UNIEKE afbeeldingen!\nGeen dubbele afbeeldingen meer!`)
        fetchDashboardData()
      } else {
        alert('❌ Direct Fix gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Direct Fix error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const runProfessionalOptimization = async () => {
    try {
      setActionLoading('professional-optimization')
      const response = await fetch('/api/products/professional-optimization', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`🚀 Professional Optimization Voltooid!\n\n${data.data.updatedProducts} producten geüpdatet\nTotale winst: €${data.data.totalProfit.toFixed(2)}\nGemiddelde marge: ${data.data.averageMargin.toFixed(1)}%\n\n✅ Je site ziet er nu uit als professionele dropshipping stores!`)
        fetchDashboardData()
      } else {
        alert('❌ Professional Optimization gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Professional Optimization error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const createRealProducts = async () => {
    try {
      setActionLoading('create-real-products')
      const response = await fetch('/api/products/create-real-products', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`🏆 REAL Professional Products Created!\n\n${data.data.createdProducts} producten aangemaakt\nTotale winst: €${data.data.totalProfit.toFixed(2)}\nGemiddelde marge: ${data.data.averageMargin.toFixed(1)}%\n\n✅ Je site ziet er nu uit als een ECHTE professionele webshop!\nGeen scammerige look meer!`)
        fetchDashboardData()
      } else {
        alert('❌ Real Products creation gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Real Products creation error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const runViralMarketingStrategy = async () => {
    try {
      const response = await fetch('/api/marketing/viral-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`🚀 VIRAL MARKETING STRATEGIE GEÏMPLEMENTEERD!\n\n✅ ${data.data.optimizedProducts} producten geoptimaliseerd\n✅ Advertising strategie klaar\n✅ Conversion tracking actief\n✅ Retargeting systeem geactiveerd\n\nJe bent nu klaar om VIRAAL te gaan! 🔥`)
      } else {
        alert('❌ Viral marketing strategie gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Error: ' + error.message)
    }
  }

  const completeSiteRedesign = async () => {
    try {
      setActionLoading('complete-redesign')
      const response = await fetch('/api/products/complete-site-redesign', {
        method: 'POST'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`🎨 COMPLETE SITE REDESIGN Voltooid!\n\n${data.data.createdProducts} producten aangemaakt\nTotale winst: €${data.data.totalProfit.toFixed(2)}\nGemiddelde marge: ${data.data.averageMargin.toFixed(1)}%\n\n✅ Je hele site ziet er nu uit als een ECHTE professionele webshop!\nGeen scammerige look meer - compleet nieuwe look!`)
        fetchDashboardData()
      } else {
        alert('❌ Complete Site Redesign gefaald: ' + data.message)
      }
    } catch (error) {
      alert('❌ Complete Site Redesign error: ' + error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'shipped': return 'text-purple-600 bg-purple-100'
      case 'completed': return 'text-gray-600 bg-gray-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getDropshipStatusColor = (status: string) => {
    switch (status) {
      case 'forwarded': return 'text-blue-600 bg-blue-100'
      case 'ordered': return 'text-orange-600 bg-orange-100'
      case 'shipped': return 'text-purple-600 bg-purple-100'
      case 'completed': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticatie controleren...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Lock className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Toegang geweigerd. Redirecting...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Dashboard laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dropshipping Dashboard</h1>
          <p className="text-gray-600 mt-2">Beheer je automatische dropshipping business</p>
        </div>

        {/* COMPLETE SITE REDESIGN - Priority */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-3">🎨</span>
            COMPLETE SITE REDESIGN - Geen Scammerige Look Meer
          </h2>
          <p className="text-gray-600 mb-6">Dit maakt je HELE site eruit zien als een ECHTE professionele webshop zoals Gymshark, Allbirds, etc.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={completeSiteRedesign}
              disabled={actionLoading === 'complete-redesign'}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg font-bold"
            >
              {actionLoading === 'complete-redesign' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <span className="mr-2">🎨</span>
              )}
              COMPLETE SITE REDESIGN
            </button>
            
            <button
              onClick={createRealProducts}
              disabled={actionLoading === 'create-real-products'}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg font-bold"
            >
              {actionLoading === 'create-real-products' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <span className="mr-2">🏆</span>
              )}
              Create REAL Products
            </button>
          </div>
        </div>

        {/* AI-Powered Automation */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-3">🤖</span>
            AI-Powered Automation
          </h2>
          <p className="text-gray-600 mb-6">Geavanceerde automatisering voor professionele producten met perfecte afbeeldingen</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={runAdvancedResearch}
              disabled={actionLoading === 'advanced-research'}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg font-semibold"
            >
              {actionLoading === 'advanced-research' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <TrendingUp className="h-5 w-5 mr-2" />
              )}
              🔍 Advanced Research
            </button>
            
            <button
              onClick={runAIImageAutomation}
              disabled={actionLoading === 'ai-automation'}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg font-semibold"
            >
              {actionLoading === 'ai-automation' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <TrendingUp className="h-5 w-5 mr-2" />
              )}
              🤖 AI Image Match
            </button>
            
            <button
              onClick={importViralProducts}
              disabled={actionLoading === 'viral-import'}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg font-semibold"
            >
              {actionLoading === 'viral-import' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <TrendingUp className="h-5 w-5 mr-2" />
              )}
              🔥 Viral Products
            </button>
          </div>
        </div>

        {/* Manual Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={updateProductImages}
            disabled={actionLoading === 'update-images'}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg font-semibold"
          >
            {actionLoading === 'update-images' ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            ) : (
              <TrendingUp className="h-6 w-6 mr-3" />
            )}
            🎨 Manual Image Update
          </button>
          
          <button
            onClick={importTrendingProducts}
            disabled={actionLoading === 'trending'}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg font-semibold"
          >
            {actionLoading === 'trending' ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
            ) : (
              <TrendingUp className="h-6 w-6 mr-3" />
            )}
            📈 Import Trending
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={importAliExpressProducts}
            disabled={actionLoading === 'import'}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === 'import' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Package className="h-5 w-5 mr-2" />
            )}
            Import AliExpress
          </button>
          
          <button
            onClick={importSpocketProducts}
            disabled={actionLoading === 'spocket'}
            className="flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === 'spocket' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Package className="h-5 w-5 mr-2" />
            )}
            Import Spocket
          </button>
          
          <button
            onClick={importTrendingProducts}
            disabled={actionLoading === 'trending'}
            className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === 'trending' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <TrendingUp className="h-5 w-5 mr-2" />
            )}
            Import Trending
          </button>
          
          <button
            onClick={optimizeProfitMargins}
            disabled={actionLoading === 'optimize'}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === 'optimize' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <DollarSign className="h-5 w-5 mr-2" />
            )}
            Optimize Margins
          </button>
        </div>

        {/* Order Forwarding Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={forwardOrders}
            disabled={actionLoading === 'forward'}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === 'forward' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <ShoppingCart className="h-5 w-5 mr-2" />
            )}
            Forward AliExpress Orders
          </button>
          
          <button
            onClick={forwardSpocketOrders}
            disabled={actionLoading === 'spocket-forward'}
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === 'spocket-forward' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <ShoppingCart className="h-5 w-5 mr-2" />
            )}
            Forward Spocket Orders
          </button>
        </div>

        {/* System Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={runSystemTest}
            disabled={actionLoading === 'system-test'}
            className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === 'system-test' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <BarChart3 className="h-5 w-5 mr-2" />
            )}
            Complete System Test
          </button>
          
          <button
            onClick={checkInventory}
            disabled={actionLoading === 'inventory-check'}
            className="flex items-center justify-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === 'inventory-check' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Package className="h-5 w-5 mr-2" />
            )}
            Check Inventory
          </button>
          
          <button
            onClick={testSuppliers}
            disabled={actionLoading === 'supplier-test'}
            className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === 'supplier-test' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Users className="h-5 w-5 mr-2" />
            )}
            Test Suppliers
          </button>
          
          <button
            onClick={sendOrderNotifications}
            disabled={actionLoading === 'notifications'}
            className="flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === 'notifications' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Mail className="h-5 w-5 mr-2" />
            )}
            Test Notifications
          </button>

          <button
            onClick={runViralMarketingStrategy}
            className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg font-bold"
          >
            🚀 VIRAL MARKETING STRATEGIE
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Totaal Producten</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Totaal Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Totale Omzet</p>
                  <p className="text-2xl font-bold text-gray-900">€{stats.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Totale Winst</p>
                  <p className="text-2xl font-bold text-gray-900">€{stats.totalProfit.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recente Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dropship
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bedrag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Winst
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shippingAddress.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDropshipStatusColor(order.dropshipStatus)}`}>
                        {order.dropshipStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="text-green-600 font-semibold">
                        €{order.profit?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.profitMargin?.toFixed(1) || '0'}% marge
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('nl-NL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Dropshipping Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">Producten Importeren:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Importeer dagelijks nieuwe trending producten</li>
                <li>Controleer prijzen en marge voor winstgevendheid</li>
                <li>Kies producten met goede reviews (4+ sterren)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Order Verwerking:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Forward orders binnen 24 uur naar leveranciers</li>
                <li>Gebruik tracking codes voor klantcommunicatie</li>
                <li>Monitor winstmarges per product</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
