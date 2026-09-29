"use client";
import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin?sub=settings").then(r => r.json()).then(setSettings).finally(() => setLoading(false));
  }, []);

  const handleSave = async (key: string, value: string) => {
    setSaving(true);
    await fetch("/api/admin", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sub: "setting", key, value }) });
    setSaving(false);
  };

  if (loading) return <div className="text-gh-muted">Yuklanmoqda...</div>;

  const labels: Record<string, string> = {
    store_name: "Do'kon nomi",
    store_phone: "Telefon",
    store_email: "Email",
    store_address: "Manzil",
    delivery_info: "Yetkazish ma'lumoti",
    click_merchant_id: "Click Merchant ID",
    payme_id: "Payme ID",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Sozlamalar</h1>
      <div className="space-y-4 max-w-lg">
        {settings.map((s: any) => (
          <div key={s.id}>
            <label className="block text-sm text-gh-muted mb-1">{labels[s.key] || s.key}</label>
            <div className="flex gap-2">
              <input
                defaultValue={s.value || ""}
                onChange={e => { const idx = settings.findIndex((x: any) => x.id === s.id); const newSettings = [...settings]; newSettings[idx] = { ...s, value: e.target.value }; setSettings(newSettings); }}
                onBlur={(e) => handleSave(s.key, e.target.value)}
                className="flex-1 px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-gh-surface border border-gh-border rounded-xl">
        <h2 className="text-lg font-semibold text-white mb-2">To&apos;lov integratsiyalari</h2>
        <p className="text-xs text-gh-muted">Click va Payme merchant ID larni sozlaganingizda, ular checkout sahifasida avtomatik ko&apos;rinadi. Bo&apos;sh qolsa — ko&apos;rinmaydi.</p>
      </div>
    </div>
  );
}
