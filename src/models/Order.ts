import mongoose, { Schema, Document } from 'mongoose';

interface Order extends Document {
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  createdAt: Date;
}

const OrderSchema = new Schema<Order>({
    userId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  });  

export default mongoose.models.Order || mongoose.model<Order>('Order', OrderSchema);
