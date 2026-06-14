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
