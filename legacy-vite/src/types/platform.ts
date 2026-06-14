import { VerificationStatus } from "./shared";

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
