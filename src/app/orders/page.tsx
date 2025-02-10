"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Interface สำหรับ Order และ OrderItem (อาจปรับแก้ตาม Model ที่แก้ไขแล้ว)
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  // ไม่จำเป็นต้องมี userId เพราะเราจะใช้ session แทน
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export default function OrderHistoryPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return; // รอให้ session โหลดเสร็จ
    if (!session) {
      setError("Please log in to view your orders.");
      return;
    }
    fetchOrders();
  }, [session, status]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // ไม่ต้องส่ง header user-id เพราะ API จะดึงจาก session
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      console.log("Fetched Orders:", data);
      setOrders(data);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setError(error.message || "Failed to fetch orders");
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
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded shadow">
            <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
            <p className="text-gray-600">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="font-bold">Total: ${order.total}</p>
            <div className="mt-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center mb-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <h3>{item.name}</h3>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
