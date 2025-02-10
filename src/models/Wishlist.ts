// src/models/Wishlist.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId; // เปลี่ยนจาก userId เป็น user
  productId: mongoose.Types.ObjectId;
}

const WishlistSchema = new Schema<IWishlist>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

export default mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);
