"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import {
  IllusCreche,
  IllusKindergarten,
  IllusNursery,
  IllusPrimary,
} from "@/components/home-illustrations";

type Stage = {
  id: string;
  title: string;
  body: string;
  accent: string;
  accentSoft: string;
  Icon: ComponentType<{ className?: string }>;
  highlights: string[];
  detail: string;
};

const STAGES: Stage[] = [
  {
    id: "reception",
    title: "Reception / Crèche",
    body: "Warm, age-appropriate care and early learning for our youngest children.",
    accent: "var(--c-sky)",
    accentSoft: "var(--c-ice)",
    Icon: IllusCreche,
    highlights: [
      "Gentle settling-in routines",
      "Sensory play and early language",
      "Safe, nurturing supervision",
      "Family partnership from day one",
    ],
    detail:
      "Our Reception / Crèche welcomes the youngest learners into a calm, caring space. Days are shaped around rest, play, songs and early discovery — so every child feels secure while building the first foundations of learning.",
  },
  {
    id: "kindergarten",
    title: "Kindergarten",
    body: "Play-based foundations that build curiosity, language and social skills.",
    accent: "var(--c-gold)",
    accentSoft: "var(--c-gold-pale)",
    Icon: IllusKindergarten,
    highlights: [
      "Play-led learning centres",
      "Spoken language & storytelling",
      "Sharing, turn-taking and kindness",
      "Creative movement and song",
    ],
    detail:
      "Kindergarten grows curiosity through purposeful play. Children explore language, numbers, stories and friendship in a stimulating environment that prepares them for nursery with confidence and joy.",
  },
  {
    id: "nursery",
    title: "Nursery",
    body: "Phonics, early literacy and numeracy in a nurturing classroom environment.",
    accent: "var(--c-emerald)",
    accentSoft: "var(--c-emerald-pale)",
    Icon: IllusNursery,
    highlights: [
      "Phonics and early reading",
      "Number sense and problem-solving",
      "Hands-on discovery activities",
      "Character and social growth",
    ],
    detail:
      "Nursery strengthens literacy and numeracy with phonics, guided practice and practical activities. Children learn how to listen, express themselves and apply new skills — always with care at the centre.",
  },
  {
    id: "primary",
    title: "Primary School",
    body: "Strong academics with creativity, character and practical learning at every stage.",
    accent: "#5b7cfa",
    accentSoft: "rgba(91,124,250,0.12)",
    Icon: IllusPrimary,
    highlights: [
      "Strong core academics",
      "STEAM and creative arts",
      "Leadership and teamwork",
      "Values, faith and responsibility",
    ],
    detail:
      "Primary education at Splendor Spring School combines rigorous foundational academics with creativity, practical projects and character formation — preparing pupils to reach greater heights in school and in life.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function HomeProgrammeStages() {
  const [active, setActive] = useState<Stage | null>(null);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const modal =
    mounted &&
    createPortal(
      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-[10060] flex items-end justify-center p-3 min-[360px]:p-4 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <motion.button
              type="button"
              aria-label="Close programme details"
              className="absolute inset-0 bg-[#140c08]/65 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative z-10 flex max-h-[min(92svh,40rem)] w-full max-w-lg flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white shadow-[0_30px_80px_rgba(7,11,20,0.45)]"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
            >
              <div
                className="relative overflow-hidden px-5 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6"
                style={{
                  background: `linear-gradient(145deg, ${active.accentSoft}, #fff 55%)`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="inline-flex h-14 w-14 items-center justify-center rounded-2xl sm:h-16 sm:w-16"
                    style={{ background: active.accentSoft, color: active.accent }}
                  >
                    <active.Icon />
                  </div>
                  <button
                    type="button"
                    onClick={() => setActive(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--c-border)] bg-white/80 text-[var(--c-text-2)] transition hover:bg-white"
                    aria-label="Close"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M6 6l12 12M18 6 6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
                <p
                  className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.18em]"
                  style={{ color: active.accent }}
                >
                  Programme stage
                </p>
                <h3
                  id={titleId}
                  className="mt-2 font-display text-2xl font-bold tracking-tight text-[var(--c-text)] sm:text-3xl"
                >
                  {active.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--c-text-3)]">{active.body}</p>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
                <p className="text-sm leading-relaxed text-[var(--c-text-2)]">{active.detail}</p>
                <ul className="mt-5 space-y-3">
                  {active.highlights.map((h, i) => (
                    <motion.li
                      key={h}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.06 }}
                      className="flex items-start gap-3 text-sm text-[var(--c-text-2)]"
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

              <div className="flex flex-col gap-2 border-t border-[var(--c-border)] bg-[var(--c-surface-2)] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="btn btn-ghost text-sm"
                >
                  Close
                </button>
                <Link href="/contact" className="btn btn-gold text-sm text-center" onClick={() => setActive(null)}>
                  Enquire about this stage
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body
    );

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-24"
      style={{
        background:
          "linear-gradient(180deg, var(--c-surface) 0%, var(--c-surface-2) 48%, var(--c-surface) 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute -left-24 top-16 h-72 w-72 rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(26,95,122,0.12), transparent 70%)",
            filter: "blur(28px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-3 min-[240px]:px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl"
        >
          <p className="section-label">Our school</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] min-[360px]:text-4xl md:text-5xl">
            Early years &amp; primary education
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--c-text-3)] sm:text-base">
            Splendor Spring School provides early years and primary education in a supportive and
            child-friendly environment. Classes are designed to meet children at their different
            stages of development.
          </p>
          <div className="section-divider" />
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 grid gap-4 min-[480px]:grid-cols-2 sm:mt-12 sm:gap-5 lg:grid-cols-4"
        >
          {STAGES.map((stage, i) => (
            <motion.button
              key={stage.id}
              type="button"
              variants={item}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActive(stage)}
              className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.5rem] border border-[var(--c-border)] bg-[var(--c-surface)] p-5 text-left shadow-[var(--shadow-xs)] transition-shadow hover:shadow-[var(--shadow-xl)] sm:rounded-[1.75rem] sm:p-6"
            >
              <motion.div
                whileHover={{ rotate: [-2, 2, 0], scale: 1.06 }}
                transition={{ duration: 0.45 }}
                className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl sm:mb-5 sm:h-16 sm:w-16"
                style={{ background: stage.accentSoft, color: stage.accent }}
              >
                <stage.Icon />
              </motion.div>

              <p
                className="text-[0.62rem] font-bold uppercase tracking-[0.18em]"
                style={{ color: stage.accent }}
              >
                Stage {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-[var(--c-text)] sm:text-xl">
                {stage.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--c-text-3)]">
                {stage.body}
              </p>
              <p
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: stage.accent }}
              >
                Learn more
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </p>
              <div
                className="mt-3 h-0.5 w-10 rounded-full transition-all duration-500 group-hover:w-full"
                style={{ background: stage.accent }}
              />
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-10"
        >
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--c-sky)]"
          >
            Explore our approach
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </Link>
        </motion.div>
      </div>
      {modal}
    </section>
  );
}
