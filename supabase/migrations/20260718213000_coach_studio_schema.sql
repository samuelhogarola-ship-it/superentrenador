-- Coach Studio private schema. Namespaced to avoid collisions with marketplace tables.
-- Uses the same auth.users identities as superentrenador.com.

create extension if not exists "pgcrypto";

create or replace function public.set_coach_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.coach_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  business_name text not null,
  logo_path text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.coach_clients (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  full_name text not null,
  goal text not null check (goal in ('ganar masa', 'adelgazar', 'mejorar rendimiento')),
  days_per_week int not null check (days_per_week between 1 and 7),
  level text not null check (level in ('principiante', 'intermedio', 'avanzado')),
  experience text default '',
  base_sport text default '',
  target_sport text default '',
  age int check (age is null or age >= 0),
  weight_kg numeric(5,2),
  height_cm numeric(5,2),
  bmi numeric(4,1),
  notes text default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.coach_exercise_library (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_group text not null,
  movement_pattern text not null,
  equipment text not null,
  level text not null check (level in ('principiante', 'intermedio', 'avanzado')),
  exercise_type text not null check (exercise_type in ('fuerza', 'cardio', 'movilidad')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.coach_workout_templates_global (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  goal text not null check (goal in ('ganar masa', 'adelgazar', 'mejorar rendimiento')),
  level text not null check (level in ('principiante', 'intermedio', 'avanzado')),
  days_per_week int not null check (days_per_week between 1 and 7),
  description text default '',
  template_data jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.coach_workout_templates_private (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  source_global_template_id uuid references public.coach_workout_templates_global (id) on delete set null,
  name text not null,
  goal text not null check (goal in ('ganar masa', 'adelgazar', 'mejorar rendimiento')),
  level text not null check (level in ('principiante', 'intermedio', 'avanzado')),
  days_per_week int not null check (days_per_week between 1 and 7),
  description text default '',
  template_data jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.coach_training_plans (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  client_id uuid not null references public.coach_clients (id) on delete cascade,
  name text not null,
  goal text not null check (goal in ('ganar masa', 'adelgazar', 'mejorar rendimiento')),
  level text not null check (level in ('principiante', 'intermedio', 'avanzado')),
  days_per_week int not null check (days_per_week between 1 and 7),
  status text not null default 'draft' check (status in ('draft', 'active')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.coach_training_plan_days (
  id uuid primary key default gen_random_uuid(),
  training_plan_id uuid not null references public.coach_training_plans (id) on delete cascade,
  day_number int not null check (day_number between 1 and 7),
  title text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (training_plan_id, day_number)
);

create table if not exists public.coach_exercise_blocks (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.coach_training_plan_days (id) on delete cascade,
  block_type text not null check (block_type in ('simple', 'compound')),
  parent_block_id uuid references public.coach_exercise_blocks (id) on delete cascade,
  sort_order int not null check (sort_order between 1 and 12),
  exercise_id uuid references public.coach_exercise_library (id) on delete set null,
  exercise_name_snapshot text not null,
  sets text,
  reps text,
  rpe text,
  load_mode text not null default 'none' check (load_mode in ('none', 'rpe', 'percent_rm', 'free_load')),
  load_value text,
  comments text,
  exercise_category text,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.enforce_coach_max_12_blocks()
returns trigger
language plpgsql
as $$
declare
  block_count int;
begin
  select count(*) into block_count
  from public.coach_exercise_blocks
  where day_id = new.day_id;

  if tg_op = 'INSERT' then
    block_count := block_count + 1;
  end if;

  if block_count > 12 then
    raise exception 'Maximo 12 ejercicios por dia';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_coach_max_12_blocks on public.coach_exercise_blocks;
create trigger trg_enforce_coach_max_12_blocks
before insert on public.coach_exercise_blocks
for each row
execute function public.enforce_coach_max_12_blocks();

drop trigger if exists trg_coach_profiles_updated_at on public.coach_profiles;
create trigger trg_coach_profiles_updated_at
before update on public.coach_profiles
for each row execute function public.set_coach_updated_at();

drop trigger if exists trg_coach_clients_updated_at on public.coach_clients;
create trigger trg_coach_clients_updated_at
before update on public.coach_clients
for each row execute function public.set_coach_updated_at();

drop trigger if exists trg_coach_workout_templates_private_updated_at on public.coach_workout_templates_private;
create trigger trg_coach_workout_templates_private_updated_at
before update on public.coach_workout_templates_private
for each row execute function public.set_coach_updated_at();

drop trigger if exists trg_coach_training_plans_updated_at on public.coach_training_plans;
create trigger trg_coach_training_plans_updated_at
before update on public.coach_training_plans
for each row execute function public.set_coach_updated_at();

alter table public.coach_profiles enable row level security;
alter table public.coach_clients enable row level security;
alter table public.coach_exercise_library enable row level security;
alter table public.coach_workout_templates_global enable row level security;
alter table public.coach_workout_templates_private enable row level security;
alter table public.coach_training_plans enable row level security;
alter table public.coach_training_plan_days enable row level security;
alter table public.coach_exercise_blocks enable row level security;

create policy "trainer profile own rows"
on public.coach_profiles
for all
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "clients own rows"
on public.coach_clients
for all
to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

create policy "exercise library readable"
on public.coach_exercise_library
for select
to authenticated
using (true);

create policy "global templates readable"
on public.coach_workout_templates_global
for select
to authenticated
using (true);

create policy "private templates own rows"
on public.coach_workout_templates_private
for all
to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

create policy "training plans own rows"
on public.coach_training_plans
for all
to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

create policy "training plan days via own plan"
on public.coach_training_plan_days
for all
to authenticated
using (
  exists (
    select 1
    from public.coach_training_plans plan
    where plan.id = training_plan_id
      and plan.trainer_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.coach_training_plans plan
    where plan.id = training_plan_id
      and plan.trainer_id = auth.uid()
  )
);

create policy "exercise blocks via own day"
on public.coach_exercise_blocks
for all
to authenticated
using (
  exists (
    select 1
    from public.coach_training_plan_days day
    join public.coach_training_plans plan on plan.id = day.training_plan_id
    where day.id = day_id
      and plan.trainer_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.coach_training_plan_days day
    join public.coach_training_plans plan on plan.id = day.training_plan_id
    where day.id = day_id
      and plan.trainer_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values ('coach-logos', 'coach-logos', true)
on conflict (id) do nothing;

create policy "trainer logos read"
on storage.objects
for select
to authenticated
using (bucket_id = 'coach-logos');

create policy "trainer logos own upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'coach-logos'
  and auth.uid()::text = split_part(name, '/', 1)
);

create policy "trainer logos own update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'coach-logos'
  and auth.uid()::text = split_part(name, '/', 1)
)
with check (
  bucket_id = 'coach-logos'
  and auth.uid()::text = split_part(name, '/', 1)
);

-- Data API access is explicit; RLS remains the ownership boundary.
grant select, insert, update, delete on public.coach_profiles to authenticated;
grant select, insert, update, delete on public.coach_clients to authenticated;
grant select on public.coach_exercise_library to authenticated;
grant select on public.coach_workout_templates_global to authenticated;
grant select, insert, update, delete on public.coach_workout_templates_private to authenticated;
grant select, insert, update, delete on public.coach_training_plans to authenticated;
grant select, insert, update, delete on public.coach_training_plan_days to authenticated;
grant select, insert, update, delete on public.coach_exercise_blocks to authenticated;

revoke execute on function public.set_coach_updated_at() from public, anon, authenticated;
revoke execute on function public.enforce_coach_max_12_blocks() from public, anon, authenticated;


-- Initial exercise library and deterministic templates.
insert into public.coach_exercise_library (name, muscle_group, movement_pattern, equipment, level, exercise_type)
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
insert into public.coach_workout_templates_global (name, goal, level, days_per_week, description, template_data)
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
