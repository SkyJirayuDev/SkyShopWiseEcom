"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductDetailPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // ✅ ฟังก์ชันเพิ่มสินค้าในตะกร้า (Add to Cart)
  const handleAddToCart = async () => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product?._id, quantity: 1 }), // ส่ง productId และ quantity
      });
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <div className="w-full aspect-video bg-gray-100 flex items-center justify-center overflow-hidden rounded">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      <p className="mt-4">{product.description}</p>
      <p className="font-bold text-xl mt-2">${product.price}</p>

      <button
        onClick={async () => {
          try {
            const response = await fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId: product._id, quantity: 1 }), // ✅ ส่งแค่ productId และ quantity
            });

            if (response.ok) {
              toast.success("Added to cart!");
            } else {
              const errorData = await response.json();
              console.error("Failed to add product to cart:", errorData);
              toast.error("Failed to add product to cart");
            }
          } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("An error occurred while adding to cart");
          }
        }}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add to Cart
      </button>
      <button
        onClick={async () => {
          try {
            const response = await fetch("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: "demoUser",
                productId: product._id,
              }),
            });

            if (response.ok) {
              toast.success("Added to wishlist!");
            } else {
              toast.error("Failed to add to wishlist.");
            }
          } catch (error) {
            console.error("Error adding to wishlist:", error);
          }
        }}
        className="mt-2 text-white px-4 py-2 rounded hover:bg-pink-600"
      >
        💟
      </button>
    </div>
  );
};

export default ProductDetailPage;
