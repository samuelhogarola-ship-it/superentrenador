import type { Metadata } from "next";
import { RegistroPageClient } from "@/components/registro-page-client";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Crea tu cuenta en Super Entrenador para contactar con entrenadores o publicar tu perfil profesional.",
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
