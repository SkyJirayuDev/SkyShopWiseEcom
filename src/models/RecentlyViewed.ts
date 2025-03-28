import mongoose from 'mongoose';

const viewedItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Viewed product
  viewedAt: { type: Date, default: Date.now }                          // When it was viewed
});

const recentlyViewedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true }, // One record per user
  items: [viewedItemSchema]                                                   // Array of viewed products
});

export default mongoose.models.RecentlyViewed || mongoose.model('RecentlyViewed', recentlyViewedSchema);