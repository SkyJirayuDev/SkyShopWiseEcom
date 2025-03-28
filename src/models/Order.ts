// ✅ /models/Order.ts
import mongoose from 'mongoose';

const orderProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  priceAtOrder: Number
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderProductSchema], // ✅ Changed from products to items
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
