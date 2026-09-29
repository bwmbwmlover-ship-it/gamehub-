"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { AuthUser } from "@/lib/utils";
import { useFavComp } from "@/components/FavCompContext";

export default function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavComp();

  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        setUser(data.user);
        if (data.user) {
          const ordRes = await fetch("/api/orders");
          if (ordRes.ok) setOrders(await ordRes.json());
        }
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  if (demoMode) return <div className="max-w-lg mx-auto px-4 py-20 text-center">
    <h1 className="text-2xl font-bold text-white mb-3">Namuna rejimi</h1>
    <p className="text-gh-muted mb-6">Hisob va admin panel bazaga ulanish sozlangach ishlaydi.</p>
    <Link href="/catalog" className="px-6 py-3 bg-gh-violet text-white rounded-lg">Katalogga qaytish</Link>
  </div>;

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gh-muted">Yuklanmoqda...</div>;

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Mening hisobim</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-gh-surface border border-gh-border rounded-xl">
          <h3 className="text-sm font-semibold text-white mb-1">{user.name}</h3>
          <p className="text-xs text-gh-muted">{user.email}</p>
          {user.phone && <p className="text-xs text-gh-muted mt-0.5">{user.phone}</p>}
        </div>
        <Link href="/account/orders" className="p-5 bg-gh-surface border border-gh-border rounded-xl hover:border-gh-violet/50 transition-colors">
          <div className="text-2xl mb-2">📦</div>
          <p className="text-sm font-medium text-white">Buyurtmalar</p>
          <p className="text-xs text-gh-muted">{orders.length} ta buyurtma</p>
        </Link>
        <Link href="/account/favorites" className="p-5 bg-gh-surface border border-gh-border rounded-xl hover:border-gh-violet/50 transition-colors">
          <div className="text-2xl mb-2">❤️</div>
          <p className="text-sm font-medium text-white">Sevimlilar</p>
          <p className="text-xs text-gh-muted">{favorites.length} ta mahsulot</p>
        </Link>
      </div>
      {user.role === "admin" && (
        <Link href="/admin" className="inline-flex items-center gap-2 px-6 py-3 bg-gh-violet hover:bg-gh-violet-dark text-white font-semibold rounded-lg transition-colors">
          Admin panel →
        </Link>
      )}
    </div>
  );
}

function LoginPage({ onLogin }: { onLogin: (u: AuthUser) => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const body = isRegister
        ? { action: "register", email, password, name, phone }
        : { action: "login", email, password };
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onLogin(data.user);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">{isRegister ? "Ro'yxatdan o'tish" : "Kirish"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <>
            <input required placeholder="Ism" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
            <input placeholder="Telefon (+998...)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2.5 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
          </>
        )}
        <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
        <input required type="password" placeholder="Parol" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
        {error && <p className="text-sm text-gh-red">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-3 bg-gh-violet hover:bg-gh-violet-dark disabled:bg-gh-surface2 text-white font-semibold rounded-lg transition-colors text-sm">
          {loading ? "Kutilmoqda..." : isRegister ? "Ro'yxatdan o'tish" : "Kirish"}
        </button>
      </form>
      <button onClick={() => setIsRegister(!isRegister)} className="w-full mt-4 text-sm text-gh-muted hover:text-gh-violet-light transition-colors text-center">
        {isRegister ? "Hisobingiz bormi? Kirish" : "Hisobingiz yo'qmi? Ro'yxatdan o'tish"}
      </button>
    </div>
  );
}
