"use client";

import { NGO_HERO_GLOW, NGO_HERO_WASH, PLACEHOLDERS } from "@splendor/ui/media";
import clsx from "clsx";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type NavLink = {
  href: string;
  label: string;
  description: string;
  icon: ReactNode;
};

const orgLinks: NavLink[] = [
  {
    href: "/about",
    label: "Who we are",
    description: "Mission, vision, and values",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M5 19c1.8-3.2 4-4.8 7-4.8S17.2 15.8 19 19"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/programmes",
    label: "Programmes",
    description: "Initiatives and community projects",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 7h16M4 12h16M4 17h10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const engageLinks: NavLink[] = [
  {
    href: "/donate",
    label: "Donate",
    description: "Support the work securely",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/events",
    label: "Events",
    description: "Upcoming community gatherings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 3v4M16 3v4M3 11h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/grants",
    label: "Grants",
    description: "Open funding opportunities",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3v18M7 8h7a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/polls",
    label: "Polls",
    description: "Share your voice",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 19V5M10 19V9M16 19v-6M22 19H2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Reach the team",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

const mobileLinks = [...orgLinks, ...engageLinks];

export function NgoHeader({ orgName }: { orgName: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);
  const menuId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!megaOpen || !panel) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        { y: 12, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.36, ease: "power3.out" }
      );
      gsap.fromTo(
        panel.querySelectorAll("[data-mega-item]"),
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.04, duration: 0.3, delay: 0.05, ease: "power2.out" }
      );
    });
    return () => ctx.revert();
  }, [megaOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: "power2.out" });
      gsap.fromTo(
        drawerRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.45, ease: "power3.out" }
      );
      gsap.fromTo(
        listRef.current?.querySelectorAll("[data-m-item]") ?? [],
        { x: 28, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.055, duration: 0.4, delay: 0.12, ease: "power3.out" }
      );
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") void closeMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen]);

  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
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
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.2 }),
      gsap.to(drawerRef.current, { x: "100%", duration: 0.32, ease: "power3.in" }),
    ]);
    setMobileOpen(false);
  }

  const solid = scrolled && !mobileOpen;

  const mobileMenu =
    mounted &&
    mobileOpen &&
    createPortal(
      <div className="fixed inset-0 z-[10050] lg:hidden" role="dialog" aria-modal="true">
        <div
          ref={backdropRef}
          className="absolute inset-0 bg-[#1b2430]/70 backdrop-blur-md"
          onClick={() => void closeMobile()}
        />
        <div
          ref={drawerRef}
          className="absolute inset-y-0 right-0 flex w-[min(100vw,22rem)] flex-col text-white shadow-2xl"
          style={{
            background: "linear-gradient(180deg, #1b2430 0%, #1f5c70 55%, #2f8f8a 100%)",
            borderLeft: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #1f5c70, #2f8f8a)" }}
              >
                {orgName.trim().charAt(0) || "N"}
              </span>
              <p className="truncate font-display text-base">{orgName}</p>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 transition hover:bg-white/15"
              onClick={() => void closeMobile()}
            >
              <span className="relative block h-3.5 w-3.5">
                <span className="absolute left-0 top-1.5 h-[1.5px] w-full rotate-45 rounded-full bg-white" />
                <span className="absolute left-0 top-1.5 h-[1.5px] w-full -rotate-45 rounded-full bg-white" />
              </span>
            </button>
          </div>

          <nav ref={listRef} className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
              Navigate
            </p>
            <ul className="space-y-1">
              {mobileLinks.map((link) => (
                <li key={link.href} data-m-item>
                  <Link
                    href={link.href}
                    className="flex items-start gap-3 rounded-2xl px-3 py-3.5 transition hover:bg-white/8 active:bg-white/12"
                    onClick={() => void closeMobile()}
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#e8915f]">
                      {link.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold text-white">{link.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-white/50">
                        {link.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div data-m-item className="mt-5 space-y-2 px-1">
              <Link
                href="/donate"
                className="flex w-full items-center justify-center rounded-2xl px-4 py-3.5 text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #d97845, #e8915f)",
                  boxShadow: "0 10px 28px rgba(217,120,69,0.4)",
                }}
                onClick={() => void closeMobile()}
              >
                Donate now
              </Link>
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-white/85 hover:bg-white/8"
                onClick={() => void closeMobile()}
              >
                Admin login
              </Link>
            </div>
          </nav>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-[9999] transition-[background,box-shadow,backdrop-filter,border-color] duration-500 ease-out",
          solid
            ? "border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
            : "border-b border-transparent"
        )}
        style={{
          background: solid
            ? "linear-gradient(180deg, rgba(27,36,48,0.95) 0%, rgba(31,92,112,0.88) 100%)"
            : "transparent",
        }}
      >
        {!solid ? (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute inset-0" style={{ background: NGO_HERO_WASH, opacity: 0.55 }} />
            <div className="absolute inset-0" style={{ background: NGO_HERO_GLOW, opacity: 0.7 }} />
          </div>
        ) : null}

        <div className="relative mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-3.5 sm:px-6">
          <Link href="/" className="group flex min-w-0 items-center gap-3 text-white">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-display text-base font-bold text-white transition group-hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #1f5c70, #2f8f8a)",
                boxShadow: "0 8px 22px rgba(31,92,112,0.4)",
              }}
            >
              {orgName.trim().charAt(0) || "N"}
            </span>
            <span className="truncate font-display text-lg tracking-tight sm:text-xl">{orgName}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <div
              className="relative"
              onMouseEnter={() => {
                cancelClose();
                setMegaOpen(true);
              }}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                aria-expanded={megaOpen}
                aria-controls={menuId}
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white/90 transition",
                  megaOpen ? "bg-white/12" : "hover:bg-white/10"
                )}
                onClick={() => setMegaOpen((v) => !v)}
              >
                Explore
                <svg
                  className={clsx(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    megaOpen && "rotate-180"
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

              {megaOpen ? (
                <div
                  id={menuId}
                  ref={panelRef}
                  className="absolute left-1/2 top-full z-[10000] w-[min(880px,calc(100vw-2rem))] -translate-x-1/2 pt-4"
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  <div
                    className="overflow-hidden rounded-[1.75rem] border border-white/12 shadow-2xl backdrop-blur-2xl md:grid md:grid-cols-[1.4fr_0.95fr]"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(27,36,48,0.97), rgba(31,92,112,0.92))",
                      boxShadow:
                        "0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
                    }}
                  >
                    <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                          Organisation
                        </p>
                        <ul className="mt-3 space-y-1">
                          {orgLinks.map((link) => (
                            <li key={link.href} data-mega-item>
                              <Link
                                href={link.href}
                                className="flex gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-white/8"
                                onClick={() => setMegaOpen(false)}
                              >
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#e8915f]">
                                  {link.icon}
                                </span>
                                <span>
                                  <span className="block text-sm font-semibold text-white">
                                    {link.label}
                                  </span>
                                  <span className="mt-0.5 block text-xs text-white/50">
                                    {link.description}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                          Engage
                        </p>
                        <ul className="mt-3 space-y-1">
                          {engageLinks.map((link) => (
                            <li key={link.href} data-mega-item>
                              <Link
                                href={link.href}
                                className="flex gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-white/8"
                                onClick={() => setMegaOpen(false)}
                              >
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#e8915f]">
                                  {link.icon}
                                </span>
                                <span>
                                  <span className="block text-sm font-semibold text-white">
                                    {link.label}
                                  </span>
                                  <span className="mt-0.5 block text-xs text-white/50">
                                    {link.description}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Link
                      href="/donate"
                      className="relative min-h-[210px] overflow-hidden"
                      onClick={() => setMegaOpen(false)}
                    >
                      <img
                        src={PLACEHOLDERS.ngoHero1}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(27,36,48,0.92), rgba(27,36,48,0.25))",
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#e8915f]">
                          Featured
                        </p>
                        <p className="mt-2 font-display text-xl leading-snug">Give with confidence</p>
                        <p className="mt-1.5 text-xs text-white/70">
                          Verified donations via Paystack or Flutterwave.
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <Link
              href="/events"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Events
            </Link>
            <Link
              href="/grants"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Grants
            </Link>
            <Link
              href="/programmes"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Programmes
            </Link>
            <Link
              href="/contact"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Contact
            </Link>

            <Link
              href="/donate"
              className="ml-2 inline-flex items-center rounded-full px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-105"
              style={{
                background: "linear-gradient(135deg, #d97845, #e8915f)",
                boxShadow: "0 8px 22px rgba(217,120,69,0.4)",
              }}
            >
              Donate now
            </Link>
          </nav>

          <button
            type="button"
            className="relative z-[10001] flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-md lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => (mobileOpen ? void closeMobile() : setMobileOpen(true))}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={clsx(
                  "absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-white transition-all duration-300",
                  mobileOpen && "top-1.5 rotate-45"
                )}
              />
              <span
                className={clsx(
                  "absolute left-0 top-[6px] h-[1.5px] w-full rounded-full bg-white transition-all duration-300",
                  mobileOpen && "scale-x-0 opacity-0"
                )}
              />
              <span
                className={clsx(
                  "absolute left-0 top-[12px] h-[1.5px] w-full rounded-full bg-white transition-all duration-300",
                  mobileOpen && "top-1.5 -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </header>
      {mobileMenu}
    </>
  );
}
