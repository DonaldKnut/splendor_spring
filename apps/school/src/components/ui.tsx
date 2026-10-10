import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";
import clsx from "clsx";

export function cn(...parts: Array<string | false | null | undefined>) {
  return clsx(parts);
}

/* ─── Button ──────────────────────────────────────────────────────────────── */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "gold" | "navy";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      className={cn(
        "btn",
        size === "sm" && "btn-sm",
        size === "lg" && "btn-lg",
        variant === "primary" && "btn-primary",
        variant === "secondary" && "btn-ghost",
        variant === "danger" && "btn-danger",
        variant === "ghost" && "btn-ghost",
        variant === "gold" && "btn-gold",
        variant === "navy" && "btn-navy",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ─── Input ───────────────────────────────────────────────────────────────── */
export function Input({
  className,
  icon,
  style,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  if (!icon) {
    return <input className={cn("input-field", className)} style={style} {...props} />;
  }

  const padStyle: CSSProperties = { ...style, paddingLeft: "2.75rem" };

  return (
    <div className="relative text-[var(--c-text-3)]">
      <span className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 opacity-70">
        {icon}
      </span>
      <input className={cn("input-field", className)} style={padStyle} {...props} />
    </div>
  );
}

/* ─── Textarea ────────────────────────────────────────────────────────────── */
export function Textarea({
  className,
  icon,
  style,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { icon?: ReactNode }) {
  if (!icon) {
    return (
      <textarea
        className={cn("input-field resize-none", className)}
        style={style}
        {...props}
      />
    );
  }

  const padStyle: CSSProperties = { ...style, paddingLeft: "2.75rem", paddingTop: "0.85rem" };

  return (
    <div className="relative text-[var(--c-text-3)]">
      <span className="pointer-events-none absolute left-3.5 top-3.5 z-[1] opacity-70">
        {icon}
      </span>
      <textarea
        className={cn("input-field resize-none", className)}
        style={padStyle}
        {...props}
      />
    </div>
  );
}

/* ─── Select ──────────────────────────────────────────────────────────────── */
export function Select({
  className,
  children,
  icon,
  style,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { icon?: ReactNode }) {
  if (!icon) {
    return (
      <select className={cn("input-field cursor-pointer", className)} style={style} {...props}>
        {children}
      </select>
    );
  }

  const padStyle: CSSProperties = { ...style, paddingLeft: "2.75rem" };

  return (
    <div className="relative text-[var(--c-text-3)]">
      <span className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 opacity-70">
        {icon}
      </span>
      <select
        className={cn("input-field cursor-pointer", className)}
        style={padStyle}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

/* ─── Label ───────────────────────────────────────────────────────────────── */
export function Label({
  children,
  htmlFor,
  required,
}: {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-semibold text-[var(--c-text-2)]"
    >
      {children}
      {required && (
        <span className="ml-1 text-[var(--c-danger)]" aria-hidden>*</span>
      )}
    </label>
  );
}

/* ─── Card ────────────────────────────────────────────────────────────────── */
export function Card({
  children,
  className,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] p-3 shadow-[var(--shadow-sm)] min-[360px]:rounded-2xl min-[360px]:p-4 sm:p-5",
        hover && "card-premium",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─── Page Header ─────────────────────────────────────────────────────────── */
export function PageHeader({
  title,
  description,
  actions,
  icon,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="page-header flex flex-col gap-3 min-[360px]:gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex min-w-0 items-start gap-2.5 min-[360px]:gap-3">
        {icon && (
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--c-ice)] text-[var(--c-sky)] min-[360px]:h-10 min-[360px]:w-10">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="font-display text-lg font-bold tracking-tight text-[var(--c-text)] min-[360px]:text-xl sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-xs leading-relaxed text-[var(--c-text-3)] min-[360px]:text-sm">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex max-w-full flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

/* ─── Alert ───────────────────────────────────────────────────────────────── */
export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "success" | "error" | "warning";
  children: ReactNode;
  className?: string;
}) {
  const icon = {
    info: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
      </svg>
    ),
    success: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    error: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
    ),
    warning: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    ),
  }[tone];

  return (
    <div
      className={cn(
        "alert-premium",
        tone === "info" && "alert-info",
        tone === "success" && "alert-success",
        tone === "error" && "alert-error",
        tone === "warning" && "alert-warning",
        className
      )}
    >
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

/* ─── Badge ───────────────────────────────────────────────────────────────── */
export function Badge({
  tone = "gray",
  children,
}: {
  tone?: "gold" | "navy" | "green" | "red" | "gray";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "badge",
        tone === "gold" && "badge-gold",
        tone === "navy" && "badge-navy",
        tone === "green" && "badge-green",
        tone === "red" && "badge-red",
        tone === "gray" && "badge-gray"
      )}
    >
      {children}
    </span>
  );
}

/* ─── Empty State ─────────────────────────────────────────────────────────── */
export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--c-border)] bg-[var(--c-surface)] px-8 py-16 text-center">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--c-surface-2)] text-[var(--c-text-3)]">
          {icon}
        </div>
      )}
      <p className="font-display text-lg font-semibold text-[var(--c-text)]">
        {title}
      </p>
      {description && (
        <p className="mt-2 text-sm text-[var(--c-text-3)] max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
export function StatCard({
  label,
  value,
  icon,
  tone = "blue",
  trend,
}: {
  label: string;
  value: number | string;
  icon?: ReactNode;
  tone?: "blue" | "gold" | "green" | "red";
  trend?: { value: number; label: string };
}) {
  const toneClasses = {
    blue:  "bg-[var(--c-ice)] text-[var(--c-sky)]",
    gold:  "bg-[var(--c-gold-pale)] text-amber-700",
    green: "bg-[var(--c-emerald-pale)] text-[var(--c-emerald)]",
    red:   "bg-[var(--c-danger-pale)] text-[var(--c-danger)]",
  }[tone];

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[var(--c-text-3)] min-[360px]:text-xs min-[360px]:tracking-[0.12em]">
            {label}
          </p>
          <p className="mt-1.5 font-display text-xl font-bold text-[var(--c-text)] min-[360px]:mt-2 min-[360px]:text-2xl sm:text-3xl">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "mt-1.5 text-xs font-medium",
                trend.value >= 0
                  ? "text-[var(--c-emerald)]"
                  : "text-[var(--c-danger)]"
              )}
            >
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg min-[360px]:h-10 min-[360px]:w-10 min-[360px]:rounded-xl sm:h-11 sm:w-11",
              toneClasses
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Section Header ──────────────────────────────────────────────────────── */
export function SectionHeader({
  label,
  title,
  description,
}: {
  label?: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      {label && <p className="section-label">{label}</p>}
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[var(--c-text-3)]">{description}</p>
      )}
      <div className="section-divider" />
    </div>
  );
}
