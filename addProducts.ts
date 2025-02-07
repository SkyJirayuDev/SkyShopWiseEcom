interface Product {
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
  }
  
  const products: Product[] = [
    {
      name: "Apple MacBook Pro M2",
      description: "13-inch, M2 chip, 8GB RAM, 256GB SSD",
      price: 1299,
      category: "Laptops",
      image: "https://via.placeholder.com/150",
      stock: 15,
    },
    {
      name: "Dell XPS 13",
      description: "13.4-inch, Intel Core i7, 16GB RAM, 512GB SSD",
      price: 1499,
      category: "Laptops",
      image: "https://via.placeholder.com/150",
      stock: 10,
    },
    {
      name: "Lenovo ThinkPad X1 Carbon",
      description: "14-inch, Intel Core i5, 8GB RAM, 256GB SSD",
      price: 1199,
      category: "Laptops",
      image: "https://via.placeholder.com/150",
      stock: 20,
    },
    {
      name: "HP Spectre x360",
      description: "13.5-inch OLED, Intel Core i7, 16GB RAM, 1TB SSD",
      price: 1599,
      category: "Laptops",
      image: "https://via.placeholder.com/150",
      stock: 12,
    },
    {
      name: "ASUS ROG Zephyrus G14",
      description: "14-inch, AMD Ryzen 9, 32GB RAM, 1TB SSD",
      price: 1799,
      category: "Gaming Laptops",
      image: "https://via.placeholder.com/150",
      stock: 8,
    },
    {
      name: "Logitech MX Master 3S",
      description: "Advanced wireless mouse with ultra-fast scrolling",
      price: 99,
      category: "Accessories",
      image: "https://via.placeholder.com/150",
      stock: 50,
    },
    {
      name: "Razer DeathAdder V2",
      description: "Ergonomic gaming mouse with high precision",
      price: 69,
      category: "Gaming Accessories",
      image: "https://via.placeholder.com/150",
      stock: 40,
    },
    {
      name: "Apple Magic Keyboard",
      description: "Wireless keyboard with numeric keypad",
      price: 129,
      category: "Accessories",
      image: "https://via.placeholder.com/150",
      stock: 30,
    },
    {
      name: "Corsair K95 RGB Platinum",
      description: "Mechanical gaming keyboard with RGB lighting",
      price: 199,
      category: "Gaming Accessories",
      image: "https://via.placeholder.com/150",
      stock: 25,
    },
    {
      name: "Samsung 970 EVO Plus 1TB",
      description: "NVMe M.2 SSD with fast read/write speeds",
      price: 149,
      category: "Storage",
      image: "https://via.placeholder.com/150",
      stock: 60,
    },
    {
      name: "Western Digital 4TB External HDD",
      description: "Portable external hard drive for data backup",
      price: 99,
      category: "Storage",
      image: "https://via.placeholder.com/150",
      stock: 45,
    },
    {
      name: "LG UltraGear 27GP850",
      description: "27-inch QHD gaming monitor with 165Hz refresh rate",
      price: 449,
      category: "Monitors",
      image: "https://via.placeholder.com/150",
      stock: 18,
    },
    {
      name: "Dell UltraSharp U2723QE",
      description: "27-inch 4K IPS monitor with USB-C connectivity",
      price: 679,
      category: "Monitors",
      image: "https://via.placeholder.com/150",
      stock: 14,
    },
    {
      name: "Sony WH-1000XM5",
      description: "Wireless noise-canceling over-ear headphones",
      price: 399,
      category: "Audio",
      image: "https://via.placeholder.com/150",
      stock: 35,
    },
    {
      name: "JBL Flip 6",
      description: "Portable waterproof Bluetooth speaker",
      price: 129,
      category: "Audio",
      image: "https://via.placeholder.com/150",
      stock: 50,
    },
    {
      name: "GoPro HERO11 Black",
      description: "Waterproof action camera with 5.3K video recording",
      price: 499,
      category: "Cameras",
      image: "https://via.placeholder.com/150",
      stock: 22,
    },
    {
      name: "Canon EOS R10",
      description: "Mirrorless camera with 24.2MP APS-C sensor",
      price: 979,
      category: "Cameras",
      image: "https://via.placeholder.com/150",
      stock: 10,
    },
    {
      name: "Anker PowerCore 20100",
      description: "High-capacity portable charger with fast charging",
      price: 49,
      category: "Accessories",
      image: "https://via.placeholder.com/150",
      stock: 70,
    },
    {
      name: "Apple AirPods Pro (2nd Gen)",
      description: "Wireless earbuds with active noise cancellation",
      price: 249,
      category: "Audio",
      image: "https://via.placeholder.com/150",
      stock: 40,
    },
    {
      name: "Logitech StreamCam",
      description: "Full HD webcam for streaming and content creation",
      price: 169,
      category: "Cameras",
      image: "https://via.placeholder.com/150",
      stock: 30,
    }
  ];
  
  async function addProducts() {
    for (const product of products) {
      try {
        const response = await fetch("http://localhost:3000/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
        const data = await response.json();
        console.log(`✅ Added: ${data.product.name}`);
      } catch (error) {
        console.error(`❌ Failed to add ${product.name}:`, error);
      }
    }
  }
  
  addProducts();
  