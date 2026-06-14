interface AvatarProps {
  name: string;
  tone?: "terracotta" | "teal" | "gold";
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name, tone = "terracotta", size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className={`avatar avatar-${tone} avatar-${size}`} aria-hidden="true">
      {initials}
    </span>
  );
}
