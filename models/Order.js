import mongoose from 'mongoose'

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest orders
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: String
  },
  billingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  payment: {
    method: {
      type: String,
      enum: ['stripe', 'ideal', 'paypal', 'card'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    amount: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shipping: {
    method: {
      type: String,
      required: true
    },
    cost: {
      type: Number,
      required: true
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  totals: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  notes: String,
  dropshipStatus: {
    type: String,
    enum: ['pending', 'forwarded', 'shipped', 'completed', 'failed'],
    default: 'pending'
  },
  dropshipInstructions: String,
  dropshipCost: Number,
  profit: Number,
  profitMargin: Number,
  trackingEvents: [{
    status: String,
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
})

// Pre-save middleware om order number te genereren
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

// Method om status te updaten
OrderSchema.methods.updateStatus = function(newStatus, message) {
  this.status = newStatus
  this.trackingEvents.push({
    status: newStatus,
    message: message || `Status gewijzigd naar ${newStatus}`,
    timestamp: new Date()
  })
  return this.save()
}

// Virtual voor totaal aantal items
OrderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0)
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)
