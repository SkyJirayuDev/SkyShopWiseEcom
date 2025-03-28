"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";

interface WishlistItem {
  _id: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setError("Please log in to view your wishlist.");
      return;
    }
    fetchWishlist();
  }, [session, status]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist items");
      }
      const data = await response.json();

      // Remove duplicate products based on product._id
      const uniqueItems = data.filter(
        (item: WishlistItem, index: number, self: WishlistItem[]) =>
          item.product &&
          index ===
            self.findIndex(
              (t) => t.product && t.product._id === item.product?._id
            )
      );

      setWishlistItems(uniqueItems);
    } catch (error: any) {
      console.error("Error fetching wishlist:", error);
      setError(error.message || "Failed to fetch wishlist items");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <p>{error}</p>
        <Link href="/login">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Wishlist ❤️</h1>
      {wishlistItems.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        wishlistItems.map((item) => (
          <div key={item.product?._id} className="border p-4 mb-4 rounded shadow">
            {item.product ? (
              <>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <h2 className="text-xl">{item.product.name}</h2>
                <p>Price: ${item.product.price}</p>
              </>
            ) : (
              <div className="p-2">
                <p className="text-gray-500">Product not available</p>
              </div>
            )}
            <button
              onClick={async () => {
                try {
                  const removePayload: { productId?: string } = {
                    productId: item.product ? item.product._id : undefined,
                  };
                  const response = await fetch("/api/wishlist", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(removePayload),
                  });
                  if (!response.ok) {
                    throw new Error("Failed to remove item from wishlist");
                  }
                  toast.success("Removed from wishlist!");
                  setWishlistItems((prev) =>
                    prev.filter((w) => w.product?._id !== item.product?._id)
                  );
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to remove item.");
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2"
            >
              Remove from Wishlist
            </button>
          </div>
        ))
      )}
    </div>
  );
}
