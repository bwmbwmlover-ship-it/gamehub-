export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-6">Aloqa</h1>
      <div className="space-y-6 text-sm text-gh-muted">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-gh-surface border border-gh-border rounded-xl">
            <h3 className="text-white font-semibold mb-1">📧 Email</h3>
            <p>Admin panel orqali sozlanadi</p>
          </div>
          <div className="p-5 bg-gh-surface border border-gh-border rounded-xl">
            <h3 className="text-white font-semibold mb-1">📞 Telefon</h3>
            <p>Admin panel orqali sozlanadi</p>
          </div>
          <div className="p-5 bg-gh-surface border border-gh-border rounded-xl">
            <h3 className="text-white font-semibold mb-1">📍 Manzil</h3>
            <p>Admin panel orqali sozlanadi</p>
          </div>
          <div className="p-5 bg-gh-surface border border-gh-border rounded-xl">
            <h3 className="text-white font-semibold mb-1">⏰ Ish vaqti</h3>
            <p>Admin panel orqali sozlanadi</p>
          </div>
        </div>
        <div className="p-4 bg-gh-surface border border-gh-border rounded-xl">
          <p className="text-gh-yellow text-xs">⚠️ Demo ma&apos;lumot. Haqiqiy aloqa ma&apos;lumotlari admin panel orqali sozlanishi mumkin.</p>
        </div>
      </div>
    </div>
  );
}
