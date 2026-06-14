import { Link } from "react-router-dom";

interface BrandMarkProps {
  to?: string;
  compact?: boolean;
}

export function BrandMark({ to = "/", compact = false }: BrandMarkProps) {
  const content = (
    <span className={`brandmark ${compact ? "brandmark-compact" : ""}`}>
      <span className="brandmark-monogram">S</span>
      <span className="brandmark-text">
        <strong>Super</strong>
        <strong>Entrenador</strong>
      </span>
    </span>
  );

  if (!to) return content;

  return (
    <Link to={to} className="brandmark-link">
      {content}
    </Link>
  );
}
