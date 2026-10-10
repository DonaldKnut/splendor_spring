"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

export type MediaSlide = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

type Variant = "hero" | "cards" | "filmstrip";

function NavArrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      {dir === "prev" ? (
        <path
          d="M14.25 6.75 9 12l5.25 5.25"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.75 6.75 15 12l-5.25 5.25"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function NavButtons({ prevClass, nextClass }: { prevClass: string; nextClass: string }) {
  return (
    <div className="media-swiper-nav">
      <button
        type="button"
        className={clsx("media-nav-btn", prevClass)}
        aria-label="Previous slide"
      >
        <NavArrow dir="prev" />
      </button>
      <button
        type="button"
        className={clsx("media-nav-btn", nextClass)}
        aria-label="Next slide"
      >
        <NavArrow dir="next" />
      </button>
    </div>
  );
}

export function MediaSwiper({
  slides,
  variant = "cards",
  className,
  autoplay = true,
  loop = true,
  renderHeader,
}: {
  slides: MediaSlide[];
  variant?: Variant;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  /** When set, nav arrows are passed into this render prop instead of overlaying the carousel. */
  renderHeader?: (nav: ReactNode) => ReactNode;
}) {
  const uid = useId().replace(/:/g, "");
  const prevClass = `media-nav-prev-${uid}`;
  const nextClass = `media-nav-next-${uid}`;
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  if (!slides.length) return null;

  const isFilm = variant === "filmstrip";
  const isHero = variant === "hero";
  const showNav = !isFilm;
  const nav = showNav ? <NavButtons prevClass={prevClass} nextClass={nextClass} /> : null;

  return (
    <div
      className={clsx(
        "media-swiper relative",
        isHero && "media-swiper--hero",
        isFilm && "media-swiper--film",
        showNav && !renderHeader && "media-swiper--nav",
        className,
      )}
    >
      {renderHeader ? renderHeader(nav) : null}

      {showNav && !renderHeader ? (
        <div className="pointer-events-none absolute -top-14 right-0 z-10">
          <div className="pointer-events-auto">{nav}</div>
        </div>
      ) : null}

      {ready ? (
        <Swiper
          modules={[Autoplay, Pagination, Navigation, FreeMode]}
          loop={loop && slides.length > 2}
          speed={700}
          spaceBetween={isFilm ? 12 : isHero ? 0 : 16}
          slidesPerView={isHero ? 1 : isFilm ? 1.35 : 1.15}
          centeredSlides={isHero}
          freeMode={isFilm}
          navigation={
            showNav
              ? {
                  prevEl: `.${prevClass}`,
                  nextEl: `.${nextClass}`,
                }
              : false
          }
          pagination={isHero ? { clickable: true } : false}
          autoplay={
            autoplay
              ? { delay: isHero ? 5200 : 3800, disableOnInteraction: false }
              : false
          }
          breakpoints={
            isHero
              ? undefined
              : isFilm
                ? {
                    240: { slidesPerView: 1.2, spaceBetween: 10 },
                    360: { slidesPerView: 1.45, spaceBetween: 12 },
                    640: { slidesPerView: 2.2, spaceBetween: 14 },
                    1024: { slidesPerView: 3.2, spaceBetween: 16 },
                  }
                : {
                    240: { slidesPerView: 1.05, spaceBetween: 12 },
                    360: { slidesPerView: 1.2, spaceBetween: 14 },
                    640: { slidesPerView: 2.1, spaceBetween: 16 },
                    1024: { slidesPerView: 3, spaceBetween: 20 },
                  }
          }
          className="!overflow-visible"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <figure
                className={clsx(
                  "group relative overflow-hidden bg-[var(--c-surface-3,#f1f5f9)]",
                  isHero
                    ? "aspect-[16/10] min-h-[14rem] rounded-[1.25rem] sm:rounded-[1.75rem]"
                    : isFilm
                      ? "aspect-[4/5] rounded-2xl"
                      : "aspect-[5/4] rounded-[1.35rem] shadow-[var(--shadow-sm)]",
                )}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(28,16,10,0.72) 0%, rgba(28,16,10,0.1) 45%, transparent 70%)",
                  }}
                />
                {(slide.caption || slide.alt) && (
                  <figcaption className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5">
                    <p className="font-display text-sm font-semibold text-white sm:text-base">
                      {slide.caption || slide.alt}
                    </p>
                  </figcaption>
                )}
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div
          className={clsx(
            "animate-pulse bg-[var(--c-surface-3)]",
            isHero ? "aspect-[16/10] rounded-[1.75rem]" : "aspect-[5/4] rounded-[1.35rem]",
          )}
        />
      )}
    </div>
  );
}
