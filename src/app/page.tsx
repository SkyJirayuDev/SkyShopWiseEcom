"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Chatbot from "../components/Chatbot";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        console.log("Fetched products:", data);

        if (Array.isArray(data)) {
          // ถ้า API ส่ง array ตรงๆ
          setProducts(data.slice(0, 6));
        } else if (data.products && Array.isArray(data.products)) {
          // ถ้า API ส่งมาในรูปแบบ { products: [...] }
          setProducts(data.products.slice(0, 6));
        } else {
          console.error("Invalid products data:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Recommendation Items (Carousel/Grid) */}
        <section className="my-8">
          <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded p-4">Product 1</div>
              <div className="border rounded p-4">Product 2</div>
              <div className="border rounded p-4">Product 3</div>
            </div>
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 border rounded">
              Previous
            </button>
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 border rounded">
              Next
            </button>
          </div>
        </section>

        <section className="text-center my-8">
          <h1 className="text-4xl font-bold text-blue-600">Welcome to ShopWise</h1>
          <p className="text-gray-600 mt-2">Smart Shopping for Your IT Needs</p>
        </section>

        <section className="my-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            Featured Products
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg p-4 shadow-md bg-white"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded"
                />
                <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="font-bold mt-2">${product.price}</p>
                <Link
                  href={`/product/${product._id}`}
                  className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch("/api/cart", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          productId: product._id, // ✅ ส่งแค่ productId
                          quantity: 1, // ✅ ระบุจำนวนสินค้า
                        }),
                      });

                      if (!response.ok) {
                        throw new Error("Failed to add to cart");
                      }

                      alert("Added to cart!");
                    } catch (error) {
                      console.error("Error adding to cart:", error);
                      alert("An error occurred while adding to cart.");
                    }
                  }}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {/* ปุ่มลิงก์ไปหน้าสินค้าทั้งหมด */}
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              View All Products
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section className="my-8">
          <h2 className="text-xl font-semibold mb-4">Product Categories</h2>
          <div className="flex space-x-4">
            <button className="border p-2 rounded">Laptops</button>
            <button className="border p-2 rounded">Keyboards</button>
            <button className="border p-2 rounded">Accessories</button>
          </div>
        </section>

        {/* Featured Products */}
        <section className="my-8">
          <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded p-4">Featured 1</div>
            <div className="border rounded p-4">Featured 2</div>
            <div className="border rounded p-4">Featured 3</div>
          </div>
        </section>

        {/* Recent Products */}
        <section className="my-8">
          <h2 className="text-xl font-semibold mb-4">Latest Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded p-4">New Product 1</div>
            <div className="border rounded p-4">New Product 2</div>
            <div className="border rounded p-4">New Product 3</div>
          </div>
        </section>

        {/* Chatbot */}
        <section className="my-8">
          <Chatbot />
        </section>
      </main>
    </div>
  );
}
