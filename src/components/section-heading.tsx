interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  body: string;
  titleAs?: "h1" | "h2";
}

export function SectionHeading({ eyebrow, title, body, titleAs = "h2" }: SectionHeadingProps) {
  const TitleTag = titleAs;

  return (
    <div className="max-w-2xl">
      <p className="app-kicker">{eyebrow}</p>
      <TitleTag className="app-title mt-3 text-3xl text-[var(--text)] sm:text-4xl">
        {title}
      </TitleTag>
      <p className="app-copy mt-4 text-base">{body}</p>
    </div>
  );
}
