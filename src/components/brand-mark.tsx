import Link from "next/link";

interface BrandMarkProps {
  href?: string;
  compact?: boolean;
}

export function BrandMark({ href = "/", compact = false }: BrandMarkProps) {
  const content = (
    <span className={`flex items-center gap-3 ${compact ? "gap-2" : ""}`}>
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-black tracking-[0.2em] text-[var(--ink)]">
        SE
      </span>
      <span className="flex flex-col leading-none">
        <strong className="font-heading text-2xl uppercase tracking-[0.08em] text-[var(--text)]">
          Super
        </strong>
        <strong className="font-heading text-2xl uppercase tracking-[0.08em] text-[var(--text)]">
          Entrenador
        </strong>
      </span>
    </span>
  );

  return (
    <Link href={href} className="transition-opacity hover:opacity-90">
      {content}
    </Link>
  );
}
