import type { Goal, Level, TrainingPlanInput, WorkoutTemplate } from '../types/domain';

const levelRank: Record<Level, number> = {
  principiante: 1,
  intermedio: 2,
  avanzado: 3,
};

function scoreTemplate(template: WorkoutTemplate, goal: Goal, level: Level, daysPerWeek: number) {
  const goalScore = template.goal === goal ? 100 : 0;
  const dayScore = 40 - Math.abs(template.daysPerWeek - daysPerWeek) * 10;
  const levelScore = 20 - Math.abs(levelRank[template.level] - levelRank[level]) * 5;
  return goalScore + dayScore + levelScore;
}

export function pickBestTemplate(
  templates: WorkoutTemplate[],
  goal: Goal,
  level: Level,
  daysPerWeek: number,
) {
  if (templates.length === 0) {
    return null;
  }

  return [...templates]
    .filter((template) => template.goal === goal)
    .sort((a, b) => scoreTemplate(b, goal, level, daysPerWeek) - scoreTemplate(a, goal, level, daysPerWeek))[0]
    ?? [...templates].sort((a, b) => scoreTemplate(b, goal, level, daysPerWeek) - scoreTemplate(a, goal, level, daysPerWeek))[0];
}

export function buildPlanFromTemplate(
  template: WorkoutTemplate,
  clientId: string,
): TrainingPlanInput {
  return {
    clientId,
    name: `Plan ${template.goal} ${template.daysPerWeek} dias`,
    goal: template.goal,
    level: template.level,
    daysPerWeek: template.daysPerWeek,
    status: 'draft',
    days: template.templateData.map((day) => ({
      dayNumber: day.dayNumber,
      title: day.title,
      notes: day.notes ?? 'Semana 1: ajustar sensaciones y registrar referencias de carga si procede.',
      blocks: day.blocks.map((block, index) => ({
        ...block,
        id: block.id ?? `${day.dayNumber}-${index}-${block.exerciseNameSnapshot}`,
        sortOrder: index + 1,
      })),
    })),
  };
}

export function validateDayBlockLimit(blockCount: number) {
  return blockCount <= 12;
}
