"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

function ensureGsap() {
  if (typeof window === "undefined") return;
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/** Fade/slide children in on mount — premium page entrance. */
export function usePageEnter(selector = "[data-animate='enter']") {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ensureGsap();
    const ctx = gsap.context(() => {
      gsap.from(selector, {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, [selector]);

  return rootRef;
}

/** Reveal elements as they enter the viewport. */
export function useRevealOnScroll(selector = "[data-animate='reveal']") {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ensureGsap();
    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray<HTMLElement>(selector);
      nodes.forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [selector]);

  return rootRef;
}

export function useParallax(selector = "[data-animate='parallax']") {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ensureGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.speed || -12),
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement || el,
            scrub: true,
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [selector]);

  return rootRef;
}

export { gsap, ScrollTrigger };
