import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  images: [{
    url: String,
    alt: String
  }],
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'fashion', 'home', 'sports', 'beauty', 'other']
  },
  subcategory: {
    type: String
  },
  brand: {
    type: String
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  specifications: {
    type: Map,
    of: String
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    }
  },
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Indexes voor betere performance
ProductSchema.index({ name: 'text', description: 'text' })
ProductSchema.index({ category: 1, isActive: 1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ averageRating: -1 })
ProductSchema.index({ createdAt: -1 })

// Virtual voor discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
  }
  return 0
})

// Method om rating te updaten
ProductSchema.methods.updateRating = function() {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0)
    this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10
    this.totalReviews = this.reviews.length
  } else {
    this.averageRating = 0
    this.totalReviews = 0
  }
}

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
