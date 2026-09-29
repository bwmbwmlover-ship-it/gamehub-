"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin?sub=dashboard").then(r => r.json()).then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gh-muted">Yuklanmoqda...</div>;
  if (!stats) return <div className="text-gh-red">Xatolik</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Buyurtmalar", value: stats.orderCount, icon: "🛒" },
          { label: "Mahsulotlar", value: stats.productCount, icon: "📦" },
          { label: "Mijozlar", value: stats.userCount, icon: "👥" },
          { label: "Daromad", value: formatPrice(stats.revenue), icon: "💰" },
        ].map((s, i) => (
          <div key={i} className="p-5 bg-gh-surface border border-gh-border rounded-xl">
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-xs text-gh-muted">{s.label}</p>
            <p className="text-xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">So&apos;nggi buyurtmalar</h2>
          {stats.recentOrders?.length === 0 ? <p className="text-sm text-gh-muted">Buyurtmalar yo&apos;q</p> : (
            <div className="space-y-2">
              {stats.recentOrders?.map((o: any) => (
                <div key={o.id} className="flex items-center justify-between p-3 bg-gh-surface2 rounded-lg">
                  <div>
                    <span className="text-sm text-white">#{o.id}</span>
                    <span className="text-xs text-gh-muted ml-2">{o.customerName}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{formatPrice(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Kam zaxira</h2>
          {stats.lowStockProducts?.length === 0 ? <p className="text-sm text-gh-muted">Barcha mahsulotlar yetarli</p> : (
            <div className="space-y-2">
              {stats.lowStockProducts?.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-gh-surface2 rounded-lg">
                  <span className="text-sm text-white">{p.name}</span>
                  <span className={`text-sm font-medium ${p.stock === 0 ? "text-gh-red" : "text-gh-yellow"}`}>{p.stock} dona</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
