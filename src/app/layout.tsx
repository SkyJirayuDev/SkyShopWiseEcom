// src/app/layout.tsx
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers"; // Import Providers ที่เป็น Client Component

export const metadata: Metadata = {
  title: "ShopWise",
  description: "Intelligent E-Commerce Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Toaster position="top-right" reverseOrder={false} />
          <header>
            <Navbar />
          </header>
          <main>{children}</main>
          <footer className="bg-gray-800 text-white p-4 text-center">
            <p>&copy; 2025 SkyShopWise by SkyJirayuDev. All Rights Reserved.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
