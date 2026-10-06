import type { Metadata } from "next";
import Link from "next/link";
import { EDITORIAL_UPDATED_AT } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Cómo funciona Superentrenador",
  description: "Descubre, compara y contacta con entrenadores. Conoce cómo crear tu perfil y qué incluye el marketplace.",
  alternates: { canonical: "/como-funciona" },
};

const journeys = [
  { title: "Busco entrenador", steps: [
    ["Descubre y compara", "Explora el directorio por ciudad, especialidad y modalidad. Revisa experiencia, descripción y precio con su unidad; si no hay importe, consulta las condiciones al profesional."],
    ["Entra en tu cuenta", "Regístrate como cliente o inicia sesión. Confirma tu correo para acceder al contacto protegido y enviar mensajes. Las opciones de contacto dependen de cada perfil."],
    ["Habla con el profesional", "Explica tu objetivo y disponibilidad. Puedes seguir los mensajes de la plataforma desde tu panel. Acordad directamente precio definitivo, lugar, horarios, cancelaciones y forma de pago."],
  ], href: "/entrenadores", label: "Buscar entrenador" },
  { title: "Soy entrenador", steps: [
    ["Crea y confirma tu cuenta", "Elige el registro para entrenadores y confirma tu correo. Desde tu perfil profesional puedes preparar la ficha de tus servicios."],
    ["Completa tu perfil", "Añade ciudad disponible, presentación, especialidades, modalidades, idiomas, experiencia, precio y datos de contacto. Publica información fiel y comprueba los requisitos para ejercer tu actividad."],
    ["Envía a revisión y atiende consultas", "Al guardar, el perfil queda pendiente de revisión. Las ediciones también requieren revisión antes de publicarse. Una ficha aprobada puede aparecer en el directorio; no garantizamos visitas, contactos ni un plazo de aprobación."],
  ], href: "/registro?intent=trainer", label: "Preparar mi perfil" },
];

export default function HowItWorksPage() {
  return <main className="w-full flex-1 bg-white text-[#111214]">
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5b5b63]">Cómo funciona</p>
      <h1 className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-tight sm:text-6xl">Descubre, compara y da el primer paso.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5b5b63]">Superentrenador conecta a quienes buscan ayuda para entrenar con profesionales que presentan sus servicios. Tú eliges con quién hablar y acordáis el servicio directamente.</p>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {journeys.map((journey) => <section key={journey.title} className="border border-[#111214] p-6 sm:p-8">
          <h2 className="font-heading text-3xl font-bold">{journey.title}</h2>
          <ol className="mt-7 space-y-7">{journey.steps.map(([title, body], index) => <li key={title}>
            <h3 className="text-lg font-bold">{index + 1}. {title}</h3><p className="mt-2 leading-7 text-[#5b5b63]">{body}</p>
          </li>)}</ol>
          <Link href={journey.href} className="mt-8 inline-block border-2 border-[#111214] bg-[var(--accent)] px-5 py-3 font-bold">{journey.label}</Link>
        </section>)}
      </div>
      <section className="mt-12 max-w-3xl" aria-labelledby="limits">
        <h2 id="limits" className="font-heading text-3xl font-bold">Qué incluye y qué debes comprobar</h2>
        <p className="mt-5 leading-8 text-[#5b5b63]">El marketplace ofrece búsqueda, perfiles y contacto. No procesa pagos de sesiones ni confirma reservas o una agenda. Enviar un mensaje no equivale a contratar y no implica una respuesta inmediata.</p>
        <p className="mt-4 leading-8 text-[#5b5b63]">La revisión de publicación o una insignia en el perfil no sustituyen comprobar titulación, habilitación, seguro y condiciones del servicio con el profesional. Tampoco garantizan resultados deportivos.</p>
        <p className="mt-4 leading-8 text-[#5b5b63]">Las opciones de interés premium se consultan por contacto; esta página no implica contratación, pago ni activación automática de Coach Studio.</p>
        <Link href="/blog" className="mt-6 inline-block font-bold underline underline-offset-4">Consulta las guías para elegir y ejercer</Link>
        <p className="mt-8 text-sm text-[#5b5b63]">Funcionamiento revisado el <time dateTime={EDITORIAL_UPDATED_AT}>6 de octubre de 2026</time>.</p>
      </section>
    </section>
  </main>;
}
