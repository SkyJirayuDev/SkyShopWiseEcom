"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            SkyShopWise
          </Link>
          
          {/* Hamburger Menu Button (Mobile) */}
          <button 
            className="md:hidden flex flex-col space-y-1" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="hover:text-blue-500">
              Home
            </Link>
            <Link href="/products" className="hover:text-blue-500">
              Products
            </Link>
            <Link href="/orders" className="hover:text-blue-500">
              Order History
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
                <button onClick={() => signOut()} className="ml-4 hover:text-blue-500">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => signIn()} className="ml-4 hover:text-blue-500">
                  Login
                </button>
                <Link href="/signup" className="ml-4 hover:text-blue-500">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Menu (Dropdown) */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-4 pt-4">
            <Link href="/" className="hover:text-blue-500 py-2 transform transition-transform duration-200 hover:translate-x-2">
              Home
            </Link>
            <Link href="/products" className="hover:text-blue-500 py-2 transform transition-transform duration-200 hover:translate-x-2">
              Products
            </Link>
            <Link href="/orders" className="hover:text-blue-500 py-2 transform transition-transform duration-200 hover:translate-x-2">
              Order History
            </Link>
            <Link href="/wishlist" className="hover:text-blue-500 py-2 transform transition-transform duration-200 hover:translate-x-2">
              Wishlist
            </Link>
            <Link href="/cart" className="relative hover:text-blue-500 py-2 transform transition-transform duration-200 hover:translate-x-2">
              Cart
              {cartCount > 0 && (
                <span className="absolute top-0 ml-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* ตรวจสอบ session สำหรับ Mobile */}
            {status === "loading" ? null : session ? (
              <>
                <span className="py-2">Hi, {session.user?.name || session.user?.email}</span>
                <button onClick={() => signOut()} className="hover:text-blue-500 py-2 text-left transform transition-transform duration-200 hover:translate-x-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => signIn()} className="hover:text-blue-500 py-2 text-left transform transition-transform duration-200 hover:translate-x-2">
                  Login
                </button>
                <Link href="/signup" className="hover:text-blue-500 py-2 transform transition-transform duration-200 hover:translate-x-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}