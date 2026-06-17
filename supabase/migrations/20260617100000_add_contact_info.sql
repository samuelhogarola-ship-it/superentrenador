-- Add contact info visible only to authenticated users (auth-gated in the UI).
alter table public.trainer_profiles
  add column if not exists contact_info text not null default '';
