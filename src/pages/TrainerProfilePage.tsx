import { Award, MapPin, MessageSquare, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { BrandMark } from "../components/BrandMark";
import { SectionTitle } from "../components/SectionTitle";
import { useAppState } from "../context/AppStateContext";

export function TrainerProfilePage() {
  const { slug } = useParams();
  const { state } = useAppState();

  if (slug !== state.trainer.slug) {
    return (
      <main className="empty-state-page">
        <BrandMark />
        <h1>Entrenador no encontrado</h1>
        <Link to="/" className="button">
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-page-header">
        <BrandMark />
        <div className="public-actions">
          <Link to="/" className="button button-secondary">
            Inicio
          </Link>
          <Link to="/app/pt" className="button">
            Ver panel PT
          </Link>
        </div>
      </header>

      <main className="profile-page-main">
        <section className="profile-hero">
          <div className="profile-cover profile-cover-large" />
          <div className="profile-hero-card">
            <Avatar name={state.trainer.displayName} size="lg" tone="terracotta" />
            <div className="profile-hero-copy">
              <div className="profile-title-row">
                <h1>{state.trainer.displayName}</h1>
                <span className="verified-mark">
                  {state.trainer.verified ? "Verified" : "En revisión"}
                </span>
              </div>
              <p>Entrenador personal · {state.trainer.city}</p>
              <div className="trainer-stats">
                <span>
                  <Star /> {state.trainer.rating} ({state.trainer.reviewsCount} opiniones)
                </span>
                <span>
                  <Award /> {state.trainer.yearsExperience} años de experiencia
                </span>
                <span>
                  <MapPin /> {state.trainer.city} y online
                </span>
              </div>
            </div>
            <button className="button button-teal">
              <MessageSquare /> Contactar
            </button>
          </div>
        </section>

        <section className="profile-grid">
          <article className="surface-card">
            <SectionTitle title="Sobre mí" />
            <p>{state.trainer.bio}</p>
          </article>
          <article className="surface-card">
            <SectionTitle title="Especialidades" />
            <div className="profile-tags">
              {state.trainer.specialties.map((specialty) => (
                <span key={specialty}>{specialty}</span>
              ))}
            </div>
          </article>
          <article className="surface-card">
            <SectionTitle title="Certificaciones" />
            <ul className="feature-list">
              {state.trainer.certifications.map((certification) => (
                <li key={certification}>{certification}</li>
              ))}
            </ul>
          </article>
          <article className="surface-card">
            <SectionTitle title="Opiniones destacadas" />
            <div className="review-stack">
              <blockquote>
                “Gran mezcla de cercanía, ciencia aplicada y claridad. El seguimiento semanal
                marca la diferencia.”
              </blockquote>
              <blockquote>
                “Con Carlos pasé de improvisar a entrenar con dirección real. Muy
                recomendable.”
              </blockquote>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
