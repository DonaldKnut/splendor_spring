"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { ToastProvider } from "./Toast";

export type AuthPromoSlide = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
};

export function AuthShell({
  brand,
  slides,
  children,
  accent = "school",
  homeHref = "/",
  homeLabel = "Back to homepage",
}: {
  brand: string;
  slides: AuthPromoSlide[];
  children: ReactNode;
  accent?: "school" | "ngo";
  homeHref?: string;
  homeLabel?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const copyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const intervalMs = 6000;

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, paused, index]);

  useEffect(() => {
    if (!copyRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        copyRef.current,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" }
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
  }, [index]);

  const slide = slides[index] ?? slides[0];
  const isSchool = accent === "school";

  const wash = isSchool
    ? "linear-gradient(160deg, rgba(28,16,10,0.58) 0%, rgba(42,24,16,0.24) 42%, rgba(42,24,16,0.08) 100%)"
    : "linear-gradient(160deg, rgba(27,36,48,0.52) 0%, rgba(27,36,48,0.2) 42%, rgba(27,36,48,0.08) 100%)";

  const glow = isSchool
    ? "radial-gradient(ellipse at bottom left, rgba(185,28,44,0.22), transparent 52%)"
    : "radial-gradient(ellipse at bottom left, rgba(217,120,69,0.24), transparent 52%)";

  function go(i: number) {
    setIndex((i + slides.length) % slides.length);
  }

  return (
    <ToastProvider>
      <div
        className="fixed inset-0 grid overflow-hidden lg:grid-cols-2"
        style={{ background: isSchool ? "#1c100a" : "#0b1120" }}
      >
        {/* ── Fixed promo slider (desktop) ───────────────────────── */}
        <aside
          className="relative hidden h-svh overflow-hidden lg:flex lg:flex-col"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Stacked images for crossfade */}
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={clsx(
                "absolute inset-0 transition-opacity duration-1000 ease-out",
                i === index ? "opacity-100" : "opacity-0"
              )}
              aria-hidden={i !== index}
            >
              <img
                src={s.image}
                alt=""
                className={clsx(
                  "h-full w-full object-cover object-center transition-transform duration-[7000ms] ease-out",
                  i === index ? "scale-105" : "scale-100"
                )}
                decoding="async"
                fetchPriority={i === 0 ? "high" : "low"}
              />
            </div>
          ))}

          <div className="absolute inset-0" style={{ background: wash }} />
          <div className="absolute inset-0" style={{ background: glow }} />

          <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-12">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <a
                  href={homeHref}
                  className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 transition hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M15 6 9 12l6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {homeLabel}
                </a>
                <p className="font-display text-2xl tracking-tight text-white">{brand}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() => go(index - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M15 6 9 12l6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => go(index + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="m9 6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div ref={copyRef} className="max-w-lg">
              {slide?.badge ? (
                <span
                  className="mb-4 inline-flex rounded-full border border-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur"
                  style={{
                    background: isSchool
                      ? "rgba(185,28,44,0.18)"
                      : "rgba(217,120,69,0.18)",
                  }}
                >
                  {slide.badge}
                </span>
              ) : null}
              <h1 className="font-display text-4xl leading-[1.12] tracking-tight text-white xl:text-5xl">
                {slide?.title}
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
                {slide?.subtitle}
              </p>

              <div className="mt-9 flex items-center gap-3">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Promo slide ${i + 1}`}
                    aria-current={i === index}
                    onClick={() => setIndex(i)}
                    className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/25"
                  >
                    {i === index ? (
                      <div
                        ref={progressRef}
                        className="absolute inset-y-0 left-0 origin-left rounded-full bg-white"
                        style={{ width: "100%", transform: "scaleX(0)" }}
                      />
                    ) : null}
                    {i < index ? (
                      <div className="absolute inset-0 rounded-full bg-white/80" />
                    ) : null}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs tabular-nums text-white/45">
                {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </p>
            </div>

            <p className="text-xs tracking-wide text-white/45">
              Secure access · Encrypted sessions · Verified email
            </p>
          </div>
        </aside>

        {/* ── Scrollable form column ─────────────────────────────── */}
        <section
          className="relative h-svh overflow-y-auto overscroll-contain"
          style={{ background: isSchool ? "#faf6f0" : "#f4f7fb" }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: isSchool
                ? "radial-gradient(ellipse 70% 45% at 100% 0%, rgba(26,95,122,0.1), transparent 55%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(201,160,106,0.12), transparent 50%), linear-gradient(180deg,#fffdf9,#f3ebe0)"
                : "radial-gradient(ellipse 70% 45% at 100% 0%, rgba(31,92,112,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(217,120,69,0.1), transparent 50%), linear-gradient(180deg,#f5f7f8,#eef2f4)",
            }}
          />

          {/* Mobile promo strip */}
          <div className="relative lg:hidden">
            <div className="relative h-44 overflow-hidden sm:h-52">
              {slides.map((s, i) => (
                <img
                  key={s.id}
                  src={s.image}
                  alt=""
                  className={clsx(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                    i === index ? "opacity-100" : "opacity-0"
                  )}
                />
              ))}
              <div className="absolute inset-0" style={{ background: wash }} />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                <a
                  href={homeHref}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md transition hover:bg-black/35"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M15 6 9 12l6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Home
                </a>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-display text-lg">{brand}</p>
                <p className="mt-1 text-xs text-white/70 line-clamp-1">{slide?.title}</p>
                <div className="mt-3 flex gap-1.5">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-label={`Slide ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={clsx(
                        "h-1 rounded-full transition-all",
                        i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto flex min-h-[calc(100svh-11rem)] w-full max-w-md flex-col justify-center px-5 py-10 sm:min-h-full sm:px-8 lg:min-h-full">
            <a
              href={homeHref}
              className="mb-5 hidden items-center gap-1.5 self-start text-sm font-semibold text-[var(--c-text-3,#64748b)] transition hover:text-[var(--c-text,#0f172a)] lg:inline-flex"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 6 9 12l6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {homeLabel}
            </a>
            <div className="rounded-[1.75rem] border border-white/60 bg-white/70 p-6 shadow-[0_24px_60px_rgba(15,28,54,0.08)] backdrop-blur-xl sm:p-8">
              {children}
            </div>
          </div>
        </section>
      </div>
    </ToastProvider>
  );
}
