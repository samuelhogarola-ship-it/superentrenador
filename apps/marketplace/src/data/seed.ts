import {
  AppState,
  ClientConnection,
  Lead,
  NutritionTemplate,
  PDFExport,
  ProgressEntry,
  PTClient,
  RoutineTemplate,
  TrainerProfile,
  TrainerSubscription,
  UserAccount,
  VerificationRequest,
  WorkoutLog
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

const users: UserAccount[] = [
  {
    id: trainer.id,
    role: "trainer",
    name: trainer.displayName,
    email: "carlos@superentrenador.com",
    phone: "600 111 222"
  },
  {
    id: "client-user-laura",
    role: "client",
    name: "Laura Gómez",
    email: "laura.gomez@email.com",
    phone: "600 444 555",
    linkedClientId: "client-laura"
  },
  {
    id: "admin-nora",
    role: "admin",
    name: "Nora Vidal",
    email: "admin@superentrenador.com",
    phone: "600 777 888"
  }
];

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
  },
  {
    id: "client-nuria",
    trainerId: trainer.id,
    type: "external",
    connectionStatus: "none",
    name: "Nuria",
    surname: "Hernández",
    email: "nuria@email.com",
    phone: "613 567 890",
    birthDate: "1990-06-01",
    gender: "Mujer",
    city: "Barcelona",
    goal: "Pérdida de peso",
    injuries: "Ninguna",
    restrictions: "Vegetariana",
    privateNotes: "Agradece mensajes cortos con instrucciones muy directas.",
    coachNotes: "Está lista para un menú más estructurado.",
    heightM: 1.63,
    weightKg: 71.8,
    status: "active",
    lastActivityAt: "2026-05-29T11:05:00",
    assignedRoutineId: "routine-body-inicio",
    assignedNutritionId: "nutrition-definicion-flex"
  }
];

const connections: ClientConnection[] = [
  {
    id: "connection-laura",
    trainerId: trainer.id,
    ptClientId: "client-laura",
    userId: "client-user-laura",
    invitationStatus: "pending",
    consentScope: "Rutina, entrenos y progreso",
    sentAt: "2026-06-01T13:00:00"
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
          },
          {
            id: "b2",
            exerciseName: "Press inclinado máquina",
            sets: 3,
            repRange: "10-12",
            restSeconds: 75,
            rir: "2",
            note: "Controla la excéntrica"
          }
        ]
      }
    ]
  },
  {
    id: "routine-body-inicio",
    trainerId: trainer.id,
    title: "Full Body Inicio",
    goal: "Adherencia y técnica",
    daysPerWeek: 3,
    level: "Principiante",
    notes: "Bloques cortos para clientes que empiezan y necesitan claridad.",
    status: "active",
    assignmentsCount: 8,
    days: [
      {
        id: "fb-day-1",
        dayLabel: "Día 1",
        focus: "Full body",
        durationMinutes: "45-55 min",
        level: "Principiante",
        blocks: [
          {
            id: "fb1",
            exerciseName: "Goblet squat",
            sets: 3,
            repRange: "10-12",
            restSeconds: 60,
            rir: "3",
            note: "Mantén el tronco estable"
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
  },
  {
    id: "routine-pierna-gluteo",
    trainerId: trainer.id,
    title: "Pierna y glúteo",
    goal: "Definición y tono",
    daysPerWeek: 4,
    level: "Intermedio",
    notes: "Ideal para clientes conectadas que registran series desde la app.",
    status: "active",
    assignmentsCount: 9,
    days: [
      {
        id: "leg-day-1",
        dayLabel: "Día 3",
        focus: "Pierna y glúteo",
        durationMinutes: "60-75 min",
        level: "Intermedio",
        blocks: [
          {
            id: "lg1",
            exerciseName: "Sentadilla trasera",
            sets: 4,
            repRange: "6-8",
            restSeconds: 120,
            rir: "2",
            note: "Sube el peso si las 4 series salen limpias"
          },
          {
            id: "lg2",
            exerciseName: "Zancada búlgara",
            sets: 3,
            repRange: "8-10 por pierna",
            restSeconds: 90,
            rir: "2",
            note: "Apoya el pie trasero con estabilidad"
          },
          {
            id: "lg3",
            exerciseName: "Hip thrust",
            sets: 4,
            repRange: "10-12",
            restSeconds: 90,
            rir: "1",
            note: "Pausa de un segundo arriba"
          },
          {
            id: "lg4",
            exerciseName: "Prensa de piernas",
            sets: 3,
            repRange: "10-12",
            restSeconds: 75,
            rir: "2",
            note: "Recorrido controlado"
          }
        ]
      }
    ]
  }
];

const nutritionTemplates: NutritionTemplate[] = [
  {
    id: "nutrition-definicion-flex",
    trainerId: trainer.id,
    title: "Definición flexible",
    type: "menu",
    caloriesTarget: 1850,
    macrosSummary: "P 135g · C 170g · G 55g",
    notes: "Plan fácil de sostener para clientes con vida social activa.",
    structure: [
      "Desayuno: yogur + avena + fruta",
      "Comida: proteína magra + arroz + verduras",
      "Merienda: fruta + queso fresco batido",
      "Cena: salmón o tofu + patata + ensalada"
    ],
    status: "active",
    assignmentsCount: 14
  },
  {
    id: "nutrition-volumen-simple",
    trainerId: trainer.id,
    title: "Volumen simple",
    type: "diet",
    caloriesTarget: 2750,
    macrosSummary: "P 170g · C 340g · G 70g",
    notes: "Más carbohidrato alrededor del entreno y menús muy repetibles.",
    structure: [
      "Desayuno fuerte con avena y huevos",
      "Comida con base de arroz/pasta",
      "Pre entreno ligero",
      "Cena completa con proteína y verdura"
    ],
    status: "active",
    assignmentsCount: 9
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
  },
  {
    id: "progress-laura-1",
    clientId: "client-laura",
    date: "2026-05-28",
    weightKg: 59.1,
    waistCm: 68,
    hipCm: 95,
    chestCm: 86,
    photoCount: 2,
    noteByTrainer: "Listo para invitarla a registrar desde la app.",
    noteByClient: "Me está ayudando ver fotos semanales."
  }
];

const workoutLogs: WorkoutLog[] = [
  {
    id: "workout-maria-1",
    clientId: "client-maria",
    date: "2026-06-02T09:15:00",
    routineTitle: "Espalda y bíceps",
    status: "completed",
    notes: "Sesión muy sólida.",
    perceivedEffort: 8,
    exercises: [
      {
        id: "we-1",
        exerciseName: "Jalón al pecho",
        prescription: "4 x 10-12",
        sets: [
          { setNumber: 1, reps: 12, weightKg: 35, rir: 2, completed: true },
          { setNumber: 2, reps: 12, weightKg: 37.5, rir: 2, completed: true }
        ]
      }
    ]
  },
  {
    id: "workout-laura-draft",
    clientId: "client-laura",
    date: "2026-06-02T08:00:00",
    routineTitle: "Pierna y glúteo",
    status: "draft",
    notes: "Lista para registrar desde la app.",
    perceivedEffort: 7,
    exercises: [
      {
        id: "we-lg1",
        exerciseName: "Sentadilla trasera",
        prescription: "4 series · 6-8 repeticiones",
        sets: [
          { setNumber: 1, reps: 8, weightKg: 60, rir: 2, completed: true },
          { setNumber: 2, reps: 8, weightKg: 65, rir: 2, completed: true },
          { setNumber: 3, reps: 7, weightKg: 70, rir: 1, completed: true },
          { setNumber: 4, reps: 6, weightKg: 72.5, rir: 1, completed: false }
        ]
      },
      {
        id: "we-lg2",
        exerciseName: "Zancada búlgara",
        prescription: "3 series · 8-10 repeticiones por pierna",
        sets: [
          { setNumber: 1, reps: 10, weightKg: 18, rir: 2, completed: false },
          { setNumber: 2, reps: 10, weightKg: 18, rir: 2, completed: false },
          { setNumber: 3, reps: 8, weightKg: 20, rir: 1, completed: false }
        ]
      },
      {
        id: "we-lg3",
        exerciseName: "Hip thrust",
        prescription: "4 series · 10-12 repeticiones",
        sets: [
          { setNumber: 1, reps: 12, weightKg: 70, rir: 2, completed: false },
          { setNumber: 2, reps: 12, weightKg: 75, rir: 2, completed: false },
          { setNumber: 3, reps: 10, weightKg: 80, rir: 1, completed: false },
          { setNumber: 4, reps: 10, weightKg: 80, rir: 1, completed: false }
        ]
      },
      {
        id: "we-lg4",
        exerciseName: "Prensa de piernas",
        prescription: "3 series · 10-12 repeticiones",
        sets: [
          { setNumber: 1, reps: 12, weightKg: 90, rir: 2, completed: false },
          { setNumber: 2, reps: 12, weightKg: 95, rir: 2, completed: false },
          { setNumber: 3, reps: 10, weightKg: 100, rir: 1, completed: false }
        ]
      }
    ]
  }
];

const exportsHistory: PDFExport[] = [
  {
    id: "pdf-1",
    trainerId: trainer.id,
    clientId: "client-javier",
    type: "routine",
    title: "Rutina Javier Martín",
    fileName: "rutina-javier-martin.pdf",
    createdAt: "2026-05-31T09:20:00"
  },
  {
    id: "pdf-2",
    trainerId: trainer.id,
    clientId: "client-nuria",
    type: "progress",
    title: "Seguimiento Nuria Hernández",
    fileName: "seguimiento-nuria-hernandez.pdf",
    createdAt: "2026-05-29T18:10:00"
  }
];

const leads: Lead[] = [
  {
    id: "lead-1",
    trainerId: trainer.id,
    source: "Perfil público",
    city: "Madrid",
    name: "Sofía Ortega",
    email: "sofia@email.com",
    message: "Busco entrenamiento online 3 días por semana.",
    status: "new"
  },
  {
    id: "lead-2",
    trainerId: trainer.id,
    source: "Directorio local",
    city: "Fuengirola",
    name: "Álvaro Núñez",
    email: "alvaro@email.com",
    message: "Quiero mejorar técnica y perder grasa.",
    status: "contacted"
  }
];

const verificationRequests: VerificationRequest[] = [
  {
    id: "verification-1",
    trainerId: trainer.id,
    status: "pending",
    submittedAt: "2026-05-30T14:00:00",
    documents: ["Copia de certificación NSCA", "DNI", "Seguro de RC"]
  }
];

export const seedState: AppState = {
  users,
  trainer,
  subscription,
  clients,
  connections,
  routines,
  nutritionTemplates,
  progressEntries,
  workoutLogs,
  exports: exportsHistory,
  leads,
  verificationRequests
};
