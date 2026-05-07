import type { Brand } from "@/types/brand";

/**
 * Canonical colour + gradient tokens for BetKing vs SuperSportBet.
 *
 * Intended to stay aligned with the SS MUI for Figma / Colour Palette specs
 * (file `8QVDJqTTu94UIkaHPSbpUS`; live sync via Figma MCP when available).
 */
export const bkPalette = {
  primary: "#1a2b6b",
  dark: "#0d1a3a",
  accent: "#00d8c8",
  mint: "#4dd9ac",
  red: "#c8102e",
  /** Text on teal primary actions */
  onAccent: "#003030",
} as const;

export const ssPalette = {
  primary: "#1a2db8",
  deep: "#0d1580",
  /** Hero / richer blue stop */
  bright: "#2a3dc8",
  accent: "#FFCD00",
  /** Text / icons on amber primary actions */
  onAccent: "#0d1580",
  surfaceMuted: "#eef2ff",
  /** Carousel nav wells (shared between brands in UI) */
  navWell: "#eef1fb",
  ink: "#1a1a2e",
  dotInactive: "#d8dbe5",
  /** Focus / outline on primary surfaces */
  outlineMuted: "#b0b8d8",
} as const;

/** Header strip + tier-1 gradients */
export const brandGradients = {
  bk: {
    header: `linear-gradient(135deg, ${bkPalette.primary}, ${bkPalette.dark})`,
    cardCasino: `linear-gradient(135deg, ${bkPalette.primary}, ${bkPalette.dark})`,
    cardSports: "linear-gradient(135deg, #c8102e, #740015)",
    promo: "linear-gradient(135deg, #003030, #00a89c)",
  },
  ss: {
    header: `linear-gradient(135deg, ${ssPalette.primary}, ${ssPalette.deep})`,
    cardCasino: `linear-gradient(135deg, ${ssPalette.primary}, ${ssPalette.deep})`,
    /** Sports / EPL-style trending tile */
    cardSports: `linear-gradient(135deg, ${ssPalette.bright}, ${ssPalette.deep})`,
    promo: `linear-gradient(135deg, ${ssPalette.deep}, #00a89c)`,
    /** Onboarding SS hero backdrop */
    brandHero:
      `linear-gradient(160deg, ${ssPalette.bright} 0%, ${ssPalette.primary} 45%, ${ssPalette.deep} 100%)`,
  },
} as const;

export function headerBackground(brand: Brand): string {
  return brand === "bk" ? brandGradients.bk.header : brandGradients.ss.header;
}

export function depositWidgetBackground(brand: Brand): string {
  return brand === "bk"
    ? "linear-gradient(135deg, #1a2b6b, #0f1a4d)"
    : `linear-gradient(135deg, ${ssPalette.primary}, ${ssPalette.deep})`;
}

/** Text on small filled promo / accent chips (paired with bkPalette.accent / ssPalette.accent). */
export function textOnAccentButton(brand: Brand): string {
  return brand === "bk" ? bkPalette.onAccent : ssPalette.onAccent;
}
