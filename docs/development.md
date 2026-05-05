# Development

Local setup, scripts, code conventions.

## Prerequisites

- Node.js 18+
- npm
- Supabase CLI (optional, for running migrations locally)

## Environment Variables

| Variable | Required | Scope | Description |
|----------|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client + Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client + Server | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Server only | Service role key for admin operations |

Copy `.env.example` to `.env.local` and fill in the values from your Supabase project dashboard (Settings > API).

## npm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start development server on port 3000 |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve production build |
| `lint` | `next lint` | Run ESLint |
| `typecheck` | `tsc --noEmit` | Type-check without emitting files |

## Code Style

### Components

- Arrow function components with named exports.
- One component per file. File name matches export name in PascalCase.

### TypeScript

- Strict mode enabled.
- Prefer explicit return types on exported functions.
- Use `type` imports where possible.

### Control Flow

- Early returns to avoid nesting beyond 2 levels.
- Extract functions longer than 30 lines into named helpers.

### Naming

- Boolean variables: `is`, `has`, `should`, `can`, `will` prefix.
- Components and types: PascalCase (`BrandSelect.tsx`, `OnboardingState`).
- Route segments: kebab-case (`/onboarding/magic`).
- Utility functions and variables: camelCase (`getNextStep`, `toggleWithMax`).

### File Organisation

- `src/app/` -- routes and API handlers only.
- `src/components/` -- reusable UI components.
- `src/state/` -- context providers and reducers.
- `src/lib/` -- utilities, data catalogues, Supabase clients.
- `src/types/` -- shared type definitions.

## Branch and Commit Conventions

### Branch Prefixes

- `feat/` -- new features
- `fix/` -- bug fixes
- `docs/` -- documentation only
- `refactor/` -- code restructuring without behaviour change
- `chore/` -- tooling, dependencies, config

### Commit Messages

Follow conventional commits:

```
feat: add casino game picker step
fix: prevent duplicate team selections
docs: add deployment guide
```

Keep the subject line under 72 characters. Use the body for context when needed.

---

See also: [architecture.md](architecture.md), [deployment.md](deployment.md)
