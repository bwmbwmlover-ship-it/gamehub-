"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import { useFavComp } from "./FavCompContext";

const CATS = [
  { slug: "gaming-laptops", name: "Noutbuklar" },
  { slug: "gaming-pcs", name: "Kompyuterlar" },
  { slug: "gaming-mice", name: "Sichqonchalar" },
  { slug: "mechanical-keyboards", name: "Klaviaturalar" },
  { slug: "mouse-pads", name: "Padlar" },
  { slug: "gaming-chairs", name: "Stullar" },
];

export default function Header() {
  const { count: cartCount } = useCart();
  const { favorites, comparisons } = useFavComp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (search.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
        if (res.ok) setSuggestions(await res.json());
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? "bg-gh-surface/95 backdrop-blur-md shadow-lg" : "bg-gh-surface"}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gh-violet flex items-center justify-center font-bold text-white text-sm">G</div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:block">GAME <span className="text-gh-violet-light">HUB</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/catalog" className="px-3 py-2 text-sm text-gh-muted hover:text-white transition-colors rounded-md hover:bg-gh-surface2">Katalog</Link>
            {CATS.map(c => (
              <Link key={c.slug} href={`/catalog?category=${c.slug}`} className="px-2 py-2 text-xs text-gh-muted hover:text-white transition-colors rounded-md hover:bg-gh-surface2">{c.name}</Link>
            ))}
          </nav>

          {/* Search */}
          <div ref={searchRef} className="relative hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gh-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Mahsulot qidirish..."
                value={search}
                onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white placeholder:text-gh-muted focus:outline-none focus:border-gh-violet transition-colors"
              />
            </div>
            {searchOpen && search.length >= 2 && suggestions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-gh-surface border border-gh-border rounded-lg shadow-xl overflow-hidden z-50">
                {suggestions.map(s => (
                  <Link key={s.id} href={`/product/${s.slug}`} onClick={() => { setSearchOpen(false); setSearch(""); }} className="block px-4 py-2.5 text-sm text-gh-text hover:bg-gh-surface2 transition-colors">{s.name}</Link>
                ))}
              </div>
            )}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <Link href="/compare" className="relative p-2 text-gh-muted hover:text-white transition-colors" title="Taqqoslash">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              {comparisons.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gh-violet text-[10px] text-white flex items-center justify-center">{comparisons.length}</span>}
            </Link>
            <Link href="/account/favorites" className="relative p-2 text-gh-muted hover:text-white transition-colors" title="Sevimlilar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {favorites.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gh-red text-[10px] text-white flex items-center justify-center">{favorites.length}</span>}
            </Link>
            <Link href="/account" className="p-2 text-gh-muted hover:text-white transition-colors hidden sm:block" title="Profil">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </Link>
            <Link href="/cart" className="relative p-2 text-gh-muted hover:text-white transition-colors" title="Savat">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.141.141-.221.33-.221.53v2.177h14v-2.177c0-.2-.08-.389-.221-.53L17 13m-5 4a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gh-violet text-[10px] text-white flex items-center justify-center">{cartCount}</span>}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gh-muted hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
            </button>
          </div>
        </div>

        {/* Secondary nav */}
        <div className="hidden lg:flex items-center gap-4 pb-2 -mt-1">
          <Link href="/deals" className="text-xs text-gh-yellow hover:text-gh-yellow/80 font-medium transition-colors">🔥 Chegirmalar</Link>
          <Link href="/about" className="text-xs text-gh-muted hover:text-white transition-colors">Biz haqimizda</Link>
          <Link href="/delivery" className="text-xs text-gh-muted hover:text-white transition-colors">Yetkazib berish</Link>
          <Link href="/contact" className="text-xs text-gh-muted hover:text-white transition-colors">Aloqa</Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-gh-surface border-t border-gh-border animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <div className="relative mb-3">
              <input type="text" placeholder="Qidirish..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-4 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white placeholder:text-gh-muted focus:outline-none focus:border-gh-violet" />
            </div>
            <Link href="/catalog" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gh-text hover:bg-gh-surface2 rounded-md">Katalog</Link>
            {CATS.map(c => (
              <Link key={c.slug} href={`/catalog?category=${c.slug}`} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gh-muted hover:text-white hover:bg-gh-surface2 rounded-md">{c.name}</Link>
            ))}
            <div className="border-t border-gh-border my-2" />
            <Link href="/deals" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gh-yellow">🔥 Chegirmalar</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gh-muted hover:text-white hover:bg-gh-surface2 rounded-md">Biz haqimizda</Link>
            <Link href="/delivery" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gh-muted hover:text-white hover:bg-gh-surface2 rounded-md">Yetkazib berish</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gh-muted hover:text-white hover:bg-gh-surface2 rounded-md">Aloqa</Link>
            <Link href="/account" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gh-muted hover:text-white hover:bg-gh-surface2 rounded-md">Profil</Link>
          </div>
        </div>
      )}
    </header>
  );
}
