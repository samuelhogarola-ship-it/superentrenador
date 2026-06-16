import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { TrainerCard } from "@/components/trainer-card";
import { listPublicTrainerProfiles } from "@/lib/repositories/trainers";

export const metadata: Metadata = {
  title: "Entrenadores personales | Super Entrenador",
  description:
    "Explora perfiles públicos de entrenadores personales por ciudad, especialidad y formato antes de desbloquear contacto y contratación.",
};

export default async function TrainersPage() {
  const trainers = await listPublicTrainerProfiles();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:px-8">
      <section className="app-surface rounded-[36px] px-6 py-8 sm:px-8 sm:py-10">
        <SectionHeading
          eyebrow="Marketplace"
          title="Perfiles publicos listos para descubrir y comparar"
          body="El sistema sigue el patron de Saulo: superficie limpia, lectura rapida y navegacion persistente. Aqui el usuario entra, compara y decide sin ruido."
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {trainers.map((trainer) => (
          <TrainerCard key={trainer.id} trainer={trainer} />
        ))}
      </div>
    </main>
  );
}
