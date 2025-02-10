"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";

// Interface สำหรับ Product และ CartItem
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  _id: string;
  quantity: number;
  product: Product | null;
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setError("Please log in to view your cart.");
      return;
    }
    fetchCartItems();
  }, [session, status]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/cart", { method: "GET" });
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();
      setCartItems(data);
    } catch (error: any) {
      console.error("Failed to fetch cart items:", error);
      setError(error.message || "Failed to fetch cart items");
    }
  };

  const handleRemove = async (cartItemId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId }),
      });
      if (response.ok) {
        toast.success("Item removed from cart!");
        fetchCartItems();
      } else {
        console.error("Failed to remove item");
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Error removing item");
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
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) =>
          item.product ? (
            <div
              key={item._id}
              className="border p-4 mb-4 rounded shadow flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="text-xl font-semibold">{item.product.name}</h2>
                  <p>Price: ${item.product.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Total: ${item.product.price * item.quantity}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ) : (
            <div
              key={item._id}
              className="border p-4 mb-4 rounded shadow bg-gray-100 text-gray-500 flex justify-between items-center"
            >
              <p>Product not available</p>
              <button
                onClick={() => handleRemove(item._id)}
                className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          )
        )
      )}
    </div>
  );
}
