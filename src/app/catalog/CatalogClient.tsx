"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Cat { id: number; slug: string; nameUz: string; }
interface Brand { id: number; slug: string; name: string; }

export default function CatalogClient({ categories, brands, currentCategory, currentSort }: { categories: Cat[]; brands: Brand[]; currentCategory: string | null; currentSort: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <div className="bg-gh-surface border border-gh-border rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Filtrlar</h3>

        <div>
          <label className="block text-xs text-gh-muted mb-1.5">Kategoriya</label>
          <select value={currentCategory || ""} onChange={e => update("category", e.target.value)} className="w-full px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet">
            <option value="">Barchasi</option>
            {categories.map(c => <option key={c.slug} value={c.slug}>{c.nameUz}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gh-muted mb-1.5">Brend</label>
          <select value={searchParams.get("brandId") || ""} onChange={e => update("brandId", e.target.value)} className="w-full px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet">
            <option value="">Barchasi</option>
            {brands.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gh-muted mb-1.5">Narx (UZS)</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Dan" value={searchParams.get("minPrice") || ""} onChange={e => update("minPrice", e.target.value)} className="w-full px-2 py-1.5 bg-gh-surface2 border border-gh-border rounded-lg text-xs text-white focus:outline-none focus:border-gh-violet" />
            <input type="number" placeholder="Gacha" value={searchParams.get("maxPrice") || ""} onChange={e => update("maxPrice", e.target.value)} className="w-full px-2 py-1.5 bg-gh-surface2 border border-gh-border rounded-lg text-xs text-white focus:outline-none focus:border-gh-violet" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="inStock" checked={searchParams.get("inStock") === "true"} onChange={e => update("inStock", e.target.checked ? "true" : "")} className="accent-gh-violet" />
          <label htmlFor="inStock" className="text-xs text-gh-muted">Mavjud</label>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isNew" checked={searchParams.get("isNew") === "true"} onChange={e => update("isNew", e.target.checked ? "true" : "")} className="accent-gh-violet" />
          <label htmlFor="isNew" className="text-xs text-gh-muted">Yangiliklar</label>
        </div>

        <div>
          <label className="block text-xs text-gh-muted mb-1.5">Saralash</label>
          <select value={currentSort} onChange={e => update("sort", e.target.value)} className="w-full px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet">
            <option value="newest">Yangi</option>
            <option value="price-asc">Narx: arzon → qimmat</option>
            <option value="price-desc">Narx: qimmat → arzon</option>
            <option value="popular">Mashhur</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
