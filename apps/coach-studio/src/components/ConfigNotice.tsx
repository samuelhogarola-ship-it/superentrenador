import { isSupabaseConfigured } from '../lib/supabase';

export function ConfigNotice() {
  if (isSupabaseConfigured) {
    return null;
  }

  return (
    <div className="notice">
      <strong>Modo sin configurar</strong>
      <p>
        Define <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> para activar login,
        base de datos y storage reales.
      </p>
    </div>
  );
}
