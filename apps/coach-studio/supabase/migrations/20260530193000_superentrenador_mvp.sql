create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.trainer_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  business_name text not null,
  logo_path text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.clients (
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

create table if not exists public.exercise_library (
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

create table if not exists public.workout_templates_global (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  goal text not null check (goal in ('ganar masa', 'adelgazar', 'mejorar rendimiento')),
  level text not null check (level in ('principiante', 'intermedio', 'avanzado')),
  days_per_week int not null check (days_per_week between 1 and 7),
  description text default '',
  template_data jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_templates_private (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  source_global_template_id uuid references public.workout_templates_global (id) on delete set null,
  name text not null,
  goal text not null check (goal in ('ganar masa', 'adelgazar', 'mejorar rendimiento')),
  level text not null check (level in ('principiante', 'intermedio', 'avanzado')),
  days_per_week int not null check (days_per_week between 1 and 7),
  description text default '',
  template_data jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.training_plans (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  goal text not null check (goal in ('ganar masa', 'adelgazar', 'mejorar rendimiento')),
  level text not null check (level in ('principiante', 'intermedio', 'avanzado')),
  days_per_week int not null check (days_per_week between 1 and 7),
  status text not null default 'draft' check (status in ('draft', 'active')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.training_plan_days (
  id uuid primary key default gen_random_uuid(),
  training_plan_id uuid not null references public.training_plans (id) on delete cascade,
  day_number int not null check (day_number between 1 and 7),
  title text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (training_plan_id, day_number)
);

create table if not exists public.exercise_blocks (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.training_plan_days (id) on delete cascade,
  block_type text not null check (block_type in ('simple', 'compound')),
  parent_block_id uuid references public.exercise_blocks (id) on delete cascade,
  sort_order int not null check (sort_order between 1 and 12),
  exercise_id uuid references public.exercise_library (id) on delete set null,
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

create or replace function public.enforce_max_12_blocks()
returns trigger
language plpgsql
as $$
declare
  block_count int;
begin
  select count(*) into block_count
  from public.exercise_blocks
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

drop trigger if exists trg_enforce_max_12_blocks on public.exercise_blocks;
create trigger trg_enforce_max_12_blocks
before insert on public.exercise_blocks
for each row
execute function public.enforce_max_12_blocks();

drop trigger if exists trg_trainer_profiles_updated_at on public.trainer_profiles;
create trigger trg_trainer_profiles_updated_at
before update on public.trainer_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_clients_updated_at on public.clients;
create trigger trg_clients_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists trg_workout_templates_private_updated_at on public.workout_templates_private;
create trigger trg_workout_templates_private_updated_at
before update on public.workout_templates_private
for each row execute function public.set_updated_at();

drop trigger if exists trg_training_plans_updated_at on public.training_plans;
create trigger trg_training_plans_updated_at
before update on public.training_plans
for each row execute function public.set_updated_at();

alter table public.trainer_profiles enable row level security;
alter table public.clients enable row level security;
alter table public.exercise_library enable row level security;
alter table public.workout_templates_global enable row level security;
alter table public.workout_templates_private enable row level security;
alter table public.training_plans enable row level security;
alter table public.training_plan_days enable row level security;
alter table public.exercise_blocks enable row level security;

create policy "trainer profile own rows"
on public.trainer_profiles
for all
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "clients own rows"
on public.clients
for all
to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

create policy "exercise library readable"
on public.exercise_library
for select
to authenticated
using (true);

create policy "global templates readable"
on public.workout_templates_global
for select
to authenticated
using (true);

create policy "private templates own rows"
on public.workout_templates_private
for all
to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

create policy "training plans own rows"
on public.training_plans
for all
to authenticated
using (trainer_id = auth.uid())
with check (trainer_id = auth.uid());

create policy "training plan days via own plan"
on public.training_plan_days
for all
to authenticated
using (
  exists (
    select 1
    from public.training_plans plan
    where plan.id = training_plan_id
      and plan.trainer_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.training_plans plan
    where plan.id = training_plan_id
      and plan.trainer_id = auth.uid()
  )
);

create policy "exercise blocks via own day"
on public.exercise_blocks
for all
to authenticated
using (
  exists (
    select 1
    from public.training_plan_days day
    join public.training_plans plan on plan.id = day.training_plan_id
    where day.id = day_id
      and plan.trainer_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.training_plan_days day
    join public.training_plans plan on plan.id = day.training_plan_id
    where day.id = day_id
      and plan.trainer_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values ('trainer-logos', 'trainer-logos', true)
on conflict (id) do nothing;

create policy "trainer logos read"
on storage.objects
for select
to authenticated
using (bucket_id = 'trainer-logos');

create policy "trainer logos own upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'trainer-logos'
  and auth.uid()::text = split_part(name, '/', 1)
);

create policy "trainer logos own update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'trainer-logos'
  and auth.uid()::text = split_part(name, '/', 1)
)
with check (
  bucket_id = 'trainer-logos'
  and auth.uid()::text = split_part(name, '/', 1)
);
