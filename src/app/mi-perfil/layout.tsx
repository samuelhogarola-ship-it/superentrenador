import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi perfil | Super Entrenador",
  robots: { index: false, follow: false },
};

export default function MiPerfilLayout({ children }: { children: React.ReactNode }) {
  return children;
}
