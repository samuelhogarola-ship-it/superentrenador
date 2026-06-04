import { demoClients } from '../lib/demo-data';
import { supabase } from '../lib/supabase';
import type { Client, ClientInput } from '../types/domain';
import { calculateBmi } from '../utils/bmi';

function mapClient(row: Record<string, unknown>): Client {
  return {
    id: String(row.id),
    trainerId: String(row.trainer_id),
    fullName: String(row.full_name),
    goal: row.goal as Client['goal'],
    daysPerWeek: Number(row.days_per_week),
    level: row.level as Client['level'],
    experience: String(row.experience ?? ''),
    baseSport: String(row.base_sport ?? ''),
    targetSport: String(row.target_sport ?? ''),
    age: row.age ? Number(row.age) : null,
    weightKg: row.weight_kg ? Number(row.weight_kg) : null,
    heightCm: row.height_cm ? Number(row.height_cm) : null,
    notes: String(row.notes ?? ''),
    bmi: row.bmi ? Number(row.bmi) : null,
    createdAt: row.created_at ? String(row.created_at) : undefined,
  };
}

export const clientService = {
  async listClients() {
    if (!supabase) {
      return demoClients;
    }
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error) {
      throw error;
    }
    return data.map(mapClient);
  },

  async getClient(clientId: string) {
    if (!supabase) {
      return demoClients.find((client) => client.id === clientId) ?? null;
    }
    const { data, error } = await supabase.from('clients').select('*').eq('id', clientId).single();
    if (error) {
      throw error;
    }
    return mapClient(data);
  },

  async saveClient(input: ClientInput, clientId?: string) {
    if (!supabase) {
      throw new Error('Configura Supabase para guardar clientes.');
    }

    const payload = {
      full_name: input.fullName,
      goal: input.goal,
      days_per_week: input.daysPerWeek,
      level: input.level,
      experience: input.experience,
      base_sport: input.baseSport,
      target_sport: input.targetSport,
      age: input.age ?? null,
      weight_kg: input.weightKg ?? null,
      height_cm: input.heightCm ?? null,
      bmi: calculateBmi(input.weightKg, input.heightCm),
      notes: input.notes,
    };

    const query = clientId
      ? supabase.from('clients').update(payload).eq('id', clientId)
      : supabase.from('clients').insert(payload);

    const { data, error } = await query.select().single();
    if (error) {
      throw error;
    }

    return mapClient(data);
  },
};
