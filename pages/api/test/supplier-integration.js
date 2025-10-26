import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// Supplier Integration Test
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('🏭 Supplier integratie test gestart...')

      const supplierReport = {
        totalSuppliers: 0,
        aliExpressSuppliers: 0,
        spocketSuppliers: 0,
        otherSuppliers: 0,
        suppliersWithContact: 0,
        suppliersWithoutContact: 0,
        averageDeliveryTime: 0,
        supplierIssues: [],
        recommendations: []
      }

      // Haal alle producten met leveranciers op
      const productsWithSuppliers = await Product.find({
        'supplier.name': { $exists: true }
      })

      const supplierMap = new Map()
      let totalDeliveryDays = 0
      let deliveryCount = 0

      for (const product of productsWithSuppliers) {
        const supplierName = product.supplier.name
        
        if (!supplierMap.has(supplierName)) {
          supplierMap.set(supplierName, {
            name: supplierName,
            email: product.supplier.email,
            contact: product.supplier.contact,
            products: 0,
            hasContact: false,
            supplierType: 'unknown'
          })
        }

        const supplier = supplierMap.get(supplierName)
        supplier.products++

        // Check contact information
        if (product.supplier.email || product.supplier.contact) {
          supplier.hasContact = true
          supplierReport.suppliersWithContact++
        } else {
          supplierReport.suppliersWithoutContact++
          supplierReport.supplierIssues.push(`${supplierName} heeft geen contact informatie`)
        }

        // Determine supplier type
        if (product.supplier.aliexpressUrl || supplierName.toLowerCase().includes('aliexpress')) {
          supplier.supplierType = 'aliexpress'
          supplierReport.aliExpressSuppliers++
        } else if (product.supplier.spocketUrl || supplierName.toLowerCase().includes('spocket')) {
          supplier.supplierType = 'spocket'
          supplierReport.spocketSuppliers++
        } else {
          supplier.supplierType = 'other'
          supplierReport.otherSuppliers++
        }

        // Estimate delivery time based on supplier type
        let deliveryDays = 14 // Default
        if (supplier.supplierType === 'spocket') {
          deliveryDays = 7 // Spocket is faster (US/EU)
        } else if (supplier.supplierType === 'aliexpress') {
          deliveryDays = 21 // AliExpress is slower (China)
        }

        totalDeliveryDays += deliveryDays
        deliveryCount++
      }

      supplierReport.totalSuppliers = supplierMap.size
      supplierReport.averageDeliveryTime = deliveryCount > 0 ? 
        Math.round(totalDeliveryDays / deliveryCount) : 0

      // Generate recommendations
      if (supplierReport.suppliersWithoutContact > 0) {
        supplierReport.recommendations.push(`Voeg contact informatie toe aan ${supplierReport.suppliersWithoutContact} leveranciers`)
      }

      if (supplierReport.aliExpressSuppliers === 0) {
        supplierReport.recommendations.push('Importeer AliExpress producten voor lagere kosten')
      }

      if (supplierReport.spocketSuppliers === 0) {
        supplierReport.recommendations.push('Importeer Spocket producten voor snellere levering')
      }

      if (supplierReport.averageDeliveryTime > 14) {
        supplierReport.recommendations.push('Overweeg meer lokale leveranciers voor snellere levering')
      }

      console.log(`🏭 Supplier test voltooid: ${supplierReport.totalSuppliers} leveranciers gevonden`)

      res.status(200).json({
        success: true,
        message: 'Supplier integratie test voltooid',
        data: {
          ...supplierReport,
          suppliers: Array.from(supplierMap.values())
        }
      })

    } catch (error) {
      console.error('❌ Supplier test gefaald:', error)
      res.status(500).json({
        success: false,
        message: 'Supplier test gefaald',
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
