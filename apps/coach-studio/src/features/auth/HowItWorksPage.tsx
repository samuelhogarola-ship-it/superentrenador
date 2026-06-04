import { Link } from 'react-router-dom';
import { ThemeToggle } from '../../components/ThemeToggle';

export function HowItWorksPage() {
  return (
    <div className="how-page">
      <section className="how-hero">
        <div className="how-topbar">
          <ThemeToggle />
        </div>
        <div className="auth-brand">
          <span className="auth-brand-mark">SE</span>
          <div>
            <strong>App de Super Entrenador</strong>
            <small>explicacion rapida del flujo</small>
          </div>
        </div>

        <p className="eyebrow">Como funciona</p>
        <h1>Una herramienta pensada para que el PT trabaje rapido y venda mejor</h1>
        <p className="auth-lead">
          Superentrenador organiza tu trabajo en un flujo simple: ficha del cliente, rutina base editable y entrega
          final con imagen profesional.
        </p>

        <div className="button-row">
          <Link className="primary-button" to="/login">
            Volver al acceso
          </Link>
        </div>
      </section>

      <section className="how-grid">
        <article className="auth-feature-card">
          <p className="eyebrow">1. Cliente</p>
          <h2>Recoge los datos importantes</h2>
          <p>Objetivo, dias, nivel, experiencia, deporte base, deporte objetivo, IMC y notas en una sola ficha.</p>
        </article>
        <article className="auth-feature-card">
          <p className="eyebrow">2. Rutina</p>
          <h2>Genera una base en segundos</h2>
          <p>El sistema elige una plantilla segun objetivo, nivel y dias. Luego la puedes retocar manualmente.</p>
        </article>
        <article className="auth-feature-card">
          <p className="eyebrow">3. Entrega</p>
          <h2>Presenta un servicio mas premium</h2>
          <p>Exporta una vista A4 limpia, con tu marca y una estructura mucho mas profesional para el cliente.</p>
        </article>
      </section>
    </div>
  );
}
