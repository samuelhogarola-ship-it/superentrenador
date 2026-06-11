import { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  meta: string;
  accent: "teal" | "terracotta" | "gold";
  icon: ReactNode;
}

export function MetricCard({ label, value, meta, accent, icon }: MetricCardProps) {
  return (
    <article className={`metric-card metric-card-${accent}`}>
      <div className="metric-card-head">
        <span className="metric-card-icon">{icon}</span>
        <span className="metric-card-label">{label}</span>
      </div>
      <strong className="metric-card-value">{value}</strong>
      <span className="metric-card-meta">{meta}</span>
    </article>
  );
}
