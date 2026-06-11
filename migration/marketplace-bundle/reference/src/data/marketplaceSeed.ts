import {
  ProgressEntry,
  PTClient,
  RoutineTemplate,
  TrainerProfile,
  TrainerSubscription
} from "../types";

const trainer: TrainerProfile = {
  id: "trainer-carlos",
  slug: "carlos-ruiz",
  displayName: "Carlos Ruiz",
  city: "Madrid",
  bio: "Ayudo a profesionales ocupados a conseguir su mejor versión con un sistema híbrido de entrenamiento, nutrición y seguimiento real.",
  specialties: [
    "Pérdida de grasa",
    "Hipertrofia",
    "Rendimiento deportivo",
    "Entrenamiento online"
  ],
  certifications: [
    "NSCA-CPT",
    "Nutrición deportiva nivel II",
    "Biomecánica aplicada"
  ],
  yearsExperience: 8,
  rating: 4.9,
  reviewsCount: 126,
  verified: false,
  publicProfileActive: true
};

const subscription: TrainerSubscription = {
  trainerId: trainer.id,
  plan: "pro",
  status: "active",
  clientLimit: "unlimited",
  monthlyPrice: 19,
  annualPrice: 190,
  renewsAt: "2026-06-15",
  storageUsedGb: 2.4,
  storageLimitGb: 20
};

const clients: PTClient[] = [
  {
    id: "client-maria",
    trainerId: trainer.id,
    type: "connected",
    connectionStatus: "accepted",
    name: "María",
    surname: "Sánchez",
    email: "maria.sanchez@gmail.com",
    phone: "600 123 456",
    birthDate: "1996-04-12",
    gender: "Mujer",
    city: "Madrid",
    goal: "Pérdida de grasa",
    injuries: "Molestia lumbar ocasional",
    restrictions: "Lactosa, fructosa",
    privateNotes: "Prefiere entrenar por la mañana. Viaja los fines de semana.",
    coachNotes: "Buena adherencia cuando tiene bloques cortos y muy claros.",
    heightM: 1.68,
    weightKg: 62.4,
    status: "active",
    lastActivityAt: "2026-06-02T09:15:00",
    linkedUserId: "client-user-maria",
    assignedRoutineId: "routine-hipertrofia-4d",
    assignedNutritionId: "nutrition-definicion-flex"
  },
  {
    id: "client-carlos",
    trainerId: trainer.id,
    type: "connected",
    connectionStatus: "accepted",
    name: "Carlos",
    surname: "López",
    email: "carlos.lopez@gmail.com",
    phone: "611 222 333",
    birthDate: "1992-08-23",
    gender: "Hombre",
    city: "Valencia",
    goal: "Ganancia muscular",
    injuries: "Ninguna",
    restrictions: "Ninguna",
    privateNotes: "Motivado pero se salta sesiones si no tiene recordatorio.",
    coachNotes: "Funciona bien con rutinas de 4 días y seguimiento semanal.",
    heightM: 1.8,
    weightKg: 78.2,
    status: "active",
    lastActivityAt: "2026-06-01T18:30:00",
    assignedRoutineId: "routine-fuerza-5x5",
    assignedNutritionId: "nutrition-volumen-simple"
  },
  {
    id: "client-laura",
    trainerId: trainer.id,
    type: "connected",
    connectionStatus: "pending",
    name: "Laura",
    surname: "Gómez",
    email: "laura.gomez@email.com",
    phone: "600 444 555",
    birthDate: "1998-10-09",
    gender: "Mujer",
    city: "Sevilla",
    goal: "Tono y definición",
    injuries: "Rodilla sensible",
    restrictions: "Evitar impactos altos",
    privateNotes: "Cliente muy constante si ve progreso visual semanal.",
    coachNotes: "Lista para pasar de PDF a cliente conectada.",
    heightM: 1.66,
    weightKg: 59.1,
    status: "active",
    lastActivityAt: "2026-05-31T10:20:00",
    linkedUserId: "client-user-laura",
    assignedRoutineId: "routine-pierna-gluteo",
    assignedNutritionId: "nutrition-definicion-flex"
  },
  {
    id: "client-javier",
    trainerId: trainer.id,
    type: "external",
    connectionStatus: "none",
    name: "Javier",
    surname: "Martín",
    email: "javier.martin@email.com",
    phone: "612 345 678",
    birthDate: "1988-02-18",
    gender: "Hombre",
    city: "Málaga",
    goal: "Rendimiento deportivo",
    injuries: "Hombro derecho sensible",
    restrictions: "Evitar press vertical pesado",
    privateNotes: "Le gusta recibir todo en PDF antes del lunes.",
    coachNotes: "Muy disciplinado. Buen candidato a Pro cuando vea la app.",
    heightM: 1.84,
    weightKg: 81.6,
    status: "active",
    lastActivityAt: "2026-05-30T16:40:00",
    assignedRoutineId: "routine-fuerza-5x5",
    assignedNutritionId: "nutrition-volumen-simple"
  }
];

const routines: RoutineTemplate[] = [
  {
    id: "routine-hipertrofia-4d",
    trainerId: trainer.id,
    title: "Rutina Hipertrofia 4 días",
    goal: "Ganancia muscular",
    daysPerWeek: 4,
    level: "Intermedio",
    notes: "Pensada para clientes que ya registran cargas y necesitan progresión clara.",
    status: "active",
    assignmentsCount: 12,
    days: [
      {
        id: "hip-day-1",
        dayLabel: "Día 1",
        focus: "Empuje superior",
        durationMinutes: "60-75 min",
        level: "Intermedio",
        blocks: [
          {
            id: "b1",
            exerciseName: "Press banca con mancuernas",
            sets: 4,
            repRange: "8-10",
            restSeconds: 90,
            rir: "2",
            note: "Busca recorrido completo"
          }
        ]
      }
    ]
  },
  {
    id: "routine-fuerza-5x5",
    trainerId: trainer.id,
    title: "Fuerza Máxima 5x5",
    goal: "Rendimiento y fuerza",
    daysPerWeek: 4,
    level: "Avanzado",
    notes: "Pensada para atletas con buena técnica y tolerancia a cargas altas.",
    status: "active",
    assignmentsCount: 6,
    days: [
      {
        id: "force-day-1",
        dayLabel: "Día 1",
        focus: "Pierna + empuje",
        durationMinutes: "75 min",
        level: "Avanzado",
        blocks: [
          {
            id: "f1",
            exerciseName: "Sentadilla trasera",
            sets: 5,
            repRange: "5",
            restSeconds: 150,
            rir: "1",
            note: "Deja una repetición en recámara"
          }
        ]
      }
    ]
  }
];

const progressEntries: ProgressEntry[] = [
  {
    id: "progress-maria-1",
    clientId: "client-maria",
    date: "2026-05-30",
    weightKg: 62.4,
    waistCm: 71,
    hipCm: 96,
    chestCm: 88,
    photoCount: 2,
    noteByTrainer: "Muy buena semana. Mantener pasos altos.",
    noteByClient: "Me noto con más energía."
  },
  {
    id: "progress-carlos-1",
    clientId: "client-carlos",
    date: "2026-05-29",
    weightKg: 78.2,
    waistCm: 82,
    hipCm: 97,
    chestCm: 104,
    photoCount: 1,
    noteByTrainer: "Subida limpia. Seguimos igual.",
    noteByClient: "El entreno de torso salió muy bien."
  }
];

export const marketplaceSeed = {
  trainer,
  subscription,
  clients,
  routines,
  progressEntries
};
