import { CheckCircle2, Crown, Flag, ShieldCheck, Users } from "lucide-react";
import { BrandMark } from "../../components/BrandMark";
import { MetricCard } from "../../components/MetricCard";
import { SectionTitle } from "../../components/SectionTitle";
import { useAdminState } from "../context/AdminStateContext";
import { formatDateTime } from "../../utils/format";

export function AdminPage() {
  const { state, approveVerification } = useAdminState();
  const pendingVerification = state.verificationRequests.find((entry) => entry.status === "pending");
  const proSubscriptions = state.subscription.plan === "free" ? 0 : 1;

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <BrandMark />
        <p>Consola de moderación, verificación y operaciones internas.</p>
      </header>

      <main className="admin-main">
        <section className="metric-grid">
          <MetricCard
            label="Entrenadores activos"
            value="148"
            meta="12 nuevos esta semana"
            accent="teal"
            icon={<Users size={18} />}
          />
          <MetricCard
            label="Verificaciones pendientes"
            value={String(state.verificationRequests.filter((entry) => entry.status === "pending").length)}
            meta="Revisión manual"
            accent="gold"
            icon={<ShieldCheck size={18} />}
          />
          <MetricCard
            label="Suscripciones PT Pro"
            value={String(proSubscriptions)}
            meta="Demo local"
            accent="terracotta"
            icon={<Crown size={18} />}
          />
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
