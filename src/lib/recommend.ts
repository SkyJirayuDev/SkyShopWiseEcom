import mongoose from "mongoose";
import Order from "@/models/Order";
import Wishlist from "@/models/Wishlist";
import Cart from "@/models/Cart";
import RecentlyViewed from "@/models/RecentlyViewed";
import Product from "@/models/Product";

// Helper: Calculate average vector
function averageVector(vectors: number[][]): number[] {
  const length = vectors[0]?.length || 0;
  const avg = Array(length).fill(0);
  for (const vec of vectors) {
    for (let i = 0; i < length; i++) {
      avg[i] += vec[i];
    }
  }
  return avg.map((v) => v / vectors.length);
}

// Helper: Fetch product embeddings
async function getProductEmbeddings(productIds: mongoose.Types.ObjectId[]): Promise<number[][]> {
  console.log("🔍 Fetching embeddings for product IDs:", productIds); // debug
  const products = await Product.find({
    _id: { $in: productIds },
    embedding: { $exists: true, $ne: null },
  });
  console.log("✅ Embeddings found:", products.length); // debug
  return products.map((p) => p.embedding);
}

// Main function: Generate user profile vector
export async function generateUserProfileVector(userId: string): Promise<number[] | null> {
  const weightConfig = {
    order: 0.4,
    wishlist: 0.3,
    cart: 0.2,
    recentlyViewed: 0.1,
  };

  let allVectors: number[][] = [];

  // ORDERS
  const orders = await Order.find({ userId });
  const orderProductIds = orders.flatMap((order: any) =>
    order.items.map((item: any) => item.productId)
  );
  console.log("🧠 Order product IDs:", orderProductIds); // debug
  const orderVectors = await getProductEmbeddings(orderProductIds);
  console.log("📦 Order vectors:", orderVectors.length); // debug
  const weightedOrder = orderVectors.map((v) => v.map((val) => val * weightConfig.order));
  allVectors.push(...weightedOrder);

  // WISHLIST
  const wishlist = await Wishlist.findOne({ userId });
  const wishlistProductIds = wishlist ? wishlist.items.map((item: any) => item.productId) : [];
  console.log("🧠 Wishlist product IDs:", wishlistProductIds); // debug
  const wishlistVectors = await getProductEmbeddings(wishlistProductIds);
  console.log("📦 Wishlist vectors:", wishlistVectors.length); // debug
  const weightedWishlist = wishlistVectors.map((v) =>
    v.map((val) => val * weightConfig.wishlist)
  );
  allVectors.push(...weightedWishlist);

  // CART
  const cart = await Cart.findOne({ userId });
  const cartProductIds = cart ? cart.items.map((item: any) => item.productId) : [];
  console.log("🧠 Cart product IDs:", cartProductIds); // debug
  const cartVectors = await getProductEmbeddings(cartProductIds);
  console.log("📦 Cart vectors:", cartVectors.length); // debug
  const weightedCart = cartVectors.map((v) => v.map((val) => val * weightConfig.cart));
  allVectors.push(...weightedCart);

  // RECENTLY VIEWED
  const recently = await RecentlyViewed.findOne({ userId });
  const recentProductIds = recently ? recently.items.map((item: any) => item.productId) : [];
  console.log("🧠 Recently Viewed product IDs:", recentProductIds); // debug
  const recentVectors = await getProductEmbeddings(recentProductIds);
  console.log("📦 Recently viewed vectors:", recentVectors.length); // debug
  const weightedRecent = recentVectors.map((v) =>
    v.map((val) => val * weightConfig.recentlyViewed)
  );
  allVectors.push(...weightedRecent);

  // If user has no vector data at all
  if (allVectors.length === 0) {
    console.warn("⚠️ No behavior found for user:", userId);
    return null;
  }

  // Return final average vector
  const userVector = averageVector(allVectors);
  return userVector;
}

// Main function: Get recommended products
export async function getRecommendedProducts(userId: string, topN: number = 10) {
  const userVector = await generateUserProfileVector(userId);
  if (!userVector) return [];

  const products = await Product.find({ embedding: { $exists: true, $ne: null } });

  // Calculate cosine similarity between user and product
  function cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
  }

  const scoredProducts = products.map((product) => {
    const score = cosineSimilarity(userVector, product.embedding);
    return { product, score };
  });

  // Sort by similarity and return top N
  const topProducts = scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((entry) => entry.product);

  return topProducts;
}
