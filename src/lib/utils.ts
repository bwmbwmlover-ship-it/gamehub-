export function formatPrice(price: number): string {
  return new Intl.NumberFormat("uz-UZ").format(price) + " UZS";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export function shorten(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
};

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  discountPrice?: number | null;
  quantity: number;
  image?: string | null;
  stock?: number;
};

export type ComparisonItem = {
  productId: number;
  name: string;
  price: number;
  discountPrice?: number | null;
  image?: string | null;
  specs?: Record<string, string>;
};

export const REGIONS: string[] = [
  "Toshkent sh.",
  "Toshkent vil.",
  "Samarqand vil.",
  "Buxoro vil.",
  "Xorazm vil.",
  "Farg'ona vil.",
  "Namangan vil.",
  "Andijon vil.",
  "Qashqadaryo vil.",
  "Surxondaryo vil.",
  "Jizzax vil.",
  "Sirdaryo vil.",
  "Navoiy vil.",
  "Qoraqalpog'iston Res.",
  "Toshkent t.",
];

export const DELIVERY_OPTIONS = [
  { value: "delivery", label: "Yetkazib berish", price: 50000 },
  { value: "pickup", label: "Do'kondan olish", price: 0 },
  { value: "express", label: "Tezkor yetkazish", price: 100000 },
] as const;

export const PAYMENT_METHODS = [
  { value: "cash", label: "Naqd pul (yetkazish paytida)" },
  { value: "store", label: "Do'konda to'lash" },
] as const;

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Kutilmoqda",
  confirmed: "Tasdiqlangan",
  processing: "Jarayonda",
  shipped: "Yo'lda",
  delivered: "Yetkazilgan",
  cancelled: "Bekor qilingan",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  processing: "bg-purple-500/20 text-purple-400",
  shipped: "bg-indigo-500/20 text-indigo-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};
