"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const load = () => {
    fetch("/api/admin?sub=categories").then(r => r.json()).then(data => { setCategories(data || []); }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { sub: "category", id: editing?.id, slug: fd.get("slug"), nameUz: fd.get("nameUz"), image: fd.get("image"), description: fd.get("description"), sortOrder: Number(fd.get("sortOrder")) || 0 };
    await fetch("/api/admin", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setShowForm(false); setEditing(null); load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/admin?sub=category&id=${id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <div className="text-gh-muted">Yuklanmoqda...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Kategoriyalar</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-gh-violet hover:bg-gh-violet-dark text-white text-sm font-medium rounded-lg transition-colors">+ Yangi</button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mb-6 p-5 bg-gh-surface border border-gh-border rounded-xl space-y-3">
          <h2 className="text-lg font-semibold text-white">{editing ? "Tahrirlash" : "Yangi kategoriya"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="nameUz" defaultValue={editing?.nameUz || ""} placeholder="Nomi (O'zbekcha)" required className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
            <input name="slug" defaultValue={editing?.slug || ""} placeholder="Slug" required className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
            <input name="image" defaultValue={editing?.image || ""} placeholder="Rasm URL" className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
            <input name="sortOrder" defaultValue={editing?.sortOrder ?? 0} placeholder="Tartib" type="number" className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
          </div>
          <textarea name="description" defaultValue={editing?.description || ""} placeholder="Tavsif" rows={2} className="w-full px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-gh-violet text-white text-sm rounded-lg">Saqlash</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-gh-border text-gh-muted text-sm rounded-lg">Bekor</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c: any) => (
          <div key={c.id} className="p-4 bg-gh-surface border border-gh-border rounded-xl">
            <div className="relative aspect-[3/2] rounded-lg overflow-hidden mb-3 bg-gh-surface2">
              {c.image && <Image src={c.image} alt={c.nameUz} fill className="object-cover" sizes="300px" />}
            </div>
            <h3 className="text-sm font-medium text-white mb-1">{c.nameUz}</h3>
            <p className="text-xs text-gh-muted mb-2">{c.slug}</p>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(c); setShowForm(true); }} className="text-gh-violet-light hover:text-gh-violet text-xs">Tahrir</button>
              <button onClick={() => handleDelete(c.id)} className="text-gh-red text-xs hover:underline">O&apos;chir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
