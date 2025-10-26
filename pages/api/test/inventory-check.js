import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

// Real-time Inventory Check
export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'POST') {
    try {
      console.log('📦 Real-time inventory check gestart...')

      const inventoryReport = {
        totalProducts: 0,
        availableProducts: 0,
        outOfStockProducts: 0,
        lowStockProducts: 0,
        productsWithSuppliers: 0,
        productsWithoutSuppliers: 0,
        averageStock: 0,
        totalValue: 0,
        issues: [],
        recommendations: []
      }

      // Haal alle producten op
      const allProducts = await Product.find({ isActive: true })
      inventoryReport.totalProducts = allProducts.length

      let totalStock = 0
      let totalValue = 0
      const lowStockThreshold = 10

      for (const product of allProducts) {
        // Stock analysis
        if (product.stock > 0) {
          inventoryReport.availableProducts++
        } else {
          inventoryReport.outOfStockProducts++
          inventoryReport.issues.push(`${product.name} is uitverkocht`)
        }

        if (product.stock > 0 && product.stock <= lowStockThreshold) {
          inventoryReport.lowStockProducts++
          inventoryReport.issues.push(`${product.name} heeft lage voorraad (${product.stock})`)
        }

        // Supplier analysis
        if (product.supplier && product.supplier.name && product.supplier.email) {
          inventoryReport.productsWithSuppliers++
        } else {
          inventoryReport.productsWithoutSuppliers++
          inventoryReport.issues.push(`${product.name} heeft geen leverancier informatie`)
        }

        // Value calculation
        const productValue = product.price * product.stock
        totalValue += productValue
        totalStock += product.stock
      }

      inventoryReport.averageStock = inventoryReport.totalProducts > 0 ? 
        Math.round(totalStock / inventoryReport.totalProducts) : 0
      inventoryReport.totalValue = Math.round(totalValue * 100) / 100

      // Generate recommendations
      if (inventoryReport.outOfStockProducts > 0) {
        inventoryReport.recommendations.push(`Herstel voorraad voor ${inventoryReport.outOfStockProducts} uitverkochte producten`)
      }

      if (inventoryReport.lowStockProducts > 0) {
        inventoryReport.recommendations.push(`Bestel nieuwe voorraad voor ${inventoryReport.lowStockProducts} producten met lage voorraad`)
      }

      if (inventoryReport.productsWithoutSuppliers > 0) {
        inventoryReport.recommendations.push(`Voeg leverancier informatie toe aan ${inventoryReport.productsWithoutSuppliers} producten`)
      }

      if (inventoryReport.availableProducts < 20) {
        inventoryReport.recommendations.push('Importeer meer producten voor betere klantkeuze')
      }

      console.log(`📦 Inventory check voltooid: ${inventoryReport.availableProducts}/${inventoryReport.totalProducts} producten beschikbaar`)

      res.status(200).json({
        success: true,
        message: 'Real-time inventory check voltooid',
        data: inventoryReport
      })

    } catch (error) {
      console.error('❌ Inventory check gefaald:', error)
      res.status(500).json({
        success: false,
        message: 'Inventory check gefaald',
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
