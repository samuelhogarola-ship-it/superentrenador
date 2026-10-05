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

export type PlatformArea = "marketplace" | "coach-studio";
export type PanelAudience = "user" | "trainer";

export interface ActivePlatformUser {
  id: string;
  name: string;
  email: string;
  role: PanelAudience;
  area: PlatformArea;
  plan: "free" | "pro" | "verified" | "client";
  status: "active" | "trial";
  lastSeenAt: string;
  panelPath: string;
}

export interface AdminPanelAccess {
  id: string;
  title: string;
  area: PlatformArea;
  audience: PanelAudience;
  description: string;
  activeUsers: number;
  path: string;
}
