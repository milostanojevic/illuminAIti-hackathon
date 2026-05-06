import type { CasinoGamesProviderResult } from "@/app/api/casino/games/route";
import type { ProviderKey } from "@/types/brand";

const inFlight = new Map<string, Promise<CasinoGamesProviderResult[]>>();

const cacheKeyFor = (providers: ProviderKey[]): string =>
  Array.from(new Set(providers)).sort().join(",");

export class CasinoGamesClientError extends Error {
  status: number;
  constructor(msg: string, status: number) {
    super(msg);
    this.name = "CasinoGamesClientError";
    this.status = status;
  }
}

export const fetchCasinoGamesByProviders = (
  providers: ProviderKey[]
): Promise<CasinoGamesProviderResult[]> => {
  if (providers.length === 0) return Promise.resolve([]);
  const key = cacheKeyFor(providers);

  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const qs = encodeURIComponent(key);
    const res = await fetch(`/api/casino/games?providers=${qs}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const payload: unknown = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg =
        typeof payload === "object" && payload !== null && "error" in payload
          ? String((payload as { error: unknown }).error)
          : res.statusText;
      throw new CasinoGamesClientError(errMsg || `Request failed (${res.status})`, res.status);
    }

    if (!payload || typeof payload !== "object" || !("results" in payload)) {
      throw new CasinoGamesClientError("Unexpected response", 0);
    }
    const raw = (payload as { results: unknown }).results;
    if (!Array.isArray(raw)) {
      throw new CasinoGamesClientError("Unexpected response shape", 0);
    }
    return raw as CasinoGamesProviderResult[];
  })();

  inFlight.set(key, promise);
  promise.finally(() => {
    if (inFlight.get(key) === promise) inFlight.delete(key);
  });
  return promise;
};
