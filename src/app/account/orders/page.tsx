"use client";
import { useState, useEffect } from "react";
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) setOrders(await res.json());
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gh-muted">Yuklanmoqda...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Buyurtmalar</h1>
      {orders.length === 0 ? (
        <p className="text-gh-muted">Buyurtmalar yo&apos;q</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o: any) => (
            <div key={o.id} className="p-5 bg-gh-surface border border-gh-border rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white">#{o.id}</span>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${ORDER_STATUS_COLORS[o.status] || "bg-gh-surface2 text-gh-muted"}`}>
                  {ORDER_STATUS_LABELS[o.status] || o.status}
                </span>
              </div>
              <p className="text-xs text-gh-muted mb-2">{new Date(o.createdAt).toLocaleDateString("uz-UZ")}</p>
              <div className="space-y-1">
                {(o.items || []).map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gh-muted">{item.productName} × {item.quantity}</span>
                    <span className="text-gh-text">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gh-border mt-3 pt-2 flex justify-between">
                <span className="text-sm font-medium text-white">Jami</span>
                <span className="text-sm font-bold text-white">{formatPrice(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
