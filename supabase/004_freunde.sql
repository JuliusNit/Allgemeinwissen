-- Freunde + Direktnachrichten. Nach 002/003 einmal im Supabase-SQL-Editor ausführen (idempotent).
-- Freundschaft: Anfrage (pending) → der Empfänger nimmt an (accepted). Löschen dürfen beide.
-- Direktnachrichten liegen in public.messages (channel 'dm', recipient gesetzt) und sind nur für die zwei
-- Beteiligten lesbar; schreiben nur unter Freunden.

create table if not exists public.friendships (
  id bigint generated always as identity primary key,
  requester uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  addressee uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  check (requester <> addressee)
);

-- nur eine Beziehung je Paar, egal wer angefragt hat
create unique index if not exists friendships_pair on public.friendships (least(requester, addressee), greatest(requester, addressee));

alter table public.friendships enable row level security;

drop policy if exists "Eigene Freundschaften lesbar" on public.friendships;
create policy "Eigene Freundschaften lesbar" on public.friendships for select to authenticated
  using ((select auth.uid()) in (requester, addressee));

drop policy if exists "Anfrage senden" on public.friendships;
create policy "Anfrage senden" on public.friendships for insert to authenticated
  with check (requester = (select auth.uid()) and status = 'pending' and public.is_member());

drop policy if exists "Anfrage annehmen" on public.friendships;
create policy "Anfrage annehmen" on public.friendships for update to authenticated
  using (addressee = (select auth.uid())) with check (addressee = (select auth.uid()) and status = 'accepted');

drop policy if exists "Freundschaft beenden" on public.friendships;
create policy "Freundschaft beenden" on public.friendships for delete to authenticated
  using ((select auth.uid()) in (requester, addressee));

create or replace function public.are_friends(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.friendships
    where status = 'accepted' and least(requester, addressee) = least(a, b) and greatest(requester, addressee) = greatest(a, b)
  )
$$;

-- ---------- Direktnachrichten ----------

alter table public.messages add column if not exists recipient uuid references public.profiles (id) on delete cascade;
create index if not exists messages_dm on public.messages (channel, user_id, recipient, created_at desc) where recipient is not null;

drop policy if exists "Nachrichten lesbar" on public.messages;
create policy "Nachrichten lesbar" on public.messages for select to authenticated
  using (recipient is null or (select auth.uid()) in (user_id, recipient));

drop policy if exists "Eigene Nachrichten schreiben" on public.messages;
create policy "Eigene Nachrichten schreiben" on public.messages for insert to authenticated
  with check (
    user_id = (select auth.uid()) and public.is_member()
    and ((recipient is null and channel <> 'dm') or (channel = 'dm' and recipient is not null and public.are_friends(user_id, recipient)))
  );

-- Live-Updates auch für Anfragen
do $$ begin
  alter publication supabase_realtime add table public.friendships;
exception when duplicate_object then null;
end $$;
