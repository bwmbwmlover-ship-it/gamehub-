import Image from "next/image";
import Link from "next/link";
import { getAllCategories, getFeaturedProducts, getNewArrivals, getDeals } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const [cats, featured, newArrivals, deals] = await Promise.all([
    getAllCategories(),
    getFeaturedProducts(8),
    getNewArrivals(8),
    getDeals(4),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[700px] overflow-hidden">
        <Image src="https://images.pexels.com/photos/7858742/pexels-photo-7858742.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1600" alt="GAME HUB" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-gh-bg via-gh-bg/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="max-w-xl animate-slide-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                GAME <span className="text-gh-violet-light">HUB</span>
              </h1>
              <p className="text-lg text-gh-muted mb-6 leading-relaxed">O&apos;zbekistondagi eng katta gaming texnikasi do&apos;koni. Premium noutbuklar, kompyuterlar va aksesuarlar.</p>
              <div className="flex gap-3">
                <Link href="/catalog" className="px-6 py-3 bg-gh-violet hover:bg-gh-violet-dark text-white font-semibold rounded-lg transition-colors">Katalog</Link>
                <Link href="/deals" className="px-6 py-3 border border-gh-border text-white hover:border-gh-violet font-semibold rounded-lg transition-colors">Chegirmalar</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">Kategoriyalar</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {cats.map(c => (
            <Link key={c.id} href={`/catalog?category=${c.slug}`} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-gh-border hover:border-gh-violet/50 transition-all">
              {c.image && <Image src={c.image} alt={c.nameUz} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" />}
              <div className="absolute inset-0 bg-gradient-to-t from-gh-bg via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-semibold text-white">{c.nameUz}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Tavsiya etilgan</h2>
            <Link href="/catalog?isFeatured=true" className="text-sm text-gh-violet-light hover:text-gh-violet transition-colors">Barchasini ko'rish →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map(p => (
              <ProductCard key={p.id} id={p.id} slug={p.slug} name={p.name} price={p.price} discountPrice={p.discountPrice} image={p.images?.[0]?.url} stock={p.stock} isNew={p.isNew} isFeatured={p.isFeatured} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Yangiliklar</h2>
            <Link href="/catalog?isNew=true" className="text-sm text-gh-violet-light hover:text-gh-violet transition-colors">Barchasini ko'rish →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newArrivals.map(p => (
              <ProductCard key={p.id} id={p.id} slug={p.slug} name={p.name} price={p.price} discountPrice={p.discountPrice} image={p.images?.[0]?.url} stock={p.stock} isNew={p.isNew} isFeatured={p.isFeatured} />
            ))}
          </div>
        </section>
      )}

      {/* Deals */}
      {deals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">🔥 Chegirmalar</h2>
            <Link href="/deals" className="text-sm text-gh-violet-light hover:text-gh-violet transition-colors">Barchasini ko'rish →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {deals.map(p => (
              <ProductCard key={p.id} id={p.id} slug={p.slug} name={p.name} price={p.price} discountPrice={p.discountPrice} image={p.images?.[0]?.url} stock={p.stock} isNew={p.isNew} isFeatured={p.isFeatured} />
            ))}
          </div>
        </section>
      )}

      {/* Advantages */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Nima uchun GAME HUB?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🚀", title: "Tez yetkazish", desc: "Toshkent bo'ylab 1-2 ish kuni ichida" },
            { icon: "🛡️", title: "Kafolat", desc: "Barcha mahsulotlarga rasmiy kafolat" },
            { icon: "💎", title: "Original mahsulotlar", desc: "Faqat original va sertifikatlangan" },
            { icon: "🤝", title: "Professional yordam", desc: "Mutaxassislar jamoasi" },
          ].map((a, i) => (
            <div key={i} className="text-center p-6 bg-gh-surface border border-gh-border rounded-xl">
              <div className="text-3xl mb-3">{a.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1">{a.title}</h3>
              <p className="text-xs text-gh-muted">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
