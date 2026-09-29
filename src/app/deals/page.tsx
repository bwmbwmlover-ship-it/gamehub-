import { getDeals } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default async function DealsPage() {
  const deals = await getDeals(20);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">🔥 Chegirmalar</h1>
      <p className="text-gh-muted mb-6">{deals.length} ta chegirmali mahsulot</p>
      {deals.length === 0 ? (
        <p className="text-gh-muted">Hozir chegirmalar yo&apos;q</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map(p => (
            <ProductCard key={p.id} id={p.id} slug={p.slug} name={p.name} price={p.price} discountPrice={p.discountPrice} image={p.images?.[0]?.url} stock={p.stock} isNew={p.isNew} isFeatured={p.isFeatured} />
          ))}
        </div>
      )}
    </div>
  );
}
