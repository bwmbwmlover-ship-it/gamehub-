"use client";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { formatPrice, REGIONS, DELIVERY_OPTIONS, PAYMENT_METHODS } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [form, setForm] = useState({
    customerName: "", phone: "", address: "", region: REGIONS[0],
    deliveryOption: "delivery", paymentMethod: "cash", notes: "",
  });

  const deliveryOpt = DELIVERY_OPTIONS.find(d => d.value === form.deliveryOption);
  const deliveryPrice = deliveryOpt?.price || 0;
  const grandTotal = total + deliveryPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const orderItems = items.map(i => ({
        productId: i.productId,
        productName: i.name,
        quantity: i.quantity,
        price: i.discountPrice || i.price,
      }));
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: orderItems }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Xatolik yuz berdi");
      }
      const order = await res.json();
      setOrderId(order.id);
      setSuccess(true);
      clearCart();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-white mb-3">Namuna rejimi</h1>
      <p className="text-gh-muted mb-6">Buyurtmalar bazaga ulanish sozlangach qabul qilinadi.</p>
      <Link href="/catalog" className="px-6 py-3 bg-gh-violet text-white rounded-lg">Katalogga qaytish</Link>
    </div>;
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-white mb-2">Buyurtma qabul qilindi!</h1>
        <p className="text-gh-muted mb-1">Buyurtma raqami: #{orderId}</p>
        <p className="text-gh-muted mb-6">Tez orada siz bilan bog&apos;lanamiz</p>
        <Link href="/" className="px-6 py-3 bg-gh-violet hover:bg-gh-violet-dark text-white font-semibold rounded-lg transition-colors">Bosh sahifa</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-gh-muted mb-4">Savat bo&apos;sh</p>
        <Link href="/catalog" className="px-6 py-3 bg-gh-violet text-white rounded-lg">Katalog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Buyurtma berish</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gh-surface border border-gh-border rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-white">Ma&apos;lumotlar</h2>
          <div>
            <label className="block text-sm text-gh-muted mb-1">Ism *</label>
            <input required value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} className="w-full px-4 py-2.5 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
          </div>
          <div>
            <label className="block text-sm text-gh-muted mb-1">Telefon *</label>
            <input required type="tel" placeholder="+998" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
          </div>
          <div>
            <label className="block text-sm text-gh-muted mb-1">Viloyat</label>
            <select value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} className="w-full px-4 py-2.5 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet">
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gh-muted mb-1">Manzil</label>
            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2.5 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
          </div>
        </div>

        <div className="bg-gh-surface border border-gh-border rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-white">Yetkazib berish</h2>
          <div className="space-y-2">
            {DELIVERY_OPTIONS.map(opt => (
              <label key={opt.value} className="flex items-center gap-3 p-3 border border-gh-border rounded-lg cursor-pointer hover:border-gh-violet/50 transition-colors">
                <input type="radio" name="delivery" value={opt.value} checked={form.deliveryOption === opt.value} onChange={e => setForm({ ...form, deliveryOption: e.target.value })} className="accent-gh-violet" />
                <span className="flex-1 text-sm text-gh-text">{opt.label}</span>
                <span className="text-sm font-medium text-white">{opt.price === 0 ? "Bepul" : formatPrice(opt.price)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-gh-surface border border-gh-border rounded-xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-white">To&apos;lov usuli</h2>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(m => (
              <label key={m.value} className="flex items-center gap-3 p-3 border border-gh-border rounded-lg cursor-pointer hover:border-gh-violet/50 transition-colors">
                <input type="radio" name="payment" value={m.value} checked={form.paymentMethod === m.value} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className="accent-gh-violet" />
                <span className="text-sm text-gh-text">{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-gh-surface border border-gh-border rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-3">Buyurtma</h2>
          <div className="space-y-2 mb-3">
            {items.map(i => (
              <div key={i.productId} className="flex justify-between text-sm">
                <span className="text-gh-muted">{i.name} × {i.quantity}</span>
                <span className="text-gh-text">{formatPrice((i.discountPrice || i.price) * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gh-border pt-2 space-y-1">
            <div className="flex justify-between text-sm"><span className="text-gh-muted">Mahsulotlar</span><span className="text-gh-text">{formatPrice(total)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gh-muted">Yetkazish</span><span className="text-gh-text">{deliveryPrice === 0 ? "Bepul" : formatPrice(deliveryPrice)}</span></div>
            <div className="flex justify-between text-base font-bold pt-1"><span className="text-white">Jami</span><span className="text-white">{formatPrice(grandTotal)}</span></div>
          </div>
        </div>

        {error && <p className="text-sm text-gh-red">{error}</p>}

        <button type="submit" disabled={loading} className="w-full py-3 bg-gh-violet hover:bg-gh-violet-dark disabled:bg-gh-surface2 text-white font-semibold rounded-lg transition-colors">
          {loading ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
        </button>
      </form>
    </div>
  );
}
