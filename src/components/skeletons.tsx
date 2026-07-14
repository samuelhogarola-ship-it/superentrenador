export function TrainerListItemSkeleton() {
  return (
    <div className="app-surface flex flex-col gap-5 rounded-[20px] p-5 sm:flex-row sm:items-center sm:p-6">
      <div className="skeleton h-20 w-20 shrink-0 rounded-full" />
      <div className="flex-1 space-y-3">
        <div className="skeleton h-5 w-40" />
        <div className="skeleton h-3.5 w-28" />
        <div className="skeleton h-3.5 w-full max-w-md" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
      </div>
      <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-[var(--line)] pt-4 sm:flex-col sm:items-end sm:gap-3 sm:border-t-0 sm:border-l sm:pl-6 sm:pt-0">
        <div className="skeleton h-7 w-20" />
        <div className="skeleton h-10 w-28 rounded-full" />
      </div>
    </div>
  );
}


export function FiltersBarSkeleton() {
  return (
    <div className="app-surface flex flex-wrap items-center gap-3 rounded-[20px] p-3">
      <div className="skeleton h-9 w-44 rounded-full" />
      <div className="skeleton h-9 w-36 rounded-full" />
      <div className="skeleton h-9 w-32 rounded-full" />
      <div className="skeleton ml-auto h-9 w-44 rounded-full" />
    </div>
  );
}

export function TrainerProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="app-surface grid gap-8 rounded-[28px] p-6 sm:p-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="flex items-center gap-4">
            <div className="skeleton h-28 w-28 shrink-0 rounded-full" />
            <div className="space-y-3">
              <div className="skeleton h-3 w-32" />
              <div className="skeleton h-8 w-56" />
              <div className="skeleton h-4 w-40" />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
        <div className="skeleton h-72 w-full rounded-[28px]" />
      </div>
    </div>
  );
}
