// src/app/layout.tsx
import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'ShopWise',
  description: 'Intelligent E-Commerce Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="p-4 bg-blue-600 text-white">
          <h1 className="text-3xl font-bold">ShopWise</h1>
        </header>
        <main>{children}</main>
        <footer className="p-4 bg-gray-200 text-center">
          <p>&copy; 2023 ShopWise</p>
        </footer>
      </body>
    </html>
  );
}
