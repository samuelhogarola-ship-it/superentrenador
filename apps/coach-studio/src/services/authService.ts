import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const authService = {
  async signIn(email: string, password: string) {
    if (!supabase) {
      return { session: null as Session | null, error: new Error('Configura Supabase para iniciar sesion.') };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { session: data.session, error };
  },

  async signUp(email: string, password: string) {
    if (!supabase) {
      return { session: null as Session | null, error: new Error('Configura Supabase para registrar cuentas.') };
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { session: data.session, error };
  },

  async signOut() {
    if (!supabase) {
      return;
    }
    await supabase.auth.signOut();
  },
};
