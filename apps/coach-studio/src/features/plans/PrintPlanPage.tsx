import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { clientService } from '../../services/clientService';
import { planService } from '../../services/planService';
import type { Client, TrainingPlan } from '../../types/domain';

export function PrintPlanPage() {
  const { clientId = '' } = useParams();
  const { profile } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);

  useEffect(() => {
    clientService.getClient(clientId).then(setClient);
    planService.getPlanByClient(clientId).then(setPlan);
  }, [clientId]);

  if (!client || !plan || !profile) {
    return <div className="page-card">Preparando vista imprimible...</div>;
  }

  return (
    <div className="print-wrap">
      <div className="button-row no-print">
        <button className="primary-button" type="button" onClick={() => window.print()}>
          Imprimir / Guardar como PDF
        </button>
      </div>

      <article className="print-page">
        <header className="print-header">
          <div className="print-brand">
            {profile.logoUrl ? <img src={profile.logoUrl} alt={profile.businessName} className="print-logo" /> : <div className="logo-fallback">{profile.businessName.slice(0, 2).toUpperCase()}</div>}
            <div>
              <p className="eyebrow">Plan de entrenamiento</p>
              <h1>{profile.businessName}</h1>
              <p>{profile.fullName}</p>
            </div>
          </div>
          <div className="print-meta">
            <strong>{client.fullName}</strong>
            <span>{client.goal}</span>
            <span>{client.daysPerWeek} dias / semana</span>
          </div>
        </header>

        <section className="print-summary">
          <div>
            <span>Nivel</span>
            <strong>{client.level}</strong>
          </div>
          <div>
            <span>Deporte base</span>
            <strong>{client.baseSport || 'General'}</strong>
          </div>
          <div>
            <span>Objetivo</span>
            <strong>{client.targetSport || client.goal}</strong>
          </div>
        </section>

        {plan.days.map((day) => (
          <section className="print-day" key={day.id}>
            <div className="print-day-head">
              <h2>{day.title}</h2>
              <p>{day.notes}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Ejercicio</th>
                  <th>Series</th>
                  <th>Reps</th>
                  <th>RPE / Carga</th>
                  <th>Comentario</th>
                </tr>
              </thead>
              <tbody>
                {day.blocks.map((block) => (
                  <tr key={block.id}>
                    <td>{block.exerciseNameSnapshot}</td>
                    <td>{block.sets || '-'}</td>
                    <td>{block.reps || '-'}</td>
                    <td>{block.loadValue || block.rpe || '-'}</td>
                    <td>{block.comments || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </article>
    </div>
  );
}
