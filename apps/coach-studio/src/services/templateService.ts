import { demoTemplates } from '../lib/demo-data';
import { supabase } from '../lib/supabase';
import type { WorkoutTemplate } from '../types/domain';

function mapTemplate(row: Record<string, unknown>): WorkoutTemplate {
  return {
    id: String(row.id),
    name: String(row.name),
    goal: row.goal as WorkoutTemplate['goal'],
    level: row.level as WorkoutTemplate['level'],
    daysPerWeek: Number(row.days_per_week),
    description: String(row.description ?? ''),
    templateData: Array.isArray(row.template_data) ? (row.template_data as WorkoutTemplate['templateData']) : [],
    trainerId: row.trainer_id ? String(row.trainer_id) : null,
    sourceGlobalTemplateId: row.source_global_template_id ? String(row.source_global_template_id) : null,
  };
}

export const templateService = {
  async listGlobalTemplates() {
    if (!supabase) {
      return demoTemplates;
    }
    const { data, error } = await supabase.from('workout_templates_global').select('*').order('name');
    if (error) {
      throw error;
    }
    return data.map(mapTemplate);
  },

  async listPrivateTemplates() {
    if (!supabase) {
      return [] as WorkoutTemplate[];
    }
    const { data, error } = await supabase.from('workout_templates_private').select('*').order('name');
    if (error) {
      throw error;
    }
    return data.map(mapTemplate);
  },

  async cloneGlobalTemplate(template: WorkoutTemplate) {
    if (!supabase) {
      return { ...template, id: `${template.id}-copy`, trainerId: 'demo-trainer', sourceGlobalTemplateId: template.id };
    }
    const { data, error } = await supabase
      .from('workout_templates_private')
      .insert({
        name: `${template.name} · copia`,
        goal: template.goal,
        level: template.level,
        days_per_week: template.daysPerWeek,
        description: template.description,
        template_data: template.templateData,
        source_global_template_id: template.id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapTemplate(data);
  },
};
