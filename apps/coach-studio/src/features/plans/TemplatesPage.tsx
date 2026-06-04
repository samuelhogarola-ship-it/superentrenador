import { useEffect, useState } from 'react';
import { templateService } from '../../services/templateService';
import type { WorkoutTemplate } from '../../types/domain';

export function TemplatesPage() {
  const [globalTemplates, setGlobalTemplates] = useState<WorkoutTemplate[]>([]);
  const [privateTemplates, setPrivateTemplates] = useState<WorkoutTemplate[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([templateService.listGlobalTemplates(), templateService.listPrivateTemplates()]).then(
      ([globals, privates]) => {
        setGlobalTemplates(globals);
        setPrivateTemplates(privates);
      },
    );
  }, []);

  const handleClone = async (template: WorkoutTemplate) => {
    const copy = await templateService.cloneGlobalTemplate(template);
    setPrivateTemplates((current) => [copy, ...current]);
    setMessage(`Se ha creado una copia privada de "${template.name}".`);
  };

  return (
    <div className="stack-lg">
      <header className="page-header">
        <div>
          <p className="eyebrow">Plantillas</p>
          <h1>Biblioteca global y privada</h1>
          <p>Las globales son solo lectura; cualquier personalizacion crea una copia propia.</p>
        </div>
      </header>

      {message ? <div className="notice success">{message}</div> : null}

      <section className="details-grid">
        <article className="page-card">
          <h2>Plantillas globales</h2>
          <div className="stack">
            {globalTemplates.map((template) => (
              <div className="template-row" key={template.id}>
                <div>
                  <strong>{template.name}</strong>
                  <p>{template.goal} · {template.level} · {template.daysPerWeek} dias</p>
                </div>
                <button className="secondary-button" type="button" onClick={() => handleClone(template)}>
                  Crear copia editable
                </button>
              </div>
            ))}
          </div>
        </article>

        <article className="page-card">
          <h2>Plantillas privadas</h2>
          <div className="stack">
            {privateTemplates.length === 0 ? <p>No has creado copias privadas aun.</p> : null}
            {privateTemplates.map((template) => (
              <div className="template-row" key={template.id}>
                <div>
                  <strong>{template.name}</strong>
                  <p>{template.goal} · {template.level} · {template.daysPerWeek} dias</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
