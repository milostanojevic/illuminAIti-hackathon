"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Brand } from "@/types/brand";
import type { PromoCategoryKey, PromotionUi } from "@/app/api/promotions/route";

type PromoCarouselProps = {
  category: PromoCategoryKey;
  title: string;
  icon: string;
  brand: Brand;
  promotions: PromotionUi[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
};

const EMPTY_COPY: Record<PromoCategoryKey, { title: string; body: string }> = {
  freebets: {
    title: "Nothing to show yet",
    body: "We're out of free bets right now — check back soon.",
  },
  freespins: {
    title: "Nothing to show yet",
    body: "No free spins are live right now — pull again in a bit.",
  },
  cashback: {
    title: "Nothing to show yet",
    body: "No cashback offers live right now — refresh to look again.",
  },
};

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12a8 8 0 0 1 14.32-4.906M20 12a8 8 0 0 1-14.32 4.906M20 12h3M4 12H1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const PromoCarousel = ({
  category,
  title,
  icon,
  brand,
  promotions,
  loading,
  error,
  onRefresh,
}: PromoCarouselProps) => {
  const isBk = brand === "bk";
  const accentBg = isBk ? "#1a2b6b" : "#1a2db8";
  const accentSoft = isBk ? "#00d8c8" : "#FFCD00";
  const empty = !loading && !error && promotions.length === 0;
  const showCarousel = !loading && !error && promotions.length > 0;

  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeInfoId, setActiveInfoId] = useState<string | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startLeft = useRef(0);

  const updateDots = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".promo-card-item");
    const amount = card ? card.offsetWidth + 8 : 248;
    setActiveIdx(Math.round(el.scrollLeft / amount));
  }, []);

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
  }, [updateDots, promotions.length]);

  useEffect(() => {
    setActiveIdx(0);
    if (carouselRef.current) carouselRef.current.scrollLeft = 0;
  }, [promotions]);

  const move = (direction: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".promo-card-item");
    const amount = card ? card.offsetWidth + 8 : 248;
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

  const activePromotion = activeInfoId ? promotions.find((p) => p.id === activeInfoId) : null;

  const headerSub =
    loading ? "Loading offers…" : empty ? "No live offers right now" : `${promotions.length} offer${promotions.length === 1 ? "" : "s"}`;

  const showNav = showCarousel && promotions.length >= 2;

  return (
    <div className="shrink-0 rounded-xl border border-gray-200/80 bg-white overflow-hidden shadow-sm">
      <div
        className="px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-2 border-b border-black/5"
        style={{ background: `linear-gradient(135deg, ${accentBg}, ${isBk ? "#0d1a3a" : "#0d1580"})` }}
      >
        <span className="text-base leading-none shrink-0" aria-hidden>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-xs sm:text-[13px] font-extrabold text-white">{title}</div>
          <div className="text-[9px] sm:text-[10px] text-white/70 mt-0.5">{headerSub}</div>
        </div>
        {showNav && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => move(-1)}
              className="w-6 h-6 rounded-full border-none bg-white/15 text-white text-[15px] font-extrabold cursor-pointer flex items-center justify-center leading-none active:scale-95"
              aria-label="Previous offer"
            >
              ‹
            </button>
            <div className="flex gap-1 mx-0.5">
              {promotions.map((_, i) => (
                <div
                  key={i}
                  className={`w-[5px] h-[5px] rounded-full ${i === activeIdx ? "bg-white" : "bg-white/35"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => move(1)}
              className="w-6 h-6 rounded-full border-none bg-white/15 text-white text-[15px] font-extrabold cursor-pointer flex items-center justify-center leading-none active:scale-95"
              aria-label="Next offer"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="relative px-3 py-2.5 sm:px-4 sm:py-3 min-h-[120px]">
        {activePromotion?.shortDescription && (
          <div
            className="absolute inset-0 z-40 flex items-end sm:items-center justify-center p-3 bg-black/45"
            role="presentation"
            onClick={() => setActiveInfoId(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`promo-info-${activePromotion.id}`}
              className="bg-white rounded-xl max-w-sm w-full shadow-xl border border-gray-100 p-3 sm:p-4 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div id={`promo-info-${activePromotion.id}`} className="text-[12px] font-extrabold text-[#1a1a2e] pr-2">
                  {activePromotion.title}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveInfoId(null)}
                  className="shrink-0 text-[11px] font-bold text-slate-500 px-2 py-0.5 rounded-full hover:bg-slate-100"
                >
                  Close
                </button>
              </div>
              <p className="text-[10.5px] sm:text-[11px] text-slate-600 leading-relaxed">{activePromotion.shortDescription}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex gap-2">
            <div className="flex-1 h-28 rounded-xl bg-slate-100 animate-pulse" />
            <div className="flex-1 h-28 rounded-xl bg-slate-100 animate-pulse hidden sm:block" />
          </div>
        )}

        {error && !loading && (
          <div className="px-1 py-3 sm:py-4 text-center">
            <div className="text-[12px] font-bold text-[#1a1a2e] mb-1">Could not load offers</div>
            <div className="text-[10.5px] text-slate-600 mb-3">{error}</div>
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-extrabold text-[#1a1a2e] cursor-pointer"
            >
              <RefreshIcon className="w-3 h-3" /> Refresh
            </button>
          </div>
        )}

        {empty && !loading && (
          <div className="px-1 py-3 sm:py-4 text-center">
            <div className="text-[20px] mb-1" aria-hidden>
              {icon}
            </div>
            <div className="text-[12px] font-bold text-[#1a1a2e] mb-1">{EMPTY_COPY[category].title}</div>
            <div className="text-[10.5px] text-slate-600 mb-3">{EMPTY_COPY[category].body}</div>
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-extrabold text-[#1a1a2e] cursor-pointer"
            >
              <RefreshIcon className="w-3 h-3" /> Refresh
            </button>
          </div>
        )}

        {showCarousel && (
          <div
            ref={carouselRef}
            className="trending-carousel"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {promotions.map((p) => (
              <article
                key={p.id}
                className="promo-card-item flex-none w-[240px] sm:w-[280px] md:w-[300px] rounded-xl overflow-hidden bg-slate-100 border border-gray-100 scroll-snap-start"
              >
                <div className="aspect-[16/9] w-full bg-slate-200 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.bannerImageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                  {p.shortDescription ? (
                    <button
                      type="button"
                      onClick={() => setActiveInfoId(p.id)}
                      aria-label="More info"
                      className="absolute top-1.5 right-1.5 z-[2] w-6 h-6 rounded-full bg-black/55 text-white text-[11px] font-extrabold inline-flex items-center justify-center cursor-pointer hover:bg-black/70"
                    >
                      i
                    </button>
                  ) : null}
                </div>
                <div className="p-2.5">
                  <div className="text-[12px] font-extrabold text-[#1a1a2e] line-clamp-2 mb-1.5 min-h-[2.25rem]">{p.title}</div>
                  {p.ctaButtonText ? (
                    <button
                      type="button"
                      className="w-full rounded-full px-3 py-1.5 text-[11px] font-extrabold cursor-pointer border-none"
                      style={{ background: accentSoft, color: isBk ? "#0d1580" : "#003030" }}
                    >
                      {p.ctaButtonText}
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div
        className="h-1 w-full opacity-80"
        style={{ background: `linear-gradient(90deg, transparent, ${accentSoft}, transparent)` }}
      />
    </div>
  );
};
