"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SOCIAL_IMPACT } from "@/lib/social-impact";

export function HomeSocialImpact() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 100% 0%, rgba(185,28,44,0.06), transparent 55%), radial-gradient(ellipse 50% 45% at 0% 100%, rgba(26,95,122,0.07), transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-3 min-[240px]:px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <p className="section-label">{SOCIAL_IMPACT.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] min-[360px]:text-4xl md:text-[2.65rem] md:leading-[1.15]">
              {SOCIAL_IMPACT.title}
            </h2>
            <div className="section-divider" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary btn-sm rounded-xl">
                Enquire about admission →
              </Link>
              <Link href="/about" className="btn btn-ghost btn-sm rounded-xl border-[var(--c-border)]">
                Our full story
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="space-y-5 rounded-[1.5rem] border border-[var(--c-border)] bg-[var(--c-surface)] p-6 shadow-[var(--shadow-sm)] sm:p-8">
              {SOCIAL_IMPACT.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={`text-sm leading-relaxed sm:text-base ${
                    i === 1
                      ? "font-medium text-[var(--c-text)]"
                      : "text-[var(--c-text-2)]"
                  }`}
                >
                  {p}
                </p>
              ))}
              <div className="grid gap-3 border-t border-[var(--c-border)] pt-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-[var(--c-ice)] px-4 py-3.5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--c-sky)]">
                    Affordable fees
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-[var(--c-text-2)]">
                    Support for low-income families who are working to keep their children in school.
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--c-emerald-pale)] px-4 py-3.5">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--c-emerald)]">
                    Free education
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-[var(--c-text-2)]">
                    For children whose parents genuinely cannot afford school fees.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
