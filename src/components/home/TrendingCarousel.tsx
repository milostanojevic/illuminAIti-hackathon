"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { TrendingCard } from "@/lib/trending";

type TrendingCarouselProps = {
  cards: TrendingCard[];
};

export const TrendingCarousel = ({ cards }: TrendingCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startLeft = useRef(0);

  const updateDots = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".trending-card-item");
    const amount = card ? card.offsetWidth + 8 : 184;
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
  }, [updateDots]);

  const move = (direction: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".trending-card-item");
    const amount = card ? card.offsetWidth + 8 : 184;
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

  return (
    <div className="bg-white rounded-[14px] p-2.5 sm:p-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-2 sm:mb-2.5">
        <div className="text-xs font-extrabold text-[#1a1a2e] flex items-center gap-1.5">
          <span>🔥</span><span>Trending now</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => move(-1)}
            className="w-6 h-6 rounded-full border-none bg-[#eef1fb] text-bk-primary text-[15px] font-extrabold cursor-pointer flex items-center justify-center leading-none active:scale-95"
          >
            ‹
          </button>
          <div className="flex gap-1 mx-0.5">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`w-[5px] h-[5px] rounded-full ${i === activeIdx ? "bg-bk-primary" : "bg-[#d8dbe5]"}`}
              />
            ))}
          </div>
          <button
            onClick={() => move(1)}
            className="w-6 h-6 rounded-full border-none bg-[#eef1fb] text-bk-primary text-[15px] font-extrabold cursor-pointer flex items-center justify-center leading-none active:scale-95"
          >
            ›
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
        {cards.map((card, i) => (
          <div
            key={i}
            className="trending-card-item flex-none w-[176px] sm:w-[210px] md:w-[230px] rounded-xl p-2.5 sm:p-3 scroll-snap-start relative overflow-hidden text-white flex flex-col gap-2 sm:gap-2.5"
            style={{ background: card.bg }}
          >
            <div className="self-start text-[8.5px] font-extrabold tracking-wide uppercase rounded-full px-[7px] py-1 bg-white/[0.16] relative">
              {card.chip}
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 relative">
              <div className="w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-[11px] bg-white/15 flex items-center justify-center text-lg sm:text-[19px] flex-shrink-0">
                {card.icon}
              </div>
              <div className="flex-1">
                <div className="text-xs sm:text-[13px] font-extrabold leading-tight mb-[3px]">
                  {card.name}
                </div>
                <div className="text-[9.5px] sm:text-[10px] text-white/70 leading-snug">
                  {card.desc}
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-between text-[10px] font-bold text-white/90">
              <span>{card.cta}</span>
              <span className="text-[13px]">›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
