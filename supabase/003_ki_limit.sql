-- KI-Proxy (Edge Function "ki"): Zaehler fuer das Tageslimit pro Konto. Einmal im SQL-Editor ausfuehren.
-- Nur die Edge Function (Service Role) darf zaehlen; Nutzer koennen weder lesen noch schreiben.

create table if not exists public.ki_usage (
  user_id uuid not null references auth.users on delete cascade,
  day date not null default current_date,
  n int not null default 0,
  primary key (user_id, day)
);

alter table public.ki_usage enable row level security;
-- absichtlich keine Policies → fuer anon/authenticated gesperrt

create or replace function public.ki_count(uid uuid) returns int
language sql security definer set search_path = '' as $$
  insert into public.ki_usage (user_id, day, n) values (uid, current_date, 1)
  on conflict (user_id, day) do update set n = public.ki_usage.n + 1
  returning n
$$;

revoke execute on function public.ki_count(uuid) from public, anon, authenticated;

-- Verbrauch ansehen:
-- select u.email, k.day, k.n from public.ki_usage k join auth.users u on u.id = k.user_id order by k.day desc, k.n desc;
