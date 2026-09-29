"use client";
import { useFavComp } from "@/components/FavCompContext";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ComparePage() {
  const { comparisons } = useFavComp();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (comparisons.length === 0) { setProducts([]); setLoading(false); return; }
    (async () => {
      try {
        const res = await fetch("/api/products?limit=100");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.items.filter((p: any) => comparisons.includes(p.id)));
        }
      } catch {} finally { setLoading(false); }
    })();
  }, [comparisons]);

  if (comparisons.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">⚖️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Taqqoslash</h1>
        <p className="text-gh-muted">Taqqoslash uchun mahsulot qo&apos;shing (maks 4 ta)</p>
      </div>
    );
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gh-muted">Yuklanmoqda...</div>;

  const allKeys = new Set<string>();
  products.forEach(p => { if (p.specs) Object.keys(p.specs).forEach(k => allKeys.add(k)); });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Taqqoslash ({products.length})</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-sm text-gh-muted bg-gh-surface2 rounded-tl-xl min-w-[120px]">Xususiyat</th>
              {products.map(p => (
                <th key={p.id} className="p-3 text-center bg-gh-surface2 min-w-[200px]">
                  <Link href={`/product/${p.slug}`} className="text-sm font-medium text-white hover:text-gh-violet-light">{p.name}</Link>
                  <div className="mt-1 text-sm font-bold text-white">{formatPrice(p.discountPrice || p.price)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(allKeys).map(key => (
              <tr key={key} className="border-t border-gh-border">
                <td className="p-3 text-sm text-gh-muted bg-gh-surface2">{key}</td>
                {products.map(p => (
                  <td key={p.id} className="p-3 text-sm text-center text-gh-text">{String((p.specs as any)?.[key] || "—")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
