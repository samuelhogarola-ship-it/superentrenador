export type AppRoute = "pt" | "client" | "admin";
export type SubscriptionPlan = "free" | "pro" | "verified";
export type PTClientType = "external" | "connected";
export type ClientConnectionStatus = "none" | "pending" | "accepted";
export type TemplateStatus = "active" | "draft";
export type VerificationStatus = "pending" | "approved" | "rejected";

export interface UserAccount {
  id: string;
  role: "trainer" | "client" | "admin";
  name: string;
  email: string;
  phone: string;
  linkedClientId?: string;
}

export interface TrainerProfile {
  id: string;
  slug: string;
  displayName: string;
  city: string;
  bio: string;
  specialties: string[];
  certifications: string[];
  yearsExperience: number;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  publicProfileActive: boolean;
}

export interface TrainerSubscription {
  trainerId: string;
  plan: SubscriptionPlan;
  status: "active" | "trial";
  clientLimit: number | "unlimited";
  monthlyPrice: number;
  annualPrice: number;
  renewsAt: string;
  storageUsedGb: number;
  storageLimitGb: number;
}

export interface PTClient {
  id: string;
  trainerId: string;
  type: PTClientType;
  connectionStatus: ClientConnectionStatus;
  name: string;
  surname: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  city: string;
  goal: string;
  injuries: string;
  restrictions: string;
  privateNotes: string;
  coachNotes: string;
  heightM: number;
  weightKg: number;
  status: "active" | "archived";
  lastActivityAt: string;
  linkedUserId?: string;
  assignedRoutineId?: string;
  assignedNutritionId?: string;
}

export interface ClientConnection {
  id: string;
  trainerId: string;
  ptClientId: string;
  userId: string;
  invitationStatus: "pending" | "accepted";
  consentScope: string;
  sentAt: string;
  connectedAt?: string;
}

export interface RoutineExerciseBlock {
  id: string;
  exerciseName: string;
  sets: number;
  repRange: string;
  restSeconds: number;
  rir: string;
  note: string;
}

export interface RoutineDay {
  id: string;
  dayLabel: string;
  focus: string;
  durationMinutes: string;
  level: string;
  blocks: RoutineExerciseBlock[];
}

export interface RoutineTemplate {
  id: string;
  trainerId: string;
  title: string;
  goal: string;
  daysPerWeek: number;
  level: string;
  notes: string;
  status: TemplateStatus;
  assignmentsCount: number;
  days: RoutineDay[];
}

export interface NutritionTemplate {
  id: string;
  trainerId: string;
  title: string;
  type: "menu" | "diet";
  caloriesTarget: number;
  macrosSummary: string;
  notes: string;
  structure: string[];
  status: TemplateStatus;
  assignmentsCount: number;
}

export interface ProgressEntry {
  id: string;
  clientId: string;
  date: string;
  weightKg: number;
  waistCm: number;
  hipCm: number;
  chestCm: number;
  photoCount: number;
  noteByTrainer: string;
  noteByClient: string;
}

export interface WorkoutSetLog {
  setNumber: number;
  reps: number;
  weightKg: number;
  rir: number;
  completed: boolean;
}

export interface WorkoutExerciseLog {
  id: string;
  exerciseName: string;
  prescription: string;
  sets: WorkoutSetLog[];
}

export interface WorkoutLog {
  id: string;
  clientId: string;
  date: string;
  routineTitle: string;
  status: "draft" | "completed";
  notes: string;
  perceivedEffort: number;
  exercises: WorkoutExerciseLog[];
}

export interface PDFExport {
  id: string;
  trainerId: string;
  clientId?: string;
  type: "routine" | "nutrition" | "progress";
  title: string;
  fileName: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  trainerId: string;
  source: string;
  city: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "contacted";
}

export interface VerificationRequest {
  id: string;
  trainerId: string;
  status: VerificationStatus;
  submittedAt: string;
  documents: string[];
  reviewedAt?: string;
  reviewerName?: string;
}

export interface ActivityItem {
  id: string;
  kind: "workout" | "progress" | "invite" | "export";
  timestamp: string;
  clientName: string;
  detail: string;
}

export interface AppState {
  users: UserAccount[];
  trainer: TrainerProfile;
  subscription: TrainerSubscription;
  clients: PTClient[];
  connections: ClientConnection[];
  routines: RoutineTemplate[];
  nutritionTemplates: NutritionTemplate[];
  progressEntries: ProgressEntry[];
  workoutLogs: WorkoutLog[];
  exports: PDFExport[];
  leads: Lead[];
  verificationRequests: VerificationRequest[];
}

export interface NewClientInput {
  type: PTClientType;
  name: string;
  surname: string;
  email: string;
  phone: string;
  goal: string;
  injuries: string;
  restrictions: string;
  privateNotes: string;
}

export interface NewProgressInput {
  clientId: string;
  weightKg: number;
  waistCm: number;
  hipCm: number;
  chestCm: number;
  photoCount: number;
  noteByTrainer: string;
}
