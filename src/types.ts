import type {
  ClientConnection,
  NutritionTemplate,
  PDFExport,
  ProgressEntry,
  PTClient,
  RoutineTemplate,
  WorkoutLog
} from "./types/coach";
import type { Lead } from "./types/marketplace";
import type { VerificationRequest } from "./types/platform";
import type { TrainerProfile, TrainerSubscription, UserAccount } from "./types/shared";

export * from "./types/shared";
export * from "./types/coach";
export * from "./types/marketplace";
export * from "./types/platform";

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
