"use client";

import { type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import clsx from "clsx";
import { Spinner } from "./Spinner";

const primaryStyle: CSSProperties = {
  background: "linear-gradient(135deg, var(--c-gold, #b91c2c) 0%, var(--c-gold-light, #d42a3a) 100%)",
  color: "var(--c-text-inv, #fff)",
  boxShadow: "0 10px 26px rgba(185, 28, 44, 0.35)",
  border: "1px solid rgba(185, 28, 44, 0.25)",
};

const secondaryStyle: CSSProperties = {
  background: "var(--c-surface, #fffdf9)",
  color: "var(--c-text, #1c100a)",
  border: "1px solid var(--c-border, #e6d9c8)",
  boxShadow: "0 2px 8px rgba(28, 16, 10, 0.06)",
};

export function AuthButton({
  loading,
  icon,
  children,
  className,
  variant = "primary",
  style,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const toneStyle =
    variant === "primary" ? primaryStyle : variant === "secondary" ? secondaryStyle : undefined;

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{ ...toneStyle, ...style }}
      className={clsx(
        "auth-btn inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition hover:brightness-105 active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
        variant === "ghost" &&
          "bg-transparent text-[var(--c-text-2,#3d2418)] hover:bg-[var(--c-surface-3,#f3ebe0)]",
        className,
      )}
    >
      {loading ? (
        <Spinner
          className={
            variant === "primary"
              ? "border-white/30 border-t-white"
              : "border-[var(--c-border)] border-t-[var(--c-text)]"
          }
        />
      ) : (
        icon
      )}
      <span>{loading ? "Please wait..." : children}</span>
    </button>
  );
}
