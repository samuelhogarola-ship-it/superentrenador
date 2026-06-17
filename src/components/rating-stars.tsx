import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  size?: number;
  className?: string;
}

export function RatingStars({ rating, reviewsCount, size = 15, className = "" }: RatingStarsProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={size}
            className={index < Math.round(rating) ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[var(--line-strong)]"}
          />
        ))}
      </span>
      <span className="text-sm font-bold text-[var(--text)]">{rating.toFixed(1)}</span>
      {typeof reviewsCount === "number" ? (
        <span className="text-sm text-[var(--muted)]">({reviewsCount})</span>
      ) : null}
    </span>
  );
}
