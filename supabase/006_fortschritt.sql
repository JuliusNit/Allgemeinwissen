-- Fortschritt im Konto + Altersgrenze im Austausch. Nach 005 einmal im Supabase-SQL-Editor ausführen (idempotent).
-- progress: Lernfortschritt als JSON je Konto (ohne API-Key, Einstellungen, Editor-Videolisten). Die App lädt ihn
--   beim Anmelden und lädt Änderungen gedrosselt hoch; Konflikte löst die App (neuerer Stand gewinnt, aber kein leerer
--   Stand ersetzt einen mit abgeschlossenen Sessions).
-- birth_years: Geburtsjahr je Konto, nur für das eigene Konto lesbar und nach dem Eintragen fest (keine Update-Policy,
--   ändern nur hier im SQL-Editor). Unter 16 – oder ohne Geburtsjahr – sind öffentliche Kanäle gesperrt
--   (lesen und schreiben); Freunde und Direktnachrichten bleiben. Mit nur dem Jahr zählt erst das Jahr nach dem
--   16. Geburtsjahr sicher als „ab 16“ (Jahr − Geburtsjahr ≥ 17).

-- ---------- Fortschritt ----------

create table if not exists public.progress (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  data jsonb not null check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 5000000),
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

drop policy if exists "Eigener Fortschritt lesbar" on public.progress;
create policy "Eigener Fortschritt lesbar" on public.progress for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Eigenen Fortschritt anlegen" on public.progress;
create policy "Eigenen Fortschritt anlegen" on public.progress for insert to authenticated
  with check (user_id = (select auth.uid()) and public.is_member());

drop policy if exists "Eigenen Fortschritt ändern" on public.progress;
create policy "Eigenen Fortschritt ändern" on public.progress for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and public.is_member());

drop policy if exists "Eigenen Fortschritt löschen" on public.progress;
create policy "Eigenen Fortschritt löschen" on public.progress for delete to authenticated
  using (user_id = (select auth.uid()));

-- ---------- Geburtsjahr ----------

create table if not exists public.birth_years (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  year int not null check (year between 1900 and 2100),
  created_at timestamptz not null default now()
);

alter table public.birth_years enable row level security;

drop policy if exists "Eigenes Geburtsjahr lesbar" on public.birth_years;
create policy "Eigenes Geburtsjahr lesbar" on public.birth_years for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Geburtsjahr eintragen" on public.birth_years;
create policy "Geburtsjahr eintragen" on public.birth_years for insert to authenticated
  with check (user_id = (select auth.uid()) and public.is_member() and year <= extract(year from now())::int);

create or replace function public.over_16(uid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select extract(year from now())::int - year >= 17 from public.birth_years where user_id = uid), false)
$$;

-- ---------- Nachrichten: öffentliche Kanäle erst ab 16 ----------

drop policy if exists "Nachrichten lesbar" on public.messages;
create policy "Nachrichten lesbar" on public.messages for select to authenticated
  using (
    (
      (recipient is null and (select public.over_16((select auth.uid()))))
      or (recipient is not null and (select auth.uid()) in (user_id, recipient))
    )
    and not exists (select 1 from public.blocks b where b.blocker = (select auth.uid()) and b.blocked = messages.user_id)
  );

drop policy if exists "Eigene Nachrichten schreiben" on public.messages;
create policy "Eigene Nachrichten schreiben" on public.messages for insert to authenticated
  with check (
    user_id = (select auth.uid()) and public.is_member() and is_ki = false
    and (
      (recipient is null and channel <> 'dm' and public.over_16(user_id))
      or (channel = 'dm' and recipient is not null and public.are_friends(user_id, recipient) and not public.is_blocked(user_id, recipient))
    )
  );

-- Kontrolle:
-- select u.email, b.year, public.over_16(u.id) as ab16 from auth.users u left join public.birth_years b on b.user_id = u.id;
-- Geburtsjahr korrigieren (z. B. nach Vertipper):
-- update public.birth_years set year = 2008 where user_id = (select id from auth.users where email = 'MAIL@…');
