"use client";

import React, { useEffect, useState } from "react";

interface CartItem {
  _id: string;
  quantity: number;
  productId: {
    name: string;
    price: number;
    image: string;
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ✅ ดึงข้อมูลสินค้าใน Cart
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/cart", { method: "GET" });
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  };

  // ✅ ฟังก์ชันสำหรับลบสินค้าออกจาก Cart
  const handleRemove = async (cartItemId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId }), // ส่ง cartItemId ไปที่ API
      });

      if (response.ok) {
        alert("Item removed from cart!");
        fetchCartItems(); // ✅ ดึงข้อมูลใหม่หลังจากลบ
      } else {
        console.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.map((item) => (
        <div key={item._id} className="border p-4 mb-4 rounded shadow flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={item.productId.image}
              alt={item.productId.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h2 className="text-xl font-semibold">{item.productId.name}</h2>
              <p>Price: ${item.productId.price}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: ${item.productId.price * item.quantity}</p>
            </div>
          </div>
          {/* ✅ ปุ่มสำหรับลบสินค้า */}
          <button
            onClick={() => handleRemove(item._id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
