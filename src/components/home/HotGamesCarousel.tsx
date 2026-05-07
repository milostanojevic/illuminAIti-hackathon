"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HomepageGameCard } from "@/lib/homepageGamesWidget";
import { parseHomepageGamesWidget } from "@/lib/homepageGamesWidget";

type HotGamesCarouselProps = {
  brand?: "ss" | "bk";
};

export const HotGamesCarousel = ({ brand = "ss" }: HotGamesCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [games, setGames] = useState<HomepageGameCard[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [activeIdx, setActiveIdx] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startLeft = useRef(0);

  const isBk = brand === "bk";
  const accent = "#FFCD00";

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    fetch("/api/trending-hot-games")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((json: unknown) => {
        if (cancelled) return;
        setGames(parseHomepageGamesWidget(json));
        setLoadState("ok");
      })
      .catch(() => {
        if (cancelled) return;
        setGames([]);
        setLoadState("err");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateDots = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".hot-game-card-item");
    const amount = card ? card.offsetWidth + 8 : 132;
    const maxIdx = Math.max(0, games.length - 1);
    setActiveIdx(Math.min(maxIdx, Math.max(0, Math.round(el.scrollLeft / amount))));
  }, [games.length]);

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
  }, [updateDots, games.length]);

  const move = (direction: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".hot-game-card-item");
    const amount = card ? card.offsetWidth + 8 : 132;
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

  if (loadState === "loading" && games.length === 0) {
    return (
      <div className="shrink-0 rounded-[14px] border border-gray-100 bg-white p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] sm:p-3">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-extrabold text-[#1a1a2e] sm:mb-2.5">
          <span className="text-[15px]" aria-hidden>
            🚀
          </span>
          <span>Hot Games</span>
        </div>
        <div className="h-36 animate-pulse rounded-xl bg-[#eef1fb]" />
      </div>
    );
  }

  if (games.length === 0) {
    return null;
  }

  return (
    <div className="shrink-0 rounded-[14px] border border-gray-100 bg-white p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] sm:p-3">
      <div className="mb-2 flex items-center justify-between sm:mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1a1a2e]">
          <span className="text-[15px] leading-none" aria-hidden>
            🚀
          </span>
          <span>Hot Games</span>
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
            {games.map((_, i) => (
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
        {games.map((game) => (
          <a
            key={game.id}
            href={game.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hot-game-card-item flex-none scroll-snap-start overflow-hidden rounded-xl border border-gray-100 bg-[#f8f9fc] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-transform active:scale-[0.98]"
            style={{ width: "min(42vw, 124px)" }}
          >
            <div className="relative aspect-[376/250] w-full overflow-hidden bg-[#e8eaf0]">
              <img
                src={game.imageUrl}
                alt={game.gameName}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
            <div className="line-clamp-2 px-1.5 py-1.5 text-center text-[8.5px] font-bold leading-tight text-[#1a1a2e] sm:px-2 sm:py-2 sm:text-[9px]">
              {game.gameName}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
