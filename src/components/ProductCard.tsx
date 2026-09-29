"use client";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartContext";
import { useFavComp } from "./FavCompContext";

interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  image?: string | null;
  stock?: number | null;
  isNew?: boolean | null;
  isFeatured?: boolean | null;
}

export default function ProductCard({ id, slug, name, price, discountPrice, image, stock, isNew }: ProductCardProps) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite, isComparison, toggleComparison } = useFavComp();
  const inStock = (stock ?? 0) > 0;

  return (
    <div className="group bg-gh-surface border border-gh-border rounded-xl overflow-hidden hover:border-gh-violet/50 transition-all duration-300 animate-fade-in">
      <Link href={`/product/${slug}`} className="block relative aspect-[4/3] bg-gh-surface2 overflow-hidden">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gh-muted">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
        {isNew && <span className="absolute top-2 left-2 px-2 py-0.5 bg-gh-violet text-white text-[10px] font-semibold rounded-md uppercase">Yangi</span>}
        {discountPrice && <span className="absolute top-2 right-2 px-2 py-0.5 bg-gh-red text-white text-[10px] font-semibold rounded-md">-{Math.round((1 - discountPrice / price) * 100)}%</span>}
        {!inStock && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-white text-sm font-medium">Tugagan</span></div>}
      </Link>
      <div className="p-4">
        <Link href={`/product/${slug}`} className="block text-sm font-medium text-gh-text hover:text-gh-violet-light transition-colors line-clamp-2 mb-2 min-h-[2.5rem]">{name}</Link>
        <div className="flex items-baseline gap-2 mb-3">
          {discountPrice ? (
            <>
              <span className="text-lg font-bold text-white">{formatPrice(discountPrice)}</span>
              <span className="text-xs text-gh-muted line-through">{formatPrice(price)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-white">{formatPrice(price)}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => addItem({ productId: id, name, price, discountPrice, quantity: 1, image, stock: stock ?? 0 })}
            disabled={!inStock}
            className="flex-1 py-2 px-3 bg-gh-violet hover:bg-gh-violet-dark disabled:bg-gh-surface2 disabled:text-gh-muted text-white text-sm font-medium rounded-lg transition-colors"
          >
            Savatga
          </button>
          <button onClick={() => toggleFavorite(id)} className={`p-2 rounded-lg border transition-colors ${isFavorite(id) ? "border-gh-red text-gh-red" : "border-gh-border text-gh-muted hover:text-gh-red hover:border-gh-red"}`} title="Sevimli">
            <svg className="w-4 h-4" fill={isFavorite(id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
          <button onClick={() => toggleComparison(id)} className={`p-2 rounded-lg border transition-colors ${isComparison(id) ? "border-gh-violet text-gh-violet" : "border-gh-border text-gh-muted hover:text-gh-violet hover:border-gh-violet"}`} title="Taqqoslash">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
