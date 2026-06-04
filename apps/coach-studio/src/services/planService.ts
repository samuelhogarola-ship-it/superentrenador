import { demoPlans } from '../lib/demo-data';
import { supabase } from '../lib/supabase';
import type {
  ExerciseBlock,
  ExerciseBlockInput,
  TrainingPlan,
  TrainingPlanDay,
  TrainingPlanInput,
} from '../types/domain';
import { validateDayBlockLimit } from '../utils/plan-generator';

function mapBlock(row: Record<string, unknown>): ExerciseBlock {
  return {
    id: String(row.id),
    dayId: String(row.day_id),
    blockType: row.block_type as ExerciseBlock['blockType'],
    parentBlockId: row.parent_block_id ? String(row.parent_block_id) : null,
    sortOrder: Number(row.sort_order),
    exerciseId: row.exercise_id ? String(row.exercise_id) : null,
    exerciseNameSnapshot: String(row.exercise_name_snapshot ?? ''),
    sets: row.sets ? String(row.sets) : null,
    reps: row.reps ? String(row.reps) : null,
    rpe: row.rpe ? String(row.rpe) : null,
    loadMode: row.load_mode as ExerciseBlock['loadMode'],
    loadValue: row.load_value ? String(row.load_value) : null,
    comments: row.comments ? String(row.comments) : null,
    exerciseCategory: row.exercise_category ? String(row.exercise_category) : null,
  };
}

function mapPlanDay(
  row: Record<string, unknown>,
  blocks: ExerciseBlock[],
): TrainingPlanDay {
  return {
    id: String(row.id),
    trainingPlanId: String(row.training_plan_id),
    dayNumber: Number(row.day_number),
    title: String(row.title),
    notes: row.notes ? String(row.notes) : null,
    blocks: blocks
      .filter((block) => block.dayId === String(row.id))
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

function mapPlan(
  row: Record<string, unknown>,
  days: TrainingPlanDay[],
): TrainingPlan {
  return {
    id: String(row.id),
    trainerId: String(row.trainer_id),
    clientId: String(row.client_id),
    name: String(row.name),
    goal: row.goal as TrainingPlan['goal'],
    level: row.level as TrainingPlan['level'],
    daysPerWeek: Number(row.days_per_week),
    status: row.status as TrainingPlan['status'],
    days: days.sort((a, b) => a.dayNumber - b.dayNumber),
  };
}

function toBlockRows(dayId: string, blocks: ExerciseBlockInput[]) {
  return blocks.map((block) => ({
    day_id: dayId,
    block_type: block.blockType,
    parent_block_id: block.parentBlockId ?? null,
    sort_order: block.sortOrder,
    exercise_id: block.exerciseId ?? null,
    exercise_name_snapshot: block.exerciseNameSnapshot,
    sets: block.sets ?? null,
    reps: block.reps ?? null,
    rpe: block.rpe ?? null,
    load_mode: block.loadMode,
    load_value: block.loadValue ?? null,
    comments: block.comments ?? null,
    exercise_category: block.exerciseCategory ?? null,
  }));
}

export const planService = {
  async getPlanByClient(clientId: string) {
    if (!supabase) {
      return demoPlans.find((plan) => plan.clientId === clientId) ?? null;
    }

    const { data: planRow, error: planError } = await supabase
      .from('training_plans')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle();

    if (planError) {
      throw planError;
    }

    if (!planRow) {
      return null;
    }

    const { data: dayRows, error: dayError } = await supabase
      .from('training_plan_days')
      .select('*')
      .eq('training_plan_id', planRow.id)
      .order('day_number');
    if (dayError) {
      throw dayError;
    }

    const dayIds = dayRows.map((day) => day.id);
    const { data: blockRows, error: blockError } = await supabase
      .from('exercise_blocks')
      .select('*')
      .in('day_id', dayIds.length ? dayIds : ['00000000-0000-0000-0000-000000000000']);
    if (blockError) {
      throw blockError;
    }

    const blocks = blockRows.map(mapBlock);
    const days = dayRows.map((day) => mapPlanDay(day, blocks));
    return mapPlan(planRow, days);
  },

  async savePlan(input: TrainingPlanInput, existingPlanId?: string) {
    if (!supabase) {
      throw new Error('Configura Supabase para guardar rutinas.');
    }

    input.days.forEach((day) => {
      if (!validateDayBlockLimit(day.blocks.length)) {
        throw new Error(`El dia ${day.dayNumber} supera el maximo de 12 ejercicios.`);
      }
    });

    const { data: planRow, error: planError } = existingPlanId
      ? await supabase
          .from('training_plans')
          .update({
            name: input.name,
            goal: input.goal,
            level: input.level,
            days_per_week: input.daysPerWeek,
            status: input.status,
          })
          .eq('id', existingPlanId)
          .select()
          .single()
      : await supabase
          .from('training_plans')
          .insert({
            client_id: input.clientId,
            name: input.name,
            goal: input.goal,
            level: input.level,
            days_per_week: input.daysPerWeek,
            status: input.status,
          })
          .select()
          .single();

    if (planError) {
      throw planError;
    }

    const planId = String(planRow.id);

    const { data: existingDays } = await supabase
      .from('training_plan_days')
      .select('id')
      .eq('training_plan_id', planId);

    const existingDayIds = (existingDays ?? []).map((day) => day.id);
    if (existingDayIds.length > 0) {
      await supabase.from('exercise_blocks').delete().in('day_id', existingDayIds);
      await supabase.from('training_plan_days').delete().eq('training_plan_id', planId);
    }

    for (const day of input.days) {
      const { data: dayRow, error: dayError } = await supabase
        .from('training_plan_days')
        .insert({
          training_plan_id: planId,
          day_number: day.dayNumber,
          title: day.title,
          notes: day.notes ?? null,
        })
        .select()
        .single();

      if (dayError) {
        throw dayError;
      }

      const { error: blockError } = await supabase.from('exercise_blocks').insert(toBlockRows(dayRow.id, day.blocks));
      if (blockError) {
        throw blockError;
      }
    }

    return this.getPlanByClient(input.clientId);
  },
};
