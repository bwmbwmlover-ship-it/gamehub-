"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AuthUser } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (data.user?.role === "admin") setUser(data.user);
        else router.push("/account");
      } catch { router.push("/account"); } finally { setLoading(false); }
    })();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gh-muted">Yuklanmoqda...</div>;
  if (!user) return null;

  const nav = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/products", label: "Mahsulotlar", icon: "📦" },
    { href: "/admin/categories", label: "Kategoriyalar", icon: "📁" },
    { href: "/admin/banners", label: "Bannerlar", icon: "🖼️" },
    { href: "/admin/orders", label: "Buyurtmalar", icon: "🛒" },
    { href: "/admin/customers", label: "Mijozlar", icon: "👥" },
    { href: "/admin/settings", label: "Sozlamalar", icon: "⚙️" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gh-surface border-r border-gh-border shrink-0 hidden lg:block">
        <div className="p-4 border-b border-gh-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gh-violet flex items-center justify-center font-bold text-white text-xs">G</div>
            <span className="text-sm font-bold text-white">GAME HUB</span>
          </Link>
          <p className="text-xs text-gh-muted mt-1">Admin panel</p>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map(n => (
            <Link key={n.href} href={n.href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${pathname === n.href ? "bg-gh-violet/20 text-gh-violet-light" : "text-gh-muted hover:text-white hover:bg-gh-surface2"}`}>
              <span>{n.icon}</span> {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="lg:hidden bg-gh-surface border-b border-gh-border p-3 flex items-center justify-between">
          <span className="text-sm font-bold text-white">Admin</span>
          <div className="flex gap-2">
            {nav.map(n => (
              <Link key={n.href} href={n.href} className={`px-2 py-1 rounded text-xs ${pathname === n.href ? "bg-gh-violet/20 text-gh-violet-light" : "text-gh-muted"}`}>{n.icon}</Link>
            ))}
          </div>
        </header>
        <div className="p-4 lg:p-6">{children}</div>
      </div>
    </div>
  );
}
