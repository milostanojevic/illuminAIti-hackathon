import type { PrematchCompetitionResult } from "@/app/api/offer/prematch/route";

const inFlight = new Map<string, Promise<PrematchCompetitionResult[]>>();

const cacheKeyFor = (ids: number[]): string =>
  Array.from(new Set(ids)).sort((a, b) => a - b).join(",");

export class PrematchClientError extends Error {
  status: number;
  constructor(msg: string, status: number) {
    super(msg);
    this.name = "PrematchClientError";
    this.status = status;
  }
}

export const fetchPrematchByCompetitionIds = (
  competitionIds: number[]
): Promise<PrematchCompetitionResult[]> => {
  if (competitionIds.length === 0) return Promise.resolve([]);
  const key = cacheKeyFor(competitionIds);

  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const qs = encodeURIComponent(key);
    const res = await fetch(`/api/offer/prematch?competitionIds=${qs}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const payload: unknown = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg =
        typeof payload === "object" && payload !== null && "error" in payload
          ? String((payload as { error: unknown }).error)
          : res.statusText;
      throw new PrematchClientError(errMsg || `Request failed (${res.status})`, res.status);
    }

    if (!payload || typeof payload !== "object" || !("results" in payload)) {
      throw new PrematchClientError("Unexpected response", 0);
    }
    const raw = (payload as { results: unknown }).results;
    if (!Array.isArray(raw)) {
      throw new PrematchClientError("Unexpected response shape", 0);
    }
    return raw as PrematchCompetitionResult[];
  })();

  inFlight.set(key, promise);
  promise.finally(() => {
    if (inFlight.get(key) === promise) inFlight.delete(key);
  });
  return promise;
};
