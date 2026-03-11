export default function CatalogSkeleton() {
  return (
    <section className="py-20 lg:py-28 bg-surface-50 border-t border-surface-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-surface-200 rounded-lg animate-pulse" />
            <div className="h-5 w-96 bg-surface-100 rounded animate-pulse" />
          </div>
          <div className="h-12 w-full md:w-72 bg-surface-200 rounded-xl animate-pulse" />
        </div>
        <div className="flex justify-center mb-10">
          <div className="h-11 w-48 bg-surface-200 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-surface-100 shadow-sm">
              <div className="aspect-square bg-surface-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-surface-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-surface-100 rounded animate-pulse" />
                <div className="h-4 w-full bg-surface-100 rounded animate-pulse" />
                <div className="flex gap-2 pt-4">
                  <div className="h-10 flex-1 bg-surface-200 rounded-xl animate-pulse" />
                  <div className="h-10 flex-1 bg-surface-200 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
