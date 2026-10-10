"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import type { GalleryImage } from "@/lib/media-gallery";

export function MegaFeaturedSwiper({
  slides,
  href = "/about",
  title = "Nurturing to Greater Heights",
  subtitle = "Early years & primary learning with character at the centre.",
  onNavigate,
  className,
}: {
  slides: GalleryImage[];
  href?: string;
  title?: string;
  subtitle?: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!slides.length) return null;

  return (
    <div className={className ?? "relative min-h-[210px] overflow-hidden md:min-h-full"}>
      {ready ? (
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={slides.length > 1}
          autoplay={{ delay: 3800, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="mega-featured-swiper absolute inset-0 h-full w-full"
          allowTouchMove
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <img
                src={slide.src}
                alt={slide.alt}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <img
          src={slides[0].src}
          alt={slides[0].alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(11,17,32,0.92), rgba(11,17,32,0.25))",
        }}
      />

      <Link
        href={href}
        className="absolute inset-x-0 bottom-0 z-10 p-6 text-white"
        onClick={onNavigate}
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d42a3a]">
          Featured
        </p>
        <p className="mt-2 font-display text-xl leading-snug">{title}</p>
        <p className="mt-1.5 text-xs text-white/70">{subtitle}</p>
      </Link>
    </div>
  );
}
