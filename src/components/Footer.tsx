import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gh-surface border-t border-gh-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gh-violet flex items-center justify-center font-bold text-white text-sm">G</div>
              <span className="text-lg font-bold text-white">GAME <span className="text-gh-violet-light">HUB</span></span>
            </div>
            <p className="text-sm text-gh-muted leading-relaxed">O&apos;zbekistondagi eng katta gaming texnikasi do&apos;koni. Premium sifatli mahsulotlar va professional xizmat.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Katalog</h3>
            <ul className="space-y-2">
              {[
                { slug: "gaming-laptops", name: "Gaming noutbuklar" },
                { slug: "gaming-pcs", name: "Gaming kompyuterlar" },
                { slug: "gaming-mice", name: "Gaming sichqonchalar" },
                { slug: "mechanical-keyboards", name: "Mexanik klaviaturalar" },
                { slug: "mouse-pads", name: "Sichqoncha padlar" },
                { slug: "gaming-chairs", name: "Gaming stullar" },
              ].map(c => (
                <li key={c.slug}><Link href={`/catalog?category=${c.slug}`} className="text-sm text-gh-muted hover:text-white transition-colors">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Ma&apos;lumot</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gh-muted hover:text-white transition-colors">Biz haqimizda</Link></li>
              <li><Link href="/delivery" className="text-sm text-gh-muted hover:text-white transition-colors">Yetkazib berish va to&apos;lov</Link></li>
              <li><Link href="/contact" className="text-sm text-gh-muted hover:text-white transition-colors">Aloqa</Link></li>
              <li><Link href="/privacy" className="text-sm text-gh-muted hover:text-white transition-colors">Maxfiylik siyosati</Link></li>
              <li><Link href="/terms" className="text-sm text-gh-muted hover:text-white transition-colors">Foydalanish shartlari</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Xizmatlar</h3>
            <ul className="space-y-2">
              <li><Link href="/account" className="text-sm text-gh-muted hover:text-white transition-colors">Mening hisobim</Link></li>
              <li><Link href="/account/orders" className="text-sm text-gh-muted hover:text-white transition-colors">Buyurtmalar</Link></li>
              <li><Link href="/account/favorites" className="text-sm text-gh-muted hover:text-white transition-colors">Sevimlilar</Link></li>
              <li><Link href="/compare" className="text-sm text-gh-muted hover:text-white transition-colors">Taqqoslash</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gh-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gh-muted">&copy; {new Date().getFullYear()} GAME HUB. Barcha huquqlar himoyalangan.</p>
          <p className="text-xs text-gh-muted">Demo do&apos;kon — haqiqiy manzil va telefon yo&apos;q</p>
        </div>
      </div>
    </footer>
  );
}
