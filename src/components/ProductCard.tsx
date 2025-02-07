// src/components/ProductCard.tsx
import React from 'react';

interface Product {
  id: number | string;
  title: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <img src={product.image} alt={product.title} className="w-full h-40 object-cover mb-4" />
      <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
      <p className="text-lg font-medium">${product.price}</p>
    </div>
  );
}
