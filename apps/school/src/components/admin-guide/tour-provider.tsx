"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  getTourSteps,
  roleLabel,
  TOUR_STORAGE_KEY,
  type AdminRole,
  type TourStep,
} from "./steps";

type TourContextValue = {
  role: AdminRole;
  startTour: (opts?: { force?: boolean }) => void;
  stopTour: () => void;
  isRunning: boolean;
  hasSeenTour: boolean;
};

const TourContext = createContext<TourContextValue | null>(null);

export function useAdminTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useAdminTour must be used inside AdminTourProvider");
  return ctx;
}

function storageKey(role: string) {
  return `${TOUR_STORAGE_KEY}:${role}`;
}

function readSeen(role: string) {
  try {
    return localStorage.getItem(storageKey(role)) === "1";
  } catch {
    return true;
  }
}

function writeSeen(role: string) {
  try {
    localStorage.setItem(storageKey(role), "1");
  } catch {
    /* ignore */
  }
}

type Spot = { top: number; left: number; width: number; height: number };
type Side = "top" | "bottom" | "left" | "right" | "center";

function measureTarget(selector: string | undefined): Spot | null {
  if (!selector || typeof document === "undefined") return null;
  const nodes = document.querySelectorAll(`[data-tour="${selector}"]`);
  let bestRect: DOMRect | null = null;
  let bestScore = -1;
  for (const node of nodes) {
    const el = node as HTMLElement;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    const onScreen =
      r.bottom > 8 &&
      r.right > 8 &&
      r.top < window.innerHeight - 8 &&
      r.left < window.innerWidth - 8;
    const score = (onScreen ? 1_000_000 : 0) + r.width * r.height;
    if (score > bestScore) {
      bestScore = score;
      bestRect = r;
    }
  }
  if (!bestRect) return null;
  const pad = selector === "tour-sidebar" ? 6 : 10;
  return {
    top: Math.max(6, bestRect.top - pad),
    left: Math.max(6, bestRect.left - pad),
    width: Math.min(window.innerWidth - 12, bestRect.width + pad * 2),
    height: Math.min(window.innerHeight - 12, bestRect.height + pad * 2),
  };
}

/** Scroll only inside admin-main — never scroll the document past the fixed shell. */
function scrollTourTarget(selector: string) {
  // Fixed shell chrome — do not scrollIntoView (that was scrolling past the sidebar)
  if (selector === "tour-sidebar" || selector === "tour-help") return;

  const el = document.querySelector(`[data-tour="${selector}"]`) as HTMLElement | null;
  if (!el) return;

  const style = window.getComputedStyle(el);
  if (style.position === "fixed" || style.position === "sticky") return;

  const scroller = document.querySelector(".admin-main") as HTMLElement | null;
  if (scroller && scroller.contains(el)) {
    const sRect = scroller.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const target =
      scroller.scrollTop +
      (eRect.top - sRect.top) -
      Math.max(24, (sRect.height - eRect.height) / 2);
    scroller.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    return;
  }
}

function pickSide(
  spot: Spot | null,
  preferred: TourStep["placement"],
  cardW: number,
  cardH: number,
): Side {
  if (!spot || preferred === "center") return "center";

  const gap = 16;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const space = {
    bottom: vh - (spot.top + spot.height) - gap,
    top: spot.top - gap,
    right: vw - (spot.left + spot.width) - gap,
    left: spot.left - gap,
  };

  const order: Side[] =
    preferred === "top"
      ? ["top", "bottom", "right", "left", "center"]
      : preferred === "bottom"
        ? ["bottom", "top", "right", "left", "center"]
        : preferred === "left"
          ? ["left", "right", "bottom", "top", "center"]
          : preferred === "right"
            ? ["right", "left", "bottom", "top", "center"]
            : ["bottom", "top", "right", "left", "center"];

  for (const side of order) {
    if (side === "center") return "center";
    if (side === "bottom" && space.bottom >= Math.min(cardH, 160)) return "bottom";
    if (side === "top" && space.top >= Math.min(cardH, 160)) return "top";
    if (side === "right" && space.right >= Math.min(cardW, 200)) return "right";
    if (side === "left" && space.left >= Math.min(cardW, 200)) return "left";
  }
  return "center";
}

function placeCard(
  spot: Spot | null,
  side: Side,
  cardW: number,
  cardH: number,
): { top: number; left: number } {
  const margin = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 14;

  if (!spot || side === "center") {
    return {
      top: Math.max(margin, Math.min((vh - cardH) / 2, vh - cardH - margin)),
      left: Math.max(margin, (vw - cardW) / 2),
    };
  }

  let top = 0;
  let left = 0;

  if (side === "bottom") {
    top = spot.top + spot.height + gap;
    left = spot.left + spot.width / 2 - cardW / 2;
  } else if (side === "top") {
    top = spot.top - cardH - gap;
    left = spot.left + spot.width / 2 - cardW / 2;
  } else if (side === "right") {
    top = spot.top + spot.height / 2 - cardH / 2;
    left = spot.left + spot.width + gap;
  } else {
    top = spot.top + spot.height / 2 - cardH / 2;
    left = spot.left - cardW - gap;
  }

  left = Math.min(Math.max(margin, left), vw - cardW - margin);
  top = Math.min(Math.max(margin, top), vh - cardH - margin);
  return { top, left };
}

export function AdminTourProvider({
  role,
  children,
}: {
  role: AdminRole;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const steps = useMemo(() => getTourSteps(role), [role]);
  const maskId = useId().replace(/:/g, "");

  const [mounted, setMounted] = useState(false);
  const [running, setRunning] = useState(false);
  const [index, setIndex] = useState(0);
  const [spot, setSpot] = useState<Spot | null>(null);
  const [hasSeen, setHasSeen] = useState(true);
  const [offerOpen, setOfferOpen] = useState(false);
  const [cardSize, setCardSize] = useState({ w: 340, h: 280 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const seen = readSeen(role);
    setHasSeen(seen);
    if (!seen && pathname === "/admin") {
      const t = window.setTimeout(() => setOfferOpen(true), 700);
      return () => window.clearTimeout(t);
    }
  }, [role, pathname]);

  const step = steps[index];

  const refreshSpot = useCallback(() => {
    setSpot(measureTarget(step?.target));
  }, [step?.target]);

  // Lock document scroll while tour runs (prevents "replica dashboard" below the shell)
  useEffect(() => {
    if (!running) return;
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
    };
  }, [running]);

  // Scroll target inside admin-main only, then remeasure
  useEffect(() => {
    if (!running) return;
    if (step?.target) scrollTourTarget(step.target);
    const t1 = window.setTimeout(refreshSpot, 80);
    const t2 = window.setTimeout(refreshSpot, 360);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [running, step?.target, index, refreshSpot]);

  useEffect(() => {
    if (!running) return;
    const onResize = () => refreshSpot();
    const main = document.querySelector(".admin-main");
    window.addEventListener("resize", onResize);
    main?.addEventListener("scroll", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      main?.removeEventListener("scroll", onResize);
    };
  }, [running, refreshSpot]);

  useLayoutEffect(() => {
    if (!running || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) {
      setCardSize({ w: r.width, h: r.height });
    }
  }, [running, index, step?.id, spot]);

  const startTour = useCallback(
    (opts?: { force?: boolean }) => {
      setOfferOpen(false);
      if (pathname !== "/admin") {
        router.push("/admin");
        window.setTimeout(() => {
          setIndex(0);
          setRunning(true);
        }, 500);
        return;
      }
      setIndex(0);
      setRunning(true);
      if (opts?.force) setHasSeen(false);
    },
    [pathname, router],
  );

  const stopTour = useCallback(() => {
    setRunning(false);
    setOfferOpen(false);
    writeSeen(role);
    setHasSeen(true);
  }, [role]);

  const next = () => {
    if (index >= steps.length - 1) {
      stopTour();
      return;
    }
    setIndex((i) => i + 1);
  };

  const back = () => setIndex((i) => Math.max(0, i - 1));

  const value: TourContextValue = {
    role,
    startTour,
    stopTour,
    isRunning: running,
    hasSeenTour: hasSeen,
  };

  const cardW = Math.min(360, typeof window !== "undefined" ? window.innerWidth - 24 : 360);
  const side = pickSide(spot, step?.placement ?? "auto", cardW, cardSize.h);
  const pos =
    mounted && running && step
      ? placeCard(spot, side, cardW, cardSize.h)
      : null;

  // Arrow points from card toward the spotlight
  const arrow =
    spot && side !== "center"
      ? {
          side,
          // Clamp arrow along the edge facing the target
          offset:
            side === "top" || side === "bottom"
              ? Math.min(
                  cardW - 28,
                  Math.max(28, spot.left + spot.width / 2 - (pos?.left ?? 0)),
                )
              : Math.min(
                  cardSize.h - 28,
                  Math.max(28, spot.top + spot.height / 2 - (pos?.top ?? 0)),
                ),
        }
      : null;

  return (
    <TourContext.Provider value={value}>
      {children}

      {mounted
        ? createPortal(
            <>
              <AnimatePresence>
                {offerOpen && !running ? (
                  <motion.div
                    className="fixed inset-0 z-[10090] flex items-end justify-center p-3 sm:items-center sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <button
                      type="button"
                      aria-label="Dismiss"
                      className="absolute inset-0 bg-[#140c08]/55 backdrop-blur-sm"
                      onClick={stopTour}
                    />
                    <motion.div
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="tour-offer-title"
                      className="relative z-10 w-full max-w-md overflow-hidden rounded-[1.6rem] border border-white/10 bg-white shadow-[0_30px_80px_rgba(7,11,20,0.45)]"
                      initial={{ opacity: 0, y: 28, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 16, scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    >
                      <div
                        className="px-5 pb-4 pt-5 sm:px-6 sm:pt-6"
                        style={{
                          background:
                            "linear-gradient(145deg, color-mix(in srgb, var(--c-sky) 16%, white), #fff 65%)",
                        }}
                      >
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--c-sky)]">
                          Quick guide · {roleLabel(role)}
                        </p>
                        <h2
                          id="tour-offer-title"
                          className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--c-text)] sm:text-2xl"
                        >
                          New here? Take a 1-minute tour
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--c-text-2)]">
                          We will walk you through the dashboard in simple English —
                          what each area does and how to get started.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 border-t border-[var(--c-border)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                        <button type="button" className="btn btn-ghost text-sm" onClick={stopTour}>
                          Skip for now
                        </button>
                        <button
                          type="button"
                          className="btn btn-gold text-sm"
                          onClick={() => startTour()}
                        >
                          Start tour
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {running && step ? (
                  <motion.div
                    className="fixed inset-0 z-[10092]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Dim layer with clean rectangular cutout — no mega box-shadow */}
                    <svg
                      className="pointer-events-none absolute inset-0 h-full w-full"
                      aria-hidden
                    >
                      <defs>
                        <mask id={`tour-mask-${maskId}`}>
                          <rect width="100%" height="100%" fill="white" />
                          {spot ? (
                            <rect
                              x={spot.left}
                              y={spot.top}
                              width={spot.width}
                              height={spot.height}
                              rx="14"
                              fill="black"
                            />
                          ) : null}
                        </mask>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill="rgba(7, 11, 20, 0.78)"
                        mask={`url(#tour-mask-${maskId})`}
                      />
                    </svg>

                    {/* Click-catcher on dimmed areas only (4 panes) */}
                    {spot ? (
                      <>
                        <button
                          type="button"
                          aria-label="Close tour"
                          className="absolute left-0 right-0 top-0 bg-transparent"
                          style={{ height: Math.max(0, spot.top) }}
                          onClick={stopTour}
                        />
                        <button
                          type="button"
                          aria-label="Close tour"
                          className="absolute bottom-0 left-0 right-0 bg-transparent"
                          style={{
                            top: spot.top + spot.height,
                            height: Math.max(0, window.innerHeight - spot.top - spot.height),
                          }}
                          onClick={stopTour}
                        />
                        <button
                          type="button"
                          aria-label="Close tour"
                          className="absolute left-0 bg-transparent"
                          style={{
                            top: spot.top,
                            width: Math.max(0, spot.left),
                            height: spot.height,
                          }}
                          onClick={stopTour}
                        />
                        <button
                          type="button"
                          aria-label="Close tour"
                          className="absolute right-0 bg-transparent"
                          style={{
                            top: spot.top,
                            left: spot.left + spot.width,
                            width: Math.max(0, window.innerWidth - spot.left - spot.width),
                            height: spot.height,
                          }}
                          onClick={stopTour}
                        />
                      </>
                    ) : (
                      <button
                        type="button"
                        aria-label="Close tour"
                        className="absolute inset-0 bg-transparent"
                        onClick={stopTour}
                      />
                    )}

                    {/* Gold highlight ring around the live target */}
                    {spot ? (
                      <motion.div
                        className="pointer-events-none absolute rounded-[14px]"
                        style={{
                          top: spot.top,
                          left: spot.left,
                          width: spot.width,
                          height: spot.height,
                          boxShadow:
                            "0 0 0 2px rgba(251,191,36,0.95), 0 0 0 6px rgba(251,191,36,0.2), 0 12px 40px rgba(0,0,0,0.25)",
                        }}
                        initial={false}
                        animate={{
                          top: spot.top,
                          left: spot.left,
                          width: spot.width,
                          height: spot.height,
                        }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                      />
                    ) : null}

                    {/* Coach card — anchored beside the spotlight */}
                    {pos ? (
                      <motion.div
                        ref={cardRef}
                        key={step.id}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="tour-step-title"
                        className="pointer-events-auto absolute overflow-visible rounded-[1.25rem] border border-white/12 shadow-[0_24px_70px_rgba(7,11,20,0.55)]"
                        style={{
                          top: pos.top,
                          left: pos.left,
                          width: cardW,
                          background:
                            "linear-gradient(165deg, #121c33 0%, #1c100a 55%, #2a1810 100%)",
                        }}
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ type: "spring", stiffness: 340, damping: 28 }}
                      >
                        {/* Pointer arrow toward target */}
                        {arrow ? (
                          <span
                            aria-hidden
                            className="absolute h-3 w-3 rotate-45 border border-white/12"
                            style={{
                              background: "#0f1730",
                              ...(arrow.side === "bottom"
                                ? {
                                    top: -6,
                                    left: arrow.offset,
                                    marginLeft: -6,
                                    borderBottom: "none",
                                    borderRight: "none",
                                  }
                                : arrow.side === "top"
                                  ? {
                                      bottom: -6,
                                      left: arrow.offset,
                                      marginLeft: -6,
                                      borderTop: "none",
                                      borderLeft: "none",
                                    }
                                  : arrow.side === "right"
                                    ? {
                                        left: -6,
                                        top: arrow.offset,
                                        marginTop: -6,
                                        borderRight: "none",
                                        borderBottom: "none",
                                      }
                                    : {
                                        right: -6,
                                        top: arrow.offset,
                                        marginTop: -6,
                                        borderLeft: "none",
                                        borderTop: "none",
                                      }),
                            }}
                          />
                        ) : null}

                        <div className="overflow-hidden rounded-[1.25rem]">
                          <div className="px-4 pt-4 sm:px-5 sm:pt-5">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#d42a3a]/85">
                                Step {index + 1} of {steps.length}
                              </p>
                              <button
                                type="button"
                                onClick={stopTour}
                                className="text-xs font-semibold text-white/45 transition hover:text-white/80"
                              >
                                Skip
                              </button>
                            </div>
                            <h3
                              id="tour-step-title"
                              className="mt-2 font-display text-lg font-semibold tracking-tight text-white sm:text-xl"
                            >
                              {step.title}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-white/70">
                              {step.body}
                            </p>
                            {step.tip ? (
                              <p
                                className="mt-3 rounded-xl px-3 py-2 text-xs leading-relaxed text-white/80"
                                style={{
                                  background: "rgba(251,191,36,0.1)",
                                  border: "1px solid rgba(251,191,36,0.22)",
                                }}
                              >
                                <span className="font-semibold text-[#d42a3a]">Tip: </span>
                                {step.tip}
                              </p>
                            ) : null}

                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {steps.map((s, i) => (
                                <span
                                  key={s.id}
                                  className="h-1.5 rounded-full transition-all"
                                  style={{
                                    width: i === index ? 18 : 6,
                                    background:
                                      i === index
                                        ? "#d42a3a"
                                        : i < index
                                          ? "rgba(251,191,36,0.45)"
                                          : "rgba(255,255,255,0.18)",
                                  }}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.08] px-4 py-3.5 sm:px-5">
                            <button
                              type="button"
                              className="rounded-xl px-3 py-2 text-sm font-semibold text-white/55 transition enabled:hover:bg-white/5 enabled:hover:text-white disabled:opacity-30"
                              onClick={back}
                              disabled={index === 0}
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#faf6f0] transition hover:brightness-105"
                              style={{
                                background: "linear-gradient(135deg, #b91c2c, #d42a3a)",
                                boxShadow: "0 8px 22px rgba(185,28,44,0.35)",
                              }}
                              onClick={next}
                            >
                              {index >= steps.length - 1 ? "Finish" : "Next"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </>,
            document.body,
          )
        : null}
    </TourContext.Provider>
  );
}

/** Floating + sidebar trigger to restart the guide */
export function TourLaunchButton({ variant = "fab" }: { variant?: "fab" | "nav" | "banner" }) {
  const { startTour, isRunning, hasSeenTour } = useAdminTour();

  if (variant === "nav") {
    return (
      <button
        type="button"
        data-tour="tour-help"
        onClick={() => startTour({ force: true })}
        className="admin-nav-item group w-full text-left"
        style={{ color: "rgba(248,250,252,0.55)" }}
      >
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#d42a3a]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </span>
        <span className="min-w-0 truncate">Quick guide</span>
      </button>
    );
  }

  if (variant === "banner") {
    return (
      <button
        type="button"
        onClick={() => startTour({ force: true })}
        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white/90 backdrop-blur transition hover:bg-white/15"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
        {hasSeenTour ? "Replay guide" : "Take the tour"}
      </button>
    );
  }

  if (isRunning) return null;
  return (
    <motion.button
      type="button"
      data-tour="tour-help"
      aria-label="Open quick guide"
      onClick={() => startTour({ force: true })}
      className="no-print fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[90] flex items-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-semibold text-[#faf6f0] shadow-[0_12px_32px_rgba(7,11,20,0.35)] md:bottom-6 md:right-6"
      style={{
        background: "linear-gradient(135deg, #b91c2c, #d42a3a)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
      <span className="hidden min-[360px]:inline">Guide</span>
    </motion.button>
  );
}
