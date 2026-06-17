import { TrainerProfileSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <div className="skeleton h-4 w-56" />
      <TrainerProfileSkeleton />
    </main>
  );
}
