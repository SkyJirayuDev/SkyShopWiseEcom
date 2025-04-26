import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

// Define page metadata (title and description)
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
      <body className="bg-white text-gray-900">
        {/* Wrap the application with Providers (for session, theme, etc.) */}
        <Providers>
          {/* Display toast notifications */}
          <Toaster position="top-right" reverseOrder={false} />

          {/* Navigation bar at the top */}
          <header>
            <Navbar />
          </header>

          {/* Main content area */}
          <main>
            {children}
          </main>

          {/* Footer at the bottom */}
          <footer>
            <Footer />
          </footer>
        </Providers>
      </body>
    </html>
  );
}
