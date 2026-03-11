export default function RecommenderSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-surface-200/50 border border-surface-100 p-8 animate-pulse">
      <div className="h-8 w-48 bg-surface-200 rounded-lg mb-6" />
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="h-12 bg-surface-100 rounded-xl" />
          <div className="h-12 bg-surface-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="h-12 bg-surface-100 rounded-xl" />
          <div className="h-12 bg-surface-100 rounded-xl" />
        </div>
        <div className="h-8 w-full bg-surface-100 rounded-lg" />
        <div className="h-14 w-full bg-surface-200 rounded-xl mt-4" />
      </div>
    </div>
  );
}
