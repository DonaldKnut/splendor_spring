"use client";

import { useRevealOnScroll } from "@splendor/ui/animations";
import { motion } from "framer-motion";
import Link from "next/link";
import { FooterSubscribe } from "@/components/footer-subscribe";
import { FooterLink } from "@/components/footer-link";
import { SchoolHeader } from "@/components/school-header";
import { SchoolLogo } from "@/components/school-logo";
import { SCHOOL_CONTACT } from "@/lib/school-contact";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export function SiteHeader({ schoolName }: { schoolName: string }) {
  return <SchoolHeader schoolName={schoolName} />;
}

export function SiteFooter({
  schoolName,
  address,
  phone,
  email,
  facebook,
}: {
  schoolName: string;
  address?: string;
  phone?: string;
  email?: string;
  facebook?: string;
}) {
  const year = new Date().getFullYear();
  const addr = address || SCHOOL_CONTACT.address;
  const phones = phone || SCHOOL_CONTACT.phoneDisplay;
  const mail = email || SCHOOL_CONTACT.email;
  const fb = facebook || SCHOOL_CONTACT.facebook;
  const phoneList = phones
    .split(/[/,|]/)
    .map((p) => p.trim())
    .filter(Boolean);

  const explore = [
    { href: "/about", label: "About" },
    { href: "/partnerships", label: "Partnerships" },
    { href: "/announcements", label: "News" },
    { href: "/contact", label: "Contact" },
  ];
  const portal = [
    { href: "/login", label: "Portal sign in" },
    { href: "/forgot-password", label: "Reset password" },
  ];

  return (
    <footer className="no-print relative mt-16 overflow-hidden text-white sm:mt-24">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 8% 0%, rgba(26,95,122,0.16), transparent 55%), linear-gradient(180deg, #140c08 0%, #1c100a 55%, #2a1810 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(201,160,106,0.35), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-3 min-[240px]:px-4 sm:px-6">
        {/* Newsletter */}
        <div className="flex flex-col gap-8 border-b border-white/[0.07] py-14 sm:flex-row sm:items-end sm:justify-between sm:gap-12 sm:py-16 lg:py-20">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d42a3a]/80 sm:text-sm">
              Newsletter
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white min-[360px]:text-4xl sm:text-[2.75rem] sm:leading-[1.15]">
              Stay close to school life
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/50 sm:text-lg">
              Announcements and term updates — no clutter.
            </p>
          </div>
          <div className="w-full sm:max-w-md">
            <FooterSubscribe accent="gold" />
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-10 py-10 sm:grid-cols-2 sm:gap-12 sm:py-12 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link href="/" className="group inline-flex max-w-full items-center gap-3">
              <motion.span whileHover={{ scale: 1.04 }} className="inline-flex">
                <SchoolLogo size="lg" />
              </motion.span>
              <span className="min-w-0">
                <span className="block truncate font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                  {schoolName}
                </span>
                <span className="mt-0.5 block text-xs text-white/40">
                  Nurturing to Greater Heights
                </span>
              </span>
            </Link>

            <div className="mt-7 space-y-3.5 text-sm text-white/55">
              <p className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-white/30" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </span>
                <span className="leading-relaxed">{addr}</span>
              </p>
              <p className="flex flex-wrap items-start gap-x-3 gap-y-1">
                <span className="mt-0.5 shrink-0 text-white/30" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </span>
                <span className="flex flex-wrap gap-x-2 gap-y-1">
                  {phoneList.map((p, i) => (
                    <span key={p} className="inline-flex items-center gap-2">
                      {i > 0 ? <span className="text-white/25">·</span> : null}
                      <a href={`tel:${p.replace(/\s/g, "")}`} className="transition hover:text-white">
                        {p}
                      </a>
                    </span>
                  ))}
                </span>
              </p>
              <p className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-white/30" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <a href={`mailto:${mail}`} className="break-all transition hover:text-white">
                  {mail}
                </a>
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={fb}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M14 13.5h2.5l.5-3H14v-1.5c0-.8.2-1.3 1.4-1.3H17V5.1C16.7 5.1 15.8 5 14.7 5 12.2 5 10.5 6.5 10.5 9.1V10.5H8v3h2.5V21h3.5v-7.5z" />
                  </svg>
                  Facebook
                  <span className="text-[#d42a3a] transition-transform group-hover:translate-x-0.5">→</span>
                </a>
                <a
                  href="https://www.instagram.com/splendorspringschool?psln=ZHBsOGh3aDFlbWlw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/70 transition hover:border-pink-500/30 hover:bg-white/[0.07] hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram
                  <span className="text-[#d42a3a] transition-transform group-hover:translate-x-0.5">→</span>
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              Explore
            </p>
            <ul className="mt-4 space-y-3">
              {explore.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              Portal
            </p>
            <ul className="mt-4 space-y-3">
              {portal.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              School hours
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/50">
              <li className="flex justify-between gap-3 border-b border-white/[0.06] pb-2.5">
                <span>Mon – Fri</span>
                <span className="text-white/75">7:30 – 15:30</span>
              </li>
              <li className="flex justify-between gap-3 border-b border-white/[0.06] pb-2.5">
                <span>Saturday</span>
                <span className="text-white/75">By appointment</span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Sunday</span>
                <span className="text-white/75">Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.07] py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {schoolName}. All rights reserved.
          </p>
          <p>
            {SCHOOL_CONTACT.proprietorTitle} · {SCHOOL_CONTACT.proprietor}
          </p>
        </div>
      </div>
    </footer>
  );
}

/** @deprecated use WhatsAppFloat — kept for layout import compatibility */
export function WhatsAppButton({
  number,
  message,
}: {
  number?: string;
  message?: string;
}) {
  return (
    <WhatsAppFloat
      number={number || SCHOOL_CONTACT.whatsapp}
      message={message || SCHOOL_CONTACT.whatsappMessage}
    />
  );
}

export function AnimatedMain({ children }: { children: React.ReactNode }) {
  const ref = useRevealOnScroll();
  return (
    <main ref={ref as React.RefObject<HTMLElement>} className="relative overflow-x-clip">
      {children}
    </main>
  );
}
