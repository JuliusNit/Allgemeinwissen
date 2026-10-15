-- Melden + Blockieren im Austausch, KI-Nachrichten nur noch über den Server. Nach 004 einmal im
-- Supabase-SQL-Editor ausführen (idempotent).
-- Blockieren: Nachrichten der Blockierten sind für mich unsichtbar, Freundschaft endet, keine neuen
-- Anfragen oder Direktnachrichten zwischen beiden.
-- Melden: Meldung mit Grund; Text und Absender übernimmt die Datenbank selbst aus der Nachricht.
-- Lesen und erledigen darf nur der Editor.
-- is_ki: Nutzer können keine Nachricht mehr als KI ausgeben; KI-Antworten schreibt die Edge Function "ki-chat".

-- ---------- Blockieren ----------

create table if not exists public.blocks (
  blocker uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  blocked uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker, blocked),
  check (blocker <> blocked)
);

alter table public.blocks enable row level security;

drop policy if exists "Eigene Blockierungen lesbar" on public.blocks;
create policy "Eigene Blockierungen lesbar" on public.blocks for select to authenticated
  using (blocker = (select auth.uid()));

drop policy if exists "Blockieren" on public.blocks;
create policy "Blockieren" on public.blocks for insert to authenticated
  with check (blocker = (select auth.uid()) and public.is_member());

drop policy if exists "Blockierung aufheben" on public.blocks;
create policy "Blockierung aufheben" on public.blocks for delete to authenticated
  using (blocker = (select auth.uid()));

-- einer von beiden hat den anderen blockiert
create or replace function public.is_blocked(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.blocks where (blocker = a and blocked = b) or (blocker = b and blocked = a))
$$;

-- Blockieren beendet eine Freundschaft bzw. offene Anfrage
create or replace function public.block_ends_friendship() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.friendships
  where least(requester, addressee) = least(new.blocker, new.blocked)
    and greatest(requester, addressee) = greatest(new.blocker, new.blocked);
  return new;
end $$;

drop trigger if exists blocks_end_friendship on public.blocks;
create trigger blocks_end_friendship after insert on public.blocks
  for each row execute function public.block_ends_friendship();

drop policy if exists "Anfrage senden" on public.friendships;
create policy "Anfrage senden" on public.friendships for insert to authenticated
  with check (requester = (select auth.uid()) and status = 'pending' and public.is_member() and not public.is_blocked(requester, addressee));

-- ---------- Nachrichten: Blockierte ausblenden, is_ki nur über den Server ----------

drop policy if exists "Nachrichten lesbar" on public.messages;
create policy "Nachrichten lesbar" on public.messages for select to authenticated
  using (
    (recipient is null or (select auth.uid()) in (user_id, recipient))
    and not exists (select 1 from public.blocks b where b.blocker = (select auth.uid()) and b.blocked = messages.user_id)
  );

drop policy if exists "Eigene Nachrichten schreiben" on public.messages;
create policy "Eigene Nachrichten schreiben" on public.messages for insert to authenticated
  with check (
    user_id = (select auth.uid()) and public.is_member() and is_ki = false
    and (
      (recipient is null and channel <> 'dm')
      or (channel = 'dm' and recipient is not null and public.are_friends(user_id, recipient) and not public.is_blocked(user_id, recipient))
    )
  );

-- ---------- Melden ----------

create table if not exists public.reports (
  id bigint generated always as identity primary key,
  reporter uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  message_id bigint references public.messages (id) on delete set null,
  reported uuid references public.profiles (id) on delete set null,
  channel text,
  text text not null default '' check (char_length(text) <= 4000),
  reason text not null check (reason in ('beleidigung', 'spam', 'unangemessen', 'sonstiges')),
  created_at timestamptz not null default now(),
  unique (reporter, message_id)
);

alter table public.reports enable row level security;

-- Text, Kanal und Absender kommen aus der Nachricht – und nur, wenn der Meldende sie lesen darf
create or replace function public.fill_report() returns trigger
language plpgsql security definer set search_path = '' as $$
declare m public.messages;
begin
  select * into m from public.messages where id = new.message_id;
  if m.id is null or not (m.recipient is null or new.reporter in (m.user_id, m.recipient)) then
    raise exception 'Nachricht nicht gefunden';
  end if;
  if m.user_id = new.reporter then
    raise exception 'Eigene Nachricht';
  end if;
  new.reported := m.user_id;
  new.channel := m.channel;
  new.text := m.text;
  return new;
end $$;

drop trigger if exists reports_fill on public.reports;
create trigger reports_fill before insert on public.reports
  for each row execute function public.fill_report();

drop policy if exists "Melden" on public.reports;
create policy "Melden" on public.reports for insert to authenticated
  with check (reporter = (select auth.uid()) and public.is_member());

drop policy if exists "Editor liest Meldungen" on public.reports;
create policy "Editor liest Meldungen" on public.reports for select to authenticated
  using (public.is_editor());

drop policy if exists "Editor erledigt Meldungen" on public.reports;
create policy "Editor erledigt Meldungen" on public.reports for delete to authenticated
  using (public.is_editor());

-- Offene Meldungen ansehen:
-- select r.created_at, r.reason, r.channel, p.name as von, r.text from public.reports r
--   left join public.profiles p on p.id = r.reported order by r.created_at desc;
