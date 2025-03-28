import mongoose from 'mongoose';

// Schema for each item in the cart
const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Refers to the product added
  quantity: { type: Number, default: 1 },                              // Quantity of this product
  addedAt: { type: Date, default: Date.now }                           // Timestamp when item was added
});

// Cart schema - one per user
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }, // Unique per user
  items: [cartItemSchema],                                                     // Array of products in the cart
  updatedAt: { type: Date, default: Date.now }                                 // Last updated timestamp
});

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
