import {
  ActivePlatformUser,
  AdminPanelAccess,
  Lead,
  TrainerProfile,
  TrainerSubscription,
  VerificationRequest
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

const activeUsers: ActivePlatformUser[] = [
  {
    id: "active-market-user-1",
    name: "Sofía Ortega",
    email: "sofia@email.com",
    role: "user",
    area: "marketplace",
    plan: "client",
    status: "active",
    lastSeenAt: "2026-06-02T09:35:00",
    panelPath: "/trainers/carlos-ruiz"
  },
  {
    id: "active-market-trainer-1",
    name: "Carlos Ruiz",
    email: "carlos@wfstudio.local",
    role: "trainer",
    area: "marketplace",
    plan: "pro",
    status: "active",
    lastSeenAt: "2026-06-02T10:12:00",
    panelPath: "/app/pt"
  },
  {
    id: "active-market-trainer-2",
    name: "Marta Salas",
    email: "marta@wfstudio.local",
    role: "trainer",
    area: "marketplace",
    plan: "verified",
    status: "active",
    lastSeenAt: "2026-06-02T08:48:00",
    panelPath: "/trainers/carlos-ruiz"
  },
  {
    id: "active-studio-user-1",
    name: "Lucía Martín",
    email: "lucia@email.com",
    role: "user",
    area: "coach-studio",
    plan: "client",
    status: "active",
    lastSeenAt: "2026-06-02T10:04:00",
    panelPath: "/app/client"
  },
  {
    id: "active-studio-user-2",
    name: "Diego Molina",
    email: "diego@email.com",
    role: "user",
    area: "coach-studio",
    plan: "client",
    status: "active",
    lastSeenAt: "2026-06-02T09:58:00",
    panelPath: "/app/client"
  },
  {
    id: "active-studio-trainer-1",
    name: "Carlos Ruiz",
    email: "carlos@wfstudio.local",
    role: "trainer",
    area: "coach-studio",
    plan: "pro",
    status: "active",
    lastSeenAt: "2026-06-02T10:16:00",
    panelPath: "/app/pt"
  }
];

const panelAccesses: AdminPanelAccess[] = [
  {
    id: "marketplace-user-panel",
    title: "Panel usuario Marketplace",
    area: "marketplace",
    audience: "user",
    description: "Vista pública, perfil del entrenador, contacto y flujo de lead.",
    activeUsers: activeUsers.filter((user) => user.area === "marketplace" && user.role === "user").length,
    path: "/trainers/carlos-ruiz"
  },
  {
    id: "marketplace-trainer-panel",
    title: "Panel entrenador Marketplace",
    area: "marketplace",
    audience: "trainer",
    description: "Perfil público, leads, verificación, suscripción y visibilidad.",
    activeUsers: activeUsers.filter((user) => user.area === "marketplace" && user.role === "trainer").length,
    path: "/app/pt"
  },
  {
    id: "coach-user-panel",
    title: "Panel usuario Coach Studio",
    area: "coach-studio",
    audience: "user",
    description: "App cliente con rutina, nutrición, progreso y mensajes.",
    activeUsers: activeUsers.filter((user) => user.area === "coach-studio" && user.role === "user").length,
    path: "/app/client"
  },
  {
    id: "coach-trainer-panel",
    title: "Panel entrenador Coach Studio",
    area: "coach-studio",
    audience: "trainer",
    description: "Dashboard profesional para clientes, rutinas, progreso y exportaciones.",
    activeUsers: activeUsers.filter((user) => user.area === "coach-studio" && user.role === "trainer").length,
    path: "/app/pt"
  }
];

export const platformSeed = {
  trainer,
  subscription,
  leads,
  verificationRequests,
  activeUsers,
  panelAccesses
};
