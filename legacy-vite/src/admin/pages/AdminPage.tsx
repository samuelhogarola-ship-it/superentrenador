import { ArrowUpRight, CheckCircle2, Crown, Dumbbell, Flag, ShieldCheck, Store, UserRound, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "../../components/BrandMark";
import { MetricCard } from "../../components/MetricCard";
import { SectionTitle } from "../../components/SectionTitle";
import { useAdminState } from "../context/AdminStateContext";
import { formatDateTime } from "../../utils/format";

export function AdminPage() {
  const { state, approveVerification } = useAdminState();
  const pendingVerification = state.verificationRequests.find((entry) => entry.status === "pending");
  const proSubscriptions = state.subscription.plan === "free" ? 0 : 1;
  const marketplaceActiveUsers = state.activeUsers.filter((user) => user.area === "marketplace");
  const coachStudioActiveUsers = state.activeUsers.filter((user) => user.area === "coach-studio");
  const activeTrainers = state.activeUsers.filter((user) => user.role === "trainer");
  const activeClients = state.activeUsers.filter((user) => user.role === "user");

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <BrandMark />
        <p>Panel de control WF-Studio para revisar actividad y entrar en las vistas de Marketplace y Coach Studio.</p>
      </header>

      <main className="admin-main">
        <section className="metric-grid">
          <MetricCard
            label="Activos Marketplace"
            value={String(marketplaceActiveUsers.length)}
            meta={`${marketplaceActiveUsers.filter((user) => user.role === "trainer").length} entrenadores`}
            accent="teal"
            icon={<Store size={18} />}
          />
          <MetricCard
            label="Activos Coach Studio"
            value={String(coachStudioActiveUsers.length)}
            meta={`${coachStudioActiveUsers.filter((user) => user.role === "user").length} usuarios cliente`}
            accent="terracotta"
            icon={<Dumbbell size={18} />}
          />
          <MetricCard
            label="Paneles disponibles"
            value={String(state.panelAccesses.length)}
            meta="Usuario y entrenador"
            accent="gold"
            icon={<Users size={18} />}
          />
          <MetricCard
            label="Verificaciones pendientes"
            value={String(state.verificationRequests.filter((entry) => entry.status === "pending").length)}
            meta="Revisión manual"
            accent="gold"
            icon={<ShieldCheck size={18} />}
          />
        </section>

        <section className="admin-control-strip">
          <article>
            <span>Usuarios activos</span>
            <strong>{activeClients.length}</strong>
            <small>Con sesión reciente en Marketplace o Coach Studio</small>
          </article>
          <article>
            <span>Entrenadores activos</span>
            <strong>{activeTrainers.length}</strong>
            <small>Operando perfiles, clientes o rutinas</small>
          </article>
          <article>
            <span>PT Pro</span>
            <strong>{proSubscriptions}</strong>
            <small>Suscripción demo activa</small>
          </article>
        </section>

        <section className="surface-card">
          <SectionTitle
            title="Acceso a paneles"
            body="Entradas directas para comprobar cómo funciona cada experiencia desde la administración."
          />
          <div className="panel-access-grid">
            {state.panelAccesses.map((panel) => (
              <article key={panel.id} className="panel-access-card">
                <div className="panel-access-head">
                  <span className={`panel-badge panel-badge-${panel.area}`}>
                    {panel.area === "marketplace" ? "Marketplace" : "Coach Studio"}
                  </span>
                  <span>{panel.audience === "user" ? "Usuario" : "Entrenador"}</span>
                </div>
                <h3>{panel.title}</h3>
                <p>{panel.description}</p>
                <div className="panel-access-foot">
                  <small>{panel.activeUsers} activos</small>
                  <Link className="button button-outline" to={panel.path}>
                    Ver panel <ArrowUpRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-grid">
          <article className="surface-card">
            <SectionTitle
              title="Activos Marketplace"
              body="Usuarios y entrenadores con actividad reciente en búsqueda, perfiles, leads o visibilidad."
            />
            <div className="admin-user-list">
              {marketplaceActiveUsers.map((user) => (
                <div key={user.id} className="admin-user-row">
                  <div className="admin-user-main">
                    <span className="admin-user-icon">
                      {user.role === "trainer" ? <Crown size={17} /> : <UserRound size={17} />}
                    </span>
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                  </div>
                  <div className="admin-user-meta">
                    <span>{user.role === "trainer" ? "Entrenador" : "Usuario"}</span>
                    <small>{formatDateTime(user.lastSeenAt)}</small>
                  </div>
                  <Link className="icon-button" to={user.panelPath} aria-label={`Ver panel de ${user.name}`}>
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card">
            <SectionTitle
              title="Activos Coach Studio"
              body="Clientes y entrenadores trabajando con rutinas, nutrición, progreso y mensajes."
            />
            <div className="admin-user-list">
              {coachStudioActiveUsers.map((user) => (
                <div key={user.id} className="admin-user-row">
                  <div className="admin-user-main">
                    <span className="admin-user-icon">
                      {user.role === "trainer" ? <Crown size={17} /> : <UserRound size={17} />}
                    </span>
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </div>
                  </div>
                  <div className="admin-user-meta">
                    <span>{user.role === "trainer" ? "Entrenador" : "Usuario"}</span>
                    <small>{formatDateTime(user.lastSeenAt)}</small>
                  </div>
                  <Link className="icon-button" to={user.panelPath} aria-label={`Ver panel de ${user.name}`}>
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="admin-grid">
          <article className="surface-card">
            <SectionTitle
              title="Verificaciones"
              body="Revisión de documentos para activar la insignia y los beneficios de visibility."
            />
            {pendingVerification ? (
              <div className="verification-review">
                <strong>{state.trainer.displayName}</strong>
                <span>Enviado: {formatDateTime(pendingVerification.submittedAt)}</span>
                <ul className="feature-list">
                  {pendingVerification.documents.map((document) => (
                    <li key={document}>{document}</li>
                  ))}
                </ul>
                <button
                  className="button"
                  onClick={() => approveVerification(pendingVerification.id, "Nora Vidal")}
                >
                  Aprobar verificación
                </button>
              </div>
            ) : (
              <p className="empty-state-inline">No hay verificaciones pendientes.</p>
            )}
          </article>

          <article className="surface-card">
            <SectionTitle
              title="Leads y soporte"
              body="Visión rápida de la demanda, el origen de los contactos y la trazabilidad operativa."
            />
            <div className="timeline-list">
              {state.leads.map((lead) => (
                <div key={lead.id} className="timeline-entry">
                  <strong>{lead.name}</strong>
                  <span>
                    {lead.city} · {lead.source}
                  </span>
                  <p>{lead.message}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="surface-card">
            <SectionTitle
              title="Suscripciones y estado"
              body="Controles rápidos para revisar la monetización y los riesgos de abuso."
            />
            <div className="settings-list">
              <p>
                <CheckCircle2 size={18} /> PT actual en demo: {state.subscription.plan.toUpperCase()}
              </p>
              <p>
                <Flag size={18} /> Riesgo operativo monitorizado: almacenamiento de imágenes y churn de PT Free.
              </p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
