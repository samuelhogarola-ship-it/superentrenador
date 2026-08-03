import {
  Bell,
  CreditCard,
  Dumbbell,
  FileOutput,
  Globe,
  LayoutDashboard,
  Menu,
  NotebookPen,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users
} from "lucide-react";
import { DragEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../../components/Avatar";
import { BrandMark } from "../../components/BrandMark";
import { ClientBadge } from "../../components/ClientBadge";
import { MetricCard } from "../../components/MetricCard";
import { SectionTitle } from "../../components/SectionTitle";
import { CoachState, useCoachState } from "../context/CoachStateContext";
import {
  NewClientInput,
  NewProgressInput,
  PTClient,
  RoutineExerciseBlock,
  RoutineTemplate
} from "../../types";
import {
  formatClientType,
  formatDate,
  formatDateTime,
  formatPlanName,
  percentage
} from "../../utils/format";

type PtSection =
  | "summary"
  | "clients"
  | "routines"
  | "nutrition"
  | "progress"
  | "exports"
  | "profile"
  | "billing"
  | "settings";

type ClientFilter = "all" | "connected" | "external" | "pending";
type DetailTab = "summary" | "routines" | "nutrition" | "progress" | "notes";

const navItems: Array<{
  id: PtSection;
  label: string;
  icon: JSX.Element;
}> = [
  { id: "summary", label: "Resumen", icon: <LayoutDashboard size={18} /> },
  { id: "clients", label: "Clientes", icon: <Users size={18} /> },
  { id: "routines", label: "Rutinas", icon: <Dumbbell size={18} /> },
  { id: "nutrition", label: "Nutrición", icon: <NotebookPen size={18} /> },
  { id: "progress", label: "Seguimiento", icon: <TrendingUp size={18} /> },
  { id: "exports", label: "Exportaciones", icon: <FileOutput size={18} /> },
  { id: "profile", label: "Perfil público", icon: <Globe size={18} /> },
  { id: "billing", label: "Facturación", icon: <CreditCard size={18} /> },
  { id: "settings", label: "Ajustes", icon: <Settings size={18} /> }
];

function getActivityFeed(state: CoachState) {
  const workoutItems = state.workoutLogs.map((log) => {
    const client = state.clients.find((entry) => entry.id === log.clientId);
    return {
      id: `workout-${log.id}`,
      timestamp: log.date,
      clientName: client ? `${client.name} ${client.surname}` : "Cliente",
      detail: `${log.routineTitle} completada`
    };
  });

  const progressItems = state.progressEntries.map((entry) => {
    const client = state.clients.find((item) => item.id === entry.clientId);
    return {
      id: `progress-${entry.id}`,
      timestamp: entry.date,
      clientName: client ? `${client.name} ${client.surname}` : "Cliente",
      detail: `Actualizó progreso corporal y ${entry.photoCount} fotos`
    };
  });

  const exportItems = state.exports.map((entry) => {
    const client = state.clients.find((item) => item.id === entry.clientId);
    return {
      id: `export-${entry.id}`,
      timestamp: entry.createdAt,
      clientName: client ? `${client.name} ${client.surname}` : "Cliente",
      detail: entry.title
    };
  });

  return [...workoutItems, ...progressItems, ...exportItems]
    .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
    .slice(0, 6);
}

function getSelectedClient(state: CoachState, selectedClientId: string) {
  return state.clients.find((client) => client.id === selectedClientId) ?? state.clients[0];
}

function buildNewClientInput(): NewClientInput {
  return {
    type: "external",
    name: "",
    surname: "",
    email: "",
    phone: "",
    goal: "",
    injuries: "",
    restrictions: "",
    privateNotes: ""
  };
}

function buildProgressInput(clientId: string): NewProgressInput {
  return {
    clientId,
    weightKg: 0,
    waistCm: 0,
    hipCm: 0,
    chestCm: 0,
    photoCount: 1,
    noteByTrainer: ""
  };
}

type ExerciseLibraryItem = {
  id: string;
  name: string;
  category: string;
  repRange: string;
  restSeconds: number;
  rir: string;
  note: string;
  videoUrl?: string;
  mediaUrl?: string;
};

function buildExerciseLibrary(): ExerciseLibraryItem[] {
  return [
    {
      id: "lib-sentadilla-trasera",
      name: "Sentadilla trasera",
      category: "Pierna",
      repRange: "6-8",
      restSeconds: 120,
      rir: "2",
      note: "Mantén tensión estable y profundidad limpia."
    },
    {
      id: "lib-press-banca",
      name: "Press banca con mancuernas",
      category: "Pecho",
      repRange: "8-10",
      restSeconds: 90,
      rir: "2",
      note: "Recorrido completo con control excéntrico."
    },
    {
      id: "lib-zancada",
      name: "Zancada búlgara",
      category: "Pierna",
      repRange: "8-10 por pierna",
      restSeconds: 90,
      rir: "2",
      note: "Estabilidad antes de subir carga."
    },
    {
      id: "lib-hip-thrust",
      name: "Hip thrust",
      category: "Glúteo",
      repRange: "10-12",
      restSeconds: 90,
      rir: "1",
      note: "Pausa de un segundo arriba."
    },
    {
      id: "lib-jalon-pecho",
      name: "Jalón al pecho",
      category: "Espalda",
      repRange: "10-12",
      restSeconds: 75,
      rir: "2",
      note: "Codos abajo y pecho arriba."
    },
    {
      id: "lib-remo-maquina",
      name: "Remo máquina",
      category: "Espalda",
      repRange: "8-10",
      restSeconds: 75,
      rir: "2",
      note: "Pausa breve al final de la tracción."
    }
  ];
}

function buildRoutineBlockFromLibrary(
  item: ExerciseLibraryItem,
  suffix: string
): RoutineExerciseBlock {
  return {
    id: `block-${suffix}`,
    exerciseName: item.name,
    sets: 4,
    repRange: item.repRange,
    restSeconds: item.restSeconds,
    rir: item.rir,
    note: item.note,
    videoUrl: item.videoUrl,
    mediaUrl: item.mediaUrl
  };
}

export function PtDashboardPage() {
  const {
    state,
    addClient,
    inviteClientToApp,
    addProgressEntry,
    createRoutineTemplate,
    duplicateRoutine,
    updateRoutineTemplate,
    assignRoutineToClients,
    assignNutritionToClient,
    updateSubscriptionPlan,
    generateExport,
    resetDemo
  } = useCoachState();
  const [activeSection, setActiveSection] = useState<PtSection>("summary");
  const [selectedClientId, setSelectedClientId] = useState(state.clients[0]?.id ?? "");
  const [selectedRoutineId, setSelectedRoutineId] = useState(state.routines[0]?.id ?? "");
  const [checkedClientIds, setCheckedClientIds] = useState<string[]>([]);
  const [newClient, setNewClient] = useState<NewClientInput>(buildNewClientInput);
  const [progressForm, setProgressForm] = useState<NewProgressInput>(
    buildProgressInput(state.clients[0]?.id ?? "")
  );
  const [notice, setNotice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [clientFilter, setClientFilter] = useState<ClientFilter>("all");
  const [detailTab, setDetailTab] = useState<DetailTab>("summary");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeRoutineDayId, setActiveRoutineDayId] = useState("");
  const [draggedExerciseId, setDraggedExerciseId] = useState("");
  const [customExercise, setCustomExercise] = useState<ExerciseLibraryItem>({
    id: "custom-exercise",
    name: "",
    category: "Personalizado",
    repRange: "8-10",
    restSeconds: 75,
    rir: "2",
    note: "",
    videoUrl: "",
    mediaUrl: ""
  });

  useEffect(() => {
    if (!state.clients.find((client) => client.id === selectedClientId) && state.clients[0]) {
      setSelectedClientId(state.clients[0].id);
    }
  }, [selectedClientId, state.clients]);

  useEffect(() => {
    if (selectedClientId) {
      setProgressForm((current) => ({ ...current, clientId: selectedClientId }));
    }
  }, [selectedClientId]);

  const selectedClient = getSelectedClient(state, selectedClientId);
  const selectedRoutine = state.routines.find((routine) => routine.id === selectedRoutineId) ?? state.routines[0];
  const selectedNutrition = state.nutritionTemplates.find(
    (template) => template.id === selectedClient?.assignedNutritionId
  );
  const selectedClientProgress = state.progressEntries.filter(
    (entry) => entry.clientId === selectedClient?.id
  );
  const activityFeed = getActivityFeed(state);
  const connectedCount = state.clients.filter((client) => client.connectionStatus === "accepted").length;
  const pendingCount = state.clients.filter((client) => client.connectionStatus === "pending").length;
  const activeRoutineCount = state.routines.filter((routine) => routine.status === "active").length;
  const weekExports = state.exports.filter((entry) => {
    const delta = Date.now() - +new Date(entry.createdAt);
    return delta < 7 * 24 * 60 * 60 * 1000;
  }).length;
  const currentClientCount = state.clients.filter((client) => client.status === "active").length;
  const storageUsage = percentage(
    state.subscription.storageUsedGb,
    state.subscription.storageLimitGb
  );
  const normalizedQuery = searchTerm.trim().toLowerCase();
  const visibleClients = state.clients.filter((client) => {
    const matchesFilter =
      clientFilter === "all" ||
      (clientFilter === "connected" && client.connectionStatus === "accepted") ||
      (clientFilter === "external" && client.type === "external") ||
      (clientFilter === "pending" && client.connectionStatus === "pending");
    const haystack = `${client.name} ${client.surname} ${client.email} ${client.goal}`.toLowerCase();
    return matchesFilter && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
  const visibleRoutines = state.routines.filter((routine) => {
    const haystack = `${routine.title} ${routine.goal} ${routine.level}`.toLowerCase();
    return !normalizedQuery || haystack.includes(normalizedQuery);
  });
  const exerciseLibrary = useMemo(() => buildExerciseLibrary(), []);
  const activeRoutineDay =
    selectedRoutine?.days.find((day) => day.id === activeRoutineDayId) ?? selectedRoutine?.days[0];

  useEffect(() => {
    if (selectedRoutine?.days[0] && !selectedRoutine.days.find((day) => day.id === activeRoutineDayId)) {
      setActiveRoutineDayId(selectedRoutine.days[0].id);
    }
  }, [activeRoutineDayId, selectedRoutine]);

  function handleAddClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = addClient(newClient);
    setNotice(result.message);
    if (result.ok) {
      setNewClient(buildNewClientInput());
      setActiveSection("clients");
    }
  }

  function toggleSelectedClient(clientId: string) {
    setCheckedClientIds((current) =>
      current.includes(clientId)
        ? current.filter((entry) => entry !== clientId)
        : [...current, clientId]
    );
  }

  function handleAssignRoutine() {
    if (!selectedRoutine || checkedClientIds.length === 0) {
      setNotice("Selecciona una rutina y al menos un cliente.");
      return;
    }

    assignRoutineToClients(selectedRoutine.id, checkedClientIds);
    setNotice(`Rutina asignada a ${checkedClientIds.length} cliente(s).`);
    setCheckedClientIds([]);
  }

  function handleAddProgress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addProgressEntry(progressForm);
    setNotice("Seguimiento guardado correctamente.");
    setProgressForm(buildProgressInput(selectedClient.id));
  }

  function patchRoutine(nextRoutine: RoutineTemplate, message?: string) {
    updateRoutineTemplate(nextRoutine);
    if (message) setNotice(message);
  }

  function handleCreateRoutine() {
    const routine = createRoutineTemplate();
    setSelectedRoutineId(routine.id);
    setActiveRoutineDayId(routine.days[0]?.id ?? "");
    setNotice("Rutina editable creada.");
  }

  function updateSelectedRoutine(fields: Partial<RoutineTemplate>) {
    if (!selectedRoutine) return;
    patchRoutine({ ...selectedRoutine, ...fields });
  }

  function updateRoutineDay(
    dayId: string,
    updater: (day: RoutineTemplate["days"][number]) => RoutineTemplate["days"][number]
  ) {
    if (!selectedRoutine) return;
    patchRoutine({
      ...selectedRoutine,
      days: selectedRoutine.days.map((day) => (day.id === dayId ? updater(day) : day))
    });
  }

  function addBlockToActiveDay(block: RoutineExerciseBlock) {
    if (!selectedRoutine || !activeRoutineDay) return;
    updateRoutineDay(activeRoutineDay.id, (day) => ({
      ...day,
      blocks: [...day.blocks, block]
    }));
    setNotice(`Ejercicio añadido a ${activeRoutineDay.dayLabel}.`);
  }

  function handleDropExercise(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!draggedExerciseId) return;
    const item = exerciseLibrary.find((entry) => entry.id === draggedExerciseId);
    if (!item) return;
    addBlockToActiveDay(buildRoutineBlockFromLibrary(item, `${Date.now()}`));
    setDraggedExerciseId("");
  }

  function handleCustomExerciseFile(file: File | null) {
    if (!file) return;
    setCustomExercise((current) => ({
      ...current,
      mediaUrl: URL.createObjectURL(file)
    }));
  }

  function handleAddCustomExercise() {
    if (!customExercise.name.trim()) {
      setNotice("Escribe un nombre para el ejercicio.");
      return;
    }

    addBlockToActiveDay(
      buildRoutineBlockFromLibrary(
        { ...customExercise, id: `custom-${Date.now()}`, name: customExercise.name.trim() },
        `${Date.now()}`
      )
    );

    setCustomExercise({
      id: "custom-exercise",
      name: "",
      category: "Personalizado",
      repRange: "8-10",
      restSeconds: 75,
      rir: "2",
      note: "",
      videoUrl: "",
      mediaUrl: ""
    });
  }

  function updateActiveDay(fields: Partial<RoutineTemplate["days"][number]>) {
    if (!activeRoutineDay) return;
    updateRoutineDay(activeRoutineDay.id, (day) => ({ ...day, ...fields }));
  }

  function updateRoutineBlock(
    blockId: string,
    fields: Partial<RoutineExerciseBlock>
  ) {
    if (!activeRoutineDay) return;
    updateRoutineDay(activeRoutineDay.id, (day) => ({
      ...day,
      blocks: day.blocks.map((block) =>
        block.id === blockId ? { ...block, ...fields } : block
      )
    }));
  }

  function removeRoutineBlock(blockId: string) {
    if (!activeRoutineDay) return;
    updateRoutineDay(activeRoutineDay.id, (day) => ({
      ...day,
      blocks: day.blocks.filter((block) => block.id !== blockId)
    }));
  }

  function assignSelectedRoutineToCurrentClient() {
    if (!selectedRoutine) {
      setNotice("Selecciona una rutina antes de asignarla.");
      return;
    }

    assignRoutineToClients(selectedRoutine.id, [selectedClient.id]);
    setNotice(`Rutina ${selectedRoutine.title} asignada a ${selectedClient.name}.`);
  }

  function renderSelectedClientPanel(client: PTClient) {
    const assignedRoutine = state.routines.find((routine) => routine.id === client.assignedRoutineId);
    const latestProgress = state.progressEntries.find((entry) => entry.clientId === client.id);

    return (
      <aside className="detail-panel">
        <div className="detail-panel-head">
          <Avatar name={`${client.name} ${client.surname}`} size="lg" tone="terracotta" />
          <div>
            <h3>
              {client.name} {client.surname}
            </h3>
            <ClientBadge type={client.type} connectionStatus={client.connectionStatus} />
          </div>
        </div>

        <div className="detail-contact">
          <span>{client.email}</span>
          <span>{client.phone}</span>
          <span>
            {new Date().getFullYear() - new Date(client.birthDate).getFullYear()} años ·{" "}
            {formatDate(client.birthDate)}
          </span>
        </div>

        <div className="detail-tabs">
          <button className={detailTab === "summary" ? "is-active" : ""} onClick={() => setDetailTab("summary")}>
            Resumen
          </button>
          <button className={detailTab === "routines" ? "is-active" : ""} onClick={() => setDetailTab("routines")}>
            Rutinas
          </button>
          <button className={detailTab === "nutrition" ? "is-active" : ""} onClick={() => setDetailTab("nutrition")}>
            Nutrición
          </button>
          <button className={detailTab === "progress" ? "is-active" : ""} onClick={() => setDetailTab("progress")}>
            Seguimiento
          </button>
          <button className={detailTab === "notes" ? "is-active" : ""} onClick={() => setDetailTab("notes")}>
            Notas
          </button>
        </div>
        {detailTab === "summary" ? (
          <>
            <div className="detail-block">
              <strong>Objetivo principal</strong>
              <p>{client.goal}</p>
            </div>
            <div className="detail-grid">
              <div>
                <strong>Peso actual</strong>
                <p>{client.weightKg} kg</p>
              </div>
              <div>
                <strong>Altura</strong>
                <p>{client.heightM.toFixed(2)} m</p>
              </div>
            </div>
            <div className="detail-block">
              <strong>Restricciones y lesiones</strong>
              <p>{client.restrictions}</p>
              <p>{client.injuries}</p>
            </div>
          </>
        ) : null}
        {detailTab === "routines" ? (
          <div className="detail-block">
            <strong>Rutina actual</strong>
            <p>{assignedRoutine ? assignedRoutine.title : "Sin asignar"}</p>
            <p>
              {assignedRoutine
                ? `${assignedRoutine.daysPerWeek} días · ${assignedRoutine.level}`
                : "Selecciona una plantilla y usa Asignar rutina."}
            </p>
          </div>
        ) : null}
        {detailTab === "nutrition" ? (
          <div className="detail-block">
            <strong>Plan nutricional</strong>
            <p>{selectedNutrition ? selectedNutrition.title : "Sin asignar"}</p>
            <p>{selectedNutrition ? selectedNutrition.macrosSummary : "Asigna una plantilla nutricional."}</p>
          </div>
        ) : null}
        {detailTab === "progress" ? (
          <div className="detail-block">
            <strong>Último seguimiento</strong>
            <p>
              {latestProgress
                ? `${formatDate(latestProgress.date)} · ${latestProgress.weightKg} kg`
                : "Todavía no hay registros de progreso"}
            </p>
            <p>{latestProgress?.noteByTrainer ?? "Añade un registro en Seguimiento corporal."}</p>
          </div>
        ) : null}
        {detailTab === "notes" ? (
          <div className="detail-block">
            <strong>Notas privadas</strong>
            <p>{client.privateNotes}</p>
            <strong>Observación del coach</strong>
            <p>{client.coachNotes}</p>
          </div>
        ) : null}
        <div className="detail-actions">
          <button className="button button-teal" onClick={assignSelectedRoutineToCurrentClient}>
            Asignar rutina
          </button>
          <button
            className="button button-secondary"
            onClick={() => assignNutritionToClient(state.nutritionTemplates[0].id, client.id)}
          >
            Asignar nutrición
          </button>
          <button className="button button-secondary" onClick={() => generateExport("routine", client.id)}>
            Generar PDF
          </button>
          <button className="button button-outline" onClick={() => inviteClientToApp(client.id)}>
            Invitar a la app
          </button>
        </div>
      </aside>
    );
  }

  function renderSummary() {
    return (
      <div className="pt-grid">
        <section className="pt-primary">
          <div className="metric-grid">
            <MetricCard
              label="Clientes activos"
              value={String(currentClientCount)}
              meta={`${connectedCount} conectados`}
              accent="teal"
              icon={<Users size={18} />}
            />
            <MetricCard
              label="Pendientes de conexión"
              value={String(pendingCount)}
              meta="Invitaciones enviadas"
              accent="gold"
              icon={<UserPlus size={18} />}
            />
            <MetricCard
              label="Plantillas activas"
              value={String(activeRoutineCount)}
              meta="Rutinas y dietas"
              accent="teal"
              icon={<Dumbbell size={18} />}
            />
            <MetricCard
              label="Exportaciones esta semana"
              value={String(weekExports)}
              meta="PDF generados"
              accent="terracotta"
              icon={<FileOutput size={18} />}
            />
          </div>

          <div className="dashboard-two-columns">
            <article className="surface-card">
              <div className="card-head">
                <div>
                  <h3>Clientes recientes</h3>
                  <p>Visión rápida del trabajo activo y las conexiones pendientes.</p>
                </div>
                <button className="button button-teal" onClick={() => setActiveSection("clients")}>
                  + Nuevo cliente
                </button>
              </div>

              <div className="list-tabs">
                <button className={clientFilter === "all" ? "is-active" : ""} onClick={() => setClientFilter("all")}>
                  Todos
                </button>
                <button
                  className={clientFilter === "connected" ? "is-active" : ""}
                  onClick={() => setClientFilter("connected")}
                >
                  Clientes conectados
                </button>
                <button
                  className={clientFilter === "external" ? "is-active" : ""}
                  onClick={() => setClientFilter("external")}
                >
                  Clientes externos
                </button>
                <button
                  className={clientFilter === "pending" ? "is-active" : ""}
                  onClick={() => setClientFilter("pending")}
                >
                  Pendientes
                </button>
              </div>

              <div className="data-table">
                <div className="table-header">
                  <span>Cliente</span>
                  <span>Tipo</span>
                  <span>Objetivo</span>
                  <span>Última actividad</span>
                </div>
                {visibleClients.map((client) => (
                  <button
                    key={client.id}
                    className={`table-row ${client.id === selectedClient.id ? "is-selected" : ""}`}
                    onClick={() => setSelectedClientId(client.id)}
                  >
                    <span className="table-cell table-row-user">
                      <small className="cell-label">Cliente</small>
                      <Avatar name={`${client.name} ${client.surname}`} size="sm" tone="teal" />
                      <span>
                        <strong>
                          {client.name} {client.surname}
                        </strong>
                        <small>{client.email}</small>
                      </span>
                    </span>
                    <span className="table-cell">
                      <small className="cell-label">Tipo</small>
                      <ClientBadge type={client.type} connectionStatus={client.connectionStatus} />
                    </span>
                    <span className="table-cell">
                      <small className="cell-label">Objetivo</small>
                      <span>{client.goal}</span>
                    </span>
                    <span className="table-cell">
                      <small className="cell-label">Última actividad</small>
                      <span>{formatDateTime(client.lastActivityAt)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </article>

            <div className="dashboard-side-stack">
              <article className="surface-card">
                <div className="card-head">
                  <div>
                    <h3>Plantillas destacadas</h3>
                    <p>Las más usadas esta semana.</p>
                  </div>
                </div>
                <div className="stack-list">
                  {visibleRoutines.slice(0, 4).map((routine) => (
                    <div key={routine.id} className="stack-item">
                      <div>
                        <strong>{routine.title}</strong>
                        <span>
                          {routine.daysPerWeek} días · {routine.level}
                        </span>
                      </div>
                      <strong>{routine.assignmentsCount}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="surface-card">
                <div className="card-head">
                  <div>
                    <h3>Facturación y plan</h3>
                    <p>{formatPlanName(state.subscription.plan)}</p>
                  </div>
                  <span className="plan-tag">{state.subscription.status}</span>
                </div>
                <div className="billing-block">
                  <span>Próxima renovación</span>
                  <strong>{formatDate(state.subscription.renewsAt)}</strong>
                </div>
                <div className="billing-block">
                  <span>Cobro mensual</span>
                  <strong>{state.subscription.monthlyPrice} € / mes</strong>
                </div>
                <div className="storage-bar">
                  <div style={{ width: `${storageUsage}%` }} />
                </div>
                <small>
                  {state.subscription.storageUsedGb} GB / {state.subscription.storageLimitGb} GB
                </small>
              </article>
            </div>
          </div>

          <article className="surface-card">
            <div className="card-head">
              <div>
                <h3>Actividad de seguimiento</h3>
                <p>Lo que está pasando hoy entre registros, progreso y entregables.</p>
              </div>
            </div>
            <div className="activity-list">
              {activityFeed.map((item) => (
                <div key={item.id} className="activity-row">
                  <div>
                    <strong>{item.clientName}</strong>
                    <span>{item.detail}</span>
                  </div>
                  <span>{formatDateTime(item.timestamp)}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        {renderSelectedClientPanel(selectedClient)}
      </div>
    );
  }

  function renderClients() {
    return (
      <div className="pt-grid">
        <section className="pt-primary">
          <article className="surface-card">
            <div className="card-head">
              <div>
                <h3>Gestión de clientes</h3>
                <p>Alta manual, clasificación, notas privadas y estado de conexión.</p>
              </div>
            </div>
            <div className="client-management-layout">
              <form className="form-card" onSubmit={handleAddClient}>
                <h4>Crear cliente manualmente</h4>
                <div className="field-grid">
                  <label>
                    Tipo
                    <select
                      value={newClient.type}
                      onChange={(event) =>
                        setNewClient((current) => ({
                          ...current,
                          type: event.target.value as NewClientInput["type"]
                        }))
                      }
                    >
                      <option value="external">Cliente externo</option>
                      <option value="connected">Cliente conectado</option>
                    </select>
                  </label>
                  <label>
                    Nombre
                    <input
                      value={newClient.name}
                      onChange={(event) =>
                        setNewClient((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="María"
                    />
                  </label>
                  <label>
                    Apellidos
                    <input
                      value={newClient.surname}
                      onChange={(event) =>
                        setNewClient((current) => ({ ...current, surname: event.target.value }))
                      }
                      placeholder="Sánchez"
                    />
                  </label>
                  <label>
                    Email
                    <input
                      value={newClient.email}
                      onChange={(event) =>
                        setNewClient((current) => ({ ...current, email: event.target.value }))
                      }
                      placeholder="cliente@email.com"
                    />
                  </label>
                  <label>
                    Teléfono
                    <input
                      value={newClient.phone}
                      onChange={(event) =>
                        setNewClient((current) => ({ ...current, phone: event.target.value }))
                      }
                      placeholder="600 000 000"
                    />
                  </label>
                  <label>
                    Objetivo
                    <input
                      value={newClient.goal}
                      onChange={(event) =>
                        setNewClient((current) => ({ ...current, goal: event.target.value }))
                      }
                      placeholder="Pérdida de grasa"
                    />
                  </label>
                  <label>
                    Lesiones
                    <input
                      value={newClient.injuries}
                      onChange={(event) =>
                        setNewClient((current) => ({ ...current, injuries: event.target.value }))
                      }
                      placeholder="Sin lesiones"
                    />
                  </label>
                  <label>
                    Restricciones
                    <input
                      value={newClient.restrictions}
                      onChange={(event) =>
                        setNewClient((current) => ({
                          ...current,
                          restrictions: event.target.value
                        }))
                      }
                      placeholder="Vegetariana"
                    />
                  </label>
                </div>
                <label>
                  Notas privadas
                  <textarea
                    value={newClient.privateNotes}
                    onChange={(event) =>
                      setNewClient((current) => ({ ...current, privateNotes: event.target.value }))
                    }
                    placeholder="Preferencias, horarios, contexto..."
                  />
                </label>
                <button className="button" type="submit">
                  Guardar cliente
                </button>
              </form>

              <article className="surface-card nested-card">
                <h4>Base de datos privada</h4>
                <div className="stack-list">
                  {visibleClients.map((client) => (
                    <button
                      key={client.id}
                      className={`stack-item stack-item-button ${
                        client.id === selectedClient.id ? "is-selected" : ""
                      }`}
                      onClick={() => setSelectedClientId(client.id)}
                    >
                      <div>
                        <strong>
                          {client.name} {client.surname}
                        </strong>
                        <span>{client.goal}</span>
                      </div>
                      <ClientBadge type={client.type} connectionStatus={client.connectionStatus} />
                    </button>
                  ))}
                </div>
              </article>
            </div>
          </article>
        </section>
        {renderSelectedClientPanel(selectedClient)}
      </div>
    );
  }

  function renderRoutines() {
    return (
      <div className="routine-builder-stack">
        <div className="surface-card routine-layout">
          <div className="card-head">
            <div>
              <h3>Banco de rutinas</h3>
              <p>Elige una base, crea una rutina editable y asígnala cuando esté lista.</p>
            </div>
            <button className="button" onClick={handleCreateRoutine}>
              Crear rutina
            </button>
          </div>
          <div className="routine-columns">
            <div className="routine-library">
              {visibleRoutines.map((routine) => (
                <button
                  key={routine.id}
                  className={`template-card ${
                    selectedRoutine?.id === routine.id ? "is-selected" : ""
                  }`}
                  onClick={() => setSelectedRoutineId(routine.id)}
                >
                  <div>
                    <strong>{routine.title}</strong>
                    <span>
                      {routine.daysPerWeek} días · {routine.level}
                    </span>
                  </div>
                  <span>{routine.assignmentsCount} asignaciones</span>
                  <p>{routine.notes}</p>
                  <div className="template-actions">
                    <span>{routine.goal}</span>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        duplicateRoutine(routine.id);
                        setNotice("Rutina duplicada y lista para editar.");
                      }}
                    >
                      Duplicar
                    </button>
                  </div>
                </button>
              ))}
            </div>

            <div className="assign-panel">
              <h4>Asignar a múltiples clientes</h4>
              <p>
                Rutina seleccionada: <strong>{selectedRoutine?.title ?? "Ninguna"}</strong>
              </p>
              <div className="assign-client-list">
                {visibleClients.map((client) => (
                  <label key={client.id} className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={checkedClientIds.includes(client.id)}
                      onChange={() => toggleSelectedClient(client.id)}
                    />
                    <span>
                      {client.name} {client.surname}
                    </span>
                    <ClientBadge type={client.type} connectionStatus={client.connectionStatus} />
                  </label>
                ))}
              </div>
              <button className="button button-teal" onClick={handleAssignRoutine}>
                Asignar rutina
              </button>
            </div>
          </div>
        </div>

        {selectedRoutine ? (
          <div className="routine-builder-layout">
            <article
              className="surface-card routine-draft-panel"
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDropExercise}
            >
              <div className="card-head">
                <div>
                  <h3>Rutina en desarrollo</h3>
                  <p>
                    Ajusta nombre, objetivo y estructura. Arrastra ejercicios del panel derecho o crea
                    uno propio.
                  </p>
                </div>
                <button
                  className="button button-secondary"
                  onClick={() => patchRoutine(selectedRoutine, "Rutina guardada correctamente.")}
                >
                  Guardar cambios
                </button>
              </div>

              <div className="routine-meta-grid">
                <label>
                  Nombre
                  <input
                    value={selectedRoutine.title}
                    onChange={(event) => updateSelectedRoutine({ title: event.target.value })}
                  />
                </label>
                <label>
                  Objetivo
                  <input
                    value={selectedRoutine.goal}
                    onChange={(event) => updateSelectedRoutine({ goal: event.target.value })}
                  />
                </label>
                <label>
                  Nivel
                  <input
                    value={selectedRoutine.level}
                    onChange={(event) => updateSelectedRoutine({ level: event.target.value })}
                  />
                </label>
                <label>
                  Días por semana
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={selectedRoutine.daysPerWeek}
                    onChange={(event) => updateSelectedRoutine({ daysPerWeek: Number(event.target.value) })}
                  />
                </label>
              </div>

              <label className="routine-notes-field">
                Notas generales
                <textarea
                  value={selectedRoutine.notes}
                  onChange={(event) => updateSelectedRoutine({ notes: event.target.value })}
                />
              </label>

              {selectedRoutine.days.length ? (
                <>
                  <div className="routine-day-tabs">
                    {selectedRoutine.days.map((day) => (
                      <button
                        key={day.id}
                        className={activeRoutineDay?.id === day.id ? "is-active" : ""}
                        onClick={() => setActiveRoutineDayId(day.id)}
                      >
                        {day.dayLabel}
                      </button>
                    ))}
                  </div>

                  {activeRoutineDay ? (
                    <>
                      <div className="routine-day-meta">
                        <label>
                          Etiqueta del día
                          <input
                            value={activeRoutineDay.dayLabel}
                            onChange={(event) => updateActiveDay({ dayLabel: event.target.value })}
                          />
                        </label>
                        <label>
                          Foco
                          <input
                            value={activeRoutineDay.focus}
                            onChange={(event) => updateActiveDay({ focus: event.target.value })}
                          />
                        </label>
                        <label>
                          Duración
                          <input
                            value={activeRoutineDay.durationMinutes}
                            onChange={(event) => updateActiveDay({ durationMinutes: event.target.value })}
                          />
                        </label>
                      </div>

                      <div className="routine-dropzone">
                        <strong>{activeRoutineDay.focus}</strong>
                        <span>
                          {activeRoutineDay.blocks.length
                            ? `${activeRoutineDay.blocks.length} ejercicios preparados`
                            : "Suelta aquí ejercicios del panel derecho o añade uno personalizado."}
                        </span>
                      </div>

                      <div className="routine-block-list">
                        {activeRoutineDay.blocks.map((block, index) => (
                          <article key={block.id} className="routine-block-card">
                            <div className="routine-block-head">
                              <div>
                                <small>Ejercicio {index + 1}</small>
                                <strong>{block.exerciseName}</strong>
                              </div>
                              <button
                                className="button button-outline"
                                type="button"
                                onClick={() => removeRoutineBlock(block.id)}
                              >
                                Quitar
                              </button>
                            </div>
                            <div className="routine-block-grid">
                              <label>
                                Nombre
                                <input
                                  value={block.exerciseName}
                                  onChange={(event) =>
                                    updateRoutineBlock(block.id, {
                                      exerciseName: event.target.value
                                    })
                                  }
                                />
                              </label>
                              <label>
                                Series
                                <input
                                  type="number"
                                  min="1"
                                  value={block.sets}
                                  onChange={(event) =>
                                    updateRoutineBlock(block.id, {
                                      sets: Number(event.target.value)
                                    })
                                  }
                                />
                              </label>
                              <label>
                                Reps
                                <input
                                  value={block.repRange}
                                  onChange={(event) =>
                                    updateRoutineBlock(block.id, {
                                      repRange: event.target.value
                                    })
                                  }
                                />
                              </label>
                              <label>
                                Descanso
                                <input
                                  type="number"
                                  min="0"
                                  value={block.restSeconds}
                                  onChange={(event) =>
                                    updateRoutineBlock(block.id, {
                                      restSeconds: Number(event.target.value)
                                    })
                                  }
                                />
                              </label>
                              <label>
                                RIR / RPE
                                <input
                                  value={block.rir}
                                  onChange={(event) =>
                                    updateRoutineBlock(block.id, {
                                      rir: event.target.value
                                    })
                                  }
                                />
                              </label>
                              <label>
                                Vídeo
                                <input
                                  value={block.videoUrl ?? ""}
                                  onChange={(event) =>
                                    updateRoutineBlock(block.id, {
                                      videoUrl: event.target.value
                                    })
                                  }
                                />
                              </label>
                            </div>
                            <label className="routine-notes-field">
                              Nota técnica
                              <textarea
                                value={block.note}
                                onChange={(event) =>
                                  updateRoutineBlock(block.id, {
                                    note: event.target.value
                                  })
                                }
                              />
                            </label>
                            {block.mediaUrl ? (
                              <div className="routine-media-preview">
                                <img src={block.mediaUrl} alt={block.exerciseName} />
                              </div>
                            ) : null}
                          </article>
                        ))}
                      </div>
                    </>
                  ) : null}
                </>
              ) : null}
            </article>

            <aside className="surface-card routine-builder-sidebar">
              <div className="card-head">
                <div>
                  <h3>Biblioteca de ejercicios</h3>
                  <p>Añade movimientos base o prepara un ejercicio propio con foto o vídeo.</p>
                </div>
              </div>

              <article className="surface-card nested-card custom-exercise-card">
                <h4>Ejercicio propio</h4>
                <div className="routine-block-grid">
                  <label>
                    Nombre
                    <input
                      value={customExercise.name}
                      onChange={(event) =>
                        setCustomExercise((current) => ({ ...current, name: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Categoría
                    <input
                      value={customExercise.category}
                      onChange={(event) =>
                        setCustomExercise((current) => ({
                          ...current,
                          category: event.target.value
                        }))
                      }
                    />
                  </label>
                  <label>
                    Reps
                    <input
                      value={customExercise.repRange}
                      onChange={(event) =>
                        setCustomExercise((current) => ({
                          ...current,
                          repRange: event.target.value
                        }))
                      }
                    />
                  </label>
                  <label>
                    Descanso
                    <input
                      type="number"
                      min="0"
                      value={customExercise.restSeconds}
                      onChange={(event) =>
                        setCustomExercise((current) => ({
                          ...current,
                          restSeconds: Number(event.target.value)
                        }))
                      }
                    />
                  </label>
                  <label>
                    RIR / RPE
                    <input
                      value={customExercise.rir}
                      onChange={(event) =>
                        setCustomExercise((current) => ({ ...current, rir: event.target.value }))
                      }
                    />
                  </label>
                  <label>
                    Link de vídeo
                    <input
                      value={customExercise.videoUrl ?? ""}
                      onChange={(event) =>
                        setCustomExercise((current) => ({
                          ...current,
                          videoUrl: event.target.value
                        }))
                      }
                    />
                  </label>
                </div>
                <label className="routine-notes-field">
                  Nota
                  <textarea
                    value={customExercise.note}
                    onChange={(event) =>
                      setCustomExercise((current) => ({ ...current, note: event.target.value }))
                    }
                  />
                </label>
                <label className="upload-field">
                  Foto directa
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleCustomExerciseFile(event.target.files?.[0] ?? null)}
                  />
                </label>
                {customExercise.mediaUrl ? (
                  <div className="routine-media-preview">
                    <img src={customExercise.mediaUrl} alt="Vista previa ejercicio" />
                  </div>
                ) : null}
                <button className="button button-teal" onClick={handleAddCustomExercise}>
                  Añadir ejercicio propio
                </button>
              </article>

              <div className="exercise-library-list">
                {exerciseLibrary.map((exercise) => (
                  <article
                    key={exercise.id}
                    className="exercise-library-card"
                    draggable
                    onDragStart={() => setDraggedExerciseId(exercise.id)}
                    onDragEnd={() => setDraggedExerciseId("")}
                  >
                    <div>
                      <small>{exercise.category}</small>
                      <strong>{exercise.name}</strong>
                    </div>
                    <span>
                      {exercise.repRange} · {exercise.restSeconds}s
                    </span>
                    <p>{exercise.note}</p>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() =>
                        addBlockToActiveDay(
                          buildRoutineBlockFromLibrary(exercise, `${Date.now()}-${exercise.id}`)
                        )
                      }
                    >
                      Añadir
                    </button>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        ) : null}
      </div>
    );
  }

  function renderNutrition() {
    return (
      <div className="surface-card">
        <div className="card-head">
          <div>
            <h3>Biblioteca nutricional</h3>
            <p>Plantillas reutilizables para asignar a clientes externos o conectados.</p>
          </div>
        </div>
        <div className="nutrition-grid">
          {state.nutritionTemplates.map((template) => (
            <article key={template.id} className="nutrition-card">
              <div>
                <strong>{template.title}</strong>
                <span>
                  {template.caloriesTarget} kcal · {template.macrosSummary}
                </span>
              </div>
              <p>{template.notes}</p>
              <ul>
                {template.structure.slice(0, 3).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <button
                className="button button-secondary"
                onClick={() => {
                  assignNutritionToClient(template.id, selectedClient.id);
                  setNotice(`Nutrición asignada a ${selectedClient.name}.`);
                }}
              >
                Asignar a {selectedClient.name}
              </button>
            </article>
          ))}
        </div>
        {selectedNutrition ? (
          <p className="inline-note">
            Actualmente <strong>{selectedClient.name}</strong> tiene asignado{" "}
            <strong>{selectedNutrition.title}</strong>.
          </p>
        ) : null}
      </div>
    );
  }

  function renderProgress() {
    return (
      <div className="progress-layout">
        <article className="surface-card">
          <div className="card-head">
            <div>
              <h3>Seguimiento corporal</h3>
              <p>Peso, medidas, fotos y observaciones del entrenador.</p>
            </div>
          </div>
          <form className="form-card inline-form" onSubmit={handleAddProgress}>
            <h4>Nuevo registro para {selectedClient.name}</h4>
            <div className="field-grid">
              <label>
                Peso (kg)
                <input
                  type="number"
                  step="0.1"
                  value={progressForm.weightKg || ""}
                  onChange={(event) =>
                    setProgressForm((current) => ({
                      ...current,
                      weightKg: Number(event.target.value)
                    }))
                  }
                />
              </label>
              <label>
                Cintura
                <input
                  type="number"
                  value={progressForm.waistCm || ""}
                  onChange={(event) =>
                    setProgressForm((current) => ({
                      ...current,
                      waistCm: Number(event.target.value)
                    }))
                  }
                />
              </label>
              <label>
                Cadera
                <input
                  type="number"
                  value={progressForm.hipCm || ""}
                  onChange={(event) =>
                    setProgressForm((current) => ({
                      ...current,
                      hipCm: Number(event.target.value)
                    }))
                  }
                />
              </label>
              <label>
                Pecho
                <input
                  type="number"
                  value={progressForm.chestCm || ""}
                  onChange={(event) =>
                    setProgressForm((current) => ({
                      ...current,
                      chestCm: Number(event.target.value)
                    }))
                  }
                />
              </label>
              <label>
                Fotos
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={progressForm.photoCount}
                  onChange={(event) =>
                    setProgressForm((current) => ({
                      ...current,
                      photoCount: Number(event.target.value)
                    }))
                  }
                />
              </label>
            </div>
            <label>
              Observación del entrenador
              <textarea
                value={progressForm.noteByTrainer}
                onChange={(event) =>
                  setProgressForm((current) => ({
                    ...current,
                    noteByTrainer: event.target.value
                  }))
                }
              />
            </label>
            <button className="button" type="submit">
              Guardar seguimiento
            </button>
          </form>
        </article>

        <article className="surface-card">
          <div className="card-head">
            <div>
              <h3>Historial temporal</h3>
              <p>Últimos registros del cliente seleccionado.</p>
            </div>
          </div>
          <div className="timeline-list">
            {selectedClientProgress.length ? (
              selectedClientProgress.map((entry) => (
                <div key={entry.id} className="timeline-entry">
                  <strong>{formatDate(entry.date)}</strong>
                  <span>
                    {entry.weightKg} kg · Cintura {entry.waistCm} cm · Fotos {entry.photoCount}
                  </span>
                  <p>{entry.noteByTrainer}</p>
                </div>
              ))
            ) : (
              <p className="empty-state-inline">Todavía no hay registros de progreso.</p>
            )}
          </div>
        </article>
      </div>
    );
  }

  function renderExports() {
    return (
      <div className="surface-card">
        <div className="card-head">
          <div>
            <h3>Exportaciones</h3>
            <p>PDFs de rutina, nutrición y seguimiento para clientes externos o entregables premium.</p>
          </div>
        </div>
        <div className="export-actions">
          <button className="button" onClick={() => generateExport("routine", selectedClient.id)}>
            PDF de rutina
          </button>
          <button
            className="button button-secondary"
            onClick={() => generateExport("nutrition", selectedClient.id)}
          >
            PDF de dieta
          </button>
          <button
            className="button button-secondary"
            onClick={() => generateExport("progress", selectedClient.id)}
          >
            PDF de seguimiento
          </button>
        </div>
        <div className="timeline-list">
          {state.exports.map((entry) => (
            <div key={entry.id} className="timeline-entry">
              <strong>{entry.fileName}</strong>
              <span>{entry.title}</span>
              <p>{formatDateTime(entry.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderProfile() {
    return (
      <div className="surface-card">
        <div className="card-head">
          <div>
            <h3>Perfil público</h3>
            <p>La capa visible para captar clientes y convertir visibilidad en leads.</p>
          </div>
          <Link to={`/trainers/${state.trainer.slug}`} className="button button-secondary">
            Ver perfil
          </Link>
        </div>
        <div className="profile-preview compact-profile">
          <div className="profile-cover" />
          <div className="profile-card">
            <Avatar name={state.trainer.displayName} size="lg" tone="terracotta" />
            <div className="profile-meta">
              <div className="profile-title-row">
                <h3>{state.trainer.displayName}</h3>
                <span className="verified-mark">
                  {state.trainer.verified ? "Verified" : "En revisión"}
                </span>
              </div>
              <p>{state.trainer.bio}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderBilling() {
    return (
      <div className="surface-card">
        <div className="card-head">
          <div>
            <h3>Plan y facturación</h3>
            <p>Simulación de cambio entre PT Free, Pro y Verified.</p>
          </div>
        </div>
        <div className="billing-plan-grid">
          {(["free", "pro", "verified"] as const).map((plan) => (
            <button
              key={plan}
              className={`plan-switch-card ${
                state.subscription.plan === plan ? "is-selected" : ""
              }`}
              onClick={() => {
                updateSubscriptionPlan(plan);
                setNotice(`Plan actualizado a ${formatPlanName(plan)}.`);
              }}
            >
              <strong>{formatPlanName(plan)}</strong>
              <span>
                {plan === "free"
                  ? "Hasta 10 clientes"
                  : plan === "pro"
                    ? "Clientes ilimitados + conectados"
                    : "Pro + verificación y prioridad"}
              </span>
            </button>
          ))}
        </div>
        <div className="billing-summary">
          <div>
            <span>Plan actual</span>
            <strong>{formatPlanName(state.subscription.plan)}</strong>
          </div>
          <div>
            <span>Precio mensual</span>
            <strong>{state.subscription.monthlyPrice} €</strong>
          </div>
          <div>
            <span>Clientes activos</span>
            <strong>{currentClientCount}</strong>
          </div>
        </div>
      </div>
    );
  }

  function renderSettings() {
    return (
      <div className="surface-card">
        <div className="card-head">
          <div>
            <h3>Ajustes y demo</h3>
            <p>Controles rápidos para revisar estados de producto y reiniciar el ejemplo.</p>
          </div>
        </div>
        <div className="settings-list">
          <button className="button button-secondary" onClick={resetDemo}>
            Resetear demo
          </button>
          <p>
            Este entorno guarda cambios en localStorage para que puedas probar altas de clientes,
            asignaciones, invitaciones y PDFs sin backend.
          </p>
        </div>
      </div>
    );
  }

  function renderCurrentSection() {
    switch (activeSection) {
      case "summary":
        return renderSummary();
      case "clients":
        return renderClients();
      case "routines":
        return renderRoutines();
      case "nutrition":
        return renderNutrition();
      case "progress":
        return renderProgress();
      case "exports":
        return renderExports();
      case "profile":
        return renderProfile();
      case "billing":
        return renderBilling();
      case "settings":
        return renderSettings();
      default:
        return renderSummary();
    }
  }

  return (
    <div className="dashboard-shell">
      <aside className={`dashboard-sidebar ${sidebarOpen ? "is-open" : "is-collapsed"}`}>
        <BrandMark compact />
        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeSection === item.id ? "is-active" : ""}
              onClick={() => setActiveSection(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <article className="sidebar-plan-card">
          <small>Tu plan</small>
          <strong>{formatPlanName(state.subscription.plan)}</strong>
          <span>
            {state.subscription.plan === "free" ? "Hasta 10 clientes" : "Clientes ilimitados"}
          </span>
          <div className="storage-bar">
            <div style={{ width: `${storageUsage}%` }} />
          </div>
          <small>
            {currentClientCount} clientes · {storageUsage}% del almacenamiento
          </small>
        </article>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="icon-button"
            aria-label="Abrir menú"
            onClick={() => setSidebarOpen((current) => !current)}
          >
            <Menu size={18} />
          </button>
          <label className="search-field">
            <Search size={16} />
            <input
              placeholder="Buscar clientes, rutinas, notas..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notificaciones">
              <Bell size={18} />
            </button>
            <div className="topbar-user">
              <Avatar name={state.trainer.displayName} size="sm" />
              <div>
                <strong>{state.trainer.displayName}</strong>
                <span>{formatPlanName(state.subscription.plan)}</span>
              </div>
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="page-heading">
            <div>
              <h1>Panel PT Pro</h1>
              <p>
                Workspace profesional para gestionar clientes, rutinas, seguimiento y entregables.
              </p>
            </div>
            {notice ? <div className="inline-notice">{notice}</div> : null}
          </div>

          {renderCurrentSection()}
        </section>
      </main>
    </div>
  );
}
