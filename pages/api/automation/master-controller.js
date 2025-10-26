import connectDB from '../../../lib/mongodb'
import axios from 'axios'

// Master Automation Controller - Regelt alles automatisch
export default async function handler(req, res) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key
  const expectedKey = process.env.CRON_API_KEY
  
  if (apiKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid API key'
    })
  }

  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('🤖 MASTER AUTOMATION CONTROLLER GESTART...')
      console.log('⏰ Tijd:', new Date().toLocaleString('nl-NL'))
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
      const results = {
        timestamp: new Date().toISOString(),
        automationSteps: []
      }

      // STAP 1: Automatische producten toevoegen
      console.log('📦 STAP 1: Automatische producten toevoegen...')
      try {
        const productsResponse = await axios.post(`${appUrl}/api/automation/auto-products-enhanced`, {}, {
          headers: { 'x-api-key': process.env.CRON_API_KEY }
        })
        results.automationSteps.push({
          step: 'Producten Toevoegen',
          status: 'success',
          data: productsResponse.data.data
        })
        console.log('✅ Producten toegevoegd:', productsResponse.data.data)
      } catch (error) {
        results.automationSteps.push({
          step: 'Producten Toevoegen',
          status: 'error',
          error: error.message
        })
        console.error('❌ Fout bij producten toevoegen:', error.message)
      }

      // STAP 2: Automatische order forwarding
      console.log('📦 STAP 2: Automatische order forwarding...')
      try {
        const forwardingResponse = await axios.post(`${appUrl}/api/automation/auto-order-forwarding`, {}, {
          headers: { 'x-api-key': process.env.CRON_API_KEY }
        })
        results.automationSteps.push({
          step: 'Order Forwarding',
          status: 'success',
          data: forwardingResponse.data.data
        })
        console.log('✅ Orders doorgestuurd:', forwardingResponse.data.data)
      } catch (error) {
        results.automationSteps.push({
          step: 'Order Forwarding',
          status: 'error',
          error: error.message
        })
        console.error('❌ Fout bij order forwarding:', error.message)
      }

      // STAP 3: Automatische order verwerking
      console.log('📋 STAP 3: Automatische order verwerking...')
      try {
        const ordersResponse = await axios.post(`${appUrl}/api/automation/auto-orders`, {}, {
          headers: { 'x-api-key': process.env.CRON_API_KEY }
        })
        results.automationSteps.push({
          step: 'Order Verwerking',
          status: 'success',
          data: ordersResponse.data.data
        })
        console.log('✅ Orders verwerkt:', ordersResponse.data.data)
      } catch (error) {
        results.automationSteps.push({
          step: 'Order Verwerking',
          status: 'error',
          error: error.message
        })
        console.error('❌ Fout bij order verwerking:', error.message)
      }

      // STAP 4: Automatische marketing
      console.log('📢 STAP 4: Automatische marketing...')
      try {
        const marketingResponse = await axios.post(`${appUrl}/api/automation/auto-marketing`, {}, {
          headers: { 'x-api-key': process.env.CRON_API_KEY }
        })
        results.automationSteps.push({
          step: 'Marketing',
          status: 'success',
          data: marketingResponse.data.data
        })
        console.log('✅ Marketing uitgevoerd:', marketingResponse.data.data)
      } catch (error) {
        results.automationSteps.push({
          step: 'Marketing',
          status: 'error',
          error: error.message
        })
        console.error('❌ Fout bij marketing:', error.message)
      }

      // STAP 5: Volledige automatisering
      console.log('🚀 STAP 5: Volledige automatisering...')
      try {
        const fullResponse = await axios.post(`${appUrl}/api/automation/full-automation`, {}, {
          headers: { 'x-api-key': process.env.CRON_API_KEY }
        })
        results.automationSteps.push({
          step: 'Volledige Automatisering',
          status: 'success',
          data: fullResponse.data.data
        })
        console.log('✅ Volledige automatisering:', fullResponse.data.data)
      } catch (error) {
        results.automationSteps.push({
          step: 'Volledige Automatisering',
          status: 'error',
          error: error.message
        })
        console.error('❌ Fout bij volledige automatisering:', error.message)
      }

      // Bereken success rate
      const successfulSteps = results.automationSteps.filter(step => step.status === 'success').length
      const totalSteps = results.automationSteps.length
      const successRate = (successfulSteps / totalSteps) * 100

      console.log(`🎯 MASTER AUTOMATION VOLTOOID: ${successfulSteps}/${totalSteps} stappen succesvol (${successRate.toFixed(1)}%)`)

      res.status(200).json({
        success: true,
        message: 'Master Automation Controller succesvol uitgevoerd',
        summary: {
          totalSteps,
          successfulSteps,
          failedSteps: totalSteps - successfulSteps,
          successRate: `${successRate.toFixed(1)}%`,
          timestamp: new Date().toISOString()
        },
        results
      })

    } catch (error) {
      console.error('❌ Master Automation Controller fout:', error)
      res.status(500).json({
        success: false,
        message: 'Master Automation Controller gefaald',
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    })
  }
}
