# Architecture

Where things live and how they connect.

## Folder Tree

```
src/
  app/
    layout.tsx               Root layout (no OnboardingProvider)
    page.tsx                 Landing / redirect → /onboarding/hero
    onboarding/
      layout.tsx             Wraps OnboardingProvider around wizard
      ...
      magic/page.tsx         MagicLoader — write localStorage → /home
    home/
      page.tsx               OnboardingProvider + HomePreferencesHydrate + HomeShell
    api/
      preferences/
        route.ts             Legacy POST/GET (optional / future backend; not used by wizard → home POC)
  components/
    home/HomePreferencesHydrate.tsx   One-shot hydrate from localStorage on /home
  state/
    OnboardingContext.tsx    Wizard state useReducer + HYDRATE + optional LS sync on /onboarding
  lib/
    flow.ts                  FLOWS + getNextStep / getGhostSkipDestination (linked skips)
    onboardingNav.ts         goToNextPreferenceStep (ghost / skip)
    storedPreferences.ts      localStorage read/write + sanitize + isEffectivelyDefault
    trending.ts               buildTrendingCards + buildPopularDefaultCards for home carousel
    supabase/browser.ts ...
    data/                    Static catalogues
  types/preferences.ts       OnboardingState
```

## OnboardingContext Shape

```typescript
type OnboardingState = {
  brand: Brand;
  leagues: LeagueKey[];
  teams: string[];
  casinoGames: string[];
  providers: ProviderKey[];
  ssGames: string[];
  style: {
    risk: RiskLevel | null;
    session: SessionStyle | null;
    promos: PromoKey[];
  };
};
```

## FLOWS Constant

```typescript
const FLOWS: Record<Brand, readonly StepKey[]> = {
  bk: ["hero", "leagues", "teams", "casino", "style", "magic"],
  ss: ["hero", "providers", "games", "leagues", "teams", "style", "magic"],
};
```

Helper functions (`getNextStep`, `getGhostSkipDestination`, `getPreviousStep`, `isStepInFlow`) live in `src/lib/flow.ts`.

## Wizard and home lifecycle (localStorage POC)

1. Under `/onboarding`, step components read/write `OnboardingContext`.
2. **Continue** respects per-step enabling rules (see [onboarding-flow.md](onboarding-flow.md)).
3. **Ghost “Skip for now”** uses `goToNextPreferenceStep` → `getGhostSkipDestination` (SS providers skip includes games; leagues skip includes teams per brand).
4. When `OnboardingState` updates on `/onboarding/*`, context sync persists to **`localStorage`** key `kingmakers_user_preferences`.
5. **MagicLoader** serialises full state to the same key, then redirects to `/home`.
6. `/home` mounts a **new** `OnboardingProvider`; **`HomePreferencesHydrate`** reads localStorage once and dispatches **`HYDRATE`**.
7. **`HomeShell`** uses `isEffectivelyDefault(state)` (`src/lib/storedPreferences.ts`). If **true**, the trending rail uses **`buildPopularDefaultCards(brand)`**; otherwise **`buildTrendingCards`** uses saved leagues / teams / games labels.

Supabase **`user_preferences`** tables remain available for future server persistence; they are not required for the current client-only journey.

---

See also: [onboarding-flow.md](onboarding-flow.md), [database.md](database.md)
