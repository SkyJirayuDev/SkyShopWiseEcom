"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface PopulatedProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface OrderItem {
  productId: PopulatedProduct | null;
  quantity: number;
  priceAtOrder: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  orderedAt: string;
}

export default function OrderHistoryPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  // Fetch orders when the component mounts or session changes
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      setError("Please log in to view your orders.");
      return;
    }
    fetchOrders();
  }, [session, status]);

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Error fetching orders.");
    }
  };

  // Handle order cancellation
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
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded shadow">
            <h2 className="text-xl font-semibold">Order ID: {order._id}</h2>
            <p className="text-gray-600">
              Date: {new Date(order.orderedAt).toLocaleDateString()}
            </p>
            <p className="font-bold mb-2">Total: ${order.total}</p>

            {/* Map through order items and display them */}
            {order.items.map((item, index) =>
              item.productId ? (
                <div key={index} className="flex items-center mb-3">
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{item.productId.name}</h3>
                    <p>Price: ${item.priceAtOrder}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total: ${item.priceAtOrder * item.quantity}</p>
                  </div>
                </div>
              ) : (
                <div key={index} className="text-gray-500 italic">
                  Product not available
                </div>
              )
            )}
          </div>
        ))
      )}
    </div>
  );
}
