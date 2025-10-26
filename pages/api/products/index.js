import connectDB from '../../../lib/mongodb'
import Product from '../../../models/Product'

export default async function handler(req, res) {
  await connectDB()

  if (req.method === 'GET') {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        minPrice,
        maxPrice,
        sort = 'createdAt',
        order = 'desc',
        search
      } = req.query

      // Build filter object
      const filter = { isActive: true }
      
      if (category && category !== 'all') {
        filter.category = category
      }
      
      if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) filter.price.$gte = parseFloat(minPrice)
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
      }
      
      if (search) {
        filter.$text = { $search: search }
      }

      // Build sort object
      const sortObj = {}
      if (sort === 'price') {
        sortObj.price = order === 'asc' ? 1 : -1
      } else if (sort === 'rating') {
        sortObj.averageRating = order === 'asc' ? 1 : -1
      } else if (sort === 'popular') {
        sortObj.sales = -1
      } else {
        sortObj[sort] = order === 'asc' ? 1 : -1
      }

      const skip = (parseInt(page) - 1) * parseInt(limit)

      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort(sortObj)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Product.countDocuments(filter)
      ])

      res.status(200).json({
        success: true,
        products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      res.status(500).json({
        success: false,
        message: 'Error fetching products',
        error: error.message
      })
    }
  } else if (req.method === 'POST') {
    try {
      const product = new Product(req.body)
      await product.save()
      
      res.status(201).json({
        success: true,
        data: product
      })
    } catch (error) {
      console.error('Error creating product:', error)
      res.status(500).json({
        success: false,
        message: 'Error creating product',
        error: error.message
      })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`
    })
  }
}
