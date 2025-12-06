export function PromptSkeleton() {
  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="h-5 skeleton rounded w-2/3" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 skeleton rounded-lg" />
          <div className="w-7 h-7 skeleton rounded-lg" />
        </div>
      </div>

      {/* Description */}
      <div className="h-4 skeleton rounded w-full mb-3" />

      {/* Content preview */}
      <div className="code-block mb-4">
        <div className="space-y-2">
          <div className="h-3 skeleton rounded w-full" />
          <div className="h-3 skeleton rounded w-5/6" />
          <div className="h-3 skeleton rounded w-4/6" />
        </div>
      </div>

      {/* Variables */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 skeleton rounded w-16" />
        <div className="h-6 skeleton rounded w-20" />
      </div>

      {/* Copy button */}
      <div className="h-10 skeleton rounded-xl w-full" />
    </div>
  );
}

export function PromptSkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items don't have stable IDs
        <PromptSkeleton key={i} />
      ))}
    </div>
  );
}
