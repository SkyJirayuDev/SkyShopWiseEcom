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
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("default");

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

  // ✅ Filtering & Sorting
  const filteredProducts = products
    .filter(
      (product) =>
        (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedCategory === "All" || product.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="container mx-auto p-4">
      {/* ✅ Search, Filter, Sort */}
      <div className="flex justify-center mb-6 space-x-4">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className=" text-gray-600 border p-2 rounded shadow-sm"
        >
          <option value="All">All Categories</option>
          <option value="Laptops">Laptops</option>
          <option value="Accessories">Accessories</option>
          <option value="Audio">Audio</option>
          <option value="Gaming">Gaming</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className=" text-gray-600 border p-2 rounded shadow-sm"
        >
          <option value="default">Sort By</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">All Products</h1>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="text-xl text-gray-600 font-semibold mt-4">
                {product.name}
              </h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-gray-600 font-bold mt-2">${product.price}</p>
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
                        productId: product._id,
                        quantity: 1,
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
