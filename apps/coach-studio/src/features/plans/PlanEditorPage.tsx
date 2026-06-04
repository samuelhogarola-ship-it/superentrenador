import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { demoExercises } from '../../lib/demo-data';
import { clientService } from '../../services/clientService';
import { planService } from '../../services/planService';
import { templateService } from '../../services/templateService';
import type { Client, ExerciseBlockInput, TrainingPlanInput, WorkoutTemplate } from '../../types/domain';
import { buildPlanFromTemplate, pickBestTemplate, validateDayBlockLimit } from '../../utils/plan-generator';

function createEmptyBlock(sortOrder: number): ExerciseBlockInput {
  return {
    blockType: 'simple',
    sortOrder,
    exerciseNameSnapshot: '',
    loadMode: 'rpe',
    sets: '',
    reps: '',
    rpe: '',
    comments: '',
    exerciseCategory: 'auto',
  };
}

function getVisualMeta(block: ExerciseBlockInput) {
  const source = `${block.exerciseCategory ?? ''} ${block.exerciseNameSnapshot}`.toLowerCase();

  if (source.includes('cardio') || source.includes('bicicleta')) {
    return { icon: 'C', label: 'Cardio' };
  }
  if (source.includes('movilidad')) {
    return { icon: 'M', label: 'Movilidad' };
  }
  if (source.includes('core') || source.includes('plancha')) {
    return { icon: 'K', label: 'Core' };
  }
  return { icon: 'F', label: 'Fuerza' };
}

export function PlanEditorPage() {
  const { clientId = '' } = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [plan, setPlan] = useState<TrainingPlanInput | null>(null);
  const [existingPlanId, setExistingPlanId] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([clientService.getClient(clientId), templateService.listGlobalTemplates(), planService.getPlanByClient(clientId)]).then(
      ([nextClient, globalTemplates, existingPlan]) => {
        setClient(nextClient);
        setTemplates(globalTemplates);
        if (existingPlan) {
          setExistingPlanId(existingPlan.id);
          setPlan({
            clientId: existingPlan.clientId,
            name: existingPlan.name,
            goal: existingPlan.goal,
            level: existingPlan.level,
            daysPerWeek: existingPlan.daysPerWeek,
            status: existingPlan.status,
            days: existingPlan.days.map((day) => ({
              id: day.id,
              dayNumber: day.dayNumber,
              title: day.title,
              notes: day.notes,
              blocks: day.blocks.map((block) => ({
                id: block.id,
                blockType: block.blockType,
                parentBlockId: block.parentBlockId,
                sortOrder: block.sortOrder,
                exerciseId: block.exerciseId,
                exerciseNameSnapshot: block.exerciseNameSnapshot,
                sets: block.sets,
                reps: block.reps,
                rpe: block.rpe,
                loadMode: block.loadMode,
                loadValue: block.loadValue,
                comments: block.comments,
                exerciseCategory: block.exerciseCategory,
              })),
            })),
          });
        }
      },
    );
  }, [clientId]);

  const bestTemplate = useMemo(() => {
    if (!client) {
      return null;
    }
    return pickBestTemplate(templates, client.goal, client.level, client.daysPerWeek);
  }, [client, templates]);

  const handleGenerate = () => {
    if (!client || !bestTemplate) {
      setError('No hay una plantilla disponible para este perfil.');
      return;
    }
    setPlan(buildPlanFromTemplate(bestTemplate, client.id));
    setError(null);
    setMessage(`Rutina generada desde la plantilla "${bestTemplate.name}".`);
  };

  const updateBlock = (dayIndex: number, blockIndex: number, field: keyof ExerciseBlockInput, value: string) => {
    setPlan((current) => {
      if (!current) {
        return current;
      }
      const next = structuredClone(current);
      const targetBlock = next.days[dayIndex].blocks[blockIndex];
      (targetBlock[field] as string | null | undefined) = value;
      return next;
    });
  };

  const addBlock = (dayIndex: number) => {
    setPlan((current) => {
      if (!current) {
        return current;
      }
      const next = structuredClone(current);
      const day = next.days[dayIndex];
      if (!validateDayBlockLimit(day.blocks.length + 1)) {
        setError('Cada dia admite un maximo de 12 ejercicios.');
        return current;
      }
      day.blocks.push(createEmptyBlock(day.blocks.length + 1));
      return next;
    });
  };

  const savePlan = async () => {
    if (!plan) {
      return;
    }
    try {
      await planService.savePlan(plan, existingPlanId);
      setMessage('Rutina guardada correctamente.');
      setError(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar la rutina.');
    }
  };

  if (!client) {
    return <div className="page-card">Cargando contexto de rutina...</div>;
  }

  return (
    <div className="stack-lg">
      <header className="page-header">
        <div>
          <p className="eyebrow">Generador y editor</p>
          <h1>Rutina de {client.fullName}</h1>
          <p>{client.goal} · {client.level} · {client.daysPerWeek} dias por semana</p>
        </div>
        <div className="button-row">
          <button className="secondary-button" type="button" onClick={handleGenerate}>
            Generar rutina inicial
          </button>
          <Link className="primary-button" to={`/clientes/${client.id}/imprimir`}>
            Vista PDF
          </Link>
        </div>
      </header>

      {message ? <div className="notice success">{message}</div> : null}
      {error ? <div className="notice error">{error}</div> : null}

      {!plan ? (
        <section className="page-card">
          <p>No hay una rutina creada todavia.</p>
          <p>
            La plantilla sugerida es <strong>{bestTemplate?.name ?? 'ninguna'}</strong>.
          </p>
        </section>
      ) : (
        <>
          {plan.days.map((day, dayIndex) => (
            <section className="page-card" key={day.dayNumber}>
              <div className="day-header">
                <div>
                  <p className="eyebrow">Dia {day.dayNumber}</p>
                  <h2>{day.title}</h2>
                </div>
                <button className="ghost-button" type="button" onClick={() => addBlock(dayIndex)}>
                  Anadir ejercicio
                </button>
              </div>

              <div className="plan-blocks">
                <div className="plan-table-head">
                  <span>Visual</span>
                  <span>Ejercicio</span>
                  <span>Series</span>
                  <span>Reps</span>
                  <span>RPE / Carga</span>
                  <span>Comentario</span>
                </div>
                {day.blocks.map((block, blockIndex) => (
                  <div className="plan-row" key={`${day.dayNumber}-${blockIndex}`}>
                    <div className="plan-visual-cell">
                      <div className="exercise-thumb" title={getVisualMeta(block).label}>
                        {getVisualMeta(block).icon}
                      </div>
                      <select
                        value={block.exerciseCategory ?? 'auto'}
                        onChange={(event) => updateBlock(dayIndex, blockIndex, 'exerciseCategory', event.target.value)}
                      >
                        <option value="auto">Auto</option>
                        <option value="fuerza">Fuerza</option>
                        <option value="cardio">Cardio</option>
                        <option value="movilidad">Movilidad</option>
                        <option value="core">Core</option>
                      </select>
                    </div>
                    <input
                      list="exercise-suggestions"
                      value={block.exerciseNameSnapshot}
                      onChange={(event) => updateBlock(dayIndex, blockIndex, 'exerciseNameSnapshot', event.target.value)}
                      placeholder="Ejercicio"
                    />
                    <input
                      value={block.sets ?? ''}
                      onChange={(event) => updateBlock(dayIndex, blockIndex, 'sets', event.target.value)}
                      placeholder="Series"
                    />
                    <input
                      value={block.reps ?? ''}
                      onChange={(event) => updateBlock(dayIndex, blockIndex, 'reps', event.target.value)}
                      placeholder="Reps"
                    />
                    <input
                      value={block.rpe ?? ''}
                      onChange={(event) => updateBlock(dayIndex, blockIndex, 'rpe', event.target.value)}
                      placeholder="RPE"
                    />
                    <input
                      value={block.comments ?? ''}
                      onChange={(event) => updateBlock(dayIndex, blockIndex, 'comments', event.target.value)}
                      placeholder="Comentario"
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}

          <datalist id="exercise-suggestions">
            {demoExercises.map((exercise) => (
              <option key={exercise.id} value={exercise.name} />
            ))}
          </datalist>

          <div className="button-row">
            <button className="primary-button" type="button" onClick={savePlan}>
              Guardar rutina
            </button>
          </div>
        </>
      )}
    </div>
  );
}
