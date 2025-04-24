"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProductCard from "../components/ProductCard";
import Chatbot from "../components/Chatbot";

// Interface for Product
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
}

export default function HomePage() {
  const { data: session, status } = useSession(); 
  const [products, setProducts] = useState<Product[]>([]); 
  const [productsFeature, setProductsFeature] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [personalMessage, setPersonalMessage] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  // Fetch products from the API
  const fetchPersonalMessage = async (forceRefresh = false) => {
    try {
      if (session?.user?.id) {
        const url = forceRefresh
          ? `/api/personal-message?userId=${session.user.id}&refresh=true`
          : `/api/personal-message?userId=${session.user.id}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.message) setPersonalMessage(data.message);
        if (data.couponCode) setCouponCode(data.couponCode);
        if (forceRefresh) toast.success("Your deal has been refreshed!");
      }
    } catch (error) {
      console.error("Error fetching personal message:", error);
    }
  };

  useEffect(() => {
    fetchPersonalMessage();
  }, [session]);

  // Fetch recommended products
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await fetch("/api/recommendations");
        const data = await response.json();

        if (Array.isArray(data)) {
          setRecommendedProducts(data.slice(0, 8));
        } else {
          console.error("Invalid recommendations data:", data);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    if (session?.user?.id) {
      fetchRecommended();
    }
  }, [session]);

  // Fetch featured products
  useEffect(() => {
    const fetchProductsFeature = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (Array.isArray(data)) {
          setProductsFeature(data.slice(0, 12));
        } else if (
          data.productsFeature &&
          Array.isArray(data.productsFeature)
        ) {
          setProductsFeature(data.productsFeature.slice(0, 6));
        } else {
          console.error("Invalid products data:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProductsFeature();
  }, []);

  // Fetch recently viewed products
  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        if (session?.user?.id) {
          const userId = session.user.id;
          const response = await fetch(`/api/recentlyViewed?userId=${userId}`, {
            method: "GET",
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              setRecentlyViewed(data);
            } else {
              setRecentlyViewed([]);
            }
          } else {
            console.error("Failed to fetch recently viewed items.");
          }
        }
      } catch (error) {
        console.error("Error fetching recently viewed:", error);
      }
    };

    fetchRecentlyViewed();
  }, [session]);

  return (
    <div className="min-h-screen bg-white text-gray-900 w-full">
      <main className="w-full">
        {/* Personalized AI Marketing Message Section */}
        {personalMessage && (
          <section className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 text-white py-8 px-6 sm:px-8 md:px-16 rounded-b-3xl shadow-xl">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
                <span>Personalized Deal Just for You</span>
              </h2>

              {/* Main message from AI - split into lines */}
              <div className="text-lg sm:text-xl font-medium leading-relaxed space-y-1">
                {personalMessage.split(". ").map((line, index) => (
                  <p key={index}>
                    {line.trim()}
                    {line.trim().endsWith(".") ? "" : "."}
                  </p>
                ))}
              </div>

              {/* Coupon Code Display */}
              {couponCode && (
                <div className="mt-4 text-lg font-semibold">
                  🎫 Use code{" "}
                  <span className="bg-white text-blue-700 px-3 py-1 rounded-full font-bold shadow-sm tracking-wide">
                    {couponCode}
                  </span>{" "}
                  at checkout
                </div>
              )}

              {/* Refresh Button */}
              {/* <button
                onClick={() => fetchPersonalMessage(true)}
                className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full text-base transition duration-300 shadow-md"
              >
                Refresh Deal
              </button> */}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full px-2 sm:px-4 mt-6">
                {recommendedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Link
                href="/products"
                className="inline-block mt-4 bg-white text-blue-700 font-semibold px-6 py-2 rounded-full text-sm sm:text-base hover:bg-gray-100 transition-all duration-300"
              >
                Shop Now
              </Link>
            </div>
          </section>
        )}

        {/* Recently Viewed Section */}
        {/* {status === "authenticated" && (
          <section className="bg-gradient-to-br from-[#1a237e] to-[#0d47a1] w-full">
            <div className="w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 text-white">
                Recently Viewed Products
              </h1>
              <p
                className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 max-w-3xl mx-auto text-white"
                style={{ animationDelay: "0.1s" }}
              >
                Check out the products you’ve recently viewed!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full px-2 sm:px-4">
                {recentlyViewed.length > 0 ? (
                  recentlyViewed.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <p className="text-white">
                    No recently viewed products found.
                  </p>
                )}
              </div>
            </div>
          </section>
        )} */}

        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Shop at <span className="text-blue-700">SkyShopWise</span>?
              </h2>
              <div className="w-24 h-1 bg-blue-700 mx-auto rounded-full mb-6"></div>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                We offer the highest quality IT products with exceptional
                service and support for all your technology needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Card 1 */}
              <div className="feature-card bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2">
                <div className="feature-icon bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0 transition-all duration-300 hover:bg-blue-200">
                  <svg
                    className="w-8 h-8 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-center md:text-left text-gray-900">
                  Genuine IT Products
                </h3>
                <p className="text-gray-600 text-sm sm:text-base text-center md:text-left">
                  All hardware and software products are sourced directly from
                  authorized distributors, ensuring authenticity and full
                  warranty coverage.
                </p>
              </div>

              {/* Card 2 */}
              <div className="feature-card bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2">
                <div className="feature-icon bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0 transition-all duration-300 hover:bg-blue-200">
                  <svg
                    className="w-8 h-8 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-center md:text-left text-gray-900">
                  Fast Delivery
                </h3>
                <p className="text-gray-600 text-sm sm:text-base text-center md:text-left">
                  Quick and reliable shipping of all your IT equipment with
                  real-time tracking and next-day delivery options available.
                </p>
              </div>

              {/* Card 3 */}
              <div className="feature-card bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2">
                <div className="feature-icon bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0 transition-all duration-300 hover:bg-blue-200">
                  <svg
                    className="w-8 h-8 text-blue-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-center md:text-left text-gray-900">
                  Technical Support
                </h3>
                <p className="text-gray-600 text-sm sm:text-base text-center md:text-left">
                  Pre-sales and post-sales technical support from certified IT
                  professionals available 24/7 to assist with any questions or
                  issues.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#1a237e] to-[#0d47a1] w-full">
          <div className="w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 text-white">
              Featured Products
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 w-full px-2 sm:px-4">
              {productsFeature.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="text-center mt-4 sm:mt-6 md:mt-8">
              <Link
                href="/products"
                className="bg-green-500 text-white px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded text-xs sm:text-sm md:text-base hover:bg-green-600 transition-colors duration-300"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white py-20 text-center w-full">
          <div className="w-full px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">
              Need IT Equipment for Your Business?
            </h2>
            <p className="text-sm sm:text-base md:text-xl mb-4 sm:mb-6 md:mb-8">
              Get volume discounts and personalized quotes for bulk orders of
              hardware and software.
            </p>
            <button className="cta-button bg-blue-900 text-white px-6 sm:px-7 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-800 transform hover:-translate-y-1 text-sm sm:text-base md:text-lg">
              Request Business Quote
            </button>
          </div>
        </section>

        {/* Chatbot */}
        <section className="text-center w-full">
          <Chatbot />
        </section>
      </main>
    </div>
  );
}
