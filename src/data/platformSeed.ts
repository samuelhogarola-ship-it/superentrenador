import {
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

export const platformSeed = {
  trainer,
  subscription,
  leads,
  verificationRequests
};
