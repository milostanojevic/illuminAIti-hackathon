create table public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id text unique,
  brand text not null check (brand in ('bk','ss')),
  risk text check (risk in ('low','high')),
  session text check (session in ('quick','long')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_preference_selections (
  preference_id uuid not null
    references public.user_preferences(id) on delete cascade,
  kind text not null check (kind in
    ('league','team','casino_game','provider','ss_game','promo')),
  key  text not null,
  rank int,
  created_at timestamptz not null default now(),
  primary key (preference_id, kind, key)
);
create index on public.user_preference_selections (kind, key);

alter table public.user_preferences enable row level security;
alter table public.user_preference_selections enable row level security;

create policy "anon write prefs" on public.user_preferences
  for all to anon using (true) with check (true);
create policy "anon write selections" on public.user_preference_selections
  for all to anon using (true) with check (true);
