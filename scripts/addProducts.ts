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
      name: "Razer Huntsman V2",
      description: "Optical mechanical keyboard with Razer Linear Optical Switches. Features 8000Hz polling rate, PBT keycaps, wrist rest, and RGB Chroma lighting.",
      price: 199.99,
      category: "Gaming",
      image: "https://www.pbtech.co.nz/imgprod/K/E/KEYRAZ84606__1.jpg?h=2032060095",
      stock: 40
    },
    {
      name: "Logitech G502X Plus Wireless Gaming Mouse - White",
      description: "Wireless gaming mouse with HERO 25K sensor, 25600 DPI, LIGHTFORCE hybrid switches, LIGHTSYNC RGB, and USB-C quick charging.",
      price: 159.99,
      category: "Gaming",
      image: "https://www.pbtech.co.nz/imgprod/M/S/MSELOG5603422__1.jpg?h=1067500475",
      stock: 55
    },
    {
      name: "Steelseries Apex Pro TKL Gen 3 Gaming Keyboard",
      description: "Tenkeyless keyboard with OmniPoint 2.0 adjustable switches, aluminum frame, per-key RGB, and detachable USB-C cable.",
      price: 400,
      category: "Gaming",
      image: "https://www.pbtech.co.nz/imgprod/K/E/KEYSTP64740__1.jpg?h=3087987000",
      stock: 30
    },
    {
      name: "HyperX Cloud II Wireless",
      description: "Wireless gaming headset with 53mm drivers, virtual 7.1 surround sound, 30-hour battery life, and detachable noise-canceling mic.",
      price: 149.99,
      category: "Gaming",
      image: "https://assets.kogan.com/images/mightyape/MPE-34427634/1-58d426770b-239271650.jpeg?auto=webp&bg-color=fff&canvas=1200%2C800&dpr=1&enable=upscale&fit=bounds&height=800&quality=90&width=1200",
      stock: 48
    },
    {
      name: "Glorious Model O Minus",
      description: "Ultra-lightweight wired gaming mouse with Pixart 3360 sensor, 12000 DPI, 1000Hz polling rate, and honeycomb shell design.",
      price: 59.99,
      category: "Gaming",
      image: "https://www.gloriousgaming.com/cdn/shop/files/GOM-WHITE_Web_Gallery_Back_69741202-1475-4418-8d8b-91080bbe13d5.webp?v=1714643598&width=800",
      stock: 62
    },
    {
      name: "ASUS ROG Strix Scope RX",
      description: "RGB mechanical keyboard with ROG RX Red Optical Switches, IP57 water & dust resistance, and USB 2.0 passthrough.",
      price: 129.99,
      category: "Gaming",
      image: "https://www.pbtech.co.nz/imgprod/K/E/KEYASU1004__1.jpg?h=2155159152",
      stock: 38
    },
    {
      name: "Corsair HS80 RGB Wireless",
      description: "Gaming headset with 24-bit audio, Dolby Atmos support, broadcast-grade microphone, and iCUE software integration.",
      price: 288,
      category: "Gaming",
      image: "https://assets.kogan.com/images/mightyape/MPE-35950777/1-ce7d97b2a6-269702080.jpeg?auto=webp&bg-color=fff&canvas=1200%2C800&dpr=1&enable=upscale&fit=bounds&height=800&quality=90&width=1200",
      stock: 44
    },
    {
      name: "Cooler Master MM720",
      description: "Ultra-lightweight ergonomic mouse, 16000 DPI, 70M click lifespan optical switches, and PTFE feet for smooth glide.",
      price: 49.99,
      category: "Gaming",
      image: "https://a.storyblok.com/f/281110/7b12df7428/mm720-black-matte-2.png/m/1440x0/smart",
      stock: 51
    },
    {
      name: "LG Gram 17 (2023)",
      description: "High-performance ultrabook with 13.5-inch Retina display, Intel Core i7 processor, 16GB RAM, and 1TB SSD. Great for multitasking and business use.",
      price: 1199.99,
      category: "Laptops",
      image: "https://www.lg.com/content/dam/channel/wcms/au/images/laptops/17z90q-g_aa78a_ehap_au_c/gallery/17Z90Q-G.AA76A3-Laptops-MZ-1.jpg",
      stock: 27
    },
    {
      name: "LG 34WR50QK 34' WQHD Curved Ultrawide Monitor",
      description: "34-inch UltraWide™ curved monitor with WQHD resolution, 100Hz refresh rate, HDR10, and 99% sRGB—ideal for multitasking and immersive viewing.",
      price: 499.95,
      category: "Monitors",
      image: "https://www.pbtech.co.nz/imgprod/M/O/MONLGL73456__1.jpg?h=2111952277",
      stock: 22
    },
    {
      name: "Panasonic SC-UX100GN Urban Audio",
      description: "300W Bluetooth mini audio system with 2-way speakers, 13cm woofers, CD player, FM radio, USB, RCA, and app control—perfect for home entertainment.",
      price: 200,
      category: "Audio",
      image: "https://www.pbtech.co.nz/imgprod/S/P/SPKPAN00100__4.jpg?h=1247419923",
      stock: 45
    },
    {
      name: "Unitek S1224A PS5 External Storage",
      description: "Dual USB-A 10Gbps to M.2 NVMe enclosure for PS5 and PC. Sleek grey design, supports high-speed external storage and efficient cooling.",
      price: 89.0,
      category: "Storage",
      image: "https://www.pbtech.co.nz/imgprod/U/N/UNI1018__1.jpg?h=2509555360",
      stock: 38
    },
    {
      name: "FujiFilm Instax Mini 99 Instant Camera",
      description: "Stylish instant camera with manual controls, built-in flash, color effect dials, and high-quality Instax Mini film—perfect for creative snapshots.",
      price: 300.99,
      category: "Cameras",
      image: "https://www.pbtech.co.nz/imgprod/C/A/CAMFUJ529869__1.jpg?h=3540840845",
      stock: 20
    },
    {
      name: "TP-Link TL-PA9020P KIT AV2000 Powerline Kit",
      description: "AV2000 powerline kit with 2Gbps speed, 300m range, dual Gigabit LAN ports, and AC pass-through—ideal for lag-free wired connections at home.",
      price: 269.49,
      category: "Networking",
      image: "https://www.pbtech.co.nz/imgprod/default/N/E/NETTPL9020__4.webp?h=2089900848",
      stock: 30
    },
    {
      name: "MSI Creator Z17 HX Studio A14VFT-298NZ RTX 4060 Gaming Laptop 17' QHD+ 165Hz Touch",
      description: "17' QHD+ 165Hz touch display, Intel Core i7, RTX 4060, and advanced cooling—designed for creators and gamers who demand power and precision.",
      price: 4500,
      category: "Laptops",
      image: "https://www.pbtech.co.nz/imgprod/N/B/NBKMSI1714298__1.jpg?h=230179527",
      stock: 25
    },
    {
      name: "Ubiquiti UniFi Protect UVC-AI-Theta-Audio for AI Theta Camera",
      description: "Modular audio accessory for the UniFi AI Theta Camera, delivering high-fidelity sound capture and seamless integration with UniFi Protect systems.",
      price: 89.99,
      category: "Audio",
      image: "https://www.pbtech.co.nz/imgprod/C/C/CCTUBI80331__1.jpg?h=1333654163",
      stock: 70
    },
    {
      name: "OWC miniStack STX Thunderbolt 4 Dual 4K Docking & Storage solution",
      description: "Thunderbolt 4 docking and storage hub with dual 4K support, 96W power delivery, NVMe M.2 + SATA bays, 10 ports, and AndroidOS compatibility—ideal for pro workflows.",
      price: 500,
      category: "Storage",
      image: "https://www.pbtech.co.nz/imgprod/N/B/NBDOWC4900__4.jpg?h=3865303216",
      stock: 33
    },
    {
      name: "Sony FDRAX43A 4K Ultra HD Handycam",
      description: "Compact 4K Ultra HD Handycam with Exmor R sensor, Balanced Optical SteadyShot™, and ZEISS lens—perfect for smooth, high-quality video recording.",
      price: 1300,
      category: "Cameras",
      image: "https://www.pbtech.co.nz/imgprod/C/A/CAMSNY1043__1.jpg?h=1674760983",
      stock: 42
    },
    {
      name: "Extreme Networks ExtremeWireless",
      description: "Wi-Fi 6 (802.11ax) indoor access point with dual-band support, high-density performance, and cloud-managed features—ideal for enterprise environments.",
      price: 349.0,
      category: "Networking",
      image: "https://www.pbtech.co.nz/imgprod/default/N/A/NAPEXN64100__1.webp?h=3454628769",
      stock: 28
    },
    {
      name: "HP 255 G10 15.6' FHD",
      description: "15.6' FHD laptop with AMD Ryzen processor, fast SSD storage, and essential ports—ideal for everyday business and study use.",
      price: 1149.75,
      category: "Laptops",
      image: "https://www.pbtech.co.nz/imgprod/N/B/NBKHNB25502IB__1.jpg?h=2825154483",
      stock: 17
    },
    {
      name: "ASUS ProArt PA278CV 27' QHD Professional Monitor",
      description: "27' QHD monitor with 100% sRGB and Calman Verified color accuracy—designed for creative professionals who demand precise, vibrant visuals.",
      price: 579.49,
      category: "Monitors",
      image: "https://www.pbtech.co.nz/imgprod/M/O/MONAS82719__1.jpg?h=2504976379",
      stock: 29
    },
    {
      name: "Wave Audio ANC Headphones - Symphony",
      description: "Wireless over-ear headphones with active noise cancellation, rich sound, and all-day comfort—ideal for travel, work, and focused listening.",
      price: 229.0,
      category: "Audio",
      image: "https://www.pbtech.co.nz/imgprod/U/N/UNC001005009__1.jpg?h=1889765898",
      stock: 37
    },
    {
      name: "HP v150w USB Flash Drive - 64GB",
      description: "Compact 64GB USB 2.0 flash drive with durable design—ideal for everyday file storage and transfers on the go.",
      price: 9,
      category: "Storage",
      image: "https://www.pbtech.co.nz/imgprod/M/E/MEMHPC0003__1.jpg?h=3612465404",
      stock: 54
    },
    {
      name: "Canon PowerShot SX740 HS 20.3MP CMOS 40x Digital Camera - Black",
      description: "20.3MP compact camera with 40x optical zoom, 4K video recording, and built-in Wi-Fi—perfect for travel and everyday photography.",
      price: 769.0,
      category: "Cameras",
      image: "https://www.pbtech.co.nz/imgprod/C/A/CAMCNN8308__2.jpg?h=2848122261",
      stock: 24
    },
    {
      name: "Cambium Networks PL-DTSTANDB-WW e430H Desktop stand",
      description: "Durable desktop stand designed for the Cambium e430H access point—provides stable mounting for flexible indoor deployments.",
      price: 37,
      category: "Networking",
      image: "https://www.pbtech.co.nz/imgprod/default/N/E/NETCBN4398961__1.webp?h=1678277273",
      stock: 36
    },
    {
      name: "HP Remanufactured Chromebook 11 MK G9 11.6' HD",
      description: "11.6' HD remanufactured Chromebook with MediaTek processor, ChromeOS, and long battery life—ideal for students and everyday tasks.",
      price: 319.99,
      category: "Laptops",
      image: "https://www.pbtech.co.nz/imgprod/N/B/NBKHNB1110__1.jpg?h=629330399",
      stock: 12
    },
    {
      name: "RODE RCV RDECASTER VIDEO - VIDEO & AUDIO PRODUCTION CONSOLE",
      description: "All-in-one video and audio production console with multi-channel support, touchscreen control, and pro-grade processing—perfect for studio content creation.",
      price: 2019.99,
      category: "Audio",
      image: "https://www.pbtech.co.nz/imgprod/A/U/AUDROD0099__1.jpg?h=718778627",
      stock: 48
    },
    {
      name: "Giada VM23-2G Celeron N3350 CPU",
      description: "Compact fanless media player with Intel Celeron N3350, 2GB RAM, 32GB storage, dual 1080p display output via DP & HDMI—ideal for digital signage and kiosks.",
      price: 129.99,
      category: "Storage",
      image: "https://www.pbtech.co.nz/imgprod/I/P/IPCGDA20004__1.jpg?h=4109543139",
      stock: 50
    },
    {
      name: "ILFORD 3005154 PIXI-D 5MP Compact Digital Camera - Black",
      description: "5MP compact digital camera with built-in flash, LCD screen, and easy point-and-shoot controls—perfect for casual everyday photography.",
      price: 149.49,
      category: "Cameras",
      image: "https://www.pbtech.co.nz/imgprod/C/A/CAMIFL0001__1.jpg?h=1616329279",
      stock: 19
    },
    {
      name: "LevelOne Dual Band Wireless USB Network Adapter",
      description: "Dual-band wireless USB adapter with speeds up to 300Mbps (2.4GHz) and 867Mbps (5GHz)—ideal for fast, stable Wi-Fi on desktops and laptops.",
      price: 64,
      category: "Networking",
      image: "https://www.pbtech.co.nz/imgprod/U/N/UNC001001203__1.jpg?h=1645005475",
      stock: 31
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
  