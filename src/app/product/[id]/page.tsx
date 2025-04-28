"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);

  // Fetch product details from the API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);

        // Log the fetched product data
        if (session?.user?.id && data?._id) {
          await fetch("/api/recentlyViewed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: session.user.id,
              productId: data._id,
            }),
          });
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, session]);

  // Handle adding product to cart
  const handleAddToCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?._id, quantity: 1 }),
      });

      if (response.ok) {
        toast.success("Added to cart!");
      } else {
        const errorData = await response.json();
        console.error("Failed to add product to cart:", errorData);
        toast.error("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred while adding to cart");
    }
  };

  // Handle adding product to wishlist
  const handleAddToWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id || "demoUser",
          productId: product?._id,
        }),
      });

      if (response.ok) {
        toast.success("Added to wishlist!");
      } else {
        toast.error("Failed to add to wishlist.");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  if (!product) return <p>Loading....</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{product.name}</h1>

      <div className="w-full flex items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-4 shadow-md">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-[500px] w-full h-auto object-contain"
        />
      </div>

      <p className="mt-6 text-gray-700">{product.description}</p>
      <p className="font-bold text-2xl mt-4">${product.price.toFixed(2)}</p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Add to Cart
        </button>
        <button
          onClick={handleAddToWishlist}
          className="flex-1 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
        >
          Add to Wishlist
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
