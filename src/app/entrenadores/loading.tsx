import { FiltersBarSkeleton, TrainerListItemSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <section className="app-surface rounded-[28px] px-6 py-7 sm:px-8">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton mt-3 h-9 w-72" />
        <div className="skeleton mt-3 h-4 w-96" />
      </section>

      <FiltersBarSkeleton />

      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <TrainerListItemSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}
