"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-white mb-2">Savat bo&apos;sh</h1>
        <p className="text-gh-muted mb-6">Mahsulotlar qo&apos;shing va xaridni davom ettiring</p>
        <Link href="/catalog" className="px-6 py-3 bg-gh-violet hover:bg-gh-violet-dark text-white font-semibold rounded-lg transition-colors">Katalogga o&apos;tish</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Savat ({items.length})</h1>
      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.productId} className="flex gap-4 p-4 bg-gh-surface border border-gh-border rounded-xl">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gh-surface2">
              {item.image ? <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" /> : <div className="w-full h-full flex items-center justify-center text-gh-muted text-xs">IMG</div>}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gh-text line-clamp-2">{item.name}</span>
              <div className="mt-1">
                {item.discountPrice ? (
                  <span className="text-sm font-bold text-white">{formatPrice(item.discountPrice)}</span>
                ) : (
                  <span className="text-sm font-bold text-white">{formatPrice(item.price)}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gh-border rounded-lg overflow-hidden">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2 py-1 text-gh-muted hover:text-white bg-gh-surface2 text-xs">−</button>
                <span className="px-3 py-1 text-xs text-white">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 py-1 text-gh-muted hover:text-white bg-gh-surface2 text-xs">+</button>
              </div>
              <button onClick={() => removeItem(item.productId)} className="p-1.5 text-gh-muted hover:text-gh-red transition-colors" title="O'chirish">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gh-surface border border-gh-border rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gh-muted">Jami:</span>
          <span className="text-xl font-bold text-white">{formatPrice(total)}</span>
        </div>
        <div className="flex gap-3">
          {process.env.NEXT_PUBLIC_DEMO_MODE === "true" ? (
            <span className="flex-1 py-3 bg-gh-surface2 text-gh-muted font-semibold rounded-lg text-center text-sm">Namuna rejimida buyurtma yopiq</span>
          ) : (
            <Link href="/checkout" className="flex-1 py-3 bg-gh-violet hover:bg-gh-violet-dark text-white font-semibold rounded-lg transition-colors text-center text-sm">Buyurtma berish</Link>
          )}
          <button onClick={clearCart} className="px-4 py-3 border border-gh-border text-gh-muted hover:text-gh-red hover:border-gh-red rounded-lg transition-colors text-sm">Tozalash</button>
        </div>
      </div>
    </div>
  );
}
