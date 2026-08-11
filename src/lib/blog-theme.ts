// One bold, flat color per content category — deliberately high-contrast
// blocks (not the site's soft gold/glass look) so each article type reads
// as its own thing at a glance across the blog list and post pages.
export interface CategoryTheme {
  block: string; // solid background block (badges, top bars, CTA)
  onBlock: string; // text color for content sitting on `block`
  text: string; // category label color on white
  ring: string; // border/ring color that matches the block
  tint: string; // very light tint of the color, for hover/section backgrounds
}

const THEMES: Record<string, CategoryTheme> = {
  "Guía de compra": {
    block: "bg-[#1d4ed8]",
    onBlock: "text-white",
    text: "text-[#1d4ed8]",
    ring: "ring-[#1d4ed8]/15",
    tint: "bg-[#1d4ed8]/[0.06]",
  },
  Captación: {
    block: "bg-[#c2410c]",
    onBlock: "text-white",
    text: "text-[#c2410c]",
    ring: "ring-[#c2410c]/15",
    tint: "bg-[#c2410c]/[0.06]",
  },
  Mercado: {
    block: "bg-[#15803d]",
    onBlock: "text-white",
    text: "text-[#15803d]",
    ring: "ring-[#15803d]/15",
    tint: "bg-[#15803d]/[0.06]",
  },
  Producto: {
    block: "bg-[#7e22ce]",
    onBlock: "text-white",
    text: "text-[#7e22ce]",
    ring: "ring-[#7e22ce]/15",
    tint: "bg-[#7e22ce]/[0.06]",
  },
  Autónomos: {
    block: "bg-[#b91c1c]",
    onBlock: "text-white",
    text: "text-[#b91c1c]",
    ring: "ring-[#b91c1c]/15",
    tint: "bg-[#b91c1c]/[0.06]",
  },
  Fiscalidad: {
    block: "bg-[#0f766e]",
    onBlock: "text-white",
    text: "text-[#0f766e]",
    ring: "ring-[#0f766e]/15",
    tint: "bg-[#0f766e]/[0.06]",
  },
  "Marketing digital": {
    block: "bg-[#be185d]",
    onBlock: "text-white",
    text: "text-[#be185d]",
    ring: "ring-[#be185d]/15",
    tint: "bg-[#be185d]/[0.06]",
  },
};

const FALLBACK: CategoryTheme = {
  block: "bg-[#17171b]",
  onBlock: "text-white",
  text: "text-[#17171b]",
  ring: "ring-[#17171b]/15",
  tint: "bg-[#17171b]/[0.05]",
};

export function getCategoryTheme(category: string): CategoryTheme {
  return THEMES[category] ?? FALLBACK;
}
