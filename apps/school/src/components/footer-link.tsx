"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
    >
      <span>{label}</span>
      <motion.span
        aria-hidden
        className="inline-flex text-[#d42a3a]"
        initial={{ x: 0, opacity: 0.35 }}
        whileHover={{ x: 4, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
    </Link>
  );
}
