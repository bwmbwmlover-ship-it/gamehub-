export default function CatalogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-gh-surface2 rounded-lg mb-6 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gh-surface border border-gh-border rounded-xl overflow-hidden">
            <div className="aspect-[4/3] bg-gh-surface2 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gh-surface2 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gh-surface2 rounded animate-pulse" />
              <div className="h-8 bg-gh-surface2 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
