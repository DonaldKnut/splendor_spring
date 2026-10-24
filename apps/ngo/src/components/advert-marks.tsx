/** Compact SVG marks for NGO advert surfaces. */

export function IllusCommunity({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden>
      <circle cx="60" cy="60" r="56" fill="currentColor" opacity="0.08" />
      <circle cx="42" cy="48" r="12" fill="currentColor" opacity="0.9" />
      <circle cx="78" cy="48" r="12" fill="currentColor" opacity="0.55" />
      <path
        d="M22 86c2.5-14 12-22 28-22s25.5 8 28 22"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M58 86c2-10 9-16 20-16 11 0 18 6 20 16"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M48 36c6 4 18 4 24 0"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export function IllusGiving({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden>
      <circle cx="60" cy="60" r="56" fill="currentColor" opacity="0.08" />
      <path
        d="M60 92s-26-16-26-34c0-10 8-16 15-16 4.5 0 8 2.5 11 6 3-3.5 6.5-6 11-6 7 0 15 6 15 16 0 18-26 34-26 34z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M44 48c8 6 24 6 32 0"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export function IllusGrant({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden>
      <circle cx="60" cy="60" r="56" fill="currentColor" opacity="0.08" />
      <rect x="28" y="34" width="64" height="52" rx="8" fill="currentColor" opacity="0.9" />
      <path
        d="M40 50h40M40 62h28M40 74h34"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle cx="84" cy="78" r="14" fill="currentColor" opacity="0.35" />
      <path d="M84 72v12M78 78h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function IllusGather({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden>
      <circle cx="60" cy="60" r="56" fill="currentColor" opacity="0.08" />
      <rect x="30" y="38" width="60" height="48" rx="8" fill="currentColor" opacity="0.88" />
      <path
        d="M42 30v12M78 30v12M30 54h60"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle cx="48" cy="70" r="4" fill="white" opacity="0.55" />
      <circle cx="60" cy="70" r="4" fill="white" opacity="0.55" />
      <circle cx="72" cy="70" r="4" fill="white" opacity="0.55" />
    </svg>
  );
}

export function IllusVoice({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden>
      <circle cx="60" cy="60" r="56" fill="currentColor" opacity="0.08" />
      <rect x="34" y="68" width="12" height="22" rx="3" fill="currentColor" opacity="0.45" />
      <rect x="54" y="48" width="12" height="42" rx="3" fill="currentColor" opacity="0.7" />
      <rect x="74" y="36" width="12" height="54" rx="3" fill="currentColor" opacity="0.95" />
    </svg>
  );
}

export function IllusShield({ className = "h-24 w-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 96 96" fill="none" aria-hidden>
      <path
        d="M48 12 78 26v22c0 20-12 34-30 42-18-8-30-22-30-42V26L48 12z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M48 18 72 29v18c0 15-9 26-24 33-15-7-24-18-24-33V29L48 18z"
        stroke="currentColor"
        strokeWidth="2.4"
        opacity="0.85"
      />
      <path
        d="m38 48 7 7 14-16"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
