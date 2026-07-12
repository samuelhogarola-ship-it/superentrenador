interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  body: string;
}

export function SectionHeading({ eyebrow, title, body }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="app-kicker">{eyebrow}</p>
      <h2 className="app-title mt-3 text-3xl text-[var(--text)] sm:text-4xl">
        {title}
      </h2>
      <p className="app-copy mt-4 text-base">{body}</p>
    </div>
  );
}
