import type { PrematchBoostedResult } from "@/app/api/offer/prematch-boosted/route";

let inFlight: Promise<PrematchBoostedResult> | null = null;

export class PrematchBoostedClientError extends Error {
  status: number;
  constructor(msg: string, status: number) {
    super(msg);
    this.name = "PrematchBoostedClientError";
    this.status = status;
  }
}

export const fetchBoostedPrematch = (): Promise<PrematchBoostedResult> => {
  if (inFlight) return inFlight;

  const promise = (async () => {
    const res = await fetch(`/api/offer/prematch-boosted`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    const payload: unknown = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg =
        typeof payload === "object" && payload !== null && "error" in payload
          ? String((payload as { error: unknown }).error)
          : res.statusText;
      throw new PrematchBoostedClientError(errMsg || `Request failed (${res.status})`, res.status);
    }

    if (!payload || typeof payload !== "object") {
      throw new PrematchBoostedClientError("Unexpected response", 0);
    }

    const p = payload as Partial<PrematchBoostedResult>;
    if (typeof p.ok !== "boolean" || !Array.isArray(p.fixtures)) {
      throw new PrematchBoostedClientError("Unexpected response shape", 0);
    }

    return {
      ok: p.ok,
      status: typeof p.status === "number" ? p.status : res.status,
      fixtures: p.fixtures,
      error: typeof p.error === "string" ? p.error : undefined,
    };
  })();

  inFlight = promise;
  promise.finally(() => {
    if (inFlight === promise) inFlight = null;
  });
  return promise;
};
