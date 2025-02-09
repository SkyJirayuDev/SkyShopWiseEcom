import mongoose, { Schema, Document } from 'mongoose';

interface WishlistItem extends Document {
  userId: string;
  productId: mongoose.Schema.Types.ObjectId;
}

const WishlistSchema = new Schema<WishlistItem>({
  userId: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

export default mongoose.models.Wishlist || mongoose.model<WishlistItem>('Wishlist', WishlistSchema);
