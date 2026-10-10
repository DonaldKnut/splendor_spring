import { SCHOOL_BRAND } from "@/lib/media-gallery";
import clsx from "clsx";

export function SchoolLogo({
  className,
  size = "md",
  priority = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}) {
  const dim =
    size === "sm" ? "h-9 w-9" : size === "lg" ? "h-12 w-12 sm:h-14 sm:w-14" : "h-10 w-10";

  return (
    <span
      className={clsx(
        "relative inline-flex shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_8px_22px_rgba(0,0,0,0.18)] ring-1 ring-white/40",
        dim,
        className
      )}
    >
      <img
        src={SCHOOL_BRAND.logo}
        alt="Splendor Spring Schools logo"
        className="h-full w-full object-contain p-0.5"
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </span>
  );
}
