-- Marketplace schema: cities + public trainer profiles.
-- Designed to be readable by the anon key (public marketplace data),
-- writes reserved for service_role / future authenticated trainer dashboards.

create extension if not exists "pgcrypto";

create table if not exists public.cities (
  slug text primary key,
  name text not null,
  region text not null,
  country text not null default 'España',
  hero_title text not null,
  intro text not null,
  seo_description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.trainer_profiles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  display_name text not null,
  city_slug text not null references public.cities (slug) on delete restrict,
  headline text not null,
  short_bio text not null,
  long_bio text not null,
  specialties text[] not null default '{}',
  verified boolean not null default false,
  years_experience integer not null default 0,
  rating numeric(2, 1) not null default 0,
  reviews_count integer not null default 0,
  price_from numeric(6, 2) not null default 0,
  modalities text[] not null default '{}',
  languages text[] not null default '{}',
  hidden_contact_hint text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists trainer_profiles_city_slug_idx on public.trainer_profiles (city_slug);
create index if not exists trainer_profiles_specialties_idx on public.trainer_profiles using gin (specialties);
create index if not exists trainer_profiles_modalities_idx on public.trainer_profiles using gin (modalities);

alter table public.cities enable row level security;
alter table public.trainer_profiles enable row level security;

-- Public marketplace data: anyone (anon key) can read.
create policy "Cities are publicly readable"
  on public.cities for select
  using (true);

create policy "Published trainer profiles are publicly readable"
  on public.trainer_profiles for select
  using (is_published = true);
