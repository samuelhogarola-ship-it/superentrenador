import type { PropsWithChildren } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';
import { ThemeToggle } from './ThemeToggle';
import { authService } from '../services/authService';
import { CookieBanner } from './CookieBanner';
import { PublicFooter } from './PublicFooter';

export function AppShell({ children }: PropsWithChildren) {
  const { profile, isDemoMode, exitDemoMode } = useAuth();
  const location = useLocation();
  const isPrintRoute = location.pathname.endsWith('/imprimir');

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link to="/clientes" className="brand">
          <span className="brand-mark">SE</span>
          <span>
            <strong>Superentrenador</strong>
            <small>MVP Online</small>
          </span>
        </Link>

        <ThemeToggle />

        <nav className="nav">
          <NavLink to="/clientes">Clientes</NavLink>
          <NavLink to="/plantillas">Plantillas</NavLink>
          <NavLink to="/perfil">Perfil PT</NavLink>
        </nav>

        <div className="sidebar-card">
          <p className="sidebar-label">Marca activa</p>
          <strong>{profile?.businessName ?? 'Pendiente de configurar'}</strong>
          {isDemoMode ? (
            <button className="ghost-button" onClick={exitDemoMode} type="button">
              Salir del modo demo
            </button>
          ) : (
            <button className="ghost-button" onClick={() => authService.signOut()} type="button">
              Cerrar sesion
            </button>
          )}
        </div>
      </aside>
      <main className="content">
        {children}
        {!isPrintRoute ? <PublicFooter /> : null}
      </main>
      {!isPrintRoute ? <CookieBanner /> : null}
    </div>
  );
}
