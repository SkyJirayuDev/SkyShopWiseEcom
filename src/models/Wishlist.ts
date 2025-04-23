import mongoose from 'mongoose';

// Define the schema for items in the wishlist
const wishlistItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to Product model
  addedAt: { type: Date, default: Date.now }                           // Date when the product was added
});

// Define the schema for the wishlist
const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }, // One wishlist per user
  items: [wishlistItemSchema]                                                  // Array to hold products in the wishlist
});

export default mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
