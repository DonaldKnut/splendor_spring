"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import clsx from "clsx";
import { HERO_GLOW, HERO_WASH } from "./media";

export type Slide = {
  id: string;
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

export function HeroSlider({
  slides,
  intervalMs = 7000,
  brandClassName,
  underlapHeader = true,
  wash = HERO_WASH,
  glow = HERO_GLOW,
  ctaTone = "gold",
}: {
  slides: Slide[];
  intervalMs?: number;
  brandClassName?: string;
  /** Extends hero under a fixed transparent header */
  underlapHeader?: boolean;
  wash?: string;
  glow?: string;
  ctaTone?: "gold" | "coral";
}) {
  const [index, setIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { scale: 1.045, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 1.35, ease: "power2.out" }
      );
      gsap.fromTo(
        copyRef.current,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", delay: 0.12 }
      );
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: intervalMs / 1000, ease: "none" }
        );
      }
    });
    return () => ctx.revert();
  }, [index, intervalMs]);

  const slide = slides[index];
  if (!slide) return null;

  const primaryStyle =
    ctaTone === "coral"
      ? {
          background: "linear-gradient(135deg, #d97845, #e8915f)",
          boxShadow: "0 12px 32px rgba(217,120,69,0.32)",
        }
      : {
          background: "linear-gradient(135deg, #b91c2c, #d42a3a)",
          boxShadow: "0 12px 32px rgba(185,28,44,0.32)",
        };

  return (
    <section
      className={clsx(
        "relative w-full overflow-hidden text-white",
        underlapHeader
          ? "h-[min(100svh,880px)] min-h-[30rem]"
          : "h-[min(90svh,820px)] min-h-[26rem]"
      )}
    >
      <div ref={panelRef} className="absolute inset-0" aria-hidden>
        <img
          src={slide.image}
          alt=""
          className="h-full w-full object-cover object-center"
          sizes="100vw"
          decoding="async"
          fetchPriority="high"
        />
      </div>
      <div className="absolute inset-0" style={{ background: wash }} />
      <div className="absolute inset-0" style={{ background: glow }} />
      {/* Soft bottom fade into the page */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36"
        style={{
          background:
            "linear-gradient(to top, rgba(28,16,10,0.55), transparent)",
        }}
        aria-hidden
      />

      <div
        className={clsx(
          "relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 sm:justify-center sm:px-6",
          underlapHeader ? "pb-24 pt-28 sm:pb-28 sm:pt-32" : "py-20 sm:py-24"
        )}
      >
        <div ref={copyRef} className="max-w-2xl">
          {slide.eyebrow ? (
            <p
              className={clsx(
                "mb-4 inline-flex items-center gap-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/75 sm:text-[0.72rem]",
                brandClassName
              )}
            >
              <span
                className="inline-block h-px w-7"
                style={{
                  background:
                    ctaTone === "coral"
                      ? "linear-gradient(90deg, #d97845, transparent)"
                      : "linear-gradient(90deg, #c9a06a, transparent)",
                }}
              />
              {slide.eyebrow}
            </p>
          ) : null}
          <h1 className="font-display text-[2.35rem] font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-[3.65rem]">
            {slide.title}
          </h1>
          {slide.subtitle ? (
            <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-white/70 sm:text-lg">
              {slide.subtitle}
            </p>
          ) : null}
          {(slide.ctaHref && slide.ctaLabel) ||
          (slide.secondaryCtaHref && slide.secondaryCtaLabel) ? (
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {slide.ctaHref && slide.ctaLabel ? (
                <a
                  href={slide.ctaHref}
                  className={clsx(
                    "inline-flex items-center rounded-full px-6 py-3 text-sm font-bold transition hover:brightness-105",
                    ctaTone === "coral" ? "text-white" : "text-[#faf6f0]"
                  )}
                  style={primaryStyle}
                >
                  {slide.ctaLabel}
                </a>
              ) : null}
              {slide.secondaryCtaHref && slide.secondaryCtaLabel ? (
                <a
                  href={slide.secondaryCtaHref}
                  className="inline-flex items-center rounded-full border border-white/25 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/90 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/10"
                >
                  {slide.secondaryCtaLabel}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        {slides.length > 1 ? (
          <div className="absolute bottom-7 left-5 right-5 mx-auto flex max-w-6xl items-center gap-4 sm:bottom-9 sm:left-6 sm:right-6">
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={clsx(
                    "rounded-full transition-all duration-500",
                    i === index
                      ? "h-2 w-7 bg-white"
                      : "h-2 w-2 bg-white/35 hover:bg-white/55"
                  )}
                />
              ))}
            </div>
            <div className="hidden h-px flex-1 overflow-hidden rounded-full bg-white/15 sm:block">
              <div
                key={index}
                ref={progressRef}
                className="h-full origin-left rounded-full bg-white/70"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <p className="hidden font-mono text-[0.65rem] tracking-[0.2em] text-white/40 sm:block">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
