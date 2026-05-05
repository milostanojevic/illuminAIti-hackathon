# Deployment

Deploy to Vercel with Supabase backend.

## Prerequisites

- Vercel account (free tier works)
- Supabase account with a project created
- GitHub repo pushed

## 1. Create Supabase Production Project

1. Go to [app.supabase.com](https://app.supabase.com) and create a new project.
2. Choose a region close to your Vercel deployment (e.g. eu-west-1 for Europe, us-east-1 for US).
3. Save the project URL and keys from Settings > API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 2. Apply Migrations

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

This applies all files in `supabase/migrations/` to the remote database.

## 3. Import Repo into Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import from Git and select the repository.
3. Framework preset is auto-detected as Next.js.
4. Leave build settings at defaults (`next build`, output directory `.next`).

## 4. Add Environment Variables

Add these in Vercel project settings under Environment Variables:

| Variable | Scope | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development | Project URL from Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | Never expose to client; not needed for Development |

## 5. Trigger First Deploy

Push to `main`. Vercel builds and deploys automatically on every push.

```bash
git push origin main
```

## 6. Preview Deployments

Every pull request gets an automatic preview deployment. Note that in POC mode all preview environments share the same Supabase project, so test data is shared.

## Custom Domain

Optional. Follow [Vercel's custom domain docs](https://vercel.com/docs/projects/domains) to add one. Point a CNAME to `cname.vercel-dns.com`.

## Troubleshooting

### Missing environment variables

Symptom: build succeeds but app shows "supabaseUrl is required" at runtime.

Fix: verify all three env vars are set in Vercel project settings and redeploy.

### RLS denial errors

Symptom: 403 or empty responses from Supabase.

Fix: confirm the anon policies exist. Run `supabase db push` again if you reset the database.

### Stale build cache

Symptom: changes deployed but not reflected in production.

Fix: force a clean deploy:

```bash
vercel deploy --force
```

Or trigger a redeploy from the Vercel dashboard with "Redeploy" > "Clear Build Cache".

---

See also: [database.md](database.md), [development.md](development.md)
