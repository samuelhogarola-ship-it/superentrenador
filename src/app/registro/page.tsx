import type { Metadata } from "next";
import { RegistroPageClient } from "@/components/registro-page-client";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Crea tu cuenta en Super Entrenador para publicar tu perfil o contactar con entrenadores verificados.",
  alternates: {
    canonical: "/registro",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegistroPage() {
  return <RegistroPageClient />;
}
