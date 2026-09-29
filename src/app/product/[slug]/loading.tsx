export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-[4/3] bg-gh-surface2 rounded-xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-gh-surface2 rounded animate-pulse" />
          <div className="h-10 w-1/2 bg-gh-surface2 rounded animate-pulse" />
          <div className="h-12 bg-gh-surface2 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
