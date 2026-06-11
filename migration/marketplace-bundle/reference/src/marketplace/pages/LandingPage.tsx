import { Check, Dumbbell, FileText, NotebookPen, ShieldCheck, Smartphone, UserRoundPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar } from "../../components/Avatar";
import { BrandMark } from "../../components/BrandMark";
import { SectionTitle } from "../../components/SectionTitle";
import { useMarketplaceState } from "../hooks/useMarketplaceState";
import { formatPlanName } from "../../utils/format";

const planRows = [
  {
    name: "PT Free",
    price: "0 € / mes",
    meta: "Hasta 10 clientes",
    features: [
      "Biblioteca básica",
      "Exportación PDF",
      "Perfil público",
      "Gestión de clientes externos"
    ],
    cta: "Empezar gratis"
  },
  {
    name: "PT Pro",
    price: "19 € / mes",
    meta: "190 € / año",
    features: [
      "Clientes ilimitados",
      "Plantillas reutilizables",
      "Clientes conectados",
      "Seguimiento completo"
    ],
    cta: "Probar PT Pro",
    featured: true
  },
  {
    name: "Verified",
    price: "39 € / mes",
    meta: "390 € / año",
    features: [
      "Insignia visible",
      "Prioridad en búsquedas",
      "Leads destacados",
      "Página profesional ampliada"
    ],
    cta: "Quiero ser Verified"
  }
];

export function LandingPage() {
  const state = useMarketplaceState();

  return (
    <div className="site-shell">
      <header className="public-header">
        <BrandMark />
        <nav className="public-nav">
          <a href="#trainers">Para entrenadores</a>
          <a href="#clients">Para clientes</a>
          <a href="#pricing">Precios</a>
          <a href="#directory">Entrenadores</a>
          <a href="#verification">Verificación</a>
        </nav>
        <div className="public-actions">
          <Link to="/app/pt" className="button button-secondary">
            Ver demo
          </Link>
          <Link to="/app/pt" className="button">
            Crear cuenta
          </Link>
        </div>
      </header>

      <main>
        <section className="hero-section" id="trainers">
          <div className="hero-copy">
            <h1>
              Tu negocio de entrenamiento,
              <br />
              por fin <span>en orden.</span>
            </h1>
            <p>
              Gestiona tus clientes, crea rutinas personalizadas, haz seguimiento real y
              entrega PDFs profesionales desde un solo lugar.
            </p>
            <div className="hero-cta">
              <Link to="/app/pt" className="button">
                Crear cuenta
              </Link>
              <Link to="/app/client" className="button button-secondary">
                Ver app cliente
              </Link>
            </div>
            <div className="hero-proof">
              <article>
                <UserRoundPlus />
                <strong>Clientes más claros</strong>
                <span>Externos o conectados, sin caos ni hojas sueltas.</span>
              </article>
              <article>
                <NotebookPen />
                <strong>Rutinas reutilizables</strong>
                <span>Menos tiempo operativo y más control del servicio.</span>
              </article>
              <article>
                <ShieldCheck />
                <strong>Marca más sólida</strong>
                <span>Perfil público, PDFs y proceso profesional desde el día uno.</span>
              </article>
            </div>
          </div>

          <div className="hero-product">
            <div className="hero-dashboard-card">
              <div className="hero-dashboard-top">
                <BrandMark compact />
                <span className="product-chip">{formatPlanName(state.subscription.plan)}</span>
              </div>
              <h3>Bienvenido, Entrenador</h3>
              <div className="mini-metrics">
                <article>
                  <span>Clientes activos</span>
                  <strong>{state.clients.length}</strong>
                </article>
                <article>
                  <span>Rutinas activas</span>
                  <strong>{state.routines.length}</strong>
                </article>
                <article>
                  <span>Evoluciones</span>
                  <strong>{state.progressEntries.length}</strong>
                </article>
              </div>
              <div className="mini-table">
                {state.clients.slice(0, 4).map((client) => (
                  <div key={client.id} className="mini-row">
                    <div className="mini-row-user">
                      <Avatar name={`${client.name} ${client.surname}`} size="sm" tone="teal" />
                      <div>
                        <strong>
                          {client.name} {client.surname}
                        </strong>
                        <span>{client.goal}</span>
                      </div>
                    </div>
                    <span>{client.type === "external" ? "PDF" : "App"}</span>
                  </div>
                ))}
              </div>
              <div className="hero-chart-band">
                <div className="hero-line-chart">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
                <div className="hero-donut">
                  <div />
                </div>
              </div>
            </div>

            <div className="hero-phone-card">
              <div className="phone-screen-head">
                <strong>Hola, Laura</strong>
                <span>Tu entrenador: {state.trainer.displayName}</span>
              </div>
              <div className="phone-session">
                <div>
                  <small>Día 3 · Fuerza</small>
                  <strong>Pierna y glúteo</strong>
                </div>
                <button>Ver rutina</button>
              </div>
              <div className="phone-sets">
                {[1, 2, 3, 4].map((set) => (
                  <div key={set}>
                    <span>{set}</span>
                    <span>{set < 4 ? "Completada" : "Pendiente"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="workflow-section" id="clients">
          <SectionTitle
            align="center"
            title="Así funciona Super Entrenador"
            body="Una misma herramienta para trabajar con clientes que siguen en PDF y clientes que entrenan dentro de la app."
          />
          <div className="workflow-grid">
            <article className="workflow-column">
              <h3>Clientes externos</h3>
              <p>Tú gestionas. Ellos reciben.</p>
              <div className="workflow-steps">
                <div>
                  <UserRoundPlus />
                  <span>1. Creas cliente</span>
                </div>
                <div>
                  <Dumbbell />
                  <span>2. Diseñas su rutina</span>
                </div>
                <div>
                  <FileText />
                  <span>3. Generas y envías PDF</span>
                </div>
              </div>
            </article>

            <div className="workflow-bridge">
              <BrandMark to={undefined} compact />
            </div>

            <article className="workflow-column">
              <h3>Clientes conectados</h3>
              <p>Más compromiso. Mejores resultados.</p>
              <div className="workflow-steps">
                <div>
                  <Smartphone />
                  <span>1. El cliente acepta conexión</span>
                </div>
                <div>
                  <Dumbbell />
                  <span>2. Registra entrenos desde la app</span>
                </div>
                <div>
                  <ShieldCheck />
                  <span>3. Tú ves progreso en tiempo real</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="pricing-section" id="pricing">
          <SectionTitle
            align="center"
            title="Elige el plan que impulsa tu negocio"
            body="Empieza gratis, crece con PT Pro y destaca con Verified cuando necesites más visibilidad."
          />
          <div className="pricing-grid">
            {planRows.map((plan) => (
              <article
                key={plan.name}
                className={`pricing-card ${plan.featured ? "pricing-card-featured" : ""}`}
              >
                <div className="pricing-head">
                  <h3>{plan.name}</h3>
                  <strong>{plan.price}</strong>
                  <span>{plan.meta}</span>
                </div>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/app/pt" className={`button ${plan.featured ? "" : "button-secondary"}`}>
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="directory-section" id="directory">
          <div className="directory-copy">
            <SectionTitle
              kicker="TU PERFIL, TU MARCA"
              title="Construye tu perfil público y atrae a más clientes."
              body="Especialidades, opiniones, certificaciones y un enlace directo para que te contacten."
            />
            <ul className="feature-list">
              <li>Perfil público profesional</li>
              <li>Opiniones y valoraciones</li>
              <li>Especialidades y certificaciones</li>
              <li>Recepción de leads para Verified</li>
            </ul>
            <Link to={`/trainers/${state.trainer.slug}`} className="button button-secondary">
              Ver entrenadores
            </Link>
          </div>

          <div className="profile-preview">
            <div className="profile-cover" />
            <div className="profile-card">
              <Avatar name={state.trainer.displayName} size="lg" tone="terracotta" />
              <div className="profile-meta">
                <div className="profile-title-row">
                  <h3>{state.trainer.displayName}</h3>
                  <span className="verified-mark">
                    {state.trainer.verified ? "Verified" : "En revisión"}
                  </span>
                </div>
                <p>Entrenador Personal · {state.trainer.city}</p>
                <span>
                  {state.trainer.rating} ({state.trainer.reviewsCount} opiniones)
                </span>
              </div>
              <Link to="/app/admin" className="button button-teal">
                Contactar
              </Link>
            </div>
            <div className="profile-tags">
              {state.trainer.specialties.map((specialty) => (
                <span key={specialty}>{specialty}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="verification-section" id="verification">
          <div className="verification-card">
            <SectionTitle
              title="Verified convierte visibilidad en confianza real"
              body="Verificación manual, insignia visible, prioridad en búsquedas y acceso a promociones para potenciar tu marca profesional."
            />
            <div className="verification-highlights">
              <span>Insignia visible</span>
              <span>Prioridad en directorio</span>
              <span>Leads cualificados</span>
              <span>Página ampliada</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <BrandMark />
        <p>SaaS PT nacional con clientes conectados, seguimiento y visibilidad profesional.</p>
        <div className="footer-links">
          <Link to="/app/pt">Panel PT</Link>
          <Link to="/app/client">App cliente</Link>
          <Link to="/app/admin">Admin</Link>
        </div>
      </footer>
    </div>
  );
}
