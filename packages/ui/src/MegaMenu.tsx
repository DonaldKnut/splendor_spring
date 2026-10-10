"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import gsap from "gsap";

export type MegaMenuColumn = {
  title: string;
  links: Array<{
    href: string;
    label: string;
    description?: string;
    icon?: ReactNode;
  }>;
};

export type MegaMenuItem = {
  label: string;
  href?: string;
  columns?: MegaMenuColumn[];
  featured?: {
    image: string;
    title: string;
    subtitle?: string;
    href?: string;
  };
};

export function MegaMenu({
  brand,
  brandHref = "/",
  brandMark,
  items,
  cta,
  tone = "light",
}: {
  brand: string;
  brandHref?: string;
  brandMark?: ReactNode;
  items: MegaMenuItem[];
  cta?: { href: string; label: string };
  tone?: "light" | "dark";
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const linkListRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef<number | null>(null);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        { y: 14, opacity: 0, scale: 0.985 },
        { y: 0, opacity: 1, scale: 1, duration: 0.38, ease: "power3.out" }
      );
      gsap.fromTo(
        panel.querySelectorAll("[data-mega-link]"),
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.045, ease: "power2.out", delay: 0.06 }
      );
    });
    return () => ctx.revert();
  }, [open]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.28, ease: "power2.out" }
      );
      gsap.fromTo(
        drawerRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.42, ease: "power3.out" }
      );
      gsap.fromTo(
        linkListRef.current?.querySelectorAll("[data-mobile-item]") ?? [],
        { x: 28, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.055, ease: "power3.out", delay: 0.12 }
      );
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      ctx.revert();
    };
  }, [mobileOpen]);

  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 120);
  }

  function cancelClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }

  async function closeMobile() {
    if (!drawerRef.current) {
      setMobileOpen(false);
      return;
    }
    await Promise.all([
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.22, ease: "power2.in" }),
      gsap.to(drawerRef.current, { x: "100%", duration: 0.32, ease: "power3.in" }),
    ]);
    setMobileOpen(false);
    setExpandedMobile(null);
  }

  const light = tone === "light";

  return (
    <header
      className={clsx(
        "sticky top-0 z-[80] transition-[background,box-shadow,border-color] duration-300",
        scrolled
          ? light
            ? "border-b border-black/6 bg-white/85 shadow-[0_8px_30px_rgba(15,28,54,0.08)] backdrop-blur-2xl"
            : "border-b border-white/10 bg-black/55 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
          : light
            ? "border-b border-transparent bg-white/55 backdrop-blur-xl"
            : "border-b border-transparent bg-black/25 backdrop-blur-xl",
        light ? "text-neutral-900" : "text-white"
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href={brandHref}
          className="group flex min-w-0 items-center gap-2.5"
          onClick={() => setOpen(null)}
        >
          {brandMark ?? (
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold text-[#0b1120]"
              style={{
                background: "linear-gradient(135deg, #f5a623, #fbbf24)",
                boxShadow: "0 4px 14px rgba(245,166,35,0.35)",
              }}
            >
              {brand.trim().charAt(0) || "S"}
            </span>
          )}
          <span className="font-display truncate text-lg tracking-tight sm:text-xl">{brand}</span>
        </a>

        {/* Desktop mega nav */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {items.map((item) => {
            const hasMega = Boolean(item.columns?.length);
            const isOpen = open === item.label;

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  if (hasMega) setOpen(item.label);
                }}
                onMouseLeave={scheduleClose}
              >
                {item.href && !hasMega ? (
                  <a
                    href={item.href}
                    className={clsx(
                      "rounded-lg px-3.5 py-2 text-sm font-medium transition",
                      light ? "hover:bg-black/5" : "hover:bg-white/10"
                    )}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`${menuId}-${item.label}`}
                    className={clsx(
                      "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition",
                      isOpen
                        ? light
                          ? "bg-black/5"
                          : "bg-white/10"
                        : light
                          ? "hover:bg-black/5"
                          : "hover:bg-white/10"
                    )}
                    onClick={() => setOpen(isOpen ? null : item.label)}
                  >
                    {item.label}
                    <svg
                      className={clsx(
                        "h-3.5 w-3.5 transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}

                {hasMega && isOpen ? (
                  <div
                    id={`${menuId}-${item.label}`}
                    ref={panelRef}
                    className="absolute left-1/2 top-full z-50 w-[min(860px,calc(100vw-2rem))] -translate-x-1/2 pt-3"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div
                      className={clsx(
                        "overflow-hidden rounded-3xl border shadow-2xl",
                        "grid md:grid-cols-[1.35fr_0.9fr]",
                        light
                          ? "border-black/8 bg-white/95 text-neutral-900 backdrop-blur-2xl"
                          : "border-white/10 bg-[#0f1c36]/95 text-white backdrop-blur-2xl"
                      )}
                      style={{
                        boxShadow:
                          "0 24px 60px rgba(15,28,54,0.18), inset 0 1px 0 rgba(255,255,255,0.55)",
                      }}
                    >
                      <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-7">
                        {item.columns!.map((col) => (
                          <div key={col.title}>
                            <p
                              className={clsx(
                                "text-[11px] font-bold uppercase tracking-[0.2em]",
                                light ? "text-neutral-400" : "text-white/45"
                              )}
                            >
                              {col.title}
                            </p>
                            <ul className="mt-3 space-y-1">
                              {col.links.map((link) => (
                                <li key={link.href} data-mega-link>
                                  <a
                                    href={link.href}
                                    className={clsx(
                                      "group/link flex gap-3 rounded-2xl px-3 py-2.5 transition",
                                      light
                                        ? "hover:bg-[rgba(59,125,216,0.06)]"
                                        : "hover:bg-white/8"
                                    )}
                                    onClick={() => setOpen(null)}
                                  >
                                    {link.icon ? (
                                      <span
                                        className={clsx(
                                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                                          light
                                            ? "bg-[rgba(59,125,216,0.1)] text-[#1e3a5f]"
                                            : "bg-white/10 text-white"
                                        )}
                                      >
                                        {link.icon}
                                      </span>
                                    ) : null}
                                    <span>
                                      <span className="block text-sm font-semibold tracking-tight">
                                        {link.label}
                                      </span>
                                      {link.description ? (
                                        <span
                                          className={clsx(
                                            "mt-0.5 block text-xs leading-relaxed",
                                            light ? "text-neutral-500" : "text-white/55"
                                          )}
                                        >
                                          {link.description}
                                        </span>
                                      ) : null}
                                    </span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {item.featured ? (
                        <a
                          href={item.featured.href || item.columns?.[0]?.links[0]?.href || "#"}
                          className="relative min-h-[200px] overflow-hidden md:min-h-full"
                          onClick={() => setOpen(null)}
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-105"
                            style={{ backgroundImage: `url(${item.featured.image})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120]/90 via-[#0b1120]/35 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#fbbf24]">
                              Featured
                            </p>
                            <p className="mt-2 font-display text-xl leading-snug">
                              {item.featured.title}
                            </p>
                            {item.featured.subtitle ? (
                              <p className="mt-1.5 text-xs text-white/75">{item.featured.subtitle}</p>
                            ) : null}
                          </div>
                        </a>
                      ) : (
                        <div
                          className="relative hidden min-h-[200px] overflow-hidden md:block"
                          style={{
                            background:
                              "linear-gradient(160deg, #0b1120 0%, #162447 55%, #1e3a5f 100%)",
                          }}
                        >
                          <div
                            className="absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-40"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(245,166,35,0.55), transparent 70%)",
                              filter: "blur(24px)",
                            }}
                          />
                          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                            <p className="font-display text-2xl leading-snug">Explore Splendor</p>
                            <p className="mt-2 text-xs text-white/65">
                              Mission, news, and secure portal access in one place.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}

          {cta ? (
            <a
              href={cta.href}
              className="ml-2 inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0b1120] transition hover:brightness-105"
              style={{
                background: "linear-gradient(135deg, #f5a623, #fbbf24)",
                boxShadow: "0 6px 18px rgba(245,166,35,0.35)",
              }}
            >
              {cta.label}
            </a>
          ) : null}
        </nav>

        {/* Animated hamburger */}
        <button
          type="button"
          className={clsx(
            "relative z-[90] flex h-11 w-11 items-center justify-center rounded-xl border lg:hidden",
            light
              ? "border-black/10 bg-white/70 backdrop-blur"
              : "border-white/15 bg-white/10 backdrop-blur"
          )}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => (mobileOpen ? closeMobile() : setMobileOpen(true))}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={clsx(
                "absolute left-0 top-0 h-[1.5px] w-full rounded-full transition-all duration-300 ease-out",
                light ? "bg-neutral-900" : "bg-white",
                mobileOpen && "top-1.5 rotate-45"
              )}
            />
            <span
              className={clsx(
                "absolute left-0 top-[6px] h-[1.5px] w-full rounded-full transition-all duration-300 ease-out",
                light ? "bg-neutral-900" : "bg-white",
                mobileOpen && "scale-x-0 opacity-0"
              )}
            />
            <span
              className={clsx(
                "absolute left-0 top-[12px] h-[1.5px] w-full rounded-full transition-all duration-300 ease-out",
                light ? "bg-neutral-900" : "bg-white",
                mobileOpen && "top-1.5 -rotate-45"
              )}
            />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true">
          <div
            ref={backdropRef}
            className="absolute inset-0 bg-[#0b1120]/55 backdrop-blur-sm"
            onClick={() => closeMobile()}
          />
          <div
            ref={drawerRef}
            className="absolute inset-y-0 right-0 flex w-[min(100vw,22rem)] flex-col border-l border-white/10 bg-[linear-gradient(180deg,#0b1120_0%,#0f1c36_45%,#162447_100%)] text-white shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 pb-2 pt-5">
              <p className="font-display text-lg tracking-tight">{brand}</p>
              <button
                type="button"
                className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-white/70"
                onClick={() => closeMobile()}
              >
                Close
              </button>
            </div>
            <p className="px-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
              Navigate
            </p>

            <ul ref={linkListRef} className="mt-4 flex-1 space-y-1 overflow-y-auto px-3 pb-8">
              {items.map((item) => {
                const hasMega = Boolean(item.columns?.length);
                if (!hasMega) {
                  return (
                    <li key={item.label} data-mobile-item>
                      <a
                        href={item.href || "#"}
                        className="block rounded-2xl px-4 py-3.5 text-base font-medium transition hover:bg-white/8"
                        onClick={() => closeMobile()}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                }

                const expanded = expandedMobile === item.label;
                return (
                  <li key={item.label} data-mobile-item>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-medium transition hover:bg-white/8"
                      onClick={() => setExpandedMobile(expanded ? null : item.label)}
                      aria-expanded={expanded}
                    >
                      {item.label}
                      <svg
                        className={clsx(
                          "h-4 w-4 text-white/50 transition-transform duration-300",
                          expanded && "rotate-180"
                        )}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div
                      className={clsx(
                        "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                        expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <ul className="mb-2 space-y-1 pl-2">
                          {item.columns!.flatMap((col) =>
                            col.links.map((link) => (
                              <li key={link.href}>
                                <a
                                  href={link.href}
                                  className="block rounded-xl px-4 py-2.5 text-sm text-white/75 transition hover:bg-white/8 hover:text-white"
                                  onClick={() => closeMobile()}
                                >
                                  <span className="font-semibold text-white/90">{link.label}</span>
                                  {link.description ? (
                                    <span className="mt-0.5 block text-xs text-white/45">
                                      {link.description}
                                    </span>
                                  ) : null}
                                </a>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}

              {cta ? (
                <li data-mobile-item className="pt-3">
                  <a
                    href={cta.href}
                    className="mx-1 flex items-center justify-center rounded-2xl px-4 py-3.5 text-sm font-bold text-[#0b1120]"
                    style={{
                      background: "linear-gradient(135deg, #f5a623, #fbbf24)",
                      boxShadow: "0 10px 28px rgba(245,166,35,0.35)",
                    }}
                    onClick={() => closeMobile()}
                  >
                    {cta.label}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      ) : null}
    </header>
  );
}
