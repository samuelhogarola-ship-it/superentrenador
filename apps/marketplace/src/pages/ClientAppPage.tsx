import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Dumbbell,
  Home,
  MessageSquare,
  MoreHorizontal,
  TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "../components/Avatar";
import { BrandMark } from "../components/BrandMark";
import { useAppState } from "../context/AppStateContext";
import { WorkoutLog } from "../types";
import { formatDate, formatDateTime } from "../utils/format";

type ClientTab = "home" | "routine" | "progress" | "messages" | "more";

export function ClientAppPage() {
  const { state, acceptClientConnection, completeClientWorkout } = useAppState();
  const [activeTab, setActiveTab] = useState<ClientTab>("home");
  const [localWorkout, setLocalWorkout] = useState<WorkoutLog | null>(null);
  const clientUser = state.users.find((user) => user.id === "client-user-laura");
  const client = state.clients.find((entry) => entry.id === clientUser?.linkedClientId);
  const workout = state.workoutLogs.find((entry) => entry.clientId === client?.id) ?? null;
  const progressEntries = state.progressEntries.filter((entry) => entry.clientId === client?.id);

  useEffect(() => {
    if (workout) {
      setLocalWorkout(workout);
    }
  }, [workout]);

  if (!clientUser || !client) {
    return (
      <main className="empty-state-page">
        <BrandMark />
        <h1>Cliente no disponible</h1>
      </main>
    );
  }

  const currentClient = client;
  const currentClientUser = clientUser;
  const coachName = state.trainer.displayName;

  const routine = state.routines.find((entry) => entry.id === currentClient.assignedRoutineId);
  const completedSets =
    localWorkout?.exercises.flatMap((exercise) => exercise.sets).filter((set) => set.completed)
      .length ?? 0;
  const totalSets = localWorkout?.exercises.flatMap((exercise) => exercise.sets).length ?? 0;

  function toggleSet(exerciseId: string, setNumber: number) {
    if (!localWorkout) return;

    setLocalWorkout({
      ...localWorkout,
      exercises: localWorkout.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.setNumber === setNumber ? { ...set, completed: !set.completed } : set
              )
            }
          : exercise
      )
    });
  }

  function saveWorkout() {
    if (!localWorkout) return;
    completeClientWorkout(currentClient.id, localWorkout);
  }

  function renderHome() {
    return (
      <>
        {currentClient.connectionStatus === "pending" ? (
          <div className="mobile-alert">
            <div>
              <strong>Invitación pendiente</strong>
              <span>Acepta la conexión para compartir entrenos y progreso con tu entrenador.</span>
            </div>
            <button className="button" onClick={() => acceptClientConnection(currentClientUser.id)}>
              Aceptar conexión
            </button>
          </div>
        ) : null}

        <section className="mobile-trainer-card">
          <Avatar name={coachName} size="lg" tone="terracotta" />
          <div>
            <small>Tu entrenador</small>
            <strong>{coachName}</strong>
            <span>
              {currentClient.connectionStatus === "accepted"
                ? "Conectada y viendo tu progreso"
                : "Pendiente de conexión"}
            </span>
          </div>
        </section>

        <section className="mobile-hero-card">
          <div>
            <small>{routine?.days[0]?.dayLabel ?? "Hoy"} · Fuerza</small>
            <h2>{routine?.days[0]?.focus ?? "Rutina de hoy"}</h2>
            <span>
              {routine?.days[0]?.durationMinutes ?? "60 min"} · {routine?.level ?? "Intermedio"}
            </span>
          </div>
          <button className="button button-secondary" onClick={() => setActiveTab("routine")}>
            Ver rutina
          </button>
        </section>

        <section className="mobile-progress-cards">
          <article>
            <strong>5/6</strong>
            <span>Adherencia semanal</span>
          </article>
          <article>
            <strong>15.240 kg</strong>
            <span>Volumen esta semana</span>
          </article>
          <article>
            <strong>12 días</strong>
            <span>Racha actual</span>
          </article>
        </section>
      </>
    );
  }

  function renderRoutine() {
    return (
      <>
        <section className="mobile-routine-header">
          <div>
            <small>Rutina de hoy</small>
            <h2>{routine?.title ?? "Sin rutina asignada"}</h2>
            <span>{completedSets} / {totalSets} series completadas</span>
          </div>
          <button
            className="icon-button"
            aria-label="Ver progreso"
            onClick={() => setActiveTab("progress")}
          >
            <Calendar size={18} />
          </button>
        </section>

        {localWorkout ? (
          <div className="exercise-stack">
            {localWorkout.exercises.map((exercise, index) => (
              <article key={exercise.id} className="exercise-card">
                <header>
                  <span className="exercise-order">{index + 1}</span>
                  <div>
                    <strong>{exercise.exerciseName}</strong>
                    <small>{exercise.prescription}</small>
                  </div>
                  <ChevronDown size={18} />
                </header>
                <div className="set-table">
                  <div className="set-table-head">
                    <span>Serie</span>
                    <span>Repeticiones</span>
                    <span>Peso</span>
                    <span>RIR</span>
                    <span>Estado</span>
                  </div>
                  {exercise.sets.map((set) => (
                    <button
                      key={set.setNumber}
                      className={`set-row ${set.completed ? "is-done" : ""}`}
                      onClick={() => toggleSet(exercise.id, set.setNumber)}
                    >
                      <span>{set.setNumber}</span>
                      <span>{set.reps}</span>
                      <span>{set.weightKg} kg</span>
                      <span>{set.rir}</span>
                      <span>{set.completed ? "OK" : "Pendiente"}</span>
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state-inline">Tu entrenador todavía no te ha asignado una rutina.</p>
        )}

        <button className="button button-full" onClick={saveWorkout}>
          Finalizar sesión
        </button>
      </>
    );
  }

  function renderProgress() {
    return (
      <>
        <section className="mobile-progress-head">
          <h2>Mi progreso</h2>
          <span>{progressEntries.length} registros</span>
        </section>
        <div className="mobile-progress-cards mobile-progress-grid">
          <article>
            <strong>{progressEntries[0]?.weightKg ?? currentClient.weightKg} kg</strong>
            <span>Peso actual</span>
          </article>
          <article>
            <strong>{progressEntries[0]?.photoCount ?? 0}</strong>
            <span>Fotos recientes</span>
          </article>
        </div>
        <div className="timeline-list mobile-timeline">
          {progressEntries.length ? (
            progressEntries.map((entry) => (
              <div key={entry.id} className="timeline-entry">
                <strong>{formatDate(entry.date)}</strong>
                <span>
                  {entry.weightKg} kg · Cintura {entry.waistCm} cm · Cadera {entry.hipCm} cm
                </span>
                <p>{entry.noteByTrainer}</p>
              </div>
            ))
          ) : (
            <p className="empty-state-inline">No hay datos suficientes para mostrar evolución.</p>
          )}
        </div>
      </>
    );
  }

  function renderMessages() {
    return (
      <section className="surface-card mobile-surface">
        <h2>Mensajes e indicaciones</h2>
        <div className="timeline-list mobile-timeline">
          <div className="timeline-entry">
            <strong>{coachName}</strong>
            <span>{formatDateTime(currentClient.lastActivityAt)}</span>
            <p>Muy buena sesión. Si mañana te notas fresca, subimos 2,5 kg en sentadilla.</p>
          </div>
          <div className="timeline-entry">
            <strong>Tú</strong>
            <span>{formatDateTime(currentClient.lastActivityAt)}</span>
            <p>Perfecto, hoy me sentí con mejor estabilidad en la tercera serie.</p>
          </div>
        </div>
      </section>
    );
  }

  function renderMore() {
    return (
      <section className="surface-card mobile-surface">
        <h2>Más</h2>
        <div className="settings-list">
          <p>
            Cliente conectado: {currentClient.connectionStatus === "accepted" ? "Sí" : "Pendiente"}
          </p>
          <p>Plan asignado: {routine?.title ?? "Sin asignar"}</p>
          <p>Última actividad: {formatDateTime(currentClient.lastActivityAt)}</p>
        </div>
      </section>
    );
  }

  function renderCurrentTab() {
    switch (activeTab) {
      case "home":
        return renderHome();
      case "routine":
        return renderRoutine();
      case "progress":
        return renderProgress();
      case "messages":
        return renderMessages();
      case "more":
        return renderMore();
      default:
        return renderHome();
    }
  }

  return (
    <div className="client-shell">
      <div className="client-phone">
        <header className="client-topbar">
          <BrandMark compact />
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notificaciones">
              <Bell size={18} />
            </button>
            <Avatar name={currentClient.name} size="sm" />
          </div>
        </header>

        <section className="client-welcome">
          <h1>¡Hola, {currentClient.name}!</h1>
          <p>
            {currentClient.connectionStatus === "accepted"
              ? "Tu entrenador ve tus registros y ajusta tu plan en tiempo real."
              : "Acepta la conexión para compartir entrenos y progreso."}
          </p>
        </section>

        <main className="client-content">{renderCurrentTab()}</main>

        <nav className="client-nav">
          <button className={activeTab === "home" ? "is-active" : ""} onClick={() => setActiveTab("home")}>
            <Home size={18} />
            Inicio
          </button>
          <button
            className={activeTab === "routine" ? "is-active" : ""}
            onClick={() => setActiveTab("routine")}
          >
            <Dumbbell size={18} />
            Rutinas
          </button>
          <button
            className={activeTab === "progress" ? "is-active" : ""}
            onClick={() => setActiveTab("progress")}
          >
            <TrendingUp size={18} />
            Progreso
          </button>
          <button
            className={activeTab === "messages" ? "is-active" : ""}
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare size={18} />
            Mensajes
          </button>
          <button className={activeTab === "more" ? "is-active" : ""} onClick={() => setActiveTab("more")}>
            <MoreHorizontal size={18} />
            Más
          </button>
        </nav>
      </div>
    </div>
  );
}
