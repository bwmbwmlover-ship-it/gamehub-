"use client";
import { useFavComp } from "@/components/FavCompContext";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";

export default function FavoritesPage() {
  const { favorites } = useFavComp();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products?limit=100");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.items.filter((p: any) => favorites.includes(p.id)));
        }
      } catch {} finally { setLoading(false); }
    })();
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Sevimlilar ({favorites.length})</h1>
      {favorites.length === 0 ? (
        <p className="text-gh-muted">Sevimli mahsulotlar yo&apos;q</p>
      ) : loading ? (
        <p className="text-gh-muted">Yuklanmoqda...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p: any) => (
            <ProductCard key={p.id} id={p.id} slug={p.slug} name={p.name} price={p.price} discountPrice={p.discountPrice} image={p.images?.[0]?.url} stock={p.stock} isNew={p.isNew} isFeatured={p.isFeatured} />
          ))}
        </div>
      )}
    </div>
  );
}
