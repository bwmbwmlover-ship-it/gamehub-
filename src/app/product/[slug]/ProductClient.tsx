"use client";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { useFavComp } from "@/components/FavCompContext";

export default function ProductClient({ productId, name, price, discountPrice, image, stock, inStock }: {
  productId: number; name: string; price: number; discountPrice: number | null; image: string | null | undefined; stock: number; inStock: boolean;
}) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite, isComparison, toggleComparison } = useFavComp();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ productId, name, price, discountPrice, quantity: qty, image, stock });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-gh-muted">Miqdor:</label>
        <div className="flex items-center border border-gh-border rounded-lg overflow-hidden">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-gh-muted hover:text-white bg-gh-surface2 transition-colors">−</button>
          <span className="px-4 py-2 text-sm text-white font-medium">{qty}</span>
          <button onClick={() => setQty(Math.min(stock, qty + 1))} className="px-3 py-2 text-gh-muted hover:text-white bg-gh-surface2 transition-colors">+</button>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleAdd} disabled={!inStock} className="flex-1 py-3 px-6 bg-gh-violet hover:bg-gh-violet-dark disabled:bg-gh-surface2 disabled:text-gh-muted text-white font-semibold rounded-lg transition-colors text-sm">
          {added ? "✓ Qo'shildi" : "Savatga qo'shish"}
        </button>
        <button onClick={() => toggleFavorite(productId)} className={`p-3 rounded-lg border transition-colors ${isFavorite(productId) ? "border-gh-red text-gh-red" : "border-gh-border text-gh-muted hover:text-gh-red hover:border-gh-red"}`} title="Sevimli">
          <svg className="w-5 h-5" fill={isFavorite(productId) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
        <button onClick={() => toggleComparison(productId)} className={`p-3 rounded-lg border transition-colors ${isComparison(productId) ? "border-gh-violet text-gh-violet" : "border-gh-border text-gh-muted hover:text-gh-violet hover:border-gh-violet"}`} title="Taqqoslash">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </button>
      </div>
    </div>
  );
}
