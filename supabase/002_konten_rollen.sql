-- Konten + Rollen. Nach schema.sql einmal im Supabase-SQL-Editor ausführen (idempotent).
-- Anmeldung jetzt mit E-Mail + Passwort; anonyme Sitzungen dürfen nur noch lesen.
-- Rollen: 'user' (Standard) und 'editor'. Die Rolle lässt sich über die App/API NIE setzen –
-- nur hier im SQL-Editor (siehe ganz unten).

-- ---------- Rolle im Profil ----------

alter table public.profiles add column if not exists role text not null default 'user';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('user', 'editor'));

-- Schutz: Anfragen über die API (anon/authenticated) können die Rolle weder setzen noch ändern.
create or replace function public.protect_role() returns trigger
language plpgsql set search_path = '' as $$
begin
  if coalesce(auth.jwt() ->> 'role', '') in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      new.role := 'user';
    else
      new.role := old.role;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role before insert or update on public.profiles
  for each row execute function public.protect_role();

-- Hilfsfunktionen für die Policies
create or replace function public.is_editor() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'editor')
$$;

create or replace function public.is_member() returns boolean
language sql stable set search_path = '' as $$
  select (select auth.uid()) is not null and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
$$;

-- ---------- Schreiben nur mit echtem Konto ----------

drop policy if exists "Eigenes Profil anlegen" on public.profiles;
create policy "Eigenes Profil anlegen" on public.profiles for insert to authenticated
  with check (id = (select auth.uid()) and public.is_member());

drop policy if exists "Eigene Nachrichten schreiben" on public.messages;
create policy "Eigene Nachrichten schreiben" on public.messages for insert to authenticated
  with check (user_id = (select auth.uid()) and public.is_member());

-- Editor darf zusätzlich jede Nachricht löschen (Moderation)
drop policy if exists "Eigene Nachrichten löschen" on public.messages;
create policy "Eigene Nachrichten löschen" on public.messages for delete to authenticated
  using (user_id = (select auth.uid()) or public.is_editor());

-- ---------- Inhalte: Videolisten je Tag (nur Editor schreibt) ----------

create table if not exists public.day_videos (
  day int primary key check (day between 1 and 90),
  videos jsonb not null check (jsonb_typeof(videos) = 'array' and pg_column_size(videos) < 60000),
  updated_by uuid default auth.uid() references auth.users on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.day_videos enable row level security;

drop policy if exists "Videos lesbar" on public.day_videos;
create policy "Videos lesbar" on public.day_videos for select to anon, authenticated using (true);

drop policy if exists "Editor ändert Videos" on public.day_videos;
create policy "Editor ändert Videos" on public.day_videos for all to authenticated
  using (public.is_editor()) with check (public.is_editor());

-- ---------- Editor festlegen (erst NACH der Registrierung in der App) ----------
-- E-Mail eintragen, Zeile einkommentieren, ausführen:
-- update public.profiles set role = 'editor'
--   where id = (select id from auth.users where email = 'DEINE@MAIL.de');
--
-- Kontrolle:
-- select u.email, p.name, p.role from public.profiles p join auth.users u on u.id = p.id order by p.role desc;
