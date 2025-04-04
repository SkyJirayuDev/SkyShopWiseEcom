import mongoose from 'mongoose';

// Define the schema for items in the order
const orderProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to Product model
  quantity: Number,
  priceAtOrder: Number
});

// Define the schema for the order
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
  items: [orderProductSchema], // Array of products in the order
  total: Number,
  status: { type: String, default: 'pending' },
  orderedAt: { type: Date, default: Date.now },
  address: {
    fullName: String,
    street: String,
    city: String,
    postcode: String,
    country: String
  }
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
