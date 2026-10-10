"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, type ComponentType } from "react";
import {
  IllusCommunity,
  IllusHeartBook,
  IllusSparkLearn,
} from "@/components/home-illustrations";
import { PremiumModal } from "@/components/premium-modal";

type PromiseItem = {
  id: string;
  title: string;
  body: string;
  detail: string;
  highlights: string[];
  accent: string;
  Icon: ComponentType<{ className?: string }>;
};

const PROMISES: PromiseItem[] = [
  {
    id: "accessible",
    title: "Accessible excellence",
    body: "Quality foundational education in a safe, nurturing environment — regardless of a family's financial circumstances.",
    detail:
      "Splendor Spring School was founded so poverty never blocks a child's education. We keep fees low, and for families who genuinely cannot pay — especially vulnerable children — learning is provided free of charge.",
    highlights: [
      "Low-cost, child-centred schooling in Makoko",
      "Fee support for vulnerable families",
      "Safe classrooms with dedicated teachers",
      "Equal opportunity for every learner",
    ],
    accent: "var(--c-sky)",
    Icon: IllusHeartBook,
  },
  {
    id: "learning",
    title: "Learning that lasts",
    body: "Strong academics with creativity, practical learning, STEAM activities and character development beyond the classroom.",
    detail:
      "We combine literacy, numeracy, science and discovery with creative arts, practical projects and STEAM-oriented activities — so pupils understand how to apply knowledge in everyday life.",
    highlights: [
      "Phonics, literacy and numeracy foundations",
      "Science, discovery and STEAM activities",
      "Creative arts and cultural experiences",
      "Learning beyond the traditional classroom",
    ],
    accent: "var(--c-gold)",
    Icon: IllusSparkLearn,
  },
  {
    id: "community",
    title: "A caring community",
    body: "Dedicated teachers nurturing over 200 children in Makoko — raising confident, compassionate and responsible pupils.",
    detail:
      "Our motto, Nurturing to Greater Heights, guides every relationship in the school. We raise confident, knowledgeable, compassionate children ready to serve their families and community.",
    highlights: [
      "Over 200 children served with care",
      "Values: excellence, integrity, compassion, respect",
      "Faith, creativity, inclusiveness and service",
      "Partnerships that open new horizons",
    ],
    accent: "var(--c-emerald)",
    Icon: IllusCommunity,
  },
];

export function HomePromises() {
  const [active, setActive] = useState<PromiseItem | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-3 py-16 min-[240px]:px-4 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55 }}
      >
        <p className="section-label">Why families choose us</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] min-[360px]:text-4xl md:text-5xl">
          Nurturing to{" "}
          <span
            style={{
              background: "linear-gradient(135deg, var(--c-sky), var(--c-gold))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            greater heights
          </span>
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--c-text-3)] sm:text-base">
          What we offer every child who walks through our doors — care, opportunity, and a strong
          foundation for life. Tap a card to learn more.
        </p>
        <div className="section-divider mt-4" />
      </motion.div>

      <div className="mt-10 grid gap-4 min-[480px]:grid-cols-2 sm:mt-12 sm:gap-6 md:grid-cols-3">
        {PROMISES.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActive(item)}
            className="group relative cursor-pointer overflow-hidden rounded-[1.5rem] border border-[var(--c-border)] bg-[var(--c-surface)] p-5 text-left shadow-[var(--shadow-xs)] sm:rounded-[1.75rem] sm:p-7"
          >
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-60 transition-transform duration-700 group-hover:scale-125"
              style={{
                background: `radial-gradient(circle, ${item.accent}22, transparent 70%)`,
              }}
              aria-hidden
            />
            <motion.div whileHover={{ scale: 1.08, rotate: 3 }} style={{ color: item.accent }}>
              <item.Icon />
            </motion.div>
            <h3 className="mt-5 font-display text-xl font-bold text-[var(--c-text)]">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--c-text-3)]">{item.body}</p>
            <p
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: item.accent }}
            >
              Learn more
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </p>
            <div
              className="mt-4 h-0.5 w-0 rounded-full transition-all duration-500 group-hover:w-full"
              style={{ background: item.accent }}
            />
          </motion.button>
        ))}
      </div>

      <PremiumModal
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.title ?? ""}
        eyebrow="Why families choose us"
        accent={active?.accent}
        footer={
          active ? (
            <>
              <button type="button" className="btn btn-ghost text-sm" onClick={() => setActive(null)}>
                Close
              </button>
              <Link
                href="/about"
                className="btn btn-gold text-sm text-center"
                onClick={() => setActive(null)}
              >
                Read our full story
              </Link>
            </>
          ) : null
        }
      >
        {active ? (
          <div className="space-y-4">
            <div
              className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: `color-mix(in srgb, ${active.accent} 14%, white)`,
                color: active.accent,
              }}
            >
              <active.Icon />
            </div>
            <p className="text-sm leading-relaxed text-[var(--c-text-2)]">{active.detail}</p>
            <ul className="space-y-2.5">
              {active.highlights.map((h, i) => (
                <motion.li
                  key={h}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                  className="flex gap-2.5 text-sm text-[var(--c-text-2)]"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: active.accent }}
                  />
                  {h}
                </motion.li>
              ))}
            </ul>
          </div>
        ) : null}
      </PremiumModal>
    </section>
  );
}
