"use client";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin?sub=products").then(r => r.json()),
      fetch("/api/admin?sub=categories").then(r => r.json()),
      fetch("/api/admin?sub=brands").then(r => r.json()),
    ]).then(([p, c, b]) => { setProducts(p.items || []); setCategories(c || []); setBrands(b || []); }).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      sub: "product",
      id: editing?.id,
      slug: fd.get("slug"),
      name: fd.get("name"),
      description: fd.get("description"),
      price: Number(fd.get("price")),
      discountPrice: Number(fd.get("discountPrice")) || null,
      categoryId: Number(fd.get("categoryId")),
      brandId: Number(fd.get("brandId")) || null,
      stock: Number(fd.get("stock")),
      isNew: fd.get("isNew") === "on",
      isFeatured: fd.get("isFeatured") === "on",
      isActive: fd.get("isActive") !== "off",
      specs: {},
      images: fd.get("images") ? (fd.get("images") as string).split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    };
    const res = await fetch("/api/admin", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setShowForm(false);
      setEditing(null);
      const p = await fetch("/api/admin?sub=products").then(r => r.json());
      setProducts(p.items || []);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/admin?sub=product&id=${id}`, { method: "DELETE" });
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <div className="text-gh-muted">Yuklanmoqda...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Mahsulotlar</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-gh-violet hover:bg-gh-violet-dark text-white text-sm font-medium rounded-lg transition-colors">+ Yangi</button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mb-6 p-5 bg-gh-surface border border-gh-border rounded-xl space-y-3">
          <h2 className="text-lg font-semibold text-white">{editing ? "Tahrirlash" : "Yangi mahsulot"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="name" defaultValue={editing?.name || ""} placeholder="Nomi" required className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
            <input name="slug" defaultValue={editing?.slug || ""} placeholder="Slug" required className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
            <input name="price" defaultValue={editing?.price || ""} placeholder="Narx (UZS)" type="number" required className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
            <input name="discountPrice" defaultValue={editing?.discountPrice || ""} placeholder="Chegirma narxi" type="number" className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
            <select name="categoryId" defaultValue={editing?.categoryId || ""} className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet">
              <option value="">Kategoriya</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nameUz}</option>)}
            </select>
            <select name="brandId" defaultValue={editing?.brandId || ""} className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet">
              <option value="">Brend</option>
              {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <input name="stock" defaultValue={editing?.stock ?? 0} placeholder="Zaxira" type="number" className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
            <input name="images" defaultValue="" placeholder="Rasm URL (vergul bilan)" className="px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
          </div>
          <textarea name="description" defaultValue={editing?.description || ""} placeholder="Tavsif" rows={2} className="w-full px-3 py-2 bg-gh-surface2 border border-gh-border rounded-lg text-sm text-white focus:outline-none focus:border-gh-violet" />
          <div className="flex gap-4">
            <label className="flex items-center gap-1 text-sm text-gh-muted"><input type="checkbox" name="isNew" defaultChecked={editing?.isNew} className="accent-gh-violet" /> Yangi</label>
            <label className="flex items-center gap-1 text-sm text-gh-muted"><input type="checkbox" name="isFeatured" defaultChecked={editing?.isFeatured} className="accent-gh-violet" /> Tavsiya</label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-gh-violet text-white text-sm rounded-lg">Saqlash</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 border border-gh-border text-gh-muted text-sm rounded-lg">Bekor</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gh-muted border-b border-gh-border">
              <th className="p-3">Nomi</th>
              <th className="p-3">Narx</th>
              <th className="p-3">Zaxira</th>
              <th className="p-3">Holat</th>
              <th className="p-3">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b border-gh-border hover:bg-gh-surface2">
                <td className="p-3 text-white">{p.name}</td>
                <td className="p-3 text-gh-text">{formatPrice(p.price)}</td>
                <td className={`p-3 ${p.stock <= 5 ? "text-gh-red" : "text-gh-text"}`}>{p.stock}</td>
                <td className="p-3">{p.isActive ? <span className="text-gh-green text-xs">Faol</span> : <span className="text-gh-muted text-xs">Nofaol</span>}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-gh-violet-light hover:text-gh-violet text-xs">Tahrir</button>
                    <button onClick={() => handleDelete(p.id)} className="text-gh-red text-xs hover:underline">O&apos;chir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
