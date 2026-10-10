/** Decorative stage illustrations for the homepage programme strip. */

export function IllusCreche({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.1" />
      <path
        d="M18 38c0-7.7 6.3-14 14-14s14 6.3 14 14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="22" r="6" fill="currentColor" opacity="0.9" />
      <path
        d="M22 44h20c1.1 0 2 .9 2 2v2H20v-2c0-1.1.9-2 2-2z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M26 30c2.5 3 9.5 3 12 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function IllusKindergarten({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.1" />
      <rect x="16" y="34" width="14" height="14" rx="2.5" fill="currentColor" opacity="0.9" />
      <rect x="28" y="22" width="14" height="14" rx="2.5" fill="currentColor" opacity="0.65" />
      <rect x="34" y="36" width="14" height="12" rx="2.5" fill="currentColor" opacity="0.45" />
      <circle cx="23" cy="41" r="2" fill="white" opacity="0.5" />
      <circle cx="35" cy="29" r="2" fill="white" opacity="0.45" />
    </svg>
  );
}

export function IllusNursery({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.1" />
      <path
        d="M20 18h18c2.2 0 4 1.8 4 4v28c0 1.1-.9 2-2 2H22c-2.2 0-4-1.8-4-4V20c0-1.1.9-2 2-2z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M38 18v8h8" fill="currentColor" opacity="0.55" />
      <path
        d="M26 32h12M26 38h10M26 44h8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M24 24h8"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function IllusPrimary({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.1" />
      <path
        d="M12 28l20-10 20 10-20 10L12 28z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M48 28v12c-5 3-10 4.5-16 4.5S21 43 16 40V28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
      <path d="M48 28v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
      <circle cx="48" cy="44" r="2.5" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

export function IllusHeartBook({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect width="48" height="48" rx="14" fill="currentColor" opacity="0.12" />
      <path
        d="M24 36s-10-6.2-10-13.2C14 19 16.8 17 19.5 17c1.7 0 3.2.9 4.5 2.3C25.3 17.9 26.8 17 28.5 17 31.2 17 34 19 34 22.8 34 29.8 24 36 24 36z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

export function IllusSparkLearn({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect width="48" height="48" rx="14" fill="currentColor" opacity="0.12" />
      <path
        d="M24 10l2.4 8.2L34 20l-6.2 4.2L30 33l-6-4.5L18 33l2.2-8.8L14 20l7.6-1.8L24 10z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

export function IllusCommunity({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect width="48" height="48" rx="14" fill="currentColor" opacity="0.12" />
      <circle cx="18" cy="18" r="5" fill="currentColor" opacity="0.9" />
      <circle cx="30" cy="18" r="5" fill="currentColor" opacity="0.55" />
      <path
        d="M8 34c0-4.4 4.5-7 10-7s10 2.6 10 7"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M24 34c0-3.2 3.2-5.2 7-5.5 3.5.2 7 2.2 7 5.5"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  );
}
