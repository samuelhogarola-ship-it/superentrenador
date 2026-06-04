import { Link } from 'react-router-dom';
import { ThemeToggle } from '../../components/ThemeToggle';
import { superentrenadorLegalContent } from './legalContent';
import { createLegalPageMarkup } from './legalMarkup';

export function LegalPage() {
  return (
    <div className="legal-page-shell">
      <div className="how-topbar">
        <ThemeToggle />
      </div>

      <div className="legal-nav">
        <div className="auth-brand">
          <span className="auth-brand-mark">SE</span>
          <div>
            <strong>App de Super Entrenador</strong>
            <small>informacion legal provisional</small>
          </div>
        </div>
        <Link className="secondary-button" to="/login">
          Volver al acceso
        </Link>
      </div>

      <div
        className="legal-shell"
        dangerouslySetInnerHTML={{ __html: createLegalPageMarkup(superentrenadorLegalContent) }}
      />
    </div>
  );
}
