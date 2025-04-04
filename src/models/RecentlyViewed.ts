import mongoose from 'mongoose';

// Define the schema for items in the recently viewed products
const viewedItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to Product model
  viewedAt: { type: Date, default: Date.now }                          // Date when the product was viewed
});

// Define the schema for the recently viewed products
const recentlyViewedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }, // One record per user
  items: [viewedItemSchema]                                                   // Array to hold viewed products
});

export default mongoose.models.RecentlyViewed || mongoose.model('RecentlyViewed', recentlyViewedSchema);
