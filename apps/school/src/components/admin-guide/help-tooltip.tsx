"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type Placement = "top" | "bottom" | "left" | "right";

function InfoGlyph() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  );
}

/**
 * Premium info tip — hugs the trigger icon (5px gap) with a pointed arrow.
 */
export function HelpTooltip({
  label,
  title,
  children,
  placement = "bottom",
  tone = "sky",
}: {
  label: string;
  title?: string;
  children?: ReactNode;
  placement?: Placement;
  tone?: "sky" | "gold" | "emerald";
}) {
  const tipId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    side: Placement;
    arrow: number;
  } | null>(null);

  const accent =
    tone === "gold"
      ? "var(--c-gold)"
      : tone === "emerald"
        ? "var(--c-emerald)"
        : "var(--c-sky)";

  useEffect(() => setMounted(true), []);

  const place = useCallback(
    (tipEl: HTMLElement | null) => {
      const trigger = triggerRef.current;
      if (!trigger || !tipEl) return;

      const gap = 5;
      const margin = 8;
      const rect = trigger.getBoundingClientRect();
      const tipW = tipEl.offsetWidth;
      const tipH = tipEl.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let side: Placement = placement;
      const space = {
        top: rect.top,
        bottom: vh - rect.bottom,
        left: rect.left,
        right: vw - rect.right,
      };
      if (side === "top" && space.top < tipH + gap + 8 && space.bottom > space.top) side = "bottom";
      if (side === "bottom" && space.bottom < tipH + gap + 8 && space.top > space.bottom) side = "top";
      if (side === "left" && space.left < tipW + gap + 8 && space.right > space.left) side = "right";
      if (side === "right" && space.right < tipW + gap + 8 && space.left > space.right) side = "left";

      let top = 0;
      let left = 0;

      if (side === "bottom") {
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tipW / 2;
      } else if (side === "top") {
        top = rect.top - tipH - gap;
        left = rect.left + rect.width / 2 - tipW / 2;
      } else if (side === "right") {
        top = rect.top + rect.height / 2 - tipH / 2;
        left = rect.right + gap;
      } else {
        top = rect.top + rect.height / 2 - tipH / 2;
        left = rect.left - tipW - gap;
      }

      left = Math.min(Math.max(margin, left), vw - tipW - margin);
      top = Math.min(Math.max(margin, top), vh - tipH - margin);

      // Arrow offset along the near edge, aimed at icon center
      const iconCx = rect.left + rect.width / 2;
      const iconCy = rect.top + rect.height / 2;
      const arrow =
        side === "top" || side === "bottom"
          ? Math.min(tipW - 14, Math.max(14, iconCx - left))
          : Math.min(tipH - 14, Math.max(14, iconCy - top));

      setPos({ top, left, side, arrow });
    },
    [placement],
  );

  const tipRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) place(node);
    },
    [place],
  );

  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-describedby={open ? tipId : undefined}
        aria-label={title ?? "Help tip"}
        className="inline-flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          background: `color-mix(in srgb, ${accent} 14%, white)`,
          color: accent,
          outlineColor: accent,
          boxShadow: open
            ? `0 0 0 3px color-mix(in srgb, ${accent} 22%, transparent)`
            : undefined,
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {children ?? <InfoGlyph />}
      </button>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  ref={tipRef}
                  id={tipId}
                  role="tooltip"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="pointer-events-none fixed z-[10100] w-max max-w-[14.5rem] rounded-xl border border-white/12 px-3 py-2 text-left shadow-[0_10px_28px_rgba(7,11,20,0.38)]"
                  style={{
                    top: pos?.top ?? -9999,
                    left: pos?.left ?? -9999,
                    visibility: pos ? "visible" : "hidden",
                    background: "linear-gradient(160deg, #121c33 0%, #1c100a 75%)",
                    color: "#f8fafc",
                  }}
                >
                  {title ? (
                    <p className="mb-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#d42a3a]/9">
                      {title}
                    </p>
                  ) : null}
                  <p className="text-[0.72rem] leading-snug text-white/88">{label}</p>
                  {pos ? (
                    <span
                      aria-hidden
                      className="absolute h-2 w-2 rotate-45 border border-white/12"
                      style={{
                        background: "#0f1730",
                        ...(pos.side === "bottom"
                          ? { top: -4, left: pos.arrow - 4 }
                          : pos.side === "top"
                            ? { bottom: -4, left: pos.arrow - 4 }
                            : pos.side === "right"
                              ? { left: -4, top: pos.arrow - 4 }
                              : { right: -4, top: pos.arrow - 4 }),
                      }}
                    />
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
