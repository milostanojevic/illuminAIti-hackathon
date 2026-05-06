# Design System

Brand color tokens, Tailwind config, and crest authoring.

## Brand Colors

| Token | Hex | Name |
|-------|-----|------|
| `bk.primary` | #1a2b6b | Navy |
| `bk.accent` | #00d8c8 | Teal |
| `bk.mint` | #4dd9ac | Mint |
| `bk.red` | #c8102e | Red |
| `bk.dark` | #0d1a3a | Dark navy |
| `ss.primary` | #1a2db8 | Blue |
| `ss.accent` | #FFCD00 | Yellow |
| `ss.deep` | #0d1580 | Deep blue |
| `ss.blue` | #2a3dc8 | Mid blue |

## Tailwind Config

Colors are registered in `tailwind.config.ts` under `theme.extend.colors`:

```typescript
colors: {
  bk: {
    primary: "#1a2b6b",
    accent: "#00d8c8",
    mint: "#4dd9ac",
    red: "#c8102e",
    dark: "#0d1a3a",
  },
  ss: {
    primary: "#1a2db8",
    accent: "#FFCD00",
    deep: "#0d1580",
    blue: "#2a3dc8",
  },
},
```

## Usage Examples

```html
<!-- BetKing branded card -->
<div class="bg-bk-primary text-white border border-bk-mint">

<!-- SuperSportBET accent button -->
<button class="bg-ss-accent text-ss-deep font-bold">

<!-- Conditional brand styling -->
<div class={brand === 'bk' ? 'bg-bk-dark' : 'bg-ss-deep'}>
```

## Adding a New Team Crest

1. Prefer a square PNG badge. Filename must match `slugifyTeamName(displayName)` from [src/lib/data/teamBadges.ts](src/lib/data/teamBadges.ts) — e.g. `new-club-name.png`. Optional initials fallback: `new-club-name.svg`.
2. Place it under `public/teams/`. Regenerate assets with `node scripts/fetch-team-badges.mjs` (TheSportsDB), or add files manually. Add a `SLUG_OVERRIDES` entry in `teamBadges.ts` if the display name does not slug cleanly.
3. Use via the Crest component (tries `.png`, then `.svg`, then `public/teams/other.svg`):
   ```tsx
   <Crest name="New Club Name" size={32} />
   ```

## Animations

The config also defines shared keyframes used across both brands:

- `pulse` -- subtle opacity pulse for loading states
- `spin` -- 360-degree rotation for spinners
- `fadeUp` -- translate + fade for step transitions

---

See also: [architecture.md](architecture.md), [development.md](development.md)
