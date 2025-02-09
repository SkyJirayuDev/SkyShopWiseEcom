'use client';

import React, { useEffect, useState } from 'react';
import toast from "react-hot-toast";

interface WishlistItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const response = await fetch('/api/wishlist', {
        headers: { 'user-id': 'demoUser' },
      });
      const data = await response.json();
      setWishlistItems(data);
    };

    fetchWishlist();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Wishlist ❤️</h1>
      {wishlistItems.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        wishlistItems.map((item) => (
          <div key={item._id} className="border p-4 mb-4 rounded shadow">
            <img src={item.productId.image} alt={item.productId.name} className="w-20 h-20 object-cover rounded" />
            <h2 className="text-xl">{item.productId.name}</h2>
            <p>Price: ${item.productId.price}</p>
            <button
              onClick={async () => {
                await fetch('/api/wishlist', {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: 'demoUser', productId: item.productId._id }),
                });
                setWishlistItems((prev) => prev.filter((w) => w._id !== item._id));
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove from Wishlist
            </button>
          </div>
        ))
      )}
    </div>
  );
}
