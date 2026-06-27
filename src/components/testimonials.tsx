import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    role: "Cliente · Málaga",
    quote:
      "Comparé tres entrenadores en cinco minutos y elegí con criterio real. El perfil mostraba justo lo que necesitaba saber.",
  },
  {
    role: "Cliente · Fuengirola",
    quote:
      "Nada de letra pequeña: especialidad, precio y reseñas a la vista. Contacté tras ver el perfil completo, sin sorpresas.",
  },
  {
    role: "Cliente · Online",
    quote:
      "El formato me recordó a los marketplaces serios que ya conocía. Se nota que está pensado para decidir rápido y bien.",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {TESTIMONIALS.map((testimonial) => (
        <article key={testimonial.role} className="app-surface flex flex-col rounded-[26px] p-6">
          <Quote size={20} className="text-[var(--accent)]" />
          <p className="app-copy mt-4 text-sm">&ldquo;{testimonial.quote}&rdquo;</p>
          <p className="mt-5 text-xs text-[var(--muted)]">{testimonial.role}</p>
        </article>
      ))}
    </div>
  );
}
