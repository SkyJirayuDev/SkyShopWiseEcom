"use client";

import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
  // คุณสามารถเพิ่ม props อื่น ๆ เช่น flag สำหรับแสดง/ซ่อนปุ่มเพิ่มเติมได้
  showButtons?: boolean;
}

export default function ProductCard({ product, showButtons = true }: ProductCardProps) {
  const { data: session } = useSession();

  const handleAddToCart = async () => {
    // ตรวจสอบว่าผู้ใช้ได้ล็อกอินหรือไม่
    if (!session) {
      toast.error("An error occurred while adding the item to your cart. Please log in to continue.");
      return;
    }
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
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred while adding the item to your cart. Please log in to continue.");
    }
  };

  const handleAddToWishlist = async () => {
    // ตรวจสอบว่าผู้ใช้ได้ล็อกอินหรือไม่
    if (!session) {
      toast.error("Failed to add to wishlist. Please log in to continue.");
      return;
    }
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // ใช้ข้อมูลจาก session แทนการส่ง userId แบบ hard-coded
          userId: session.user?.id,
          productId: product._id,
        }),
      });
      if (response.ok) {
        toast.success("Added to wishlist!");
      } else {
        toast.error("Failed to add to wishlist. Please log in to continue.");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("An error occurred while adding to wishlist.");
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <div className="w-full aspect-video bg-gray-100 flex items-center justify-center overflow-hidden rounded">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="font-bold mt-2">${product.price}</p>
      {showButtons && (
        <div className="mt-3 space-x-2">
          <Link
            href={`/product/${product._id}`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add to Cart
          </button>
          <button
            onClick={handleAddToWishlist}
            className="text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            💟
          </button>
        </div>
      )}
    </div>
  );
}
