import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const COOKIE_STORAGE_KEY = 'superentrenador-cookie-choice';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedChoice = window.localStorage.getItem(COOKIE_STORAGE_KEY);
    setVisible(savedChoice === null);
  }, []);

  const saveChoice = (choice: 'accepted' | 'rejected') => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, choice);
    }
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <aside className="cookie-banner" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <div className="cookie-copy">
        <strong>Cookies</strong>
        <p>
          Usamos cookies técnicas básicas para recordar preferencias como el tema visual. Puedes leer los detalles en
          la <Link to="/legal#cookies">información legal y cookies</Link>.
        </p>
      </div>
      <div className="cookie-actions">
        <button className="secondary-button" type="button" onClick={() => saveChoice('rejected')}>
          Rechazar
        </button>
        <button className="primary-button" type="button" onClick={() => saveChoice('accepted')}>
          Aceptar
        </button>
      </div>
    </aside>
  );
}
