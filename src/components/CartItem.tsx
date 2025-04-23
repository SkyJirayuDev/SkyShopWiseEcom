"use client";
import React from "react";

// CartItem component
interface CartItemProps {
  item: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
      <div className="flex-1 ml-4">
        <h2 className="font-bold">{item.name}</h2>
        <p>${item.price} x {item.quantity}</p>
      </div>
      <button
        onClick={() => onRemove(item._id)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Remove
      </button>
    </div>
  );
}
