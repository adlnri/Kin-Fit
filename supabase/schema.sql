-- Kin Fit · base Supabase (à coller une fois dans Supabase › SQL Editor › New query, puis Run).
-- Comptes, sauvegarde de la progression, amis et défis entre amis.
-- Sécurité : Row Level Security sur chaque table ; chacun ne lit que ses données,
-- ses amitiés et les défis auxquels il participe. Les pseudos des autres ne sont
-- visibles qu'à travers les fonctions ci-dessous.

create extension if not exists citext;

-- ---------- Profils (un par compte) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  pseudo citext not null unique check (pseudo ~ '^[A-Za-z0-9_.-]{3,20}$'),
  consent_at timestamptz not null,           -- consentement explicite (données de santé)
  state jsonb not null default '{}'::jsonb,  -- progression de l'app (profil sportif, points, médailles, historique)
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profil: lire le sien" on public.profiles;
create policy "profil: lire le sien" on public.profiles for select using (id = auth.uid());
drop policy if exists "profil: créer le sien" on public.profiles;
create policy "profil: créer le sien" on public.profiles for insert with check (id = auth.uid());
drop policy if exists "profil: modifier le sien" on public.profiles;
create policy "profil: modifier le sien" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- ---------- Amitiés ----------
create table if not exists public.friendships (
  id bigint generated always as identity primary key,
  requester uuid not null references public.profiles (id) on delete cascade,
  addressee uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  check (requester <> addressee)
);
create unique index if not exists friendships_pair on public.friendships (least(requester, addressee), greatest(requester, addressee));
alter table public.friendships enable row level security;
drop policy if exists "amitié: voir les siennes" on public.friendships;
create policy "amitié: voir les siennes" on public.friendships for select using (auth.uid() in (requester, addressee));
drop policy if exists "amitié: demander" on public.friendships;
create policy "amitié: demander" on public.friendships for insert with check (requester = auth.uid() and status = 'pending');
drop policy if exists "amitié: accepter" on public.friendships;
create policy "amitié: accepter" on public.friendships for update using (addressee = auth.uid()) with check (addressee = auth.uid());
drop policy if exists "amitié: retirer" on public.friendships;
create policy "amitié: retirer" on public.friendships for delete using (auth.uid() in (requester, addressee));

create or replace function public.are_friends(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from friendships f where f.status = 'accepted'
    and ((f.requester = a and f.addressee = b) or (f.requester = b and f.addressee = a)));
$$;

-- ---------- Défis entre amis ----------
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  cid text not null,
  title text not null check (char_length(title) <= 80),
  unit text not null default '' check (char_length(unit) <= 20),
  target int not null check (target between 1 and 100000),
  cat text not null default 'sport',
  icon text not null default 'star',
  steps jsonb not null default '[1]'::jsonb,
  msg text not null default '' check (char_length(msg) <= 120),
  created_by uuid references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.challenge_members (
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'invited' check (status in ('invited', 'accepted', 'declined')),
  progress int not null default 0 check (progress between 0 and 100000),
  updated_at timestamptz not null default now(),
  primary key (challenge_id, user_id)
);
alter table public.challenges enable row level security;
alter table public.challenge_members enable row level security;

create or replace function public.is_member(c uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from challenge_members m where m.challenge_id = c and m.user_id = auth.uid());
$$;

drop policy if exists "défi: voir si membre" on public.challenges;
create policy "défi: voir si membre" on public.challenges for select using (public.is_member(id));
drop policy if exists "membres: voir ceux de mes défis" on public.challenge_members;
create policy "membres: voir ceux de mes défis" on public.challenge_members for select using (public.is_member(challenge_id));
drop policy if exists "membres: modifier ma ligne" on public.challenge_members;
create policy "membres: modifier ma ligne" on public.challenge_members for update using (user_id = auth.uid()) with check (user_id = auth.uid());
-- Création uniquement via create_challenge() ci-dessous (vérifie les amitiés).

-- ---------- Fonctions appelées par l'app ----------

-- Trouver un utilisateur par son pseudo exact (ne renvoie que l'identifiant et le pseudo).
create or replace function public.find_user(p_pseudo text) returns table (id uuid, pseudo text)
language sql stable security definer set search_path = public as $$
  select p.id, p.pseudo::text from profiles p where p.pseudo = p_pseudo::citext and p.id <> auth.uid() limit 1;
$$;

-- Mes amis et demandes en cours, avec les pseudos.
create or replace function public.my_friends() returns table (friendship_id bigint, friend_id uuid, pseudo text, status text, incoming boolean)
language sql stable security definer set search_path = public as $$
  select f.id,
         case when f.requester = auth.uid() then f.addressee else f.requester end,
         p.pseudo::text, f.status, f.addressee = auth.uid()
  from friendships f
  join profiles p on p.id = case when f.requester = auth.uid() then f.addressee else f.requester end
  where auth.uid() in (f.requester, f.addressee)
  order by f.status, p.pseudo;
$$;

-- Créer un défi et inviter des amis (seulement des amis acceptés).
create or replace function public.create_challenge(p_cid text, p_title text, p_unit text, p_target int, p_cat text, p_icon text, p_steps jsonb, p_msg text, p_friends uuid[])
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid; f uuid;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if coalesce(array_length(p_friends, 1), 0) = 0 or array_length(p_friends, 1) > 20 then raise exception 'bad friends'; end if;
  insert into challenges (cid, title, unit, target, cat, icon, steps, msg, created_by)
    values (p_cid, left(p_title, 80), left(coalesce(p_unit, ''), 20), p_target, p_cat, p_icon, coalesce(p_steps, '[1]'::jsonb), left(coalesce(p_msg, ''), 120), auth.uid())
    returning id into new_id;
  insert into challenge_members (challenge_id, user_id, status) values (new_id, auth.uid(), 'accepted');
  foreach f in array p_friends loop
    if public.are_friends(auth.uid(), f) then
      insert into challenge_members (challenge_id, user_id, status) values (new_id, f, 'invited') on conflict do nothing;
    end if;
  end loop;
  return new_id;
end $$;

-- Mes défis avec la progression de chaque participant.
create or replace function public.my_challenges() returns table (id uuid, cid text, title text, unit text, target int, cat text, icon text, steps jsonb, msg text, from_pseudo text, created_at timestamptz, my_status text, my_progress int, members jsonb)
language sql stable security definer set search_path = public as $$
  select c.id, c.cid, c.title, c.unit, c.target, c.cat, c.icon, c.steps, c.msg,
         coalesce(cp.pseudo::text, '?'), c.created_at, me.status, me.progress,
         (select jsonb_agg(jsonb_build_object('pseudo', p.pseudo, 'progress', m.progress, 'status', m.status, 'me', m.user_id = auth.uid()) order by m.progress desc)
            from challenge_members m join profiles p on p.id = m.user_id where m.challenge_id = c.id)
  from challenges c
  join challenge_members me on me.challenge_id = c.id and me.user_id = auth.uid()
  left join profiles cp on cp.id = c.created_by
  where me.status <> 'declined' and c.created_at > now() - interval '60 days'
  order by c.created_at desc;
$$;

-- Supprimer mon compte et toutes mes données (droit à l'effacement).
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  delete from auth.users where id = auth.uid();
end $$;

revoke execute on function public.find_user(text), public.my_friends(), public.create_challenge(text, text, text, int, text, text, jsonb, text, uuid[]), public.my_challenges(), public.delete_my_account(), public.are_friends(uuid, uuid), public.is_member(uuid) from public, anon;
grant execute on function public.find_user(text), public.my_friends(), public.create_challenge(text, text, text, int, text, text, jsonb, text, uuid[]), public.my_challenges(), public.delete_my_account(), public.are_friends(uuid, uuid), public.is_member(uuid) to authenticated;
