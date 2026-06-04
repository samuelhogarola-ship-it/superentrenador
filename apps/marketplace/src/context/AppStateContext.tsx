import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { seedState } from "../data/seed";
import { generateCoachPdf } from "../utils/pdf";
import {
  AppState,
  ClientConnection,
  NewClientInput,
  NewProgressInput,
  NutritionTemplate,
  PDFExport,
  PTClient,
  RoutineTemplate,
  SubscriptionPlan,
  WorkoutLog
} from "../types";

interface AppStateContextValue {
  state: AppState;
  addClient: (input: NewClientInput) => { ok: boolean; message: string };
  inviteClientToApp: (clientId: string) => void;
  acceptClientConnection: (userId: string) => void;
  addProgressEntry: (input: NewProgressInput) => void;
  duplicateRoutine: (routineId: string) => void;
  assignRoutineToClients: (routineId: string, clientIds: string[]) => void;
  assignNutritionToClient: (nutritionId: string, clientId: string) => void;
  updateSubscriptionPlan: (plan: SubscriptionPlan) => void;
  approveVerification: (requestId: string, reviewerName: string) => void;
  completeClientWorkout: (clientId: string, workout: WorkoutLog) => void;
  generateExport: (type: PDFExport["type"], clientId: string) => void;
  resetDemo: () => void;
}

const STORAGE_KEY = "super-entrenador-v2";

const AppStateContext = createContext<AppStateContextValue | null>(null);

function loadState(): AppState {
  if (typeof window === "undefined") return seedState;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedState;

  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return seedState;
  }
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function buildActivityFromExport(type: PDFExport["type"]) {
  if (type === "routine") return "Se generó un PDF de rutina";
  if (type === "nutrition") return "Se generó un PDF de nutrición";
  return "Se generó un PDF de seguimiento";
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addClient: AppStateContextValue["addClient"] = (input) => {
    const activeClients = state.clients.filter((client) => client.status === "active").length;

    if (state.subscription.plan === "free" && activeClients >= 10) {
      return {
        ok: false,
        message: "Has alcanzado el límite del plan Free. Pásate a PT Pro para añadir más clientes."
      };
    }

    const newClient: PTClient = {
      id: createId("client"),
      trainerId: state.trainer.id,
      type: input.type,
      connectionStatus: input.type === "connected" ? "pending" : "none",
      name: input.name,
      surname: input.surname,
      email: input.email,
      phone: input.phone,
      birthDate: "1995-01-01",
      gender: "No especificado",
      city: "España",
      goal: input.goal,
      injuries: input.injuries,
      restrictions: input.restrictions,
      privateNotes: input.privateNotes,
      coachNotes: "Nuevo alta creada desde el panel PT.",
      heightM: 1.7,
      weightKg: 70,
      status: "active",
      lastActivityAt: new Date().toISOString()
    };

    setState((current) => {
      const next = {
        ...current,
        clients: [newClient, ...current.clients]
      };

      if (input.type === "connected") {
        const connection: ClientConnection = {
          id: createId("connection"),
          trainerId: current.trainer.id,
          ptClientId: newClient.id,
          userId: "",
          invitationStatus: "pending",
          consentScope: "Rutina, entrenos y progreso",
          sentAt: new Date().toISOString()
        };

        next.connections = [connection, ...current.connections];
      }

      return next;
    });

    return { ok: true, message: "Cliente creado correctamente." };
  };

  const inviteClientToApp = (clientId: string) => {
    setState((current) => {
      const nextClients = current.clients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              type: "connected" as const,
              connectionStatus: "pending" as const,
              lastActivityAt: new Date().toISOString()
            }
          : client
      );

      const existing = current.connections.find((connection) => connection.ptClientId === clientId);
      const nextConnections = existing
        ? current.connections.map((connection) =>
            connection.ptClientId === clientId
              ? {
                  ...connection,
                  invitationStatus: "pending" as const,
                  sentAt: new Date().toISOString()
                }
              : connection
          )
        : [
            {
              id: createId("connection"),
              trainerId: current.trainer.id,
              ptClientId: clientId,
              userId: "",
              invitationStatus: "pending" as const,
              consentScope: "Rutina, entrenos y progreso",
              sentAt: new Date().toISOString()
            },
            ...current.connections
          ];

      return {
        ...current,
        clients: nextClients,
        connections: nextConnections
      };
    });
  };

  const acceptClientConnection = (userId: string) => {
    setState((current) => {
      const clientAccount = current.users.find((user) => user.id === userId);
      if (!clientAccount?.linkedClientId) return current;

      return {
        ...current,
        clients: current.clients.map((client) =>
          client.id === clientAccount.linkedClientId
            ? {
                ...client,
                type: "connected" as const,
                connectionStatus: "accepted" as const,
                linkedUserId: userId,
                lastActivityAt: new Date().toISOString()
              }
            : client
        ),
        connections: current.connections.map((connection) =>
          connection.ptClientId === clientAccount.linkedClientId
            ? {
                ...connection,
                userId,
                invitationStatus: "accepted",
                connectedAt: new Date().toISOString()
              }
            : connection
        )
      };
    });
  };

  const addProgressEntry = (input: NewProgressInput) => {
    setState((current) => ({
      ...current,
      progressEntries: [
        {
          id: createId("progress"),
          clientId: input.clientId,
          date: new Date().toISOString().slice(0, 10),
          weightKg: input.weightKg,
          waistCm: input.waistCm,
          hipCm: input.hipCm,
          chestCm: input.chestCm,
          photoCount: input.photoCount,
          noteByTrainer: input.noteByTrainer,
          noteByClient: ""
        },
        ...current.progressEntries
      ],
      clients: current.clients.map((client) =>
        client.id === input.clientId
          ? {
              ...client,
              weightKg: input.weightKg,
              lastActivityAt: new Date().toISOString()
            }
          : client
      )
    }));
  };

  const duplicateRoutine = (routineId: string) => {
    setState((current) => {
      const source = current.routines.find((routine) => routine.id === routineId);
      if (!source) return current;

      const copy: RoutineTemplate = {
        ...source,
        id: createId("routine"),
        title: `${source.title} Copy`,
        assignmentsCount: 0,
        days: source.days.map((day) => ({
          ...day,
          id: createId("day"),
          blocks: day.blocks.map((block) => ({ ...block, id: createId("block") }))
        }))
      };

      return {
        ...current,
        routines: [copy, ...current.routines]
      };
    });
  };

  const assignRoutineToClients = (routineId: string, clientIds: string[]) => {
    setState((current) => ({
      ...current,
      clients: current.clients.map((client) =>
        clientIds.includes(client.id)
          ? {
              ...client,
              assignedRoutineId: routineId,
              lastActivityAt: new Date().toISOString()
            }
          : client
      ),
      routines: current.routines.map((routine) =>
        routine.id === routineId
          ? {
              ...routine,
              assignmentsCount:
                clientIds.length +
                current.clients.filter((client) => client.assignedRoutineId === routineId).length
            }
          : routine
      )
    }));
  };

  const assignNutritionToClient = (nutritionId: string, clientId: string) => {
    setState((current) => ({
      ...current,
      clients: current.clients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              assignedNutritionId: nutritionId,
              lastActivityAt: new Date().toISOString()
            }
          : client
      ),
      nutritionTemplates: current.nutritionTemplates.map((template) =>
        template.id === nutritionId
          ? { ...template, assignmentsCount: template.assignmentsCount + 1 }
          : template
      )
    }));
  };

  const updateSubscriptionPlan = (plan: SubscriptionPlan) => {
    setState((current) => ({
      ...current,
      subscription: {
        ...current.subscription,
        plan,
        clientLimit: plan === "free" ? 10 : "unlimited",
        monthlyPrice: plan === "free" ? 0 : plan === "pro" ? 19 : 39,
        annualPrice: plan === "free" ? 0 : plan === "pro" ? 190 : 390
      }
    }));
  };

  const approveVerification = (requestId: string, reviewerName: string) => {
    setState((current) => ({
      ...current,
      trainer: {
        ...current.trainer,
        verified: true
      },
      verificationRequests: current.verificationRequests.map((request) =>
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

  const completeClientWorkout = (clientId: string, workout: WorkoutLog) => {
    setState((current) => ({
      ...current,
      workoutLogs: [
        {
          ...workout,
          id: createId("workout"),
          clientId,
          date: new Date().toISOString(),
          status: "completed"
        },
        ...current.workoutLogs.filter((entry) => entry.id !== workout.id)
      ],
      clients: current.clients.map((client) =>
        client.id === clientId
          ? {
              ...client,
              connectionStatus: "accepted",
              lastActivityAt: new Date().toISOString()
            }
          : client
      )
    }));
  };

  const generateExport = (type: PDFExport["type"], clientId: string) => {
    setState((current) => {
      const client = current.clients.find((entry) => entry.id === clientId);
      if (!client) return current;

      const routine = current.routines.find((entry) => entry.id === client.assignedRoutineId);
      const nutrition = current.nutritionTemplates.find(
        (entry) => entry.id === client.assignedNutritionId
      );
      const progressForClient = current.progressEntries.filter((entry) => entry.clientId === clientId);

      const fileName = generateCoachPdf({
        type,
        trainer: current.trainer,
        client,
        routine,
        nutrition,
        progressEntries: progressForClient
      });

      return {
        ...current,
        exports: [
          {
            id: createId("export"),
            trainerId: current.trainer.id,
            clientId,
            type,
            title: buildActivityFromExport(type),
            fileName,
            createdAt: new Date().toISOString()
          },
          ...current.exports
        ]
      };
    });
  };

  const resetDemo = () => {
    setState(seedState);
  };

  return (
    <AppStateContext.Provider
      value={{
        state,
        addClient,
        inviteClientToApp,
        acceptClientConnection,
        addProgressEntry,
        duplicateRoutine,
        assignRoutineToClients,
        assignNutritionToClient,
        updateSubscriptionPlan,
        approveVerification,
        completeClientWorkout,
        generateExport,
        resetDemo
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}
