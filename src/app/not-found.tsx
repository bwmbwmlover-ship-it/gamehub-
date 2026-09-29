import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">404</div>
      <h1 className="text-2xl font-bold text-white mb-2">Sahifa topilmadi</h1>
      <p className="text-gh-muted mb-6">Bu sahifa mavjud emas yoki o&apos;chirilgan</p>
      <Link href="/" className="px-6 py-3 bg-gh-violet hover:bg-gh-violet-dark text-white font-semibold rounded-lg transition-colors">Bosh sahifa</Link>
    </div>
  );
}
