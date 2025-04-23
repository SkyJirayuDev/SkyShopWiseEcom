"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

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

  // Fetch products from the API
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

  // Handle search input change
  const filteredProducts = products
    .filter(
      (product) =>
        (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) &&
        (selectedCategory === "All" || product.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="container mx-auto p-4">
      {/* Search, Filter, Sort */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Search: อยู่บรรทัดบน เต็มความกว้าง */}
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Category + Sort: อยู่บรรทัดล่างในแถวเดียวกัน */}
        <div className="flex flex-row gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 text-gray-600 border p-2 rounded shadow-sm"
          >
            <option value="All">All Categories</option>
            <option value="Accessories">Accessories</option>
            <option value="Audio">Audio</option>
            <option value="Cameras">Cameras</option>
            <option value="Gaming">Gaming</option>
            <option value="Laptops">Laptops</option>
            <option value="Monitors">Monitors</option>
            <option value="Storage">Storage</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="flex-1 text-gray-600 border p-2 rounded shadow-sm"
          >
            <option value="default">Sort By</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6">All Products</h1>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
