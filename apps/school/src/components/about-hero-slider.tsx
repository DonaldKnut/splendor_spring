"use client";

import { useEffect, useState } from "react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import type { GalleryImage } from "@/lib/media-gallery";

export function AboutHeroSlider({ slides }: { slides: GalleryImage[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!slides.length) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="relative aspect-[4/3] w-full min-h-[14rem] sm:min-h-[16rem]">
        {ready ? (
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop={slides.length > 1}
            autoplay={{ delay: 4200, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="about-hero-swiper absolute inset-0 h-full w-full"
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
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
          style={{
            background: "linear-gradient(to top, rgba(20,12,8,0.55), transparent)",
          }}
        />
      </div>
    </div>
  );
}
