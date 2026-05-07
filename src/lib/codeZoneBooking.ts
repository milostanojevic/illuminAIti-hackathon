/** Shapes from SuperSportBet `widgetType=codeZone` widget loader. */

export type CodeZoneSelection = {
  selectionId?: string;
  selectionName?: string;
  fixtureName?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  marketName?: string;
  oddValue?: number | null;
  unboostedOddValue?: number | null;
  selectionStatus?: string;
  selectionStatusId?: number;
  specifiers?: Record<string, string | number>;
  marketTranslationKey?: string;
};

export type BookingCodeEntry = {
  bookingCode: string;
  folds: number;
  betCount: number;
  totalOdds: number;
  selections: CodeZoneSelection[];
};

export type CodeZoneWidgetPayload = {
  bookingCodes?: BookingCodeEntry[];
  totalItems?: number;
  totalPages?: number;
};

export const formatPlacedShort = (n: number): string => {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.round(n));
};

/** Team / pick label shown on the left of each leg row. */
export const pickLegHeadline = (sel: CodeZoneSelection): string => {
  const sn = String(sel.selectionName ?? "").trim();
  if (sn === "1") return sel.homeTeamName?.trim() || sel.fixtureName || "Home";
  if (sn === "2") return sel.awayTeamName?.trim() || sel.fixtureName || "Away";
  if (sn === "Over" || sn === "Under")
    return `${sel.homeTeamName ?? ""} vs ${sel.awayTeamName ?? ""}`.trim() || sel.fixtureName || sn;
  return sel.fixtureName?.trim() || sn || "Selection";
};

export const buildLegSubtitle = (sel: CodeZoneSelection): string => {
  const m = sel.marketName?.trim();
  if (m) return m;
  const line = sel.specifiers?.line;
  const sn = String(sel.selectionName ?? "").trim();
  if (line !== undefined && line !== null && (sn === "Over" || sn === "Under")) {
    return `Total goals ${sn} ${line}`;
  }
  if (sn === "1" || sn === "2") {
    const opp = sn === "1" ? sel.awayTeamName : sel.homeTeamName;
    return opp ? `1X2 · vs ${opp}` : "1X2";
  }
  return sel.fixtureName?.trim() || "Match market";
};

export const isLegDimmed = (sel: CodeZoneSelection): boolean =>
  sel.selectionStatus !== "Active" || (sel.selectionStatusId != null && sel.selectionStatusId !== 1);

export const parseCodeZonePayload = (raw: unknown): BookingCodeEntry[] => {
  if (!raw || typeof raw !== "object") return [];
  const codes = (raw as CodeZoneWidgetPayload).bookingCodes;
  if (!Array.isArray(codes)) return [];
  return codes
    .filter((c) => c && typeof c.bookingCode === "string")
    .map((c) => ({
      ...c,
      selections: Array.isArray(c.selections) ? c.selections : [],
    }))
    .filter((c) => c.selections.length > 0);
};
