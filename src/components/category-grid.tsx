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
              className="app-surface group flex flex-col gap-3 rounded-[24px] p-5 transition-transform hover:-translate-y-1"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] transition-colors group-hover:bg-[var(--accent)]">
                <Icon size={19} className="text-[var(--accent)] transition-colors group-hover:text-white" />
              </span>
              <span className="text-sm font-semibold leading-snug text-[var(--text)]">{specialty}</span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
