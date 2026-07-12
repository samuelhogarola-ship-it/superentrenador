import Link from "next/link";
import {
  Activity,
  Dumbbell,
  Flame,
  Heart,
  Laptop,
  Shuffle,
  Target,
  Trophy,
  Venus,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/reveal";

const ICON_MAP: Record<string, typeof Dumbbell> = {
  hipertrofia: Dumbbell,
  "pérdida de grasa": Flame,
  "seguimiento online": Laptop,
  "planes híbridos": Shuffle,
  "fuerza femenina": Venus,
  posparto: Heart,
  "entrenamiento funcional": Activity,
  rendimiento: Trophy,
  "preparación física": Target,
  "fuerza aplicada": Zap,
};

interface CategoryGridProps {
  specialties: string[];
}

export function CategoryGrid({ specialties }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {specialties.map((specialty, index) => {
        const Icon = ICON_MAP[specialty.toLowerCase()] ?? Dumbbell;
        return (
          <Reveal key={specialty} delay={(index % 5) * 60}>
            <Link
              href={`/entrenadores?specialty=${encodeURIComponent(specialty)}`}
              className="group flex items-center gap-3 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4 transition-colors hover:border-[var(--accent)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
                <Icon size={18} className="text-[var(--accent)]" />
              </span>
              <span className="text-sm font-semibold leading-snug text-[var(--text)]">{specialty}</span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
