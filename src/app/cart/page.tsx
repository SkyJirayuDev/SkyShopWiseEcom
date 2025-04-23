"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";

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

  // Fetch cart items when the session is available
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setError("Please log in to view your cart.");
      return;
    }
    fetchCartItems();
  }, [session, status]);

  // Fetch cart items from the server
  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/cart", { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch cart items");
      const data = await response.json();
      setCartItems(data);
    } catch (error: any) {
      console.error("Failed to fetch cart items:", error);
      setError(error.message || "Failed to fetch cart items");
    }
  };

  // Handle removing an item from the cart
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
        toast.error("Failed to remove item");
      }
    } catch (error) {
      toast.error("Error removing item");
    }
  };

  // Handle placing an order
  const handlePlaceOrder = async () => {
    try {
      const cartProducts = cartItems
        .filter((item) => item.product) //Filter invalid items
        .map((item) => ({
          productId: item.product!._id,
          quantity: item.quantity,
          priceAtOrder: item.product!.price,
        }));
  
      // Calculate total price
      const total = cartProducts.reduce((acc, item) => {
        return acc + item.priceAtOrder * item.quantity;
      }, 0);
  
      // Validate cart items and total
      if (cartProducts.length === 0 || total === 0) {
        toast.error("Cart is empty or invalid.");
        return;
      }
  
      // Send order details to the server
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: cartProducts, total }),
      });
  
      if (!response.ok) throw new Error("Failed to place order");
  
      toast.success("Order placed successfully!");
      setCartItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    }
  };  

  // Render the cart page
  if (status === "loading") return <div>Loading...</div>;
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
            <div key={item._id} className="border p-4 mb-4 rounded shadow flex items-center justify-between">
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
            <div key={item._id} className="border p-4 mb-4 rounded shadow bg-gray-100 text-gray-500 flex justify-between items-center">
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

      {/* Display total price */}
      {cartItems.length > 0 && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
