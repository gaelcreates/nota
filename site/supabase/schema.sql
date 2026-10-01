-- Espace membre Nota · schéma complet
-- À coller une seule fois dans Supabase › SQL Editor › New query, puis Run.

-- ─── Membres ───────────────────────────────────────────────
create table public.members (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid unique references auth.users(id) on delete set null,
  email       text not null unique check (email = lower(email)),
  full_name   text not null default '',
  role        text not null default 'member' check (role in ('member', 'admin')),
  offer       text not null default 'nota' check (offer in ('nota', 'nota_plus', 'repli')),
  start_date  date not null default current_date,
  end_date    date not null default (current_date + interval '6 months')::date,
  last_seen   timestamptz,
  created_at  timestamptz not null default now()
);

-- Qui est connecté, est-il admin, son accès est-il ouvert
create or replace function public.me() returns uuid
language sql stable security definer set search_path = '' as $$
  select id from public.members where user_id = auth.uid()
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.members where user_id = auth.uid() and role = 'admin')
$$;

create or replace function public.is_active() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.members
    where user_id = auth.uid() and (role = 'admin' or end_date >= current_date)
  )
$$;

create or replace function public.has_group() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.members
    where user_id = auth.uid() and (role = 'admin' or offer <> 'repli')
  )
$$;

-- Seules les adresses invitées peuvent créer un compte
create or replace function public.guard_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.members where email = lower(new.email)) then
    raise exception 'Adresse non invitée';
  end if;
  return new;
end $$;

create trigger guard_new_user before insert on auth.users
  for each row execute function public.guard_new_user();

-- Relie le compte au membre, dans les deux sens
create or replace function public.link_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.members set user_id = new.id where email = lower(new.email);
  return new;
end $$;

create trigger link_new_user after insert on auth.users
  for each row execute function public.link_new_user();

create or replace function public.link_invited_member() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.email := lower(trim(new.email));
  if new.user_id is null then
    select id into new.user_id from auth.users where lower(email) = new.email;
  end if;
  return new;
end $$;

create trigger link_invited_member before insert on public.members
  for each row execute function public.link_invited_member();

-- ─── Missions cochées (départ et modules) ─────────────────
create table public.completions (
  member_id  uuid not null references public.members(id) on delete cascade,
  item_key   text not null,
  link       text,
  done_at    timestamptz not null default now(),
  primary key (member_id, item_key)
);

-- ─── Les quatre chiffres : départ, 3 mois, 6 mois ────────
create table public.metrics (
  member_id    uuid not null references public.members(id) on delete cascade,
  period       text not null check (period in ('depart', 'm3', 'm6')),
  views        integer,
  messages     integer,
  subscribers  integer,
  meetings     integer,
  updated_at   timestamptz not null default now(),
  primary key (member_id, period)
);

-- ─── Appels 1:1 ───────────────────────────────────────────
create table public.calls (
  id             uuid primary key default gen_random_uuid(),
  member_id      uuid not null references public.members(id) on delete cascade,
  held_on        date not null default current_date,
  title          text not null default '',
  recording_url  text,
  summary        text,
  next_steps     text,
  created_at     timestamptz not null default now()
);

-- ─── Micro-app ────────────────────────────────────────────
create table public.microapps (
  member_id   uuid primary key references public.members(id) on delete cascade,
  level       integer not null default 1 check (level in (1, 2)),
  step        integer not null default 0 check (step between 0 and 6),
  url         text,
  note        text,
  updated_at  timestamptz not null default now()
);

-- ─── Nota+ : ce que Gael livre ────────────────────────────
create table public.deliveries (
  member_id  uuid not null references public.members(id) on delete cascade,
  item_key   text not null,
  status     text not null default 'a_venir' check (status in ('a_venir', 'en_cours', 'livre')),
  link       text,
  primary key (member_id, item_key)
);

-- ─── Appels de groupe ─────────────────────────────────────
create table public.group_sessions (
  id          uuid primary key default gen_random_uuid(),
  held_on     date not null,
  theme_key   text not null,
  replay_url  text,
  created_at  timestamptz not null default now()
);

-- ─── Réglages (liens) ─────────────────────────────────────
create table public.settings (
  key    text primary key,
  value  text not null default ''
);

-- ─── Sécurité ligne par ligne ─────────────────────────────
alter table public.members        enable row level security;
alter table public.completions    enable row level security;
alter table public.metrics        enable row level security;
alter table public.calls          enable row level security;
alter table public.microapps      enable row level security;
alter table public.deliveries     enable row level security;
alter table public.group_sessions enable row level security;
alter table public.settings       enable row level security;

create policy "membre : sa fiche"      on public.members for select using (user_id = auth.uid() or public.is_admin());
create policy "admin : membres"        on public.members for all    using (public.is_admin()) with check (public.is_admin());

create policy "membre : ses missions"  on public.completions for all
  using (public.is_admin() or (member_id = public.me() and public.is_active()))
  with check (public.is_admin() or (member_id = public.me() and public.is_active()));

create policy "membre : ses chiffres"  on public.metrics for all
  using (public.is_admin() or (member_id = public.me() and public.is_active()))
  with check (public.is_admin() or (member_id = public.me() and public.is_active()));

create policy "membre : ses appels"    on public.calls for select using (public.is_admin() or (member_id = public.me() and public.is_active()));
create policy "admin : appels"         on public.calls for all    using (public.is_admin()) with check (public.is_admin());

create policy "membre : sa micro-app"  on public.microapps for select using (public.is_admin() or (member_id = public.me() and public.is_active()));
create policy "admin : micro-apps"     on public.microapps for all    using (public.is_admin()) with check (public.is_admin());

create policy "membre : ses livrables" on public.deliveries for select using (public.is_admin() or (member_id = public.me() and public.is_active()));
create policy "admin : livrables"      on public.deliveries for all    using (public.is_admin()) with check (public.is_admin());

create policy "membre : appels de groupe" on public.group_sessions for select using (public.is_active() and public.has_group());
create policy "admin : appels de groupe"  on public.group_sessions for all    using (public.is_admin()) with check (public.is_admin());

create policy "connecté : réglages"    on public.settings for select using (public.is_active());
create policy "admin : réglages"       on public.settings for all    using (public.is_admin()) with check (public.is_admin());

-- Dernière visite, sans ouvrir l'écriture de la fiche au membre
create or replace function public.touch_last_seen() returns void
language sql security definer set search_path = '' as $$
  update public.members set last_seen = now() where user_id = auth.uid()
$$;

-- ─── Départ ───────────────────────────────────────────────
insert into public.members (email, full_name, role, offer, end_date)
values ('gael@notaconsulting.ch', 'Gael', 'admin', 'nota_plus', '2099-12-31');

insert into public.settings (key, value) values
  ('questionnaire_url', 'https://docs.google.com/document/d/1TdX_A1tDLW--BbYJjaLO5EMfjAlYZxfQ45vvtsDmCSU/copy'),
  ('miro_url', ''),
  ('calendly_url', ''),
  ('discord_url', ''),
  ('whatsapp_url', '');

-- ═══ Migration 2 (28 sept) : fonctions internes fermées aux visiteurs ═══
revoke execute on function public.guard_new_user() from public, anon, authenticated;
revoke execute on function public.link_new_user() from public, anon, authenticated;
revoke execute on function public.link_invited_member() from public, anon, authenticated;
revoke execute on function public.me(), public.is_admin(), public.is_active(), public.has_group(), public.touch_last_seen() from public, anon;
grant execute on function public.me(), public.is_admin(), public.is_active(), public.has_group(), public.touch_last_seen() to authenticated;
-- (toutes les règles ci-dessus passées en « to authenticated » via alter policy)

-- ═══ Migration 3 (1er oct) : paiement et contrat ═══
alter table public.members
  add column paid boolean not null default false,
  add column price integer,
  add column paid_amount integer not null default 0,
  add column due_note text;
update public.members set paid = true where role = 'admin';
create or replace function public.is_active() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.members where user_id = auth.uid() and (role = 'admin' or (paid and end_date >= current_date)))
$$;
drop policy "connecté : réglages" on public.settings;
create policy "membre : réglages" on public.settings for select to authenticated using (public.me() is not null);
insert into public.settings (key, value) values
  ('beneficiary', ''), ('iban', ''), ('street', ''), ('postal_code', ''), ('town', ''), ('country', 'CH'), ('currency', 'EUR')
on conflict (key) do nothing;

-- ═══ Migration 4 (1er oct) : livrables écrits et nom modifiable ═══
create table public.answers (
  member_id uuid not null references public.members(id) on delete cascade,
  item_key text not null,
  answer text not null default '' check (char_length(answer) <= 20000),
  updated_at timestamptz not null default now(),
  primary key (member_id, item_key)
);
alter table public.answers enable row level security;
create policy "membre : ses livrables écrits" on public.answers for all to authenticated
  using (public.is_admin() or (member_id = public.me() and public.is_active()))
  with check (public.is_admin() or (member_id = public.me() and public.is_active()));
create or replace function public.update_my_name(new_name text) returns void
language sql security definer set search_path = '' as $$
  update public.members set full_name = left(trim(new_name), 80) where user_id = auth.uid()
$$;
revoke execute on function public.update_my_name(text) from public, anon;
grant execute on function public.update_my_name(text) to authenticated;
