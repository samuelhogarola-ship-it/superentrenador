import { Quote } from "lucide-react";
import { Avatar } from "@/components/avatar";

const TESTIMONIALS = [
  {
    name: "Marta Castillo",
    role: "Cliente en Málaga",
    quote:
      "Comparé tres entrenadores en cinco minutos y elegí con criterio real. El perfil mostraba justo lo que necesitaba saber.",
  },
  {
    name: "Iván Pelegrín",
    role: "Cliente en Fuengirola",
    quote:
      "Nada de letra pequeña: especialidad, precio y reseñas a la vista. Contacté tras ver el perfil completo, sin sorpresas.",
  },
  {
    name: "Noelia Ferrer",
    role: "Cliente online",
    quote:
      "El formato me recordó a los marketplaces serios que ya conocía. Se nota que está pensado para decidir rápido y bien.",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {TESTIMONIALS.map((testimonial) => (
        <article key={testimonial.name} className="app-surface flex flex-col rounded-[26px] p-6">
          <Quote size={20} className="text-[var(--accent)]" />
          <p className="app-copy mt-4 text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
          <div className="mt-5 flex items-center gap-3">
            <Avatar name={testimonial.name} size="sm" />
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">{testimonial.name}</p>
              <p className="text-xs text-[var(--muted)]">{testimonial.role}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
