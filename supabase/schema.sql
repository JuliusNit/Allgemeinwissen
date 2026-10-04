-- Austausch-Chat: Profile + Nachrichten. Anmeldung anonym (Supabase Anonymous Sign-ins),
-- jeder darf alles lesen, aber nur eigene Nachrichten/Profile schreiben.

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default 'Anonym' check (char_length(name) between 1 and 40),
  avatar text check (avatar is null or char_length(avatar) < 60000),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id bigint generated always as identity primary key,
  channel text not null check (channel ~ '^[a-z0-9-]{1,40}$'),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  is_ki boolean not null default false,
  text text not null check (char_length(text) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index if not exists messages_channel_created on public.messages (channel, created_at desc);

alter table public.profiles enable row level security;
alter table public.messages enable row level security;

create policy "Profile lesbar" on public.profiles for select to authenticated using (true);
create policy "Eigenes Profil anlegen" on public.profiles for insert to authenticated with check (id = (select auth.uid()));
create policy "Eigenes Profil ändern" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "Nachrichten lesbar" on public.messages for select to authenticated using (true);
create policy "Eigene Nachrichten schreiben" on public.messages for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Eigene Nachrichten löschen" on public.messages for delete to authenticated using (user_id = (select auth.uid()));

-- Live-Updates
alter publication supabase_realtime add table public.messages;
