const GRADIENTS = [
  "linear-gradient(135deg, #c9962f, #8a6418)",
  "linear-gradient(135deg, #2f6e5b, #163d31)",
  "linear-gradient(135deg, #2f4f6e, #16263d)",
  "linear-gradient(135deg, #8a3f2f, #4d2016)",
  "linear-gradient(135deg, #5b2f6e, #2e1639)",
  "linear-gradient(135deg, #2f6e68, #163d3a)",
];

const SIZES = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-lg",
  lg: "h-20 w-20 text-2xl",
  xl: "h-28 w-28 text-4xl",
} as const;

interface AvatarProps {
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}

function hashName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % GRADIENTS.length;
  }
  return Math.abs(hash) % GRADIENTS.length;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return initials.join("");
}

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const gradient = GRADIENTS[hashName(name)];

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-heading font-bold tracking-[-0.04em] text-white shadow-[var(--shadow-soft)] ring-4 ring-white ${SIZES[size]} ${className}`}
      style={{ background: gradient }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
