"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const load = () => {
    fetch("/api/admin?sub=banners").then(r => r.json()).then(data => { setBanners(data || []); }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { sub: "banner", id: editing?.id, title: fd.get("title"), subtitle: fd.get("subtitle"), image: fd.get("image"), link: fd.get("link"), sortOrder: Number(fd.get("sortOrder")) || 0, isActive: fd.get("isActive") === "on" };
    await fetch("/api/admin", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setShowForm(false); setEditing(null); load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/admin?sub=banner&id=${id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <div className="text-gh-muted">Yuklanmoqda...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Bannerlar</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-gh-violet hover:bg-gh-violet-dark text-white text-sm font-medium rounded-lg transition-colors">+ Yangi</button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mb-6 p-5 bg-gh-surface border border-gh-border rounded-xl space-y-3">
          <h2 className="text-lg font-semibold text-white">{editing ? "Tahrirlash" : "Yangi banner"}</h2>
          <input name="title" defaultValue={editing?.title || ""} placeholder="Sarlavha" className="w-full px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
          <textarea name="subtitle" defaultValue={editing?.subtitle || ""} placeholder="Sub-sarlavha" rows={2} className="w-full px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
          <input name="image" defaultValue={editing?.image || ""} placeholder="Rasm URL" className="w-full px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
          <input name="link" defaultValue={editing?.link || ""} placeholder="Havola" className="w-full px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
          <div className="flex gap-4">
            <input name="sortOrder" defaultValue={editing?.sortOrder ?? 0} placeholder="Tartib" type="number" className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
            <label className="flex items-center gap-1 text-sm text-gh-muted"><input type="checkbox" name="isActive" defaultChecked={editing?.isActive !== false} className="accent-gh-violet" /> Faol</label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-gh-violet text-white text-sm rounded-lg">Saqlash</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-gh-border text-gh-muted text-sm rounded-lg">Bekor</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {banners.map((b: any) => (
          <div key={b.id} className="p-4 bg-gh-surface border border-gh-border rounded-xl flex gap-4">
            <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0 bg-gh-surface2">
              {b.image && <Image src={b.image} alt={b.title || ""} fill className="object-cover" sizes="128px" />}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">{b.title}</h3>
              <p className="text-xs text-gh-muted mt-0.5">{b.subtitle}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] ${b.isActive ? "bg-gh-green/20 text-gh-green" : "bg-gh-surface2 text-gh-muted"}`}>{b.isActive ? "Faol" : "Nofaol"}</span>
            </div>
            <div className="flex gap-2 items-start">
              <button onClick={() => { setEditing(b); setShowForm(true); }} className="text-gh-violet-light text-xs">Tahrir</button>
              <button onClick={() => handleDelete(b.id)} className="text-gh-red text-xs">O&apos;chir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
