export default function DeliveryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-6">Yetkazib berish va to&apos;lov</h1>
      <div className="space-y-6 text-sm text-gh-muted leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">Yetkazib berish</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Toshkent shahri bo&apos;ylab — 1-2 ish kuni</li>
            <li>Viloyatlarga — 3-5 ish kuni</li>
            <li>Tezkor yetkazish — Toshkent bo&apos;ylab xuddi shu kun</li>
            <li>Do&apos;kondan olish — bepul, oldindan buyurtma bilan</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white mb-3">To&apos;lov usullari</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Naqd pul — yetkazib berish paytida</li>
            <li>Do&apos;konda to&apos;lash — naqd yoki karta</li>
          </ul>
          <p className="mt-2 text-xs text-gh-yellow">Click va Payme integratsiyalari faqat haqiqiy savdo bilan konfiguratsiya qilinganida ko&apos;rsatiladi.</p>
        </section>
        <div className="p-4 bg-gh-surface border border-gh-border rounded-xl">
          <p className="text-gh-yellow text-xs">⚠️ Demo ma&apos;lumot. Haqiqiy yetkazib berish shartlari admin panel orqali sozlanishi mumkin.</p>
        </div>
      </div>
    </div>
  );
}
