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
