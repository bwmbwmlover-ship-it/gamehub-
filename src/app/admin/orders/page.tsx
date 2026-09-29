"use client";
import { useState, useEffect } from "react";
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, ORDER_STATUSES } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/orders").then(r => r.json()).then(data => { setOrders(data.items || []); setTotal(data.total || 0); }).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch("/api/orders", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    }
  };

  if (loading) return <div className="text-gh-muted">Yuklanmoqda...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Buyurtmalar ({total})</h1>
      <div className="space-y-3">
        {orders.map((o: any) => (
          <div key={o.id} className="p-4 bg-gh-surface border border-gh-border rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-white">#{o.id}</span>
                <span className="text-xs text-gh-muted ml-2">— {o.customerName}</span>
                <span className="text-xs text-gh-muted ml-2">{o.phone}</span>
              </div>
              <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="px-2 py-1 bg-gh-surface2 border border-gh-border rounded text-xs text-white focus:outline-none">
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between text-xs text-gh-muted">
              <span>{new Date(o.createdAt).toLocaleDateString("uz-UZ")}</span>
              <span className="text-sm font-medium text-white">{formatPrice(o.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
