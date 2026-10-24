"use client";

import { buildWhatsAppUrl } from "@splendor/shared/whatsapp";
import { useRevealOnScroll } from "@splendor/ui/animations";
import Link from "next/link";
import { FooterSubscribe } from "@/components/footer-subscribe";
import { NgoHeader } from "@/components/ngo-header";

export function SiteHeader({ orgName }: { orgName: string }) {
  return <NgoHeader orgName={orgName} />;
}

export function SiteFooter({
  orgName,
  address,
  phone,
  email,
}: {
  orgName: string;
  address?: string;
  phone?: string;
  email?: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden text-white">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 85% 0%, rgba(217,120,69,0.2), transparent 50%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(47,143,138,0.2), transparent 50%), linear-gradient(165deg, #121820 0%, #1b2430 45%, #1f5c70 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(232,145,95,0.5), rgba(47,143,138,0.35), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-3.5 sm:px-6">
        <div className="grid gap-10 border-b border-white/[0.08] py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16 lg:py-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#e8915f]/90">
              Community
            </p>
            <h2 className="mt-3 font-display text-2xl leading-tight tracking-tight text-white sm:text-4xl">
              Stories of verified impact, in your inbox
            </h2>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-white/60 sm:text-sm">
              Occasional updates on community health outreaches, children's scholarships, and how your support creates durable change.
            </p>
          </div>
          <FooterSubscribe />
        </div>

        <div className="grid gap-12 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl font-display text-lg font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #1f5c70, #2f8f8a)",
                  boxShadow: "0 10px 28px rgba(31,92,112,0.35)",
                }}
              >
                {orgName.trim().charAt(0) || "N"}
              </span>
              <span className="font-display text-xl tracking-tight">{orgName}</span>
            </Link>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/60 sm:text-sm">
              Dedicated to empowering children and vulnerable families through education, clean water, and community healthcare with verified transparency.
            </p>
            <div className="mt-5 space-y-1.5 text-xs text-white/50 sm:text-sm">
              {address ? <p>{address}</p> : <p>Lagos, Nigeria • Serving communities across West Africa</p>}
              {phone ? <p>{phone}</p> : null}
              {email ? (
                <a href={`mailto:${email}`} className="transition hover:text-white">
                  {email}
                </a>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/30">Explore</p>
            <ul className="mt-4 space-y-3">
              {[
                { href: "/about", label: "About" },
                { href: "/programmes", label: "Programmes" },
                { href: "/donate", label: "Donate" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/30">Account</p>
            <ul className="mt-4 space-y-3">
              {[
                { href: "/login", label: "Admin login" },
                { href: "/forgot-password", label: "Reset password" },
                { href: "/verify-email", label: "Verify email" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/30">Give</p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Secure donations via Paystack or Flutterwave. Every success is verified before it
              counts.
            </p>
            <Link
              href="/donate"
              className="mt-5 inline-flex rounded-full px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-105"
              style={{
                background: "linear-gradient(135deg, #d97845, #e8915f)",
                boxShadow: "0 8px 22px rgba(217,120,69,0.35)",
              }}
            >
              Donate now
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.07] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/35">
            © {year} {orgName}. All rights reserved.
          </p>
          <p className="text-xs tracking-wide text-white/25">Serving communities with integrity</p>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppButton({
  number,
  message,
}: {
  number?: string;
  message?: string;
}) {
  const href = buildWhatsAppUrl(number, message);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M20.5 3.5A11.8 11.8 0 0 0 12.05 0C5.5 0 .2 5.3.2 11.85c0 2.1.55 4.1 1.6 5.9L0 24l6.4-1.7a11.8 11.8 0 0 0 5.65 1.45h.05c6.55 0 11.85-5.3 11.85-11.85 0-3.17-1.23-6.15-3.45-8.4z" />
      </svg>
    </a>
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
