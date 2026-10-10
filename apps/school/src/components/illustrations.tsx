export function StudentsHeroIllustration({ className = "w-48 h-48" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <defs>
        <linearGradient id="stud-grad-sky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a5f7a" />
          <stop offset="100%" stopColor="#5c3a28" />
        </linearGradient>
        <linearGradient id="stud-grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d42a3a" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="stud-grad-soft" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e8f0fb" />
          <stop offset="100%" stopColor="#d1e3f8" />
        </linearGradient>
        <filter id="stud-shadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#2a1810" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Background ambient circular glow */}
      <circle cx="160" cy="120" r="100" fill="url(#stud-grad-soft)" opacity="0.6" />
      <circle cx="230" cy="70" r="30" fill="url(#stud-grad-gold)" opacity="0.25" />

      {/* Desk surface */}
      <ellipse cx="160" cy="195" rx="125" ry="18" fill="#e2e8f0" />

      {/* Main Open Book */}
      <g filter="url(#stud-shadow)">
        <path d="M70 170 C110 162 145 168 160 178 C175 168 210 162 250 170 L245 130 C205 122 175 128 160 138 C145 128 115 122 75 130 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M160 138 L160 178" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        {/* Book lines */}
        <line x1="90" y1="142" x2="140" y2="140" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <line x1="90" y1="152" x2="135" y2="150" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="90" y1="162" x2="142" y2="160" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="180" y1="140" x2="230" y2="142" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <line x1="185" y1="150" x2="230" y2="152" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="178" y1="160" x2="225" y2="162" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Floating Graduation Cap */}
      <g filter="url(#stud-shadow)">
        {/* Cap top diamond */}
        <polygon points="160,50 215,70 160,90 105,70" fill="url(#stud-grad-sky)" />
        {/* Cap skullcap */}
        <path d="M125 78 L125 96 C125 110 195 110 195 96 L195 78 Z" fill="#3d2418" />
        {/* Cap tassel button & cord */}
        <circle cx="160" cy="70" r="4" fill="url(#stud-grad-gold)" />
        <path d="M160 70 Q195 75 205 92" stroke="#d42a3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="202" y="92" width="6" height="12" rx="2" fill="url(#stud-grad-gold)" />
      </g>

      {/* Floating Star / Sparkle Badges */}
      <g transform="translate(65, 80)">
        <polygon points="12,0 15,8 24,9 17,15 19,24 12,19 5,24 7,15 0,9 9,8" fill="url(#stud-grad-gold)" />
      </g>
      <g transform="translate(245, 110) scale(0.75)">
        <polygon points="12,0 15,8 24,9 17,15 19,24 12,19 5,24 7,15 0,9 9,8" fill="url(#stud-grad-gold)" />
      </g>

      {/* Floating Pencil */}
      <g transform="translate(225, 140) rotate(-35)">
        <rect x="0" y="0" width="10" height="42" rx="2" fill="#d42a3a" />
        <polygon points="0,42 10,42 5,52" fill="#fed7aa" />
        <polygon points="3,48 7,48 5,52" fill="#1e293b" />
        <rect x="0" y="0" width="10" height="8" rx="2" fill="#f43f5e" />
      </g>

      {/* Floating ID / Badge Card */}
      <g transform="translate(75, 115) rotate(-10)" filter="url(#stud-shadow)">
        <rect x="0" y="0" width="44" height="30" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
        <rect x="5" y="6" width="12" height="14" rx="2" fill="#1a5f7a" opacity="0.3" />
        <circle cx="11" cy="11" r="3" fill="#1a5f7a" />
        <line x1="22" y1="9" x2="38" y2="9" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="15" x2="34" y2="15" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="22" y1="21" x2="30" y2="21" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function CsvImportIllustration({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <defs>
        <linearGradient id="csv-grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="csv-grad-sky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      <rect x="35" y="30" width="170" height="135" rx="16" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="35" y="30" width="170" height="32" rx="16" fill="#f1f5f9" />
      <line x1="35" y1="62" x2="205" y2="62" stroke="#e2e8f0" strokeWidth="2" />

      {/* Grid columns */}
      <line x1="85" y1="62" x2="85" y2="165" stroke="#f1f5f9" strokeWidth="1.5" />
      <line x1="145" y1="62" x2="145" y2="165" stroke="#f1f5f9" strokeWidth="1.5" />

      {/* Header pills */}
      <rect x="45" y="40" width="30" height="12" rx="4" fill="#cbd5e1" />
      <rect x="95" y="40" width="40" height="12" rx="4" fill="#cbd5e1" />
      <rect x="155" y="40" width="36" height="12" rx="4" fill="#cbd5e1" />

      {/* Data rows */}
      <rect x="45" y="75" width="28" height="8" rx="2" fill="#94a3b8" opacity="0.6" />
      <rect x="95" y="75" width="38" height="8" rx="2" fill="#94a3b8" opacity="0.6" />
      <rect x="155" y="75" width="32" height="8" rx="2" fill="#94a3b8" opacity="0.6" />

      <rect x="45" y="95" width="32" height="8" rx="2" fill="#cbd5e1" />
      <rect x="95" y="95" width="34" height="8" rx="2" fill="#cbd5e1" />
      <rect x="155" y="95" width="38" height="8" rx="2" fill="#cbd5e1" />

      <rect x="45" y="115" width="25" height="8" rx="2" fill="#cbd5e1" />
      <rect x="95" y="115" width="42" height="8" rx="2" fill="#cbd5e1" />
      <rect x="155" y="115" width="30" height="8" rx="2" fill="#cbd5e1" />

      {/* Cloud upload bubble overlay */}
      <circle cx="170" cy="140" r="32" fill="#ffffff" filter="drop-shadow(0 6px 16px rgba(0,0,0,0.12))" />
      <circle cx="170" cy="140" r="26" fill="url(#csv-grad-green)" />
      {/* Upload arrow */}
      <path d="M170 128 L162 136 M170 128 L178 136 M170 128 L170 152" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EmptyStudentsIllustration({ className = "w-44 h-44" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <circle cx="130" cy="110" r="85" fill="#f8fafc" />
      <circle cx="130" cy="110" r="65" fill="#e8f0fb" opacity="0.6" />

      {/* Open book folder */}
      <rect x="75" y="75" width="110" height="80" rx="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" filter="drop-shadow(0 8px 20px rgba(15,28,54,0.08))" />
      <rect x="85" y="65" width="40" height="15" rx="4" fill="#93c5fd" opacity="0.5" />

      {/* Student avatar placeholder */}
      <circle cx="130" cy="105" r="14" fill="#1a5f7a" opacity="0.2" />
      <circle cx="130" cy="103" r="7" fill="#1a5f7a" />
      <path d="M118 123 C118 116 142 116 142 123" stroke="#1a5f7a" strokeWidth="2" strokeLinecap="round" />

      {/* Sparkles */}
      <circle cx="80" cy="55" r="4" fill="#d42a3a" />
      <circle cx="195" cy="85" r="3" fill="#d42a3a" />
      <circle cx="185" cy="155" r="5" fill="#10b981" opacity="0.7" />
      <circle cx="70" cy="140" r="3" fill="#1a5f7a" opacity="0.6" />
    </svg>
  );
}

export function AboutMissionIllustration({ className = "w-full max-w-sm h-64" }: { className?: string }) {
  return (
    <svg viewBox="0 0 380 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <defs>
        <linearGradient id="ab-grad-sun" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#d42a3a" />
        </linearGradient>
        <linearGradient id="ab-grad-tree" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="ab-grad-torch" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      {/* Backdrop sun */}
      <circle cx="190" cy="120" r="75" fill="url(#ab-grad-sun)" opacity="0.25" />
      <circle cx="190" cy="120" r="50" fill="url(#ab-grad-sun)" opacity="0.4" />

      {/* Mountain of growth / knowledge */}
      <path d="M60 210 L150 110 L220 180 L290 90 L360 210 Z" fill="#e0f2fe" opacity="0.6" />
      <path d="M120 210 L200 130 L270 210 Z" fill="#bae6fd" opacity="0.8" />

      {/* Open pedestal / book */}
      <path d="M130 190 C160 182 185 186 190 192 C195 186 220 182 250 190 L245 220 C220 214 195 218 190 224 C185 218 160 214 135 220 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.06))" />

      {/* Nurturing Tree / Sprout of Excellence */}
      <path d="M190 190 L190 145" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
      <circle cx="190" cy="130" r="24" fill="url(#ab-grad-tree)" />
      <circle cx="174" cy="140" r="16" fill="url(#ab-grad-tree)" />
      <circle cx="206" cy="140" r="16" fill="url(#ab-grad-tree)" />

      {/* Stars of achievement */}
      <g transform="translate(182, 75)">
        <polygon points="8,0 10,5 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,5" fill="#9f1239" />
      </g>
      <g transform="translate(110, 80) scale(0.7)">
        <polygon points="8,0 10,5 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,5" fill="#9f1239" />
      </g>
      <g transform="translate(265, 85) scale(0.7)">
        <polygon points="8,0 10,5 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,5" fill="#9f1239" />
      </g>
    </svg>
  );
}

export function AnnouncementsIllustration({ className = "w-44 h-44" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <defs>
        <linearGradient id="ann-grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9f1239" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <circle cx="130" cy="110" r="75" fill="#fef3c7" opacity="0.6" />

      {/* Megaphone */}
      <g transform="translate(70, 75)">
        {/* Cone */}
        <path d="M30 45 L80 15 L80 75 L30 55 Z" fill="#1a5f7a" stroke="#5c3a28" strokeWidth="2" />
        {/* Mouth rim */}
        <ellipse cx="80" cy="45" rx="8" ry="30" fill="#60a5fa" stroke="#5c3a28" strokeWidth="2" />
        {/* Handle */}
        <path d="M40 55 L35 75 L45 75 L48 55 Z" fill="#1e293b" />
        {/* Back piece */}
        <rect x="15" y="44" width="16" height="16" rx="4" fill="#d42a3a" stroke="#d97706" strokeWidth="2" />

        {/* Sound waves */}
        <path d="M96 30 C106 38 106 52 96 60" stroke="#9f1239" strokeWidth="3" strokeLinecap="round" />
        <path d="M106 20 C122 34 122 56 106 70" stroke="#9f1239" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* Floating sparkles */}
      <circle cx="60" cy="65" r="4" fill="#1a5f7a" />
      <circle cx="205" cy="60" r="5" fill="#d42a3a" />
      <circle cx="190" cy="160" r="4" fill="#10b981" />
    </svg>
  );
}

export function ContactIllustration({ className = "w-full max-w-xs h-64" }: { className?: string }) {
  return (
    <svg viewBox="0 0 340 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <defs>
        <linearGradient id="ct-grad-sky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a5f7a" />
          <stop offset="100%" stopColor="#5c3a28" />
        </linearGradient>
      </defs>

      <circle cx="170" cy="130" r="85" fill="#e8f0fb" opacity="0.7" />

      {/* Chat bubble back */}
      <rect x="75" y="65" width="125" height="85" rx="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" filter="drop-shadow(0 8px 16px rgba(15,28,54,0.08))" />
      <path d="M95 150 L85 168 L115 150 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <rect x="95" y="85" width="70" height="8" rx="4" fill="#94a3b8" />
      <rect x="95" y="103" width="85" height="8" rx="4" fill="#cbd5e1" />
      <rect x="95" y="121" width="50" height="8" rx="4" fill="#cbd5e1" />

      {/* Front envelope badge */}
      <g transform="translate(155, 110)" filter="drop-shadow(0 10px 24px rgba(26,95,122,0.3))">
        <rect x="0" y="0" width="110" height="75" rx="14" fill="#1a5f7a" />
        {/* Envelope fold */}
        <path d="M0 5 L55 45 L110 5" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" fill="none" />
        {/* Seal */}
        <circle cx="55" cy="45" r="10" fill="#d42a3a" />
      </g>

      {/* Location pin */}
      <g transform="translate(60, 140)">
        <path d="M20 0 C9 0 0 9 0 20 C0 35 20 52 20 52 C20 52 40 35 40 20 C40 9 31 0 20 0 Z" fill="#059669" />
        <circle cx="20" cy="20" r="7" fill="#ffffff" />
      </g>

      <circle cx="280" cy="80" r="5" fill="#d42a3a" />
      <circle cx="50" cy="90" r="4" fill="#60a5fa" />
    </svg>
  );
}
