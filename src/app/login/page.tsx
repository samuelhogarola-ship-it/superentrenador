import type { Metadata } from "next";
import { LoginPageClient } from "@/components/login-page-client";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Accede a tu cuenta de Super Entrenador para contactar con entrenadores o gestionar tu perfil.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return <LoginPageClient />;
}
