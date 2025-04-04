import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import { OpenAI } from "openai";
import Product from "@/models/Product"; 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB");
  }
}

async function generateEmbeddingForProduct(product: any) {
  const input = `${product.name}. ${product.description}`;

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input,
    });

    const embedding = response.data[0].embedding;

    await Product.updateOne(
      { _id: product._id },
      { $set: { embedding } }
    );

    console.log(`✅ Embedding saved for: ${product.name}`);
  } catch (error: any) {
    console.error(`❌ Failed for ${product.name}:`, error.message);
  }
}

async function generateAllEmbeddings() {
  await connectToDatabase();

  const products = await Product.find({});
  console.log(`🔎 Found ${products.length} products to embed`);

  for (const product of products) {
    await generateEmbeddingForProduct(product);
  }

  console.log("🎉 Done generating all embeddings");
  process.exit(0);
}

generateAllEmbeddings();
