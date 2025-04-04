import mongoose from "mongoose";

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stock: Number,
  embedding: {
    type: [Number], 
    default: undefined,
  },
});

// Create the Product model using the schema
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
