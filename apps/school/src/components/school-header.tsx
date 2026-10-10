"use client";

import { HERO_GLOW, HERO_WASH } from "@splendor/ui/media";
import clsx from "clsx";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { SchoolLogo } from "@/components/school-logo";
import { MegaFeaturedSwiper } from "@/components/mega-featured-swiper";
import { SCHOOL_GALLERY } from "@/lib/media-gallery";

type NavLink = {
  href: string;
  label: string;
  description: string;
  icon: ReactNode;
};

const schoolLinks: NavLink[] = [
  {
    href: "/about",
    label: "About Splendor",
    description: "Mission, vision, values & proprietor",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M4 18h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/announcements",
    label: "News & highlights",
    description: "Session news, impact & partnerships",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 4h11a2 2 0 0 1 2 2v13H7a2 2 0 0 1-2-2V4Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8 8h7M8 12h7M8 16h4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const connectLinks: NavLink[] = [
  {
    href: "/contact",
    label: "Contact",
    description: "26 Aganmayo Lane, Makoko",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/login",
    label: "Portal login",
    description: "Students, parents & staff",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

const mobilePrimary = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/announcements", label: "News" },
  { href: "/contact", label: "Contact" },
] as const;

const exploreGroups = [
  { title: "The school", links: schoolLinks },
  { title: "Connect", links: connectLinks },
] as const;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={clsx(
        "h-4 w-4 shrink-0 text-white/45 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        open && "rotate-180 text-[#c9a06a]",
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
  );
}

export function SchoolHeader({ schoolName }: { schoolName: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const explorePanelRef = useRef<HTMLDivElement>(null);
  const exploreInnerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);
  const menuId = useId();
  const exploreId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const sync = () => {
      setScrolled(window.scrollY > 24);
      const footer = document.querySelector("footer");
      if (!footer) {
        setNearFooter(false);
        return;
      }
      setNearFooter(footer.getBoundingClientRect().top <= 88);
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [pathname]);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
    setExploreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 12, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.36, ease: "power3.out" },
      );
      gsap.fromTo(
        el.querySelectorAll("[data-mega-item]"),
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.04, duration: 0.3, delay: 0.05, ease: "power2.out" },
      );
    });
    return () => ctx.revert();
  }, [megaOpen]);

  // Open / close full mobile sheet
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.32, ease: "power2.out" },
      );
      gsap.fromTo(
        sheetRef.current,
        { y: "-8%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.48, ease: "power3.out" },
      );
      gsap.fromTo(
        listRef.current?.querySelectorAll("[data-m-row]") ?? [],
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.045, duration: 0.42, delay: 0.1, ease: "power3.out" },
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

  // Smooth Explore accordion
  useLayoutEffect(() => {
    const panel = explorePanelRef.current;
    const inner = exploreInnerRef.current;
    if (!panel || !inner || !mobileOpen) return;

    gsap.killTweensOf(panel);

    if (exploreOpen) {
      gsap.set(panel, { height: "auto", opacity: 1, overflow: "hidden" });
      const h = panel.scrollHeight;
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0.4 },
        {
          height: h,
          opacity: 1,
          duration: 0.45,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(panel, { height: "auto", overflow: "visible" });
          },
        },
      );
      gsap.fromTo(
        inner.querySelectorAll("[data-explore-link]"),
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.04, duration: 0.36, delay: 0.06, ease: "power2.out" },
      );
    } else {
      const h = panel.scrollHeight || panel.offsetHeight;
      gsap.set(panel, { height: h || "auto", overflow: "hidden" });
      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.34,
        ease: "power2.inOut",
      });
    }
  }, [exploreOpen, mobileOpen]);

  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  }
  function cancelClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }

  async function closeMobile() {
    if (!sheetRef.current) {
      setMobileOpen(false);
      setExploreOpen(false);
      return;
    }
    await Promise.all([
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.22, ease: "power2.in" }),
      gsap.to(sheetRef.current, {
        y: "-6%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      }),
    ]);
    setMobileOpen(false);
    setExploreOpen(false);
  }

  const solid = scrolled || nearFooter || mobileOpen;
  const footerSurface =
    "radial-gradient(ellipse 70% 50% at 8% 0%, rgba(26,95,122,0.16), transparent 55%), linear-gradient(180deg, #140c08 0%, #1c100a 55%, #2a1810 100%)";

  const mobileMenu =
    mounted &&
    mobileOpen &&
    createPortal(
      <div className="fixed inset-0 z-[10050] lg:hidden" role="dialog" aria-modal="true">
        <div
          ref={backdropRef}
          role="presentation"
          className="absolute inset-0 bg-[#1c100a]/55 backdrop-blur-md"
          onClick={() => void closeMobile()}
        />

        {/* Full-bleed drop-down sheet */}
        <div
          ref={sheetRef}
          className="absolute inset-x-0 top-0 flex max-h-[100svh] flex-col overflow-hidden text-white"
          style={{
            background:
              "linear-gradient(165deg, #140c08 0%, #1c100a 42%, #2a1810 100%)",
            paddingTop: "max(0px, env(safe-area-inset-top))",
          }}
        >
          {/* Top bar mirrors header */}
          <div className="flex h-[4.5rem] shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] px-5">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2.5"
              onClick={() => void closeMobile()}
            >
              <SchoolLogo size="sm" />
              <span className="truncate font-display text-base tracking-tight">{schoolName}</span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] transition active:scale-95"
              onClick={() => void closeMobile()}
            >
              <span className="relative block h-3.5 w-3.5">
                <span className="absolute left-0 top-1.5 h-[1.5px] w-full rotate-45 rounded-full bg-white" />
                <span className="absolute left-0 top-1.5 h-[1.5px] w-full -rotate-45 rounded-full bg-white" />
              </span>
            </button>
          </div>

          <nav
            ref={listRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2"
          >
            <ul className="divide-y divide-white/[0.06]">
              {/* Home */}
              <li data-m-row>
                <Link
                  href="/"
                  className="flex items-center justify-between py-4 text-[1.05rem] font-medium tracking-tight text-white/95 transition active:text-white"
                  onClick={() => void closeMobile()}
                >
                  Home
                </Link>
              </li>

              {/* Explore mega accordion */}
              <li data-m-row>
                <button
                  type="button"
                  aria-expanded={exploreOpen}
                  aria-controls={exploreId}
                  className="flex w-full items-center justify-between py-4 text-left text-[1.05rem] font-medium tracking-tight text-white/95"
                  onClick={() => setExploreOpen((v) => !v)}
                >
                  <span className="inline-flex items-center gap-2.5">
                    Explore
                    <span className="rounded-full bg-[#b91c2c]/20 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#d42a3a]">
                      Menu
                    </span>
                  </span>
                  <Chevron open={exploreOpen} />
                </button>

                <div
                  id={exploreId}
                  ref={explorePanelRef}
                  className="overflow-hidden"
                  style={{ height: 0, opacity: 0 }}
                >
                  <div ref={exploreInnerRef} className="pb-4">
                    {exploreGroups.map((group) => (
                      <div key={group.title} className="mb-4 last:mb-0">
                        <p className="mb-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/35">
                          {group.title}
                        </p>
                        <ul className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                          {group.links.map((link, i) => (
                            <li
                              key={link.href}
                              data-explore-link
                              className={clsx(
                                i > 0 && "border-t border-white/[0.06]",
                              )}
                            >
                              <Link
                                href={link.href}
                                className="flex items-start gap-3 px-3.5 py-3.5 transition active:bg-white/[0.06]"
                                onClick={() => void closeMobile()}
                              >
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-[#c9a06a]">
                                  {link.icon}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[0.95rem] font-semibold text-white">
                                    {link.label}
                                  </span>
                                  <span className="mt-0.5 block text-xs leading-relaxed text-white/45">
                                    {link.description}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    <div
                      data-explore-link
                      className="mt-1 overflow-hidden rounded-2xl border border-white/[0.08]"
                    >
                      <MegaFeaturedSwiper
                        className="relative h-40 overflow-hidden"
                        slides={[...SCHOOL_GALLERY.megaFeatured]}
                        onNavigate={() => void closeMobile()}
                      />
                    </div>
                  </div>
                </div>
              </li>

              {/* Simple primary links (skip Home — already above) */}
              {mobilePrimary
                .filter((l) => l.href !== "/")
                .map((link) => (
                  <li key={link.href} data-m-row>
                    <Link
                      href={link.href}
                      className="flex items-center justify-between py-4 text-[1.05rem] font-medium tracking-tight text-white/95 transition active:text-white"
                      onClick={() => void closeMobile()}
                    >
                      {link.label}
                      <span className="text-white/25" aria-hidden>
                        →
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>

            <div data-m-row className="mt-8">
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold text-[#faf6f0] transition active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #b91c2c, #d42a3a)",
                  boxShadow: "0 12px 32px rgba(185,28,44,0.32)",
                }}
                onClick={() => void closeMobile()}
              >
                Portal login
                <span aria-hidden>→</span>
              </Link>
              <p className="mt-3 text-center text-[0.7rem] text-white/35">
                Students, parents & staff
              </p>
            </div>
          </nav>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-[9999] transition-[background,box-shadow,backdrop-filter,border-color] duration-500 ease-out",
          solid
            ? nearFooter
              ? "border-b border-white/[0.07] shadow-none"
              : "border-b border-white/10 shadow-[0_12px_40px_rgba(28,16,10,0.35)] backdrop-blur-2xl"
            : "border-b border-transparent",
        )}
        style={{
          background: nearFooter
            ? footerSurface
            : solid
              ? "linear-gradient(180deg, rgba(20,12,8,0.96) 0%, rgba(28,16,10,0.94) 100%)"
              : "transparent",
        }}
      >
        {!solid && !nearFooter ? (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute inset-0" style={{ background: HERO_WASH, opacity: 0.55 }} />
            <div className="absolute inset-0" style={{ background: HERO_GLOW, opacity: 0.65 }} />
          </div>
        ) : null}

        <div className="relative mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
          <Link href="/" className="group flex min-w-0 items-center gap-3 text-white">
            <SchoolLogo priority className="transition group-hover:scale-[1.03]" />
            <span className="truncate font-display text-lg tracking-tight sm:text-xl">
              {schoolName}
            </span>
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
                  megaOpen ? "bg-white/12" : "hover:bg-white/10",
                )}
                onClick={() => setMegaOpen((v) => !v)}
              >
                Explore
                <svg
                  className={clsx(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    megaOpen && "rotate-180",
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
                        "linear-gradient(145deg, rgba(20,12,8,0.97), rgba(42,24,16,0.95))",
                      boxShadow:
                        "0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
                    }}
                  >
                    <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                          The school
                        </p>
                        <ul className="mt-3 space-y-1">
                          {schoolLinks.map((link) => (
                            <li key={link.href} data-mega-item>
                              <Link
                                href={link.href}
                                className="group/item flex gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-white/8"
                                onClick={() => setMegaOpen(false)}
                              >
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#c9a06a]">
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
                          Connect
                        </p>
                        <ul className="mt-3 space-y-1">
                          {connectLinks.map((link) => (
                            <li key={link.href} data-mega-item>
                              <Link
                                href={link.href}
                                className="group/item flex gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-white/8"
                                onClick={() => setMegaOpen(false)}
                              >
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#c9a06a]">
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

                    <MegaFeaturedSwiper
                      slides={[...SCHOOL_GALLERY.megaFeatured]}
                      onNavigate={() => setMegaOpen(false)}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            <Link
              href="/about"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              About
            </Link>
            <Link
              href="/announcements"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              News
            </Link>
            <Link
              href="/contact"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              Contact
            </Link>

            <Link
              href="/login"
              className="ml-2 inline-flex items-center rounded-full px-4 py-2.5 text-sm font-bold text-[#faf6f0] transition hover:brightness-105"
              style={{
                background: "linear-gradient(135deg, #b91c2c, #d42a3a)",
                boxShadow: "0 8px 22px rgba(185,28,44,0.35)",
              }}
            >
              Portal login
            </Link>
          </nav>

          <button
            type="button"
            className="relative z-[10001] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition active:scale-95 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => (mobileOpen ? void closeMobile() : setMobileOpen(true))}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={clsx(
                  "absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-white transition-all duration-300",
                  mobileOpen && "top-1.5 rotate-45",
                )}
              />
              <span
                className={clsx(
                  "absolute left-0 top-[6px] h-[1.5px] w-full rounded-full bg-white transition-all duration-300",
                  mobileOpen && "scale-x-0 opacity-0",
                )}
              />
              <span
                className={clsx(
                  "absolute left-0 top-[12px] h-[1.5px] w-full rounded-full bg-white transition-all duration-300",
                  mobileOpen && "top-1.5 -rotate-45",
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
