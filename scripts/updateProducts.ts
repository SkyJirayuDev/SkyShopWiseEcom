interface ProductUpdate {
    _id: string;
    name: string;
    description: string;
  }
  
  const productUpdates: ProductUpdate[] = [
    {
      _id: "67a56c252e294f353c873d10",
      name: "Apple MacBook Pro 13-inch (M2, 2022)",
      description:
        "The Apple MacBook Pro 13-inch (M2, 2022) features the new M2 chip, 8GB of RAM, 256GB SSD storage, and a brilliant Retina display for superior performance and visuals.",
    },
    {
      _id: "67a56c252e294f353c873d12",
      name: "Dell XPS 13 (2022)",
      description:
        "The Dell XPS 13 (2022) offers a 13.4-inch display, Intel Core i7 processor, 16GB of RAM, and a 512GB SSD, delivering both high performance and sleek design.",
    },
    {
      _id: "67a56c252e294f353c873d14",
      name: "Lenovo ThinkPad X1 Carbon Gen 9",
      description:
        "The Lenovo ThinkPad X1 Carbon Gen 9 comes with a 14-inch display, Intel Core i5 processor, 8GB of RAM, and a 256GB SSD, engineered for business professionals seeking durability and performance.",
    },
    {
      _id: "67a56c252e294f353c873d16",
      name: "HP Spectre x360 Convertible",
      description:
        "The HP Spectre x360 Convertible boasts a 13.5-inch OLED display, Intel Core i7 processor, 16GB of RAM, and a 1TB SSD, combining luxury with versatile functionality in a convertible form factor.",
    },
    {
      _id: "67a56c252e294f353c873d18",
      name: "ASUS ROG Zephyrus G14 Gaming Laptop",
      description:
        "The ASUS ROG Zephyrus G14 is designed for gamers, featuring a 14-inch display, AMD Ryzen 9 processor, 32GB of RAM, and a 1TB SSD for top-tier gaming performance.",
    },
    {
      _id: "67a56c252e294f353c873d1a",
      name: "Logitech MX Master 3S Wireless Mouse",
      description:
        "The Logitech MX Master 3S is an advanced wireless mouse offering ultra-fast scrolling and precision control, ideal for productivity and creative work.",
    },
    {
      _id: "67a56c262e294f353c873d1c",
      name: "Razer DeathAdder V2 Gaming Mouse",
      description:
        "The Razer DeathAdder V2 Gaming Mouse is ergonomically designed for competitive gaming, featuring a high-precision sensor with up to 20K DPI.",
    },
    {
      _id: "67a56c262e294f353c873d1e",
      name: "Apple Magic Keyboard with Numeric Keypad",
      description:
        "The Apple Magic Keyboard with Numeric Keypad provides a smooth wireless typing experience for Mac users, featuring a full numeric keypad and seamless connectivity.",
    },
    {
      _id: "67a56c262e294f353c873d20",
      name: "Corsair K100 Optical RGB Mechanical Gaming Keyboard",
      description:
        "The Corsair K100 is an optical mechanical gaming keyboard featuring customizable RGB lighting and rapid-response optical switches, perfect for gaming enthusiasts.",
    },
    {
      _id: "67a56c262e294f353c873d22",
      name: "Samsung 970 EVO Plus 1TB NVMe SSD",
      description:
        "The Samsung 970 EVO Plus 1TB NVMe SSD delivers blazing fast read/write speeds, making it ideal for high-performance computing and gaming.",
    },
    {
      _id: "67a56c262e294f353c873d24",
      name: "Western Digital My Passport 4TB External HDD",
      description:
        "The Western Digital My Passport 4TB External HDD offers reliable portable storage for secure data backup and easy transfer of large files.",
    },
    {
      _id: "67a56c262e294f353c873d26",
      name: "LG UltraGear 27GS50F-B Gaming Monitor",
      description:
        "The LG UltraGear 27GS50F-B is a 27-inch QHD gaming monitor with a 165Hz refresh rate, providing smooth visuals and an immersive gaming experience.",
    },
    {
      _id: "67a56c262e294f353c873d28",
      name: "Dell UltraSharp U2723QE 27-inch 4K Monitor",
      description:
        "The Dell UltraSharp U2723QE is a 27-inch 4K IPS monitor with USB-C connectivity, offering accurate colors and exceptional clarity for professional work.",
    },
    {
      _id: "67a56c272e294f353c873d2a",
      name: "Sony WH-1000XM5 Noise-Canceling Headphones",
      description:
        "The Sony WH-1000XM5 are wireless noise-canceling over-ear headphones that provide superior sound quality and advanced noise cancellation for an immersive audio experience.",
    },
    {
      _id: "67a56c272e294f353c873d2c",
      name: "JBL Flip 6 Portable Bluetooth Speaker",
      description:
        "The JBL Flip 6 is a portable, waterproof Bluetooth speaker that delivers powerful sound in a compact design, perfect for on-the-go entertainment.",
    },
    {
      _id: "67a56c272e294f353c873d2e",
      name: "GoPro HERO13 Black Action Camera",
      description:
        "The GoPro HERO13 Black Action Camera records stunning 4K video, features a waterproof design up to 10 meters, and includes Wi-Fi, Bluetooth, and advanced stabilization technology.",
    },
    {
      _id: "67a56c272e294f353c873d30",
      name: "Canon EOS R10 Mirrorless Camera with 18-150mm Lens Kit",
      description:
        "The Canon EOS R10 is an APS-C mirrorless camera with a 24.2MP sensor, built-in Wi-Fi and Bluetooth, and 4K30 video recording, paired with a versatile 18-150mm lens kit.",
    },
    {
      _id: "67a56c272e294f353c873d32",
      name: "Anker 20000mAh 30W Portable Charger",
      description:
        "The Anker 20000mAh 30W Portable Charger offers fast charging with a 30W output via USB-C, making it perfect for powering your devices on the go.",
    },
    {
      _id: "67a56c272e294f353c873d34",
      name: "Apple AirPods Pro 2 with MagSafe Charging Case",
      description:
        "The Apple AirPods Pro 2 deliver adaptive active noise cancellation and exceptional sound quality, paired with a convenient MagSafe charging case for effortless wireless connectivity.",
    },
    {
      _id: "67a56c272e294f353c873d36",
      name: "Logitech StreamCam HD Webcam",
      description:
        "The Logitech StreamCam is an HD webcam that provides Full HD 1080p video at 60fps via USB-C, complete with a built-in microphone for high-quality streaming and content creation.",
    },
  ];
  
  async function updateProducts(): Promise<void> {
    for (const product of productUpdates) {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${product._id}`, {
          method: "PUT", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: product.name,
            description: product.description,
          }),
        });
        const data = await response.json();
        console.log(`✅ Updated: ${data.product.name}`);
      } catch (error) {
        console.error(`❌ Failed to update product ${product._id}:`, error);
      }
    }
  }
  
  updateProducts();
  