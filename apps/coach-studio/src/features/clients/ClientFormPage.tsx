import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Field } from '../../components/Field';
import { clientService } from '../../services/clientService';
import type { ClientInput, Goal, Level } from '../../types/domain';
import { calculateBmi, getBmiLabel } from '../../utils/bmi';
import { emptyClientForm } from './client-form-defaults';

const goals: Goal[] = ['ganar masa', 'adelgazar', 'mejorar rendimiento'];
const levels: Level[] = ['principiante', 'intermedio', 'avanzado'];

export function ClientFormPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<ClientInput>(emptyClientForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(clientId));

  useEffect(() => {
    if (!clientId) {
      return;
    }
    clientService
      .getClient(clientId)
      .then((client) => {
        if (client) {
          setForm({
            fullName: client.fullName,
            goal: client.goal,
            daysPerWeek: client.daysPerWeek,
            level: client.level,
            experience: client.experience,
            baseSport: client.baseSport,
            targetSport: client.targetSport,
            age: client.age,
            weightKg: client.weightKg,
            heightCm: client.heightCm,
            notes: client.notes,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [clientId]);

  const bmi = useMemo(() => calculateBmi(form.weightKg, form.heightCm), [form.weightKg, form.heightCm]);

  const updateField = <K extends keyof ClientInput>(key: K, value: ClientInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const saved = await clientService.saveClient(form, clientId);
      navigate(`/clientes/${saved.id}`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar el cliente.');
    }
  };

  if (loading) {
    return <div className="page-card">Cargando cliente...</div>;
  }

  return (
    <div className="stack-lg">
      <header className="page-header">
        <div>
          <p className="eyebrow">{clientId ? 'Editar cliente' : 'Nuevo cliente'}</p>
          <h1>Ficha base del cliente</h1>
        </div>
      </header>

      <form className="page-card grid-form" onSubmit={handleSubmit}>
        <Field label="Nombre del cliente" value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} required />
        <label className="field">
          <span>Objetivo</span>
          <select value={form.goal} onChange={(event) => updateField('goal', event.target.value as Goal)}>
            {goals.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </label>
        <Field label="Dias por semana" type="number" min={1} max={7} value={form.daysPerWeek} onChange={(event) => updateField('daysPerWeek', Number(event.target.value))} required />
        <label className="field">
          <span>Nivel</span>
          <select value={form.level} onChange={(event) => updateField('level', event.target.value as Level)}>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        <Field label="Experiencia" value={form.experience} onChange={(event) => updateField('experience', event.target.value)} />
        <Field label="Deporte base" value={form.baseSport} onChange={(event) => updateField('baseSport', event.target.value)} />
        <Field label="Deporte objetivo" value={form.targetSport} onChange={(event) => updateField('targetSport', event.target.value)} />
        <Field label="Edad" type="number" min={0} value={form.age ?? ''} onChange={(event) => updateField('age', event.target.value ? Number(event.target.value) : null)} />
        <Field label="Peso (kg)" type="number" step="0.1" value={form.weightKg ?? ''} onChange={(event) => updateField('weightKg', event.target.value ? Number(event.target.value) : null)} />
        <Field label="Altura (cm)" type="number" step="0.1" value={form.heightCm ?? ''} onChange={(event) => updateField('heightCm', event.target.value ? Number(event.target.value) : null)} />
        <Field label="Notas" as="textarea" rows={5} value={form.notes} onChange={(event) => updateField('notes', event.target.value)} />

        <div className="metric-card">
          <p className="eyebrow">IMC automatico</p>
          <strong>{bmi ?? '--'}</strong>
          <span>{getBmiLabel(bmi)}</span>
        </div>

        {error ? <p className="error-text form-message">{error}</p> : null}
        <button className="primary-button" type="submit">
          Guardar cliente
        </button>
      </form>
    </div>
  );
}
