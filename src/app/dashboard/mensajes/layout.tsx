import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mensajes | Super Entrenador",
  robots: { index: false, follow: false },
};

export default function DashboardMensajesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
