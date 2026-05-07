"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { BookingCodeEntry, CodeZoneSelection } from "@/lib/codeZoneBooking";
import {
  buildLegSubtitle,
  formatPlacedShort,
  isLegDimmed,
  parseCodeZonePayload,
  pickLegHeadline,
} from "@/lib/codeZoneBooking";
import { Crest } from "@/components/ui/Crest";
import type { TrendingCard } from "@/lib/trending";
import { TrendingCarousel } from "@/components/home/TrendingCarousel";

const MAX_LEGS = 3;

const FlameIcon = ({ className }: { className?: string }) => {
  const raw = useId();
  const gid = `tf-${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 2c0 4-4 5-4 10a4 4 0 108 0c0-3-2-4.5-2-7 .5 1.2 1.5 2.2 2.5 3.1C17 10.5 18 12.2 18 14a6 6 0 11-12 0c0-2.2 1.1-4 3-5.2C8.5 6.8 10 4.8 12 2z"
        fill={`url(#${gid})`}
      />
      <defs>
        <linearGradient id={gid} x1="8" y1="2" x2="16" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M8 7V5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2H8z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

const OddsUpIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-[#FFCD00]" aria-hidden>
    <path d="M12 5l7 8H5l7-8z" fill="currentColor" />
  </svg>
);

function crestSourceName(sel: CodeZoneSelection): string {
  const sn = String(sel.selectionName ?? "").trim();
  if (sn === "1") return sel.homeTeamName?.trim() || "Other";
  if (sn === "2") return sel.awayTeamName?.trim() || "Other";
  return sel.homeTeamName?.trim() || sel.awayTeamName?.trim() || "Other";
}

type TrendingSportBetsCarouselProps = {
  brand?: "ss" | "bk";
  /** Shown if the upstream widget returns no slips or the proxy request fails. */
  fallbackCards?: TrendingCard[];
};

export const TrendingSportBetsCarousel = ({
  brand = "ss",
  fallbackCards,
}: TrendingSportBetsCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<BookingCodeEntry[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [activeIdx, setActiveIdx] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startLeft = useRef(0);

  const isBk = brand === "bk";
  const primary = isBk ? "#0d1580" : "#0d1580";
  const accent = "#FFCD00";
  const mutedFire = "#9a3412";

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    fetch("/api/trending-booking-codes")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: unknown) => {
        if (cancelled) return;
        const list = parseCodeZonePayload(json);
        setItems(list);
        setLoadState("ok");
      })
      .catch(() => {
        if (cancelled) return;
        setItems([]);
        setLoadState("err");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateDots = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".trending-bet-card-item");
    const amount = card ? card.offsetWidth + 8 : 300;
    setActiveIdx(
      Math.min(Math.max(items.length - 1, 0), Math.max(0, Math.round(el.scrollLeft / amount)))
    );
  }, [items.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(updateDots, 80);
    };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, [updateDots, items.length]);

  const move = (direction: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".trending-bet-card-item");
    const amount = card ? card.offsetWidth + 8 : 300;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
    setTimeout(updateDots, 260);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const el = carouselRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.clientX;
    startLeft.current = el.scrollLeft;
    el.classList.add("dragging");
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    carouselRef.current.scrollLeft = startLeft.current - (e.clientX - startX.current);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    carouselRef.current?.classList.remove("dragging");
    updateDots();
  };

  const copyCode = (code: string) => {
    void navigator.clipboard?.writeText(code).catch(() => {});
  };

  if (loadState === "loading" && items.length === 0) {
    return (
      <div className="shrink-0 rounded-[14px] border border-gray-100 bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 text-xs font-extrabold text-[#1a1a2e]">
          <FlameIcon />
          <span>Trending Bets</span>
        </div>
        <div className="mt-3 h-24 animate-pulse rounded-xl bg-[#eef1fb]" />
      </div>
    );
  }

  if (items.length === 0) {
    if (fallbackCards?.length) return <TrendingCarousel brand={brand} cards={fallbackCards} />;
    return null;
  }

  return (
    <div className="shrink-0 rounded-[14px] border border-gray-100 bg-white p-2.5 sm:p-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="mb-2 flex items-center justify-between sm:mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1a1a2e]">
          <FlameIcon className="shrink-0" />
          <span>Trending Bets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => move(-1)}
            className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none text-[15px] font-extrabold leading-none active:scale-95 ${
              isBk ? "bg-[#eef1fb] text-bk-primary" : "bg-[#eef1fb] text-[#0d1580]"
            }`}
            aria-label="Previous"
          >
            ‹
          </button>
          <div className="mx-0.5 flex gap-1">
            {items.map((_, i) => (
              <div
                key={i}
                className={`h-[5px] w-[5px] rounded-full ${
                  i === activeIdx ? (isBk ? "bg-bk-primary" : "bg-[#0d1580]") : "bg-[#d8dbe5]"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => move(1)}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none leading-none active:scale-95"
            style={{ background: accent, color: "#0d1580" }}
            aria-label="Next"
          >
            <span className="text-[15px] font-extrabold">›</span>
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="trending-carousel"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {items.map((slip) => {
          const legs = slip.selections.slice(0, MAX_LEGS);
          const odds = Number(slip.totalOdds);
          const totalOddsLabel = Number.isFinite(odds) ? odds.toFixed(2) : "—";

          return (
            <article
              key={slip.bookingCode}
              className="trending-bet-card-item flex-none scroll-snap-start rounded-xl border border-gray-100 bg-white p-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sm:p-3"
              style={{ width: "min(92vw, 300px)" }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyCode(slip.bookingCode)}
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg hover:bg-[#eef2ff]"
                    style={{ color: primary }}
                    aria-label={`Copy booking code ${slip.bookingCode}`}
                  >
                    <CopyIcon />
                  </button>
                  <span
                    className="truncate font-mono text-[13px] font-extrabold tracking-tight sm:text-sm"
                    style={{ color: primary }}
                  >
                    {slip.bookingCode}
                  </span>
                </div>
                <div
                  className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold"
                  style={{ color: mutedFire }}
                >
                  <span className="text-[11px]" aria-hidden>
                    🔥
                  </span>
                  <span>{formatPlacedShort(slip.betCount)} placed</span>
                </div>
              </div>

              <ul className="mb-2.5 space-y-2 border-b border-gray-100 pb-2">
                {legs.map((sel, idx) => {
                  const dim = isLegDimmed(sel);
                  const odd = sel.oddValue;
                  const prev = sel.unboostedOddValue;
                  const showDrift =
                    prev != null && Number.isFinite(prev) && odd != null && Number(prev) !== Number(odd);

                  return (
                    <li
                      key={sel.selectionId ?? `${slip.bookingCode}-${idx}`}
                      className={`flex gap-2 ${dim ? "opacity-45" : ""}`}
                    >
                      <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-[#f1f5f9] ring-1 ring-gray-100">
                        <Crest name={crestSourceName(sel)} size={32} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-extrabold leading-tight text-[#1a1a2e]">
                          {pickLegHeadline(sel)}
                        </div>
                        <div className="text-[9px] leading-snug text-gray-500">{buildLegSubtitle(sel)}</div>
                      </div>
                      <div className="flex flex-col items-end justify-center text-right">
                        <div className="flex items-center gap-0.5">
                          <span className="text-[12px] font-extrabold" style={{ color: primary }}>
                            {odd != null && Number.isFinite(odd) ? odd.toFixed(2) : "—"}
                          </span>
                          {showDrift && (
                            <span className="flex flex-col items-center">
                              <OddsUpIcon />
                            </span>
                          )}
                        </div>
                        {showDrift && prev != null && (
                          <span className="text-[9px] text-gray-400 line-through">
                            {Number(prev).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-extrabold" style={{ color: primary }}>
                  {slip.folds} Fold | {totalOddsLabel}
                </div>
                <a
                  href="https://www.supersportbet.com/en-zm/sports"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-white"
                  style={{ background: primary }}
                >
                  View bet
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
