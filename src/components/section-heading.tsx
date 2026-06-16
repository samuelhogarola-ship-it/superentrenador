interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  body: string;
}

export function SectionHeading({ eyebrow, title, body }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="app-kicker">{eyebrow}</p>
      <h2 className="app-title mt-3 text-4xl text-[var(--text)] sm:text-5xl">
        {title}
      </h2>
      <p className="app-copy mt-4 text-base sm:text-lg">{body}</p>
    </div>
  );
}
