# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview

This is a Next.js 14 (App Router) project with TypeScript and Tailwind CSS, intended for the KingMakers AI hackathon. The database layer uses Supabase (PostgreSQL) and deployment targets Vercel.

### Running the Application

- **Dev server:** `npm run dev` (runs on port 3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Production start:** `npm start`

### Key Notes

- Node.js 20 LTS is required (installed via NodeSource).
- No test framework is configured yet; add one (e.g., Jest or Vitest) when tests are needed.
- Supabase credentials are not yet configured. When adding Supabase, you will need `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
- The project uses the `src/` directory layout with `@/*` import alias.
- Tailwind CSS config is in `tailwind.config.ts`, PostCSS config in `postcss.config.mjs`.
- ESLint is configured via `.eslintrc.json` with `eslint-config-next`.
