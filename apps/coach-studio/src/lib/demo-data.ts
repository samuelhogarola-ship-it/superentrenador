import type { Client, Exercise, TrainingPlan, TrainerProfile, WorkoutTemplate } from '../types/domain';
import { calculateBmi } from '../utils/bmi';

export const demoProfile: TrainerProfile = {
  id: 'demo-trainer',
  fullName: 'Sorvali',
  businessName: 'Personal Trainer Fuengirola',
  logoPath: null,
};

export const demoExercises: Exercise[] = [
  { id: 'e1', name: 'Sentadilla goblet', muscleGroup: 'Piernas', movementPattern: 'Dominante de rodilla', equipment: 'Mancuerna', level: 'principiante', exerciseType: 'fuerza' },
  { id: 'e2', name: 'Peso muerto rumano', muscleGroup: 'Cadena posterior', movementPattern: 'Dominante de cadera', equipment: 'Barra', level: 'intermedio', exerciseType: 'fuerza' },
  { id: 'e3', name: 'Remo con mancuerna', muscleGroup: 'Espalda', movementPattern: 'Tiron horizontal', equipment: 'Mancuerna', level: 'principiante', exerciseType: 'fuerza' },
  { id: 'e4', name: 'Press banca con mancuernas', muscleGroup: 'Pecho', movementPattern: 'Empuje horizontal', equipment: 'Mancuernas', level: 'principiante', exerciseType: 'fuerza' },
  { id: 'e5', name: 'Plancha frontal', muscleGroup: 'Core', movementPattern: 'Anti-extension', equipment: 'Peso corporal', level: 'principiante', exerciseType: 'movilidad' },
  { id: 'e6', name: 'Bicicleta estatica', muscleGroup: 'Cardio', movementPattern: 'Ciclico', equipment: 'Bicicleta', level: 'principiante', exerciseType: 'cardio' },
];

export const demoTemplates: WorkoutTemplate[] = [
  {
    id: 't1',
    name: 'Masa 3 dias principiante',
    goal: 'ganar masa',
    level: 'principiante',
    daysPerWeek: 3,
    description: 'Base full body con enfasis en tecnica y volumen moderado.',
    templateData: [
      {
        dayNumber: 1,
        title: 'Dia 1 · Full body',
        blocks: [
          { blockType: 'simple', sortOrder: 1, exerciseNameSnapshot: 'Sentadilla goblet', sets: '4', reps: '8-10', rpe: '7', loadMode: 'rpe', comments: 'Control de tecnica.' },
          { blockType: 'simple', sortOrder: 2, exerciseNameSnapshot: 'Press banca con mancuernas', sets: '4', reps: '8-10', rpe: '7', loadMode: 'rpe' },
          { blockType: 'simple', sortOrder: 3, exerciseNameSnapshot: 'Remo con mancuerna', sets: '4', reps: '10', rpe: '7', loadMode: 'rpe' },
          { blockType: 'simple', sortOrder: 4, exerciseNameSnapshot: 'Plancha frontal', sets: '3', reps: '30-40 s', rpe: '6', loadMode: 'none' },
        ],
      },
      {
        dayNumber: 2,
        title: 'Dia 2 · Tren inferior + core',
        blocks: [
          { blockType: 'simple', sortOrder: 1, exerciseNameSnapshot: 'Peso muerto rumano', sets: '4', reps: '8', rpe: '7', loadMode: 'rpe' },
          { blockType: 'simple', sortOrder: 2, exerciseNameSnapshot: 'Sentadilla goblet', sets: '3', reps: '12', rpe: '7', loadMode: 'rpe' },
          { blockType: 'simple', sortOrder: 3, exerciseNameSnapshot: 'Plancha frontal', sets: '3', reps: '40 s', rpe: '6', loadMode: 'none' },
        ],
      },
      {
        dayNumber: 3,
        title: 'Dia 3 · Full body + cardio',
        blocks: [
          { blockType: 'simple', sortOrder: 1, exerciseNameSnapshot: 'Press banca con mancuernas', sets: '4', reps: '8', rpe: '7', loadMode: 'rpe' },
          { blockType: 'simple', sortOrder: 2, exerciseNameSnapshot: 'Remo con mancuerna', sets: '4', reps: '10', rpe: '7', loadMode: 'rpe' },
          { blockType: 'simple', sortOrder: 3, exerciseNameSnapshot: 'Bicicleta estatica', sets: '1', reps: '12 min', rpe: '6', loadMode: 'none', comments: 'Ritmo sostenido.' },
        ],
      },
    ],
  },
  {
    id: 't2',
    name: 'Definicion 1 dia principiante',
    goal: 'adelgazar',
    level: 'principiante',
    daysPerWeek: 1,
    description: 'Sesion total body con cardio final.',
    templateData: [
      {
        dayNumber: 1,
        title: 'Dia 1 · Circuito base',
        blocks: [
          { blockType: 'simple', sortOrder: 1, exerciseNameSnapshot: 'Sentadilla goblet', sets: '3', reps: '12', rpe: '7', loadMode: 'rpe' },
          { blockType: 'simple', sortOrder: 2, exerciseNameSnapshot: 'Remo con mancuerna', sets: '3', reps: '12', rpe: '7', loadMode: 'rpe' },
          { blockType: 'simple', sortOrder: 3, exerciseNameSnapshot: 'Bicicleta estatica', sets: '1', reps: '15 min', rpe: '7', loadMode: 'none' },
        ],
      },
    ],
  },
  {
    id: 't3',
    name: 'Rendimiento 5 dias intermedio',
    goal: 'mejorar rendimiento',
    level: 'intermedio',
    daysPerWeek: 5,
    description: 'Microciclo con fuerza, potencia y acondicionamiento.',
    templateData: [1, 2, 3, 4, 5].map((day) => ({
      dayNumber: day,
      title: `Dia ${day} · Rendimiento`,
      blocks: [
        { blockType: 'simple', sortOrder: 1, exerciseNameSnapshot: 'Peso muerto rumano', sets: '4', reps: '6', rpe: '7-8', loadMode: 'rpe' },
        { blockType: 'simple', sortOrder: 2, exerciseNameSnapshot: 'Press banca con mancuernas', sets: '4', reps: '6-8', rpe: '7', loadMode: 'rpe' },
        { blockType: 'simple', sortOrder: 3, exerciseNameSnapshot: 'Bicicleta estatica', sets: '1', reps: '10 min', rpe: '6', loadMode: 'none' },
      ],
    })),
  },
];

export const demoClients: Client[] = [
  {
    id: 'demo-client-1',
    trainerId: 'demo-trainer',
    fullName: 'Carlos Ruiz',
    goal: 'ganar masa',
    daysPerWeek: 3,
    level: 'principiante',
    experience: '6 meses entrenando de forma irregular',
    baseSport: 'Futbol amateur',
    targetSport: 'Hipertrofia general',
    age: 31,
    weightKg: 78,
    heightCm: 178,
    bmi: calculateBmi(78, 178),
    notes: 'Quiere ganar masa muscular sin perder movilidad.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-client-2',
    trainerId: 'demo-trainer',
    fullName: 'Marta Lopez',
    goal: 'adelgazar',
    daysPerWeek: 2,
    level: 'principiante',
    experience: 'Vuelta al entrenamiento tras varios anos',
    baseSport: 'Ninguno',
    targetSport: 'Mejorar composicion corporal',
    age: 39,
    weightKg: 84,
    heightCm: 166,
    bmi: calculateBmi(84, 166),
    notes: 'Necesita adherencia y sesiones sencillas.',
    createdAt: new Date().toISOString(),
  },
];

export const demoPlans: TrainingPlan[] = [
  {
    id: 'demo-plan-1',
    trainerId: 'demo-trainer',
    clientId: 'demo-client-1',
    name: 'Plan ganar masa 3 dias',
    goal: 'ganar masa',
    level: 'principiante',
    daysPerWeek: 3,
    status: 'draft',
    days: demoTemplates[0].templateData.map((day) => ({
      id: `demo-day-${day.dayNumber}`,
      trainingPlanId: 'demo-plan-1',
      dayNumber: day.dayNumber,
      title: day.title,
      notes: day.notes ?? null,
      blocks: day.blocks.map((block, index) => ({
        id: `demo-block-${day.dayNumber}-${index + 1}`,
        dayId: `demo-day-${day.dayNumber}`,
        blockType: block.blockType,
        parentBlockId: block.parentBlockId ?? null,
        sortOrder: block.sortOrder,
        exerciseId: block.exerciseId ?? null,
        exerciseNameSnapshot: block.exerciseNameSnapshot,
        sets: block.sets ?? null,
        reps: block.reps ?? null,
        rpe: block.rpe ?? null,
        loadMode: block.loadMode,
        loadValue: block.loadValue ?? null,
        comments: block.comments ?? null,
        exerciseCategory: block.exerciseCategory ?? null,
      })),
    })),
  },
];
