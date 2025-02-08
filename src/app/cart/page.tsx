"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ✅ สร้าง Product Interface สำหรับสินค้า
interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

// ✅ ปรับปรุง CartItem Interface ให้ใช้ Product
interface CartItem {
  _id: string;
  quantity: number;
  product: Product; // ใช้ product แทน productId
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
        toast.success("Item removed from cart!");
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
          {/* ✅ ปุ่มสำหรับลบสินค้า */}
          <button
            onClick={() => handleRemove(item._id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={async () => {
          const userId = "demoUser"; // สมมติว่า userId เป็น demoUser

          // ✅ แปลง cartItems ให้อยู่ในรูปแบบที่ถูกต้อง
          const orderItems = cartItems.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
          }));

          const total = orderItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );

          console.log("Order Items:", orderItems); // ✅ ตรวจสอบก่อนส่งข้อมูล

          const response = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, cartItems: orderItems, total }),
          });

          const data = await response.json();

          if (data.message) {
            toast.success("Order placed successfully!");
          } else {
            toast.error("Failed to place order.");
          }
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
      >
        Place Order
      </button>
    </div>
  );
}
