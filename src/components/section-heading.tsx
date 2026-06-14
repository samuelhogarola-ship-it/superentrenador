interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  body: string;
}

export function SectionHeading({ eyebrow, title, body }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-5xl uppercase tracking-[0.06em] text-[var(--text)] sm:text-6xl">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{body}</p>
    </div>
  );
}
