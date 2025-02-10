// src/models/Cart.ts
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",  // อ้างอิงโมเดล Product
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
