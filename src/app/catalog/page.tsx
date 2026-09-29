import { getAllCategories, getAllBrands, getProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import CatalogClient from "./CatalogClient";

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const [categories, brands] = await Promise.all([getAllCategories(), getAllBrands()]);

  const catSlug = params.category;
  const categoryId = catSlug ? categories.find(c => c.slug === catSlug)?.id : undefined;

  const result = await getProducts({
    categoryId,
    brandId: params.brandId ? Number(params.brandId) : undefined,
    search: params.search,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    inStock: params.inStock === "true",
    isNew: params.isNew === "true",
    sort: params.sort,
    page: Number(params.page) || 1,
    limit: 12,
  });

  const currentCat = catSlug ? categories.find(c => c.slug === catSlug) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{currentCat ? currentCat.nameUz : "Katalog"}</h1>
        <p className="text-sm text-gh-muted mt-1">{result.total} ta mahsulot</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <CatalogClient categories={categories} brands={brands} currentCategory={catSlug || null} currentSort={params.sort || ""} />

        {/* Products */}
        <div className="flex-1">
          {result.items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-gh-muted">Mahsulot topilmadi</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {result.items.map(p => (
                  <ProductCard key={p.id} id={p.id} slug={p.slug} name={p.name} price={p.price} discountPrice={p.discountPrice} image={p.images?.[0]?.url} stock={p.stock} isNew={p.isNew} isFeatured={p.isFeatured} />
                ))}
              </div>
              {/* Pagination */}
              {result.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(p => (
                    <a key={p} href={`?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${p === result.page ? "bg-gh-violet text-white" : "bg-gh-surface2 text-gh-muted hover:text-white"}`}>
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
