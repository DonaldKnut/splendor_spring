"use client";

import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@splendor/shared/whatsapp";
import { motion } from "framer-motion";
import { toWhatsAppDigits } from "@/lib/school-contact";

export function WhatsAppFloat({
  number = "08186431261",
  message = "Hello Splendor Spring School, I would like to enquire about admissions.",
}: {
  number?: string;
  message?: string;
}) {
  const href = buildWhatsAppUrl(toWhatsAppDigits(number), message);
  const [hintOpen, setHintOpen] = useState(false);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let alive = true;

    const cycle = () => {
      showTimer = setTimeout(() => {
        if (!alive) return;
        setHintOpen(true);
        hideTimer = setTimeout(() => {
          if (!alive) return;
          setHintOpen(false);
          cycle();
        }, 3200);
      }, 5200);
    };

    const first = setTimeout(() => {
      if (!alive) return;
      setHintOpen(true);
      hideTimer = setTimeout(() => {
        if (!alive) return;
        setHintOpen(false);
        cycle();
      }, 3200);
    }, 1800);

    return () => {
      alive = false;
      clearTimeout(first);
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!href) return null;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`wa-float no-print${hintOpen ? " wa-float--hint" : ""}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
    >
      <span className="wa-float__label">Chat with us</span>
      <span className="wa-float__icon" aria-hidden>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M20.5 3.5A11.8 11.8 0 0 0 12.05 0C5.5 0 .2 5.3.2 11.85c0 2.1.55 4.1 1.6 5.9L0 24l6.4-1.7a11.8 11.8 0 0 0 5.65 1.45h.05c6.55 0 11.85-5.3 11.85-11.85 0-3.17-1.23-6.15-3.45-8.4zm-8.45 18.2h-.04a9.8 9.8 0 0 1-5-1.37l-.36-.22-3.8 1 1.02-3.7-.24-.38a9.8 9.8 0 0 1-1.5-5.22c0-5.42 4.41-9.83 9.84-9.83a9.77 9.77 0 0 1 9.83 9.83c0 5.43-4.41 9.84-9.75 9.84zm5.4-7.36c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.57-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
        </svg>
      </span>
    </motion.a>
  );
}
