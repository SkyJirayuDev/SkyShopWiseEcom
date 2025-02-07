import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number,
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
