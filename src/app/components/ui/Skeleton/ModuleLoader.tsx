// lightweight skeleton while chunks load
export function ModuleLoader({ title }: { title: string }) {
  return (
    <div className="p-8">
      <div className="animate-pulse space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-48 bg-gray-200 rounded" />
      </div>
    </div>
  );
}