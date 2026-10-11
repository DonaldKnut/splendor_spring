"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function PremiumModal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  accent = "var(--c-sky)",
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  accent?: string;
  size?: "md" | "lg";
}) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[10060] flex items-end justify-center p-2.5 min-[360px]:p-4 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-[#140c08]/65 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={
              size === "lg"
                ? "relative z-10 flex max-h-[min(92svh,44rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-white shadow-[0_30px_80px_rgba(7,11,20,0.45)] min-[360px]:rounded-[1.75rem]"
                : "relative z-10 flex max-h-[min(92svh,38rem)] w-full max-w-md flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-white shadow-[0_30px_80px_rgba(7,11,20,0.45)] min-[360px]:rounded-[1.75rem]"
            }
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div
              className="relative px-4 pb-4 pt-4 min-[360px]:px-6 min-[360px]:pb-5 min-[360px]:pt-5"
              style={{
                background: `linear-gradient(145deg, color-mix(in srgb, ${accent} 14%, white), #fff 60%)`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {eyebrow ? (
                    <p
                      className="text-[0.62rem] font-bold uppercase tracking-[0.16em]"
                      style={{ color: accent }}
                    >
                      {eyebrow}
                    </p>
                  ) : null}
                  <h3
                    id={titleId}
                    className="mt-1 font-display text-lg font-bold tracking-tight text-[var(--c-text)] min-[360px]:text-xl sm:text-2xl"
                  >
                    {title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--c-border)] bg-white/90 text-[var(--c-text-2)]"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M6 6l12 12M18 6 6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 min-[360px]:px-6">
              {children}
            </div>
            {footer ? (
              <div className="flex flex-col gap-2 border-t border-[var(--c-border)] bg-[var(--c-surface-2)] px-4 py-3 min-[360px]:flex-row min-[360px]:justify-end min-[360px]:px-6 min-[360px]:py-4">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
