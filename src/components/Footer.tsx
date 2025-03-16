"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 sm:py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6 md:gap-8">
          {/* Company Info */}
          <div className="animate-fade-up">
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 md:mb-4">
              SkyShopWise
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Your trusted online store for IT equipment and enterprise
              solutions.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              &copy; 2025 SkyShopWise by SkyJirayuDev. All Rights Reserved.
            </p>
          </div>

          {/* Products Column */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">
              Products
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Servers & Storage
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Networking Equipment
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Software Licenses
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Security Hardware
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">
              Company
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div className="animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 md:mb-4">
              Connect
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-colors duration-300"
                >
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
