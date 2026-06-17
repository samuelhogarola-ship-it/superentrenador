import Image from "next/image";
import Link from "next/link";

interface BrandMarkProps {
  href?: string;
  compact?: boolean;
}

export function BrandMark({ href = "/", compact = false }: BrandMarkProps) {
  const size = compact ? 36 : 44;

  return (
    <Link href={href} className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
      <Image
        src="/logo.png"
        alt="Super Entrenador"
        width={size}
        height={size}
        className="rounded-xl"
        priority
      />
      <span className="flex flex-col leading-none">
        <strong className="font-heading text-[1.35rem] tracking-[-0.08em] text-[var(--text)]">
          Super
        </strong>
        <strong className="font-heading text-[1.35rem] tracking-[-0.08em] text-[var(--text)]">
          Entrenador
        </strong>
      </span>
    </Link>
  );
}
