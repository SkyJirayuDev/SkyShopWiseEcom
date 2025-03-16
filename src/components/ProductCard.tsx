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
  inWishlist?: boolean;
}

interface ProductCardProps {
  product: Product;
  // คุณสามารถเพิ่ม props อื่น ๆ เช่น flag สำหรับแสดง/ซ่อนปุ่มเพิ่มเติมได้
  showButtons?: boolean;
}

export default function ProductCard({
  product,
  showButtons = true,
}: ProductCardProps) {
  const { data: session } = useSession();

  const handleAddToCart = async () => {
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
      toast.error(
        "An error occurred while adding the item to your cart. Please log in to continue."
      );
    }
  };

  const handleAddToWishlist = async () => {
    if (!session) {
      toast.error("Failed to add to wishlist. Please log in to continue.");
      return;
    }
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
    <div className="border rounded-lg p-2 sm:p-4 shadow-md bg-white flex flex-col h-full transition-all duration-300 hover:shadow-xl">
      {/* ส่วนแสดงภาพสินค้า - ทำให้รูปภาพคลิกได้ */}
      <Link href={`/product/${product._id}`}>
        <div className="w-full aspect-video bg-gray-100 flex items-center justify-center overflow-hidden rounded relative cursor-pointer">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain transition-transform duration-500 hover:scale-105" 
          />
          
          {/* Wishlist button repositioned to top right with star icon */}
          {showButtons && (
            <button
              onClick={(e) => {
                e.preventDefault(); // ป้องกันการเปิดลิงก์เมื่อคลิกปุ่ม wishlist
                handleAddToWishlist();
              }}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white bg-opacity-75 hover:bg-opacity-100 p-1 sm:p-2 rounded-full shadow-md transition-all duration-300 hover:transform hover:scale-110 text-base sm:text-lg"
              aria-label="Add to wishlist"
            >
              {product.inWishlist ? (
                <span className="text-yellow-500 transition-colors duration-300">★</span>
              ) : (
                <span className="text-gray-400 transition-colors duration-300">☆</span>
              )}
            </button>
          )}
        </div>
      </Link>
  
      {/* ส่วนเนื้อหาสินค้า - ทำให้ชื่อสินค้าคลิกได้ */}
      <div className="mt-2 sm:mt-4 flex-1">
        <Link href={`/product/${product._id}`}>
          <h2 className="text-gray-800 text-sm sm:text-base md:text-lg lg:text-xl font-semibold transition-colors duration-300 hover:text-blue-600 line-clamp-1 cursor-pointer">
            {product.name}
          </h2>
        </Link>
        
        {/* ใช้ line-clamp-2 เพื่อตัดรายละเอียดสินค้าหากยาวเกิน 2 บรรทัด */}
        <p className="text-gray-600 text-xs sm:text-sm overflow-hidden text-ellipsis line-clamp-2 mt-1 sm:mt-2">
          {product.description}
        </p>
        <p className="text-gray-800 font-bold mt-1 sm:mt-3 text-sm sm:text-base md:text-lg lg:text-xl">
          ${product.price}
        </p>
      </div>
  
      {/* ส่วนปุ่มด้านล่าง - มีเฉพาะปุ่ม Add to Cart */}
      {showButtons && (
        <div className="mt-2 sm:mt-4">
          <button
            onClick={handleAddToCart}
            className="w-full bg-green-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded font-medium transition-all duration-300 hover:bg-green-600 transform hover:-translate-y-1 text-xs sm:text-sm md:text-base"
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
