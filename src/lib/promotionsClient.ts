import type { PromotionsResponse } from "@/app/api/promotions/route";

export class PromotionsClientError extends Error {
  status: number;
  constructor(msg: string, status: number) {
    super(msg);
    this.name = "PromotionsClientError";
    this.status = status;
  }
}

export const fetchPromotions = async (refresh = false): Promise<PromotionsResponse> => {
  const url = refresh ? "/api/promotions?refresh=1" : "/api/promotions";
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const payload: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error: unknown }).error)
        : res.statusText;
    throw new PromotionsClientError(msg || `Request failed (${res.status})`, res.status);
  }
  return payload as PromotionsResponse;
};
