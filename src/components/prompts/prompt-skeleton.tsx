export function PromptSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="h-6 bg-gray-700 rounded w-2/3" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-700 rounded-lg" />
          <div className="w-8 h-8 bg-gray-700 rounded-lg" />
        </div>
      </div>

      {/* Description */}
      <div className="h-4 bg-gray-700 rounded w-full mb-3" />

      {/* Content preview */}
      <div className="bg-gray-900/50 rounded-lg p-3 mb-3 space-y-2">
        <div className="h-3 bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-700 rounded w-5/6" />
        <div className="h-3 bg-gray-700 rounded w-4/6" />
      </div>

      {/* Variables */}
      <div className="flex gap-1.5 mb-3">
        <div className="h-6 bg-gray-700 rounded-full w-16" />
        <div className="h-6 bg-gray-700 rounded-full w-20" />
      </div>

      {/* Copy button */}
      <div className="h-9 bg-gray-700 rounded-lg w-full" />
    </div>
  );
}

export function PromptSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items don't have stable IDs
        <PromptSkeleton key={i} />
      ))}
    </div>
  );
}
