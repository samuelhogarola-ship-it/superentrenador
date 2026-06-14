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
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-6 py-14 lg:px-10">
      <SectionHeading
        eyebrow="Marketplace"
        title="Perfiles públicos listos para posicionar"
        body="El marketplace nace con una estructura pública indexable: perfiles, ciudades, especialidades y una capa privada futura para desbloqueo y conversión."
      />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {trainers.map((trainer) => (
          <TrainerCard key={trainer.id} trainer={trainer} />
        ))}
      </div>
    </main>
  );
}
