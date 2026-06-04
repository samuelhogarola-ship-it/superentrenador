interface SectionTitleProps {
  kicker?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
}

export function SectionTitle({
  kicker,
  title,
  body,
  align = "left"
}: SectionTitleProps) {
  return (
    <div className={`section-title section-title-${align}`}>
      {kicker ? <span className="section-kicker">{kicker}</span> : null}
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}
