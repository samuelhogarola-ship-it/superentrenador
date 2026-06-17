-- Link trainer profiles to Supabase Auth users.
-- Existing seed rows keep user_id = null (no auth required to display them).
-- New profiles created via the registration form will have user_id set.

alter table public.trainer_profiles
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create unique index if not exists trainer_profiles_user_id_idx
  on public.trainer_profiles (user_id)
  where user_id is not null;

-- Authenticated trainer can create their own profile.
create policy "Trainer can insert own profile"
  on public.trainer_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Authenticated trainer can update only their own profile.
create policy "Trainer can update own profile"
  on public.trainer_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
