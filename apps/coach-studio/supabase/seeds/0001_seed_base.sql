insert into public.exercise_library (name, muscle_group, movement_pattern, equipment, level, exercise_type)
values
  ('Sentadilla goblet', 'Piernas', 'Dominante de rodilla', 'Mancuerna', 'principiante', 'fuerza'),
  ('Peso muerto rumano', 'Cadena posterior', 'Dominante de cadera', 'Barra', 'intermedio', 'fuerza'),
  ('Remo con mancuerna', 'Espalda', 'Tiron horizontal', 'Mancuerna', 'principiante', 'fuerza'),
  ('Press banca con mancuernas', 'Pecho', 'Empuje horizontal', 'Mancuernas', 'principiante', 'fuerza'),
  ('Plancha frontal', 'Core', 'Anti-extension', 'Peso corporal', 'principiante', 'movilidad'),
  ('Bicicleta estatica', 'Cardio', 'Ciclico', 'Bicicleta', 'principiante', 'cardio'),
  ('Zancadas caminando', 'Piernas', 'Unilateral', 'Mancuernas', 'intermedio', 'fuerza'),
  ('Face pull', 'Hombro posterior', 'Tiron horizontal', 'Polea', 'intermedio', 'fuerza'),
  ('Movilidad toracica', 'Movilidad', 'Rotacion', 'Peso corporal', 'principiante', 'movilidad')
on conflict do nothing;

insert into public.workout_templates_global (name, goal, level, days_per_week, description, template_data)
values
  (
    'Masa 3 dias principiante',
    'ganar masa',
    'principiante',
    3,
    'Base full body con enfasis en tecnica y volumen moderado.',
    '[
      {"dayNumber":1,"title":"Dia 1 · Full body","notes":"Semana 1 orientada a sensaciones.","blocks":[
        {"blockType":"simple","sortOrder":1,"exerciseNameSnapshot":"Sentadilla goblet","sets":"4","reps":"8-10","rpe":"7","loadMode":"rpe","comments":"Control tecnico."},
        {"blockType":"simple","sortOrder":2,"exerciseNameSnapshot":"Press banca con mancuernas","sets":"4","reps":"8-10","rpe":"7","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":3,"exerciseNameSnapshot":"Remo con mancuerna","sets":"4","reps":"10","rpe":"7","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":4,"exerciseNameSnapshot":"Plancha frontal","sets":"3","reps":"30-40 s","rpe":"6","loadMode":"none"}
      ]},
      {"dayNumber":2,"title":"Dia 2 · Tren inferior + core","notes":"Sin buscar cargas maximas.","blocks":[
        {"blockType":"simple","sortOrder":1,"exerciseNameSnapshot":"Peso muerto rumano","sets":"4","reps":"8","rpe":"7","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":2,"exerciseNameSnapshot":"Zancadas caminando","sets":"3","reps":"10 por lado","rpe":"7","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":3,"exerciseNameSnapshot":"Plancha frontal","sets":"3","reps":"40 s","rpe":"6","loadMode":"none"}
      ]},
      {"dayNumber":3,"title":"Dia 3 · Full body + cardio","notes":"Cierre con acondicionamiento suave.","blocks":[
        {"blockType":"simple","sortOrder":1,"exerciseNameSnapshot":"Press banca con mancuernas","sets":"4","reps":"8","rpe":"7","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":2,"exerciseNameSnapshot":"Remo con mancuerna","sets":"4","reps":"10","rpe":"7","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":3,"exerciseNameSnapshot":"Bicicleta estatica","sets":"1","reps":"12 min","rpe":"6","loadMode":"none","comments":"Ritmo sostenido."}
      ]}
    ]'::jsonb
  ),
  (
    'Definicion 1 dia principiante',
    'adelgazar',
    'principiante',
    1,
    'Sesion total body con cardio final.',
    '[
      {"dayNumber":1,"title":"Dia 1 · Circuito base","notes":"Buscar continuidad y ritmo.","blocks":[
        {"blockType":"simple","sortOrder":1,"exerciseNameSnapshot":"Sentadilla goblet","sets":"3","reps":"12","rpe":"7","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":2,"exerciseNameSnapshot":"Remo con mancuerna","sets":"3","reps":"12","rpe":"7","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":3,"exerciseNameSnapshot":"Bicicleta estatica","sets":"1","reps":"15 min","rpe":"7","loadMode":"none"}
      ]}
    ]'::jsonb
  ),
  (
    'Rendimiento 5 dias intermedio',
    'mejorar rendimiento',
    'intermedio',
    5,
    'Microciclo con fuerza, potencia y acondicionamiento.',
    '[
      {"dayNumber":1,"title":"Dia 1 · Rendimiento","blocks":[
        {"blockType":"simple","sortOrder":1,"exerciseNameSnapshot":"Peso muerto rumano","sets":"4","reps":"6","rpe":"7-8","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":2,"exerciseNameSnapshot":"Press banca con mancuernas","sets":"4","reps":"6-8","rpe":"7","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":3,"exerciseNameSnapshot":"Bicicleta estatica","sets":"1","reps":"10 min","rpe":"6","loadMode":"none"}
      ]},
      {"dayNumber":2,"title":"Dia 2 · Rendimiento","blocks":[
        {"blockType":"simple","sortOrder":1,"exerciseNameSnapshot":"Zancadas caminando","sets":"4","reps":"8 por lado","rpe":"7","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":2,"exerciseNameSnapshot":"Face pull","sets":"3","reps":"12","rpe":"6","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":3,"exerciseNameSnapshot":"Movilidad toracica","sets":"2","reps":"8","rpe":"5","loadMode":"none"}
      ]},
      {"dayNumber":3,"title":"Dia 3 · Rendimiento","blocks":[
        {"blockType":"simple","sortOrder":1,"exerciseNameSnapshot":"Peso muerto rumano","sets":"3","reps":"5","rpe":"8","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":2,"exerciseNameSnapshot":"Remo con mancuerna","sets":"4","reps":"8","rpe":"7","loadMode":"rpe"}
      ]},
      {"dayNumber":4,"title":"Dia 4 · Rendimiento","blocks":[
        {"blockType":"simple","sortOrder":1,"exerciseNameSnapshot":"Press banca con mancuernas","sets":"4","reps":"6","rpe":"7","loadMode":"rpe"},
        {"blockType":"simple","sortOrder":2,"exerciseNameSnapshot":"Face pull","sets":"3","reps":"15","rpe":"6","loadMode":"rpe"}
      ]},
      {"dayNumber":5,"title":"Dia 5 · Rendimiento","blocks":[
        {"blockType":"simple","sortOrder":1,"exerciseNameSnapshot":"Bicicleta estatica","sets":"1","reps":"20 min","rpe":"6","loadMode":"none"},
        {"blockType":"simple","sortOrder":2,"exerciseNameSnapshot":"Movilidad toracica","sets":"2","reps":"10","rpe":"5","loadMode":"none"}
      ]}
    ]'::jsonb
  )
on conflict do nothing;
