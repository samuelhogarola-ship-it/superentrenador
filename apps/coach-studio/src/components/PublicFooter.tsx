import { Link } from 'react-router-dom';

export function PublicFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-left">Superentrenador · by Personal Trainer Fuengirola</div>
        <div className="footer-right">
          <Link to="/legal">Informacion legal</Link>
          <span>© 2026 · Todos los derechos reservados</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-studio-label">Desarrollado y mantenido por</span>
        <a
          href="https://webfuengirola.com"
          className="footer-studio-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Web Fuengirola Studio
        </a>
      </div>
    </footer>
  );
}
