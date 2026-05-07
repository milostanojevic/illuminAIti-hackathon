/** Normalise upstream offer prematch payloads into fixture rows + 1X2 prices (best-effort). */

export type OneXtwoPrices = {
  labelHome: string;
  labelDraw: string;
  labelAway: string;
  priceHome: string;
  priceDraw: string;
  priceAway: string;
  boostHome?: boolean;
  boostDraw?: boolean;
  boostAway?: boolean;
  /** Pre-boost price when `finalPrice > originalPrice` for that selection */
  originalHome?: string;
  originalDraw?: string;
  originalAway?: string;
};

export type PrematchFixtureUi = {
  fixtureKey: string;
  homeTeam: string;
  awayTeam: string;
  eventTitle: string;
  /** ISO 8601 when parseable from fixture row */
  eventStart: string | null;
  oneXtwo: OneXtwoPrices | null;
};

const ONE_X_TWO_MARKET_TYPE_ID = 110;

const MARKET_HINT = /\b(1\s*x\s*2|1x2|match\s*result|full\s*time\s*result|fulltime\s*result|match\s*betting|win\s*draw\s*win|wdw|home\s*draw\s*away)\b/i;

export const isRecord = (x: unknown): x is Record<string, unknown> =>
  typeof x === "object" && x !== null && !Array.isArray(x);

const str = (x: unknown): string =>
  typeof x === "number" && Number.isFinite(x)
    ? String(x)
    : typeof x === "string"
      ? x.trim()
      : "";

const readFiniteNumber = (x: unknown): number | null => {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  const s = str(x).replace(",", ".");
  if (!s) return null;
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : null;
};

const priceStr = (x: unknown): string => {
  const n = readFiniteNumber(x);
  if (n !== null) return n.toFixed(2);
  return "";
};

/** Match Result / 1X2 market type — API uses MarketTypeId 110 */
const normalizedMarketTypeId = (m: Record<string, unknown>): number | null => {
  const v = m.MarketTypeId ?? m.marketTypeId ?? m.Market_Type_Id ?? m.TypeId ?? m.typeId;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = Number.parseInt(str(v), 10);
  return Number.isFinite(n) ? n : null;
};

/** Parse nested Price { Original, Final, originalPrice, finalPrice, … } — boost when Final > Original */
const parsePriceObject = (po: Record<string, unknown>): {
  price: string;
  boosted: boolean;
  original?: string;
} => {
  const ORIGINAL_KEYS = [
    "original",
    "originalPrice",
    "Original",
    "OriginalDecimal",
    "DecimalOriginal",
    "OpeningDecimal",
    "openingDecimal",
    "OpenPrice",
    "openPrice",
    "OldPrice",
    "oldPrice",
  ];
  const FINAL_KEYS = [
    "final",
    "finalPrice",
    "Final",
    "FinalDecimal",
    "DecimalFinal",
    "finalDecimal",
    "CurrentDecimal",
    "currentDecimal",
    "Decimal",
    "decimal",
  ];

  let orig: number | null = null;
  for (const k of ORIGINAL_KEYS) {
    const n = readFiniteNumber(po[k]);
    if (n !== null) {
      orig = n;
      break;
    }
  }

  let fin: number | null = null;
  for (const k of FINAL_KEYS) {
    const n = readFiniteNumber(po[k]);
    if (n !== null) {
      fin = n;
      break;
    }
  }

  if (orig !== null && fin !== null) {
    if (fin > orig + 1e-6) {
      return { price: fin.toFixed(2), boosted: true, original: orig.toFixed(2) };
    }
    return { price: fin.toFixed(2), boosted: false };
  }

  const single = fin ?? orig;
  if (single !== null) return { price: single.toFixed(2), boosted: false };

  for (const k of Object.keys(po)) {
    if (k.toLowerCase().includes("name") || k.toLowerCase().includes("id")) continue;
    const v = po[k];
    if (isRecord(v)) continue;
    const n = readFiniteNumber(v);
    if (n !== null && n > 0) return { price: n.toFixed(2), boosted: false };
  }

  return { price: "", boosted: false };
};

type SelectionOddsResult = { price: string; boosted: boolean; original?: string };

/** Prefer explicit team names from common provider shapes. */
const pickTeams = (
  row: Record<string, unknown>
): { home: string; away: string } | null => {
  const cand: Array<[string, string]> = [
    [str(row.HomeTeamName), str(row.AwayTeamName)],
    [str(row.homeTeamName), str(row.awayTeamName)],
    [str(row.HomeTeam), str(row.AwayTeam)],
    [str(row.homeTeam), str(row.awayTeam)],
  ];

  const homeObj = row.HomeTeam ?? row.homeTeam;
  const awayObj = row.AwayTeam ?? row.awayTeam;
  if (isRecord(homeObj) && isRecord(awayObj)) {
    cand.push([str(homeObj.Name ?? homeObj.name), str(awayObj.Name ?? awayObj.name)]);
  }

  const px = row.Participants ?? row.participants;
  if (Array.isArray(px) && px.length >= 2 && isRecord(px[0]) && isRecord(px[1])) {
    cand.push([
      str(px[0].Name ?? px[0].name ?? px[0].Title),
      str(px[1].Name ?? px[1].name ?? px[1].Title),
    ]);
  }

  for (const [h, a] of cand) {
    if (h.length > 0 && a.length > 0) return { home: h, away: a };
  }

  return null;
};

const selectionName = (s: Record<string, unknown>): string => {
  const n =
    str(s.Name) ||
    str(s.name) ||
    str(s.SelectionName) ||
    str(s.RunnerName) ||
    str(s.OutcomeName) ||
    str(s.Label) ||
    str(s.label);
  return n;
};

const selectionOdds = (s: Record<string, unknown>): SelectionOddsResult => {
  const priceField = s.Price ?? s.price;
  if (isRecord(priceField)) {
    const fromObj = parsePriceObject(priceField);
    if (fromObj.price) return fromObj;
  } else {
    const scalar = priceStr(priceField);
    if (scalar) return { price: scalar, boosted: false };
  }

  const origN = readFiniteNumber(s.originalPrice ?? s.OriginalPrice ?? s.original);
  const finN = readFiniteNumber(s.finalPrice ?? s.FinalPrice ?? s.final ?? s.Final);
  if (origN !== null && finN !== null) {
    if (finN > origN + 1e-6) {
      return { price: finN.toFixed(2), boosted: true, original: origN.toFixed(2) };
    }
    return { price: finN.toFixed(2), boosted: false };
  }
  if (finN !== null && origN === null) return { price: finN.toFixed(2), boosted: false };
  if (origN !== null && finN === null) return { price: origN.toFixed(2), boosted: false };

  const p =
    priceStr(s.DecimalPrice) ||
    priceStr(s.Odds) ||
    priceStr(s.PriceDecimal) ||
    priceStr(s.decimalPrice) ||
    priceStr(s.odds) ||
    priceStr(s.Final) ||
    priceStr(s.final) ||
    priceStr(s.Original) ||
    priceStr(s.original);
  return { price: p, boosted: false };
};

const classify1x2 = (name: string): "home" | "draw" | "away" | null => {
  const t = name.toLowerCase().trim();
  if (t === "1" || t === "home" || t === "h" || /\b(home|homewin)\b/.test(t)) return "home";
  if (t === "x" || t === "d" || t === "draw" || /\bdraw\b/.test(t)) return "draw";
  if (t === "2" || t === "away" || t === "a" || /\b(away)\b/.test(t)) return "away";
  return null;
};

const selectionCount = (m: Record<string, unknown>): number => {
  const selections = m.Selections ?? m.selections ?? m.Outcomes ?? m.outcomes ?? m.Runners ?? m.runners;
  if (!Array.isArray(selections)) return 0;
  return selections.filter((s) => isRecord(s)).length;
};

const pick1x2Market = (markets: unknown): Record<string, unknown> | null => {
  if (!Array.isArray(markets)) return null;
  let fallback: Record<string, unknown> | null = null;

  for (const m of markets) {
    if (!isRecord(m)) continue;
    const selections = m.Selections ?? m.selections ?? m.Outcomes ?? m.outcomes ?? m.Runners ?? m.runners;
    if (!Array.isArray(selections) || selections.length < 3) continue;

    const count = selectionCount(m);
    if (count >= 3 && count <= 6) {
      if (!fallback) fallback = m;
    }

    if (normalizedMarketTypeId(m) === ONE_X_TWO_MARKET_TYPE_ID) {
      return m;
    }
  }

  for (const m of markets) {
    if (!isRecord(m)) continue;
    const title =
      str(m.Name) ||
      str(m.name) ||
      str(m.MarketName) ||
      str(m.Type) ||
      str(m.type) ||
      str(m.Description);
    const selections = m.Selections ?? m.selections ?? m.Outcomes ?? m.outcomes ?? m.Runners ?? m.runners;

    if (!Array.isArray(selections) || selections.length < 3) continue;

    if (title && MARKET_HINT.test(title)) {
      return m;
    }
    if (MARKET_HINT.test(JSON.stringify(m).slice(0, 400))) {
      return m;
    }
  }

  return fallback;
};

type SideSlot = { price: string; boosted: boolean; original?: string } | undefined;

const mapMarketTo1x2 = (market: Record<string, unknown>): OneXtwoPrices | null => {
  const selections =
    market.Selections ?? market.selections ?? market.Outcomes ?? market.outcomes ?? market.Runners ?? market.runners;
  if (!Array.isArray(selections)) return null;

  const triple: {
    home?: SideSlot;
    draw?: SideSlot;
    away?: SideSlot;
    labels: { h: string; d: string; a: string };
  } = {
    labels: { h: "1", d: "X", a: "2" },
  };

  const orderedPrices: { price: string; boosted: boolean; original?: string }[] = [];

  for (let i = 0; i < selections.length; i++) {
    const raw = selections[i];
    if (!isRecord(raw)) continue;
    const nm = selectionName(raw);
    const { price: pr, boosted, original } = selectionOdds(raw);
    if (!pr || pr === "0.00") continue;

    const bucket = classify1x2(nm || `slot${i}`);
    if (bucket === "home") triple.home = { price: pr, boosted, original };
    else if (bucket === "draw") triple.draw = { price: pr, boosted, original };
    else if (bucket === "away") triple.away = { price: pr, boosted, original };
    else orderedPrices.push({ price: pr, boosted, original });
    if (nm) {
      if (bucket === "home") triple.labels.h = nm;
      if (bucket === "draw") triple.labels.d = nm;
      if (bucket === "away") triple.labels.a = nm;
    }
  }

  let home = triple.home;
  let draw = triple.draw;
  let away = triple.away;
  if ((!home || !draw || !away) && orderedPrices.length >= 3) {
    home = home ?? { price: orderedPrices[0].price, boosted: false };
    draw = draw ?? { price: orderedPrices[1].price, boosted: false };
    away = away ?? { price: orderedPrices[2].price, boosted: false };
  }

  if (!home || !draw || !away) return null;

  return {
    labelHome: triple.labels.h || "1",
    labelDraw: triple.labels.d || "X",
    labelAway: triple.labels.a || "2",
    priceHome: home.price,
    priceDraw: draw.price,
    priceAway: away.price,
    boostHome: home.boosted || undefined,
    boostDraw: draw.boosted || undefined,
    boostAway: away.boosted || undefined,
    ...(home.boosted && home.original ? { originalHome: home.original } : {}),
    ...(draw.boosted && draw.original ? { originalDraw: draw.original } : {}),
    ...(away.boosted && away.original ? { originalAway: away.original } : {}),
  };
};

const fixtureKeyFor = (row: Record<string, unknown>, index: number): string => {
  const id =
    row.Id ?? row.EventId ?? row.FixtureId ?? row.id ?? row.MatchId ?? row.matchId;
  const s = str(id);
  return s.length > 0 ? s : `fixture-${index}`;
};

/** Best-effort kickoff for sorting / grouping */
const parseEventStartIso = (row: Record<string, unknown>): string | null => {
  const candidates: unknown[] = [
    row.FixtureDateUtc,
    row.fixtureDateUtc,
    row.KickOff,
    row.kickOff,
    row.StartTime,
    row.startTime,
    row.EventDate,
    row.eventDate,
    row.FixtureDate,
    row.fixtureDate,
    row.MatchDateTime,
    row.matchDateTime,
    row.DateUtc,
    row.dateUtc,
    row.UtcKickOff,
    row.utcKickOff,
    row.EventStart,
    row.eventStart,
    row.ScheduledStart,
    row.scheduledStart,
  ];

  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c)) {
      const ms = c > 1e12 ? c : c * 1000;
      const d = new Date(ms);
      if (!Number.isNaN(d.getTime())) return d.toISOString();
      continue;
    }
    const s = str(c);
    if (!s) continue;
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }

  return null;
};

const rowHasMarketsArray = (row: Record<string, unknown>): boolean =>
  Array.isArray(row.Markets ?? row.markets ?? row.OfferedMarkets ?? row.offeredMarkets);

const extractFixturesFromRecord = (root: Record<string, unknown>): Record<string, unknown>[] => {
  const candidates: unknown[] = [
    root.Fixtures,
    root.fixtures,
    root.Events,
    root.events,
    root.Items,
    root.items,
    root.Results,
    root.results,
    root.Data,
    root.data,
  ];

  const nested = root.Data ?? root.data;
  if (isRecord(nested)) {
    candidates.push(
      nested.Fixtures,
      nested.fixtures,
      nested.Events,
      nested.events,
      nested.Items,
      nested.items,
      nested.Result,
      nested.result
    );
  }

  for (const c of candidates) {
    if (Array.isArray(c)) {
      const objs = c.filter(isRecord);
      const looksLikeFixtures = objs.some((o) => rowHasMarketsArray(o) || pickTeams(o));
      if (looksLikeFixtures || objs.length === 0) return objs;
    }
  }

  /** Fallback: shallow search for arrays whose first item looks like an event. */
  const queue: unknown[] = [root];
  for (let depth = 0; depth < 24 && queue.length; depth++) {
    const nextQueue: unknown[] = [];
    for (const node of queue) {
      if (!isRecord(node)) continue;
      for (const v of Object.values(node)) {
        if (!Array.isArray(v) || v.length === 0) continue;
        const first = v[0];
        if (!isRecord(first)) continue;
        if (pickTeams(first) || rowHasMarketsArray(first)) return v.filter(isRecord);
        if (isRecord(first)) nextQueue.push(first);
      }
      nextQueue.push(...Object.values(node));
    }
    queue.length = 0;
    queue.push(...nextQueue.slice(0, 40));
  }

  return [];
};

export function extractPrematchFixtures(payload: unknown): PrematchFixtureUi[] {
  if (!isRecord(payload)) return [];

  const rows = extractFixturesFromRecord(payload);
  const out: PrematchFixtureUi[] = [];

  rows.forEach((row, index) => {
    const teams = pickTeams(row);
    if (!teams) return;

    const markets = row.Markets ?? row.markets ?? row.OfferedMarkets ?? row.offeredMarkets;
    const market = pick1x2Market(markets);
    const oneXtwo = market ? mapMarketTo1x2(market) : null;

    out.push({
      fixtureKey: fixtureKeyFor(row, index),
      homeTeam: teams.home,
      awayTeam: teams.away,
      eventTitle: `${teams.home} vs ${teams.away}`,
      eventStart: parseEventStartIso(row),
      oneXtwo,
    });
  });

  return out;
}

/** Boosted prematch feed — first market per fixture with arbitrary selection shapes */
export type BoostedSelectionUi = {
  name: string;
  price: string;
  boosted: boolean;
  original?: string;
};

export type BoostedMarketUi = {
  name: string;
  marketTypeId: number | null;
  selections: BoostedSelectionUi[];
};

export type BoostedFixtureUi = {
  fixtureKey: string;
  fixtureName: string;
  competitionName: string;
  categoryName: string;
  eventStart: string | null;
  market: BoostedMarketUi | null;
};

const rowLooksLikeBoostedFixture = (o: Record<string, unknown>): boolean =>
  Boolean(str(o.fixtureName ?? o.FixtureName)) && Array.isArray(o.markets ?? o.Markets);

const extractBoostedFixtureRows = (root: Record<string, unknown>): Record<string, unknown>[] => {
  const sports = root.sports ?? root.Sports;
  if (isRecord(sports)) {
    const fx = sports.fixtures ?? sports.Fixtures;
    if (Array.isArray(fx)) {
      const objs = fx.filter(isRecord);
      if (objs.some(rowLooksLikeBoostedFixture)) return objs;
    }
  }

  const queue: unknown[] = [root];
  for (let depth = 0; depth < 16 && queue.length; depth++) {
    const nextQueue: unknown[] = [];
    for (const node of queue) {
      if (!isRecord(node)) continue;
      for (const v of Object.values(node)) {
        if (!Array.isArray(v) || v.length === 0) continue;
        const first = v[0];
        if (!isRecord(first)) continue;
        if (rowLooksLikeBoostedFixture(first)) return v.filter(isRecord);
        if (isRecord(first)) nextQueue.push(first);
      }
      nextQueue.push(...Object.values(node).filter(isRecord));
    }
    queue.length = 0;
    queue.push(...nextQueue.slice(0, 60));
  }

  return [];
};

const resolveBoostedMarketDisplayName = (m: Record<string, unknown>): string => {
  let name = str(m.name ?? m.Name);
  const lineVal = readFiniteNumber(m.lineValue ?? m.LineValue ?? m.specialValue ?? m.SpecialValue);
  const spec = m.specifiers ?? m.Specifiers;
  let lineStr = "";
  if (isRecord(spec)) {
    lineStr = str(spec.line ?? spec.Line);
  }
  if (!lineStr && lineVal !== null) lineStr = String(lineVal);
  if (name.includes("{line}") && lineStr) {
    name = name.replace(/\{line\}/gi, lineStr);
  }
  return name.trim() || "Market";
};

const mapFirstMarketToBoostedUi = (market: Record<string, unknown>): BoostedMarketUi | null => {
  const selections = market.selections ?? market.Selections;
  if (!Array.isArray(selections)) return null;

  const out: BoostedSelectionUi[] = [];
  for (const raw of selections) {
    if (!isRecord(raw)) continue;
    const nm = selectionName(raw);
    const priceField = raw.price ?? raw.Price;
    if (!isRecord(priceField)) continue;
    const pr = parsePriceObject(priceField);
    if (!pr.price) continue;
    out.push({ name: nm || "?", price: pr.price, boosted: pr.boosted, original: pr.original });
  }

  if (out.length === 0) return null;

  return {
    name: resolveBoostedMarketDisplayName(market),
    marketTypeId: normalizedMarketTypeId(market),
    selections: out,
  };
};

export function extractBoostedFixtures(payload: unknown): BoostedFixtureUi[] {
  if (!isRecord(payload)) return [];

  const rows = extractBoostedFixtureRows(payload);
  const out: BoostedFixtureUi[] = [];

  rows.forEach((row, index) => {
    const markets = row.markets ?? row.Markets;
    if (!Array.isArray(markets) || markets.length === 0) return;
    const first = markets[0];
    if (!isRecord(first)) return;
    const marketUi = mapFirstMarketToBoostedUi(first);
    if (!marketUi) return;

    const fid = str(row.fixtureId ?? row.FixtureId ?? row.id);
    const fixtureKey = fid.length > 0 ? fid : `boosted-${index}`;

    out.push({
      fixtureKey,
      fixtureName: str(row.fixtureName ?? row.FixtureName),
      competitionName: str(row.competitionName ?? row.CompetitionName),
      categoryName: str(row.categoryName ?? row.CategoryName),
      eventStart: parseEventStartIso(row),
      market: marketUi,
    });
  });

  return out;
}
