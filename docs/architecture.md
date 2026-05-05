# Architecture

Where things live and how they connect.

## Folder Tree

```
src/
  app/
    layout.tsx            Root layout, wraps OnboardingProvider
    page.tsx              Landing / redirect
    onboarding/
      page.tsx            Brand select (step 1)
      providers/page.tsx  SS: game studio picker
      games/page.tsx      SS: pin favourite games
      leagues/page.tsx    Both: league selector
      teams/page.tsx      Both: club picker
      casino/page.tsx     BK: casino game picker
      style/page.tsx      Both: risk, session, promos
      magic/page.tsx      Loading animation + save
    home/
      page.tsx            Personalised home screen
    api/
      preferences/
        route.ts          POST/GET preference persistence
  components/             Shared UI components
  state/
    OnboardingContext.tsx  Global onboarding state (useReducer)
  lib/
    flow.ts               FLOWS constant + step helpers
    supabase/
      browser.ts          Client-side Supabase instance
      server.ts           Server-side Supabase instance
    data/
      leagues.ts          League catalogue
      teams.ts            Team catalogue
      providers.ts        Provider catalogue
      bkGames.ts          BetKing casino game catalogue
  types/
    brand.ts              Brand, LeagueKey, ProviderKey, etc.
    preferences.ts        OnboardingState type
supabase/
  migrations/
    0001_user_preferences.sql
docs/
  architecture.md
  onboarding-flow.md
  database.md
  design-system.md
  development.md
  deployment.md
```

## OnboardingContext Shape

```typescript
type OnboardingState = {
  brand: Brand | null;       // "bk" | "ss"
  leagues: LeagueKey[];
  teams: string[];
  casinoGames: string[];
  providers: ProviderKey[];
  ssGames: string[];
  style: {
    risk: RiskLevel | null;  // "low" | "high"
    session: SessionStyle | null; // "quick" | "long"
    promos: PromoKey[];
  };
};
```

## FLOWS Constant

```typescript
const FLOWS: Record<Brand, readonly StepKey[]> = {
  bk: ["brand", "leagues", "teams", "casino", "style", "magic"],
  ss: ["brand", "providers", "games", "leagues", "teams", "style", "magic"],
};
```

Each brand follows a different step sequence. Helper functions (`getNextStep`, `getPreviousStep`, `isStepInFlow`) live in `src/lib/flow.ts`.

## Request Lifecycle

1. Step page reads state from `OnboardingContext`.
2. User interacts (toggles, selects).
3. Component dispatches an action to the reducer.
4. On "Next", the page calls `router.push()` to the next step route.
5. At the final step (`/onboarding/magic`), the MagicLoader component POSTs the full state to `/api/preferences`.
6. On success the router redirects to `/home`.

---

See also: [onboarding-flow.md](onboarding-flow.md), [database.md](database.md)
