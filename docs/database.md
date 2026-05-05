# Database

Supabase schema, migration commands, and save/read flows.

## Schema

```sql
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
```

### Design Notes

- `user_preferences` stores one row per user with scalar fields (brand, risk, session).
- `user_preference_selections` is a child table holding multi-value selections grouped by `kind`.
- `rank` allows ordered preferences (e.g. casino games pinned in a specific order).
- Composite primary key `(preference_id, kind, key)` prevents duplicates.

## Save Flow (POST /api/preferences)

1. **Upsert parent** -- insert into `user_preferences` with `ON CONFLICT (user_id) DO UPDATE` to set brand, risk, session, updated_at.
2. **Delete child rows** -- delete all `user_preference_selections` for the returned `preference_id`.
3. **Bulk insert selections** -- insert one row per selection with kind, key, and optional rank.

This replace-all strategy keeps the logic simple and avoids diff calculation.

## Read Flow (GET /api/preferences?user_id=...)

1. Select from `user_preferences` where `user_id` matches.
2. Join with `user_preference_selections` on `preference_id`.
3. Group selections by `kind` into arrays.
4. Return a JSON response matching the `OnboardingState` shape.

## Migration Commands

```bash
# Link to your Supabase project (first time only)
supabase link --project-ref <your-project-ref>

# Push all migrations to the remote database
supabase db push

# Create a new migration file locally
supabase migration new <migration-name>
```

## Row-Level Security

Both tables have RLS enabled with permissive `anon` policies:

```sql
create policy "anon write prefs" on public.user_preferences
  for all to anon using (true) with check (true);
create policy "anon write selections" on public.user_preference_selections
  for all to anon using (true) with check (true);
```

This is intentional for the POC phase. When authentication is added, replace these with policies that check `auth.uid() = user_id`.

---

See also: [architecture.md](architecture.md), [deployment.md](deployment.md)
