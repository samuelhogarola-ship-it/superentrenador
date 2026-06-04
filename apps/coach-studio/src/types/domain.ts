export type Goal = 'ganar masa' | 'adelgazar' | 'mejorar rendimiento';
export type Level = 'principiante' | 'intermedio' | 'avanzado';
export type ExerciseType = 'fuerza' | 'cardio' | 'movilidad';
export type BlockType = 'simple' | 'compound';
export type LoadMode = 'none' | 'rpe' | 'percent_rm' | 'free_load';
export type PlanStatus = 'draft' | 'active';

export interface TrainerProfile {
  id: string;
  fullName: string;
  businessName: string;
  logoPath: string | null;
  logoUrl?: string | null;
  createdAt?: string;
}

export interface ClientInput {
  fullName: string;
  goal: Goal;
  daysPerWeek: number;
  level: Level;
  experience: string;
  baseSport: string;
  targetSport: string;
  age?: number | null;
  weightKg?: number | null;
  heightCm?: number | null;
  notes: string;
}

export interface Client extends ClientInput {
  id: string;
  trainerId: string;
  bmi: number | null;
  createdAt?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  movementPattern: string;
  equipment: string;
  level: Level;
  exerciseType: ExerciseType;
}

export interface ExerciseBlockInput {
  id?: string;
  blockType: BlockType;
  parentBlockId?: string | null;
  sortOrder: number;
  exerciseId?: string | null;
  exerciseNameSnapshot: string;
  sets?: string | null;
  reps?: string | null;
  rpe?: string | null;
  loadMode: LoadMode;
  loadValue?: string | null;
  comments?: string | null;
  exerciseCategory?: string | null;
}

export interface ExerciseBlock extends ExerciseBlockInput {
  id: string;
  dayId: string;
}

export interface TrainingPlanDayInput {
  id?: string;
  dayNumber: number;
  title: string;
  notes?: string | null;
  blocks: ExerciseBlockInput[];
}

export interface TrainingPlanDay {
  id: string;
  trainingPlanId: string;
  dayNumber: number;
  title: string;
  notes?: string | null;
  blocks: ExerciseBlock[];
}

export interface TrainingPlanInput {
  name: string;
  goal: Goal;
  level: Level;
  daysPerWeek: number;
  status: PlanStatus;
  clientId: string;
  days: TrainingPlanDayInput[];
}

export interface TrainingPlan {
  id: string;
  trainerId: string;
  clientId: string;
  name: string;
  goal: Goal;
  level: Level;
  daysPerWeek: number;
  status: PlanStatus;
  days: TrainingPlanDay[];
}

export interface TemplateDataDay {
  dayNumber: number;
  title: string;
  notes?: string | null;
  blocks: ExerciseBlockInput[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  goal: Goal;
  level: Level;
  daysPerWeek: number;
  description: string;
  templateData: TemplateDataDay[];
  trainerId?: string | null;
  sourceGlobalTemplateId?: string | null;
}
