begin;
create or replace function public.forme_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;
create table if not exists public.forme_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  locale text not null default 'en' check (locale in ('en', 'es')),
  display_name text,
  city text,
  country_code text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create table if not exists public.forme_app_states (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb check (jsonb_typeof(state) = 'object'),
  client_updated_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id)
);
create table if not exists public.forme_wardrobe_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id text not null,
  item jsonb not null check (jsonb_typeof(item) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, client_id)
);
create table if not exists public.forme_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  outfit_id text not null,
  reason text not null,
  context jsonb not null default '{}'::jsonb check (jsonb_typeof(context) = 'object'),
  created_at timestamptz not null default timezone('utc', now())
);
drop trigger if exists forme_profiles_updated_at on public.forme_profiles;
create trigger forme_profiles_updated_at before update on public.forme_profiles for each row execute function public.forme_set_updated_at();
drop trigger if exists forme_app_states_updated_at on public.forme_app_states;
create trigger forme_app_states_updated_at before update on public.forme_app_states for each row execute function public.forme_set_updated_at();
drop trigger if exists forme_wardrobe_items_updated_at on public.forme_wardrobe_items;
create trigger forme_wardrobe_items_updated_at before update on public.forme_wardrobe_items for each row execute function public.forme_set_updated_at();
alter table public.forme_profiles enable row level security;
alter table public.forme_app_states enable row level security;
alter table public.forme_wardrobe_items enable row level security;
alter table public.forme_feedback enable row level security;
revoke all on public.forme_profiles, public.forme_app_states, public.forme_wardrobe_items, public.forme_feedback from anon;
grant select, insert, update, delete on public.forme_profiles, public.forme_app_states, public.forme_wardrobe_items, public.forme_feedback to authenticated;
create policy "forme_profiles_select_own" on public.forme_profiles for select to authenticated using (auth.uid() = user_id);
create policy "forme_profiles_insert_own" on public.forme_profiles for insert to authenticated with check (auth.uid() = user_id);
create policy "forme_profiles_update_own" on public.forme_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "forme_profiles_delete_own" on public.forme_profiles for delete to authenticated using (auth.uid() = user_id);
create policy "forme_states_select_own" on public.forme_app_states for select to authenticated using (auth.uid() = user_id);
create policy "forme_states_insert_own" on public.forme_app_states for insert to authenticated with check (auth.uid() = user_id);
create policy "forme_states_update_own" on public.forme_app_states for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "forme_states_delete_own" on public.forme_app_states for delete to authenticated using (auth.uid() = user_id);
create policy "forme_items_select_own" on public.forme_wardrobe_items for select to authenticated using (auth.uid() = user_id);
create policy "forme_items_insert_own" on public.forme_wardrobe_items for insert to authenticated with check (auth.uid() = user_id);
create policy "forme_items_update_own" on public.forme_wardrobe_items for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "forme_items_delete_own" on public.forme_wardrobe_items for delete to authenticated using (auth.uid() = user_id);
create policy "forme_feedback_select_own" on public.forme_feedback for select to authenticated using (auth.uid() = user_id);
create policy "forme_feedback_insert_own" on public.forme_feedback for insert to authenticated with check (auth.uid() = user_id);
create policy "forme_feedback_update_own" on public.forme_feedback for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "forme_feedback_delete_own" on public.forme_feedback for delete to authenticated using (auth.uid() = user_id);
create index if not exists forme_items_user_category_idx on public.forme_wardrobe_items (user_id, ((item->>'category')));
create index if not exists forme_feedback_user_created_idx on public.forme_feedback (user_id, created_at desc);
commit;
