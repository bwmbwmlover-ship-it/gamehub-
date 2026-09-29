"use client";
import { useState, useEffect } from "react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin?sub=customers").then(r => r.json()).then(data => setCustomers(data.items || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gh-muted">Yuklanmoqda...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Mijozlar</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gh-muted border-b border-gh-border">
              <th className="p-3">Ism</th>
              <th className="p-3">Email</th>
              <th className="p-3">Telefon</th>
              <th className="p-3">Sana</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((u: any) => (
              <tr key={u.id} className="border-b border-gh-border">
                <td className="p-3 text-white">{u.name}</td>
                <td className="p-3 text-gh-text">{u.email}</td>
                <td className="p-3 text-gh-text">{u.phone || "—"}</td>
                <td className="p-3 text-gh-muted">{new Date(u.createdAt).toLocaleDateString("uz-UZ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
