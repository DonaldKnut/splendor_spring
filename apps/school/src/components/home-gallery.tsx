"use client";

import { MediaSwiper } from "@splendor/ui";
import { motion } from "framer-motion";
import { SCHOOL_GALLERY } from "@/lib/media-gallery";

export function HomeGallery() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-3 min-[240px]:px-4 sm:px-6">
        <MediaSwiper
          slides={[...SCHOOL_GALLERY.campusLife]}
          variant="cards"
          renderHeader={(nav) => (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 flex items-end justify-between gap-6 sm:mb-12"
            >
              <div className="max-w-2xl">
                <p className="section-label">Life at Splendor</p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--c-text)] min-[360px]:text-4xl md:text-5xl">
                  Moments from our classrooms
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--c-text-3)] sm:text-base">
                  Real moments from classrooms, celebrations and community life at Splendor Spring
                  School.
                </p>
                <div className="section-divider" />
              </div>
              <div className="shrink-0 pb-1">{nav}</div>
            </motion.div>
          )}
        />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10"
        >
          <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--c-text-3)]">
            Early years &amp; community
          </p>
          <MediaSwiper
            slides={[...SCHOOL_GALLERY.earlyYearsCommunity]}
            variant="filmstrip"
          />
        </motion.div>
      </div>
    </section>
  );
}
