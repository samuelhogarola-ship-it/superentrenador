import { type PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { demoProfile } from '../../lib/demo-data';
import { supabase } from '../../lib/supabase';
import { profileService } from '../../services/profileService';
import type { TrainerProfile } from '../../types/domain';

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  profile: TrainerProfile | null;
  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const refreshProfile = async () => {
    if (isDemoMode) {
      setProfile(demoProfile);
      return;
    }
    if (!session?.user.id) {
      setProfile(null);
      return;
    }
    const nextProfile = await profileService.getProfile(session.user.id);
    if (nextProfile?.logoPath) {
      nextProfile.logoUrl = await profileService.getLogoUrl(nextProfile.logoPath);
    }
    setProfile(nextProfile);
  };

  useEffect(() => {
    if (!supabase) {
      setProfile(demoProfile);
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (data.session?.user.id) {
        const nextProfile = await profileService.getProfile(data.session.user.id);
        if (nextProfile?.logoPath) {
          nextProfile.logoUrl = await profileService.getLogoUrl(nextProfile.logoPath);
        }
        setProfile(nextProfile);
      }
    });

    const { data } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user.id) {
        const nextProfile = await profileService.getProfile(nextSession.user.id);
        if (nextProfile?.logoPath) {
          nextProfile.logoUrl = await profileService.getLogoUrl(nextProfile.logoPath);
        }
        setProfile(nextProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, [session?.user.id]);

  const enterDemoMode = () => {
    setIsDemoMode(true);
    setProfile(demoProfile);
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    if (!session) {
      setProfile(demoProfile);
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, profile, isDemoMode, enterDemoMode, exitDemoMode, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
