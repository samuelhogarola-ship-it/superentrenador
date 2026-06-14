export function formatDate(dateInput: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(dateInput));
}

export function formatDateTime(dateInput: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateInput));
}

export function formatPlanName(plan: "free" | "pro" | "verified") {
  if (plan === "free") return "PT Free";
  if (plan === "pro") return "PT Pro";
  return "Verified";
}

export function formatClientType(type: "external" | "connected") {
  return type === "external" ? "Cliente externo" : "Cliente conectado";
}

export function percentage(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}
