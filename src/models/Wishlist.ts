import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Product in wishlist
  addedAt: { type: Date, default: Date.now }                           // When it was added
});

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }, // One wishlist per user
  items: [wishlistItemSchema]                                                  // Array of products
});

export default mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
