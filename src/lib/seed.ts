import { db } from "@/db";
import { categories, brands, products, productImages, users, banners, storeSettings } from "@/db/schema";
import bcrypt from "bcryptjs";

const CI = {
  "gaming-laptops": "https://images.pexels.com/photos/3951449/pexels-photo-3951449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "gaming-pcs": "https://images.pexels.com/photos/7858767/pexels-photo-7858767.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "gaming-mice": "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "mechanical-keyboards": "https://images.pexels.com/photos/5380584/pexels-photo-5380584.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "mouse-pads": "https://images.pexels.com/photos/27679707/pexels-photo-27679707.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  "gaming-chairs": "https://images.pexels.com/photos/7915533/pexels-photo-7915533.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

const PI = {
  laptop: [
    "https://images.pexels.com/photos/15393003/pexels-photo-15393003.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/3951449/pexels-photo-3951449.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/37694203/pexels-photo-37694203.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  ],
  pc: [
    "https://images.pexels.com/photos/7858743/pexels-photo-7858743.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/7858767/pexels-photo-7858767.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/7859348/pexels-photo-7859348.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/7915225/pexels-photo-7915225.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  ],
  mouse: [
    "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/29259392/pexels-photo-29259392.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/28993052/pexels-photo-28993052.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  ],
  keyboard: [
    "https://images.pexels.com/photos/5380584/pexels-photo-5380584.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/7915219/pexels-photo-7915219.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/671629/pexels-photo-671629.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/7915508/pexels-photo-7915508.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  ],
  mousepad: [
    "https://images.pexels.com/photos/27679707/pexels-photo-27679707.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/18155963/pexels-photo-18155963.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/27559560/pexels-photo-27559560.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  ],
  chair: [
    "https://images.pexels.com/photos/7915533/pexels-photo-7915533.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/16040234/pexels-photo-16040234.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    "https://images.pexels.com/photos/28955779/pexels-photo-28955779.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  ],
};

export async function seed() {
  console.log("Seeding...");

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    if (adminPassword.length < 12) throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters");
    const adminHash = await bcrypt.hash(adminPassword, 12);
    await db.insert(users).values({ email: adminEmail, passwordHash: adminHash, name: "Admin", role: "admin" }).onConflictDoNothing();
  }

  const cats = await db.insert(categories).values([
    { slug: "gaming-laptops", nameUz: "Gaming noutbuklar", image: CI["gaming-laptops"], sortOrder: 1 },
    { slug: "gaming-pcs", nameUz: "Gaming kompyuterlar", image: CI["gaming-pcs"], sortOrder: 2 },
    { slug: "gaming-mice", nameUz: "Gaming sichqonchalar", image: CI["gaming-mice"], sortOrder: 3 },
    { slug: "mechanical-keyboards", nameUz: "Mexanik klaviaturalar", image: CI["mechanical-keyboards"], sortOrder: 4 },
    { slug: "mouse-pads", nameUz: "Sichqoncha padlar", image: CI["mouse-pads"], sortOrder: 5 },
    { slug: "gaming-chairs", nameUz: "Gaming stullar", image: CI["gaming-chairs"], sortOrder: 6 },
  ]).returning();

  const brs = await db.insert(brands).values([
    { slug: "asus", name: "ASUS ROG" },
    { slug: "msi", name: "MSI" },
    { slug: "lenovo", name: "Lenovo Legion" },
    { slug: "razer", name: "Razer" },
    { slug: "logitech", name: "Logitech G" },
    { slug: "corsair", name: "Corsair" },
    { slug: "hyperx", name: "HyperX" },
    { slug: "steelseries", name: "SteelSeries" },
    { slug: "secretlab", name: "Secretlab" },
    { slug: "noblechairs", name: "Noblechairs" },
    { slug: "acer", name: "Acer Predator" },
    { slug: "hp", name: "HP Omen" },
  ]).returning();

  const cm = Object.fromEntries(cats.map(c => [c.slug, c.id]));
  const bm = Object.fromEntries(brs.map(b => [b.slug, b.id]));

  const prods = await db.insert(products).values([
    { slug: "asus-rog-strix-g16", name: "ASUS ROG Strix G16", description: "Intel Core i9-13980HX, RTX 4070, 16\" QHD 240Hz, 32GB DDR5, 1TB SSD", price: 28000000, categoryId: cm["gaming-laptops"], brandId: bm["asus"], stock: 8, isNew: true, isFeatured: true, specs: { Protsessor: "Intel Core i9-13980HX", Videokarta: "NVIDIA RTX 4070", Ekran: '16" QHD 240Hz', RAM: "32GB DDR5", SSD: "1TB NVMe" } },
    { slug: "msi-ge78-hx", name: "MSI Raider GE78 HX", description: "Intel Core i9-13980HX, RTX 4080, 17\" QHD+ 240Hz, 32GB DDR5, 1TB SSD", price: 35000000, categoryId: cm["gaming-laptops"], brandId: bm["msi"], stock: 5, isFeatured: true, specs: { Protsessor: "Intel Core i9-13980HX", Videokarta: "NVIDIA RTX 4080", Ekran: '17" QHD+ 240Hz', RAM: "32GB DDR5", SSD: "1TB NVMe" } },
    { slug: "lenovo-legion-pro-7", name: "Lenovo Legion Pro 7i", description: "Intel Core i9-13900HX, RTX 4070, 16\" WQXGA 240Hz, 32GB DDR5, 1TB SSD", price: 25500000, categoryId: cm["gaming-laptops"], brandId: bm["lenovo"], stock: 12, isNew: true, specs: { Protsessor: "Intel Core i9-13900HX", Videokarta: "NVIDIA RTX 4070", Ekran: '16" WQXGA 240Hz', RAM: "32GB DDR5", SSD: "1TB NVMe" } },
    { slug: "asus-rog-zephyrus-g14", name: "ASUS ROG Zephyrus G14", description: "AMD Ryzen 9 7940HS, RTX 4060, 14\" QHD+ 165Hz, 16GB DDR5, 512GB SSD", price: 18000000, categoryId: cm["gaming-laptops"], brandId: bm["asus"], stock: 15, isFeatured: true, specs: { Protsessor: "AMD Ryzen 9 7940HS", Videokarta: "NVIDIA RTX 4060", Ekran: '14" QHD+ 165Hz', RAM: "16GB DDR5", SSD: "512GB NVMe" } },
    { slug: "acer-predator-helios-18", name: "Acer Predator Helios 18", description: "Intel Core i9-13900HX, RTX 4080, 18\" 4K 120Hz, 32GB DDR5, 2TB SSD", price: 38000000, categoryId: cm["gaming-laptops"], brandId: bm["acer"], stock: 3, specs: { Protsessor: "Intel Core i9-13900HX", Videokarta: "NVIDIA RTX 4080", Ekran: '18" 4K 120Hz', RAM: "32GB DDR5", SSD: "2TB NVMe" } },
    { slug: "hp-omen-16", name: "HP Omen 16", description: "Intel Core i7-13700HX, RTX 4060, 16\" QHD 165Hz, 16GB DDR5, 512GB SSD", price: 16500000, discountPrice: 14500000, categoryId: cm["gaming-laptops"], brandId: bm["hp"], stock: 20, isNew: true, specs: { Protsessor: "Intel Core i7-13700HX", Videokarta: "NVIDIA RTX 4060", Ekran: '16" QHD 165Hz', RAM: "16GB DDR5", SSD: "512GB NVMe" } },

    { slug: "rog-strix-g35ce", name: "ASUS ROG Strix G35CE", description: "Intel Core i9-13900KF, RTX 4090, 32GB DDR5, 2TB SSD. Ultimate gaming stansiya.", price: 45000000, categoryId: cm["gaming-pcs"], brandId: bm["asus"], stock: 4, isFeatured: true, specs: { Protsessor: "Intel Core i9-13900KF", Videokarta: "NVIDIA RTX 4090", RAM: "32GB DDR5", SSD: "2TB NVMe" } },
    { slug: "msi-infinite-a", name: "MSI Infinite RS 14th", description: "Intel Core i7-14700KF, RTX 4070, 16GB DDR5, 1TB SSD", price: 15800000, categoryId: cm["gaming-pcs"], brandId: bm["msi"], stock: 10, isNew: true, specs: { Protsessor: "Intel Core i7-14700KF", Videokarta: "NVIDIA RTX 4070", RAM: "16GB DDR5", SSD: "1TB NVMe" } },
    { slug: "corsair-vengeance-i7500", name: "Corsair Vengeance i7500", description: "Intel Core i7-14700KF, RTX 4080, 32GB DDR5, 2TB SSD", price: 32000000, categoryId: cm["gaming-pcs"], brandId: bm["corsair"], stock: 6, isFeatured: true, specs: { Protsessor: "Intel Core i7-14700KF", Videokarta: "NVIDIA RTX 4080", RAM: "32GB DDR5", SSD: "2TB NVMe" } },
    { slug: "hp-omen-45l", name: "HP Omen 45L", description: "Intel Core i9-14900KF, RTX 4090, 32GB DDR5, 2TB SSD", price: 42000000, discountPrice: 39000000, categoryId: cm["gaming-pcs"], brandId: bm["hp"], stock: 3, specs: { Protsessor: "Intel Core i9-14900KF", Videokarta: "NVIDIA RTX 4090", RAM: "32GB DDR5", SSD: "2TB NVMe" } },

    { slug: "razer-deathadder-v3", name: "Razer DeathAdder V3 Pro", description: "30K DPI Focus Pro sensor, 63g, HyperSpeed wireless", price: 1200000, categoryId: cm["gaming-mice"], brandId: bm["razer"], stock: 25, isFeatured: true, specs: { DPI: "30,000", "Og'irligi": "63g", Sims: "Ha - HyperSpeed", Sensor: "Focus Pro 30K" } },
    { slug: "logitech-g-pro-x2", name: "Logitech G PRO X SUPERLIGHT 2", description: "32K DPI, 60g, HERO 2 sensor, LIGHTSPEED wireless", price: 1500000, categoryId: cm["gaming-mice"], brandId: bm["logitech"], stock: 30, isNew: true, isFeatured: true, specs: { DPI: "32,000", "Og'irligi": "60g", Sims: "Ha - LIGHTSPEED", Sensor: "HERO 2" } },
    { slug: "razer-viper-v3", name: "Razer Viper V3 HyperSpeed", description: "30K DPI, 82g, ergonomik, wireless", price: 980000, categoryId: cm["gaming-mice"], brandId: bm["razer"], stock: 18, specs: { DPI: "30,000", "Og'irligi": "82g", Sims: "Ha", Sensor: "Focus Pro 30K" } },
    { slug: "steelseries-prime-mini", name: "SteelSeries Prime Mini Wireless", description: "18K DPI, 80g, TrueMove Air, wireless", price: 850000, discountPrice: 690000, categoryId: cm["gaming-mice"], brandId: bm["steelseries"], stock: 22, specs: { DPI: "18,000", "Og'irligi": "80g", Sims: "Ha", Sensor: "TrueMove Air" } },
    { slug: "corsair-sabre-pro", name: "Corsair Sabre RGB Pro Wireless", description: "26K DPI, 79g, Marksman sensor, Slipstream", price: 780000, categoryId: cm["gaming-mice"], brandId: bm["corsair"], stock: 15, specs: { DPI: "26,000", "Og'irligi": "79g", Sims: "Ha", Sensor: "Marksman 26K" } },

    { slug: "razer-huntsman-v3-pro", name: "Razer Huntsman V3 Pro", description: "Analog Optical switches, per-key RGB, magnetic wrist rest", price: 2800000, categoryId: cm["mechanical-keyboards"], brandId: bm["razer"], stock: 12, isFeatured: true, specs: { Switch: "Analog Optical", Chiroq: "Per-key RGB", Sims: "Yo'q", Maket: "Full-size" } },
    { slug: "corsair-k70-pro", name: "Corsair K70 Pro Mini Wireless", description: "Cherry MX Red, 65% compact, per-key RGB, wireless", price: 2200000, categoryId: cm["mechanical-keyboards"], brandId: bm["corsair"], stock: 16, isNew: true, specs: { Switch: "Cherry MX Red", Chiroq: "Per-key RGB", Sims: "Ha", Maket: "65%" } },
    { slug: "logitech-g915-tkl", name: "Logitech G915 TKL", description: "GL Tactile, Tenkeyless, LIGHTSYNC RGB, LIGHTSPEED", price: 2100000, categoryId: cm["mechanical-keyboards"], brandId: bm["logitech"], stock: 14, specs: { Switch: "GL Tactile", Chiroq: "LIGHTSYNC RGB", Sims: "Ha", Maket: "TKL" } },
    { slug: "hyperx-alloy-origins", name: "HyperX Alloy Origins 65", description: "HyperX Red, 65% compact, per-key RGB, aluminum frame", price: 950000, categoryId: cm["mechanical-keyboards"], brandId: bm["hyperx"], stock: 20, specs: { Switch: "HyperX Red", Chiroq: "Per-key RGB", Sims: "Yo'q", Maket: "65%" } },
    { slug: "steelseries-apex-pro-tkl", name: "SteelSeries Apex Pro TKL", description: "OmniPoint adjustable, Smart OLED, per-key RGB", price: 2500000, discountPrice: 2100000, categoryId: cm["mechanical-keyboards"], brandId: bm["steelseries"], stock: 8, specs: { Switch: "OmniPoint Adjustable", Chiroq: "Per-key RGB + OLED", Sims: "Yo'q", Maket: "TKL" } },

    { slug: "razer-goliathus-chroma", name: "Razer Goliathus Extended Chroma", description: "950x420mm, RGB edge lighting, micro-weave cloth", price: 550000, categoryId: cm["mouse-pads"], brandId: bm["razer"], stock: 30, isFeatured: true, specs: { "O'lcham": "950x420mm", Material: "Micro-weave cloth", RGB: "Ha - Chroma", Qalinlik: "3mm" } },
    { slug: "logitech-g640", name: "Logitech G640 Large", description: "900x400mm, cloth surface, rubber base", price: 380000, categoryId: cm["mouse-pads"], brandId: bm["logitech"], stock: 25, specs: { "O'lcham": "900x400mm", Material: "Cloth", RGB: "Yo'q", Qalinlik: "3mm" } },
    { slug: "steelseries-qck-prism", name: "SteelSeries QcK Prism", description: "450x400mm, RGB 12-zone lighting, micro-textured", price: 420000, categoryId: cm["mouse-pads"], brandId: bm["steelseries"], stock: 18, isNew: true, specs: { "O'lcham": "450x400mm", Material: "Micro-textured cloth", RGB: "Ha - 12 zones", Qalinlik: "4mm" } },
    { slug: "corsair-mm300-extended", name: "Corsair MM300 Extended", description: "930x430mm, glide-optimized, anti-fray stitched edges", price: 350000, categoryId: cm["mouse-pads"], brandId: bm["corsair"], stock: 22, specs: { "O'lcham": "930x430mm", Material: "Glide-optimized", RGB: "Yo'q", Qalinlik: "3mm" } },

    { slug: "secretlab-titan-evo-2024", name: "Secretlab Titan Evo 2024", description: "Neo Hybrid Leatherette, 4-way L-ADAPT Lumbar, cold-cure foam", price: 6500000, categoryId: cm["gaming-chairs"], brandId: bm["secretlab"], stock: 6, isFeatured: true, specs: { Material: "Neo Hybrid Leatherette", "Bel yostig'i": "4-Way L-ADAPT", "Maks yuk": "130kg", "Balandlik sozlash": "Ha" } },
    { slug: "noblechairs-hero", name: "Noblechairs HERO TX", description: "PU leather, adjustable lumbar, 4D armrests, max 150kg", price: 4500000, categoryId: cm["gaming-chairs"], brandId: bm["noblechairs"], stock: 10, isNew: true, specs: { Material: "PU Leather", "Bel yostig'i": "Adjustable", "Maks yuk": "150kg", "Balandlik sozlash": "Ha" } },
    { slug: "razer-iskur-v2", name: "Razer Iskur V2", description: "Ergonomic lumbar support, fully adjustable, high-density foam", price: 5200000, categoryId: cm["gaming-chairs"], brandId: bm["razer"], stock: 8, specs: { Material: "PU Leather", "Bel yostig'i": "Ergonomic adjustable", "Maks yuk": "130kg", "Balandlik sozlash": "Ha" } },
    { slug: "corsair-t3-rush", name: "Corsair T3 Rush", description: "Soft fabric, 4D armrests, adjustable neck and lumbar pillows", price: 3200000, discountPrice: 2700000, categoryId: cm["gaming-chairs"], brandId: bm["corsair"], stock: 14, specs: { Material: "Soft Fabric", "Bel yostig'i": "Adjustable pillow", "Maks yuk": "120kg", "Balandlik sozlash": "Ha" } },
  ]).returning();

  const imgMap = new Map<number, string[]>();
  imgMap.set(cm["gaming-laptops"], PI.laptop);
  imgMap.set(cm["gaming-pcs"], PI.pc);
  imgMap.set(cm["gaming-mice"], PI.mouse);
  imgMap.set(cm["mechanical-keyboards"], PI.keyboard);
  imgMap.set(cm["mouse-pads"], PI.mousepad);
  imgMap.set(cm["gaming-chairs"], PI.chair);

  const imgValues: { productId: number; url: string; alt: string; sortOrder: number; isPrimary: boolean }[] = [];
  for (const p of prods) {
    const catId = p.categoryId;
    const imgs = catId ? (imgMap.get(catId) || []) : [];
    imgs.forEach((url: string, i: number) => {
      imgValues.push({ productId: p.id, url, alt: p.name, sortOrder: i, isPrimary: i === 0 });
    });
  }
  if (imgValues.length > 0) {
    await db.insert(productImages).values(imgValues);
  }

  await db.insert(banners).values([
    { title: "GAME HUB — Gaming texnikasi markazi", subtitle: "O'zbekistondagi eng katta gaming texnikasi do'koni. Premium noutbuklar, kompyuterlar va aksesuarlar.", image: "https://images.pexels.com/photos/7858742/pexels-photo-7858742.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", link: "/catalog", sortOrder: 1, isActive: true },
    { title: "RTX 4090 bilan tanishing", subtitle: "Eng kuchli videokartalar bilan gaming kompyuterlar endi sotuvda.", image: "https://images.pexels.com/photos/7915225/pexels-photo-7915225.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200", link: "/catalog/gaming-pcs", sortOrder: 2, isActive: true },
  ]);

  const settings = [
    { key: "store_name", value: "GAME HUB" },
    { key: "store_phone", value: "" },
    { key: "store_email", value: "" },
    { key: "store_address", value: "" },
    { key: "delivery_info", value: "Toshkent shahri bo'ylab 1-2 ish kuni ichida yetkazib beriladi. Viloyatlarga 3-5 ish kuni." },
    { key: "click_merchant_id", value: "" },
    { key: "payme_id", value: "" },
  ];
  await db.insert(storeSettings).values(settings);

  console.log("Seeding complete!");
}
