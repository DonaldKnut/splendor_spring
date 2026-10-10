"use client";

import { type ReactNode } from "react";
import clsx from "clsx";

export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag data-animate="reveal" className={clsx(className)}>
      {children}
    </Tag>
  );
}

export function Enter({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "h1" | "p" | "header";
}) {
  return (
    <Tag data-animate="enter" className={clsx(className)}>
      {children}
    </Tag>
  );
}
