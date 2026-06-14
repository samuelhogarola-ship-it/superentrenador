import { PropsWithChildren, createContext, useContext, useState } from "react";
import { platformSeed } from "../../data/platformSeed";
import { TrainerProfile, TrainerSubscription, VerificationRequest } from "../../types";

interface AdminState {
  trainer: TrainerProfile;
  subscription: TrainerSubscription;
  leads: typeof platformSeed.leads;
  verificationRequests: typeof platformSeed.verificationRequests;
}

interface AdminStateContextValue {
  state: AdminState;
  approveVerification: (requestId: string, reviewerName: string) => void;
}

const AdminStateContext = createContext<AdminStateContextValue | null>(null);

export function AdminStateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AdminState>(platformSeed);

  const approveVerification = (requestId: string, reviewerName: string) => {
    setState((current) => ({
      ...current,
      trainer: {
        ...current.trainer,
        verified: true
      },
      verificationRequests: current.verificationRequests.map((request): VerificationRequest =>
        request.id === requestId
          ? {
              ...request,
              status: "approved",
              reviewedAt: new Date().toISOString(),
              reviewerName
            }
          : request
      )
    }));
  };

  return (
    <AdminStateContext.Provider value={{ state, approveVerification }}>
      {children}
    </AdminStateContext.Provider>
  );
}

export function useAdminState() {
  const context = useContext(AdminStateContext);

  if (!context) {
    throw new Error("useAdminState must be used within AdminStateProvider");
  }

  return context;
}
