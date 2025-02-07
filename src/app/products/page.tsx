"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]); // ✅ ตั้งค่าเริ่มต้นเป็น Array ว่าง

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        console.log("Fetched products:", data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">All Products</h1>

      {products.length === 0 ? ( // ✅ ตรวจสอบก่อนแสดงผล
        <p className="text-center text-gray-500">No products available.</p>
      ) : (
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
      )}
    </div>
  );
}
