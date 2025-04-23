import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers"; 

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
        
        <Providers>
          <Toaster position="top-right" reverseOrder={false} />
          <header>
            <Navbar />
          </header>

          <main>
            {children}
          </main>

          <footer>
            <Footer />
          </footer>
        </Providers>

      </body>
    </html>
  );
}
