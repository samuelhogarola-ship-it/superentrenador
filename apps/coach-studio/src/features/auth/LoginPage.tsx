import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useAuth } from './AuthProvider';
import { authService } from '../../services/authService';

export function LoginPage() {
  const { enterDemoMode } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const action = mode === 'login' ? authService.signIn : authService.signUp;
    const result = await action(email, password);
    if (result.error) {
      setError(result.error.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="auth-page">
      <section className="auth-panel auth-landing">
        <div className="auth-topbar">
          <div className="auth-brand">
            <span className="auth-brand-mark">SE</span>
            <div>
              <strong>App de Super Entrenador</strong>
              <small>by Personal Trainer Fuengirola</small>
            </div>
          </div>
          <div className="auth-actions">
            <span className="auth-tag">Rutinas de Superentrenador</span>
            <ThemeToggle />
          </div>
        </div>

        <div className="auth-hero">
          <p className="eyebrow">Vende mejor tu servicio. Trabaja mas rapido.</p>
          <h1>
            CREA PLANES
            <br />
            QUE TU CLIENTE
            <br />
            QUIERA SEGUIR
          </h1>
          <p className="auth-lead">
            Crea planes de entrenamiento profesionales y con tu marca, en unos minutos.
          </p>

          <div className="auth-cta-row">
            <button type="button" className="primary-button" onClick={enterDemoMode}>
              Entrar ahora
            </button>
            <div className="auth-proof">
              <strong>Hecho para PTs</strong>
              <span>menos caos, mejor imagen profesional</span>
            </div>
          </div>
        </div>

        <div className="auth-stats">
          <div>
            <strong>Clientes</strong>
            <span>fichas claras y centralizadas</span>
          </div>
          <div>
            <strong>Rutinas</strong>
            <span>generacion rapida + edicion manual</span>
          </div>
          <div>
            <strong>PDF</strong>
            <span>entrega imprimible con tu branding</span>
          </div>
        </div>

        <div className="auth-secondary-row">
          <Link className="secondary-button" to="/como-funciona">
            Ver como funciona
          </Link>
        </div>
      </section>

      <section className="auth-card auth-login-card" id="login-card">
        <div className="auth-card-head">
          <p className="eyebrow">Acceso entrenador</p>
          <h2>Entra o crea tu cuenta</h2>
          <p>Todo queda listo para que luego conectemos la web madre de Superentrenador.</p>
        </div>

        <div className="auth-toggle">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
            Entrar
          </button>
          <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="stack">
          <label className="field">
            <span>Email profesional</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          <label className="field">
            <span>Contrasena</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength={6} />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="primary-button auth-submit" disabled={submitting}>
            {submitting ? 'Procesando...' : mode === 'login' ? 'Entrar al panel' : 'Crear cuenta de entrenador'}
          </button>
          <button type="button" className="secondary-button auth-submit" onClick={enterDemoMode}>
            Entrar en demo sin registro
          </button>
        </form>

        <div className="auth-card-footer">
          <div>
            <strong>Incluye en esta fase</strong>
            <span>clientes, plantillas, rutinas y PDF A4</span>
          </div>
          <div>
            <strong>Siguiente evolucion</strong>
            <span>portal cliente y web madre comercial</span>
          </div>
        </div>
      </section>
    </div>
  );
}
