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

1. Create a 32x32 SVG with the team crest. Use a transparent background.
2. Add an entry to `src/lib/data/crests.ts`:
   ```typescript
   export const crests = {
     // ...existing entries
     "new-team": "/crests/new-team.svg",
   };
   ```
3. Place the SVG file in `public/crests/`.
4. Use via the Crest component:
   ```tsx
   <Crest name="new-team" size={32} />
   ```

## Animations

The config also defines shared keyframes used across both brands:

- `pulse` -- subtle opacity pulse for loading states
- `spin` -- 360-degree rotation for spinners
- `fadeUp` -- translate + fade for step transitions

---

See also: [architecture.md](architecture.md), [development.md](development.md)
