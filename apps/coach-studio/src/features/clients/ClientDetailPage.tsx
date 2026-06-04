import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import type { Client } from '../../types/domain';
import { getBmiLabel } from '../../utils/bmi';

export function ClientDetailPage() {
  const { clientId = '' } = useParams();
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    clientService.getClient(clientId).then(setClient);
  }, [clientId]);

  if (!client) {
    return <div className="page-card">Cargando ficha del cliente...</div>;
  }

  return (
    <div className="stack-lg">
      <header className="page-header">
        <div>
          <p className="eyebrow">Ficha de cliente</p>
          <h1>{client.fullName}</h1>
          <p>
            {client.goal} · {client.daysPerWeek} dias · {client.level}
          </p>
        </div>
        <div className="button-row">
          <Link className="secondary-button" to={`/clientes/${client.id}/editar`}>
            Editar ficha
          </Link>
          <Link className="primary-button" to={`/clientes/${client.id}/rutina`}>
            Abrir rutina
          </Link>
        </div>
      </header>

      <section className="details-grid">
        <article className="page-card">
          <h2>Estado actual</h2>
          <ul className="facts-list">
            <li>IMC: {client.bmi ?? '--'} · {getBmiLabel(client.bmi)}</li>
            <li>Edad: {client.age ?? 'No indicada'}</li>
            <li>Peso: {client.weightKg ?? 'No indicado'} kg</li>
            <li>Altura: {client.heightCm ?? 'No indicada'} cm</li>
          </ul>
        </article>
        <article className="page-card">
          <h2>Objetivos y contexto</h2>
          <ul className="facts-list">
            <li>Experiencia: {client.experience || 'Sin detalle'}</li>
            <li>Deporte base: {client.baseSport || 'Sin detalle'}</li>
            <li>Deporte objetivo: {client.targetSport || 'Sin detalle'}</li>
            <li>Notas: {client.notes || 'Sin notas'}</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
