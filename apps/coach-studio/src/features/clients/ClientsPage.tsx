import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clientService } from '../../services/clientService';
import type { Client } from '../../types/domain';

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clientService.listClients().then(setClients).finally(() => setLoading(false));
  }, []);

  return (
    <div className="stack-lg">
      <header className="page-header">
        <div>
          <p className="eyebrow">Clientes</p>
          <h1>Base de clientes del entrenador</h1>
          <p>Gestiona fichas, rutinas y PDF de forma centralizada.</p>
        </div>
        <Link className="primary-button" to="/clientes/nuevo">
          Nuevo cliente
        </Link>
      </header>

      <section className="page-card">
        {loading ? (
          <p>Cargando clientes...</p>
        ) : clients.length === 0 ? (
          <div className="empty-state">
            <strong>Aun no hay clientes creados.</strong>
            <p>Crea el primero para generar una rutina determinista y exportarla en A4.</p>
          </div>
        ) : (
          <div className="client-grid">
            {clients.map((client) => (
              <article className="client-card" key={client.id}>
                <p className="client-goal">{client.goal}</p>
                <h3>{client.fullName}</h3>
                <p>
                  {client.daysPerWeek} dias · {client.level}
                </p>
                <div className="client-card-actions">
                  <Link to={`/clientes/${client.id}`}>Ver ficha</Link>
                  <Link to={`/clientes/${client.id}/rutina`}>Rutina</Link>
                  <Link to={`/clientes/${client.id}/imprimir`}>PDF</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
