import Link from "next/link";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import ProductClient from "./ProductClient";
import ProductGallery from "@/components/ProductGallery";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId!, 4);
  const primaryImage = product.images?.[0]?.url;
  const stock = product.stock ?? 0;
  const inStock = stock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-sm text-gh-muted mb-6">
        <Link href="/" className="hover:text-white">Bosh sahifa</Link>
        <span className="mx-2">/</span>
        <Link href="/catalog" className="hover:text-white">Katalog</Link>
        <span className="mx-2">/</span>
        <span className="text-gh-text">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <ProductGallery images={(product.images || []).map(img => ({ id: img.id, url: img.url, alt: img.alt }))} name={product.name} />

        {/* Details */}
        <div>
          {product.isNew && <span className="inline-block px-2 py-0.5 bg-gh-violet text-white text-xs font-semibold rounded-md mb-2">Yangi</span>}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{product.name}</h1>
          <div className="flex items-baseline gap-3 mb-4">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-bold text-white">{formatPrice(product.discountPrice)}</span>
                <span className="text-lg text-gh-muted line-through">{formatPrice(product.price)}</span>
                <span className="px-2 py-0.5 bg-gh-red text-white text-xs font-semibold rounded-md">-{Math.round((1 - product.discountPrice / product.price) * 100)}%</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className={`inline-flex items-center gap-1.5 mb-6 ${inStock ? "text-gh-green" : "text-gh-red"}`}>
            <div className={`w-2 h-2 rounded-full ${inStock ? "bg-gh-green" : "bg-gh-red"}`} />
            <span className="text-sm font-medium">{inStock ? `Mavjud (${stock} dona)` : "Tugagan"}</span>
          </div>

          <ProductClient productId={product.id} name={product.name} price={product.price} discountPrice={product.discountPrice} image={primaryImage} stock={stock} inStock={inStock} />

          {/* Specs */}
          {product.specs && Object.keys(product.specs).length > 0 ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-white mb-3">Xususiyatlar</h2>
              <div className="bg-gh-surface border border-gh-border rounded-xl overflow-hidden">
                {Object.entries(product.specs as Record<string, string>).map(([key, value]: [string, string], i: number) => (
                  <div key={key} className={`flex ${i > 0 ? "border-t border-gh-border" : ""}`}>
                    <div className="w-1/3 px-4 py-2.5 text-sm text-gh-muted bg-gh-surface2">{key}</div>
                    <div className="w-2/3 px-4 py-2.5 text-sm text-gh-text">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Description */}
          {product.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-white mb-2">Tavsif</h2>
              <p className="text-sm text-gh-muted leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Delivery info */}
          <div className="mt-6 p-4 bg-gh-surface border border-gh-border rounded-xl">
            <h3 className="text-sm font-semibold text-white mb-2">Yetkazib berish</h3>
            <p className="text-xs text-gh-muted">Toshkent shahri bo&apos;ylab 1-2 ish kuni ichida. Viloyatlarga 3-5 ish kuni. Do&apos;kondan olish imkoniyati mavjud.</p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-white mb-6">O&apos;xshash mahsulotlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map(p => (
              <ProductCard key={p.id} id={p.id} slug={p.slug} name={p.name} price={p.price} discountPrice={p.discountPrice} image={p.images?.[0]?.url} stock={p.stock} isNew={p.isNew} isFeatured={p.isFeatured} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
