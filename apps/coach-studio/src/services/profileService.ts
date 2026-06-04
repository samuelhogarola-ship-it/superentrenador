import { demoProfile } from '../lib/demo-data';
import { supabase } from '../lib/supabase';
import type { TrainerProfile } from '../types/domain';

function mapProfile(row: Record<string, unknown>): TrainerProfile {
  return {
    id: String(row.id),
    fullName: String(row.full_name ?? ''),
    businessName: String(row.business_name ?? ''),
    logoPath: row.logo_path ? String(row.logo_path) : null,
  };
}

export const profileService = {
  async getProfile(userId: string) {
    if (!supabase) {
      return demoProfile;
    }

    const { data, error } = await supabase.from('trainer_profiles').select('*').eq('id', userId).maybeSingle();
    if (error) {
      throw error;
    }
    return data ? mapProfile(data) : null;
  },

  async saveProfile(profile: Omit<TrainerProfile, 'logoUrl'>, logoFile?: File | null) {
    if (!supabase) {
      return profile;
    }

    let logoPath = profile.logoPath;
    if (logoFile) {
      const extension = logoFile.name.split('.').pop() ?? 'png';
      const filePath = `${profile.id}/logo.${extension}`;
      const { error: uploadError } = await supabase.storage.from('trainer-logos').upload(filePath, logoFile, {
        upsert: true,
      });
      if (uploadError) {
        throw uploadError;
      }
      logoPath = filePath;
    }

    const { data, error } = await supabase
      .from('trainer_profiles')
      .upsert({
        id: profile.id,
        full_name: profile.fullName,
        business_name: profile.businessName,
        logo_path: logoPath,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapProfile(data);
  },

  async getLogoUrl(logoPath: string | null) {
    if (!supabase || !logoPath) {
      return null;
    }

    const { data } = supabase.storage.from('trainer-logos').getPublicUrl(logoPath);
    return data.publicUrl;
  },
};
