"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const { data: session, status } = useSession();

  // ดึงจำนวนสินค้าจาก Cart
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();
        setCartCount(data.length); // นับจำนวนสินค้าในตะกร้า
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
  }, []);

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold">
          SkyShopWise
        </Link>

        <div className="space-x-6 flex items-center">
          <Link href="/" className="hover:text-blue-500">
            Home
          </Link>
          <Link href="/products" className="hover:text-blue-500">
            Products
          </Link>
          <Link href="/orders" className="hover:text-blue-500">
            Orders
          </Link>
          <Link href="/wishlist" className="hover:text-blue-500">
            Wishlist
          </Link>
          <Link href="/cart" className="relative hover:text-blue-500">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ตรวจสอบ session */}
          {status === "loading" ? null : session ? (
            <>
              <span className="ml-4">Hi, {session.user?.name || session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="ml-4 hover:text-blue-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => signIn()}
                className="ml-4 hover:text-blue-500"
              >
                Login
              </button>
              <Link href="/signup" className="ml-4 hover:text-blue-500">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
