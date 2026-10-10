"use client";

import { SCHOOL_BRAND } from "@/lib/media-gallery";
import clsx from "clsx";

export function BrandSpinner({
  label = "Loading…",
  size = "lg",
  fullscreen = false,
  className,
}: {
  label?: string;
  size?: "md" | "lg" | "xl";
  fullscreen?: boolean;
  className?: string;
}) {
  const dim =
    size === "md"
      ? "h-16 w-16 min-[360px]:h-20 min-[360px]:w-20"
      : size === "xl"
        ? "h-28 w-28 min-[360px]:h-36 min-[360px]:w-36 sm:h-40 sm:w-40"
        : "h-24 w-24 min-[360px]:h-28 min-[360px]:w-28 sm:h-32 sm:w-32";

  const content = (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-4 text-center",
        className
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={clsx("brand-spinner relative", dim)}>
        <span className="brand-spinner__ring" aria-hidden />
        <span className="brand-spinner__ring brand-spinner__ring--delay" aria-hidden />
        <span className="brand-spinner__mark">
          <img
            src={SCHOOL_BRAND.logo}
            alt=""
            className="h-full w-full object-contain p-1.5 sm:p-2"
            decoding="async"
          />
        </span>
      </div>
      <p className="font-display text-sm font-semibold text-[var(--c-text-2)] min-[360px]:text-base">
        {label}
      </p>
      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[10080] flex items-center justify-center bg-[var(--c-surface-2)]/85 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
