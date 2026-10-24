import React from "react";

export function EducationIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eduBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f5c70" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#2f8f8a" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2f8f8a" />
          <stop offset="100%" stopColor="#1f5c70" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97845" />
        </linearGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="160" cy="110" r="95" fill="url(#eduBgGrad)" />
      <circle cx="80" cy="60" r="3" fill="#2f8f8a" opacity="0.6" />
      <circle cx="240" cy="70" r="4" fill="#d97845" opacity="0.7" />
      <circle cx="250" cy="160" r="3" fill="#2f8f8a" opacity="0.5" />

      {/* Floating Sparkles & Lightbulb */}
      <g className="animate-float-slow">
        <circle cx="160" cy="45" r="16" fill="#fff" stroke="#f59e0b" strokeWidth="2.5" />
        <path d="M154 44c0-3.3 2.7-6 6-6s6 2.7 6 6c0 2-1 3.5-2.5 4.5v2.5h-7V48.5c-1.5-1-2.5-2.5-2.5-4.5z" fill="url(#goldGrad)" />
        <path d="M156 54h8" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        {/* Glow rays */}
        <line x1="160" y1="20" x2="160" y2="24" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <line x1="178" y1="28" x2="175" y2="31" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <line x1="142" y1="28" x2="145" y2="31" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Open Book Base */}
      <g transform="translate(60, 90)">
        {/* Pages under */}
        <path
          d="M100 85 C65 72 30 74 5 82 L0 25 C25 17 65 15 100 28 C135 15 175 17 200 25 L195 82 C170 74 135 72 100 85 Z"
          fill="#e2e8f0"
          opacity="0.7"
        />
        {/* Open Book Cover */}
        <path
          d="M100 80 C65 67 28 69 5 77 L0 18 C25 10 65 8 100 22 C135 8 175 10 200 18 L195 77 C172 69 135 67 100 80 Z"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        {/* Spine */}
        <line x1="100" y1="22" x2="100" y2="80" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        
        {/* Left page lines */}
        <line x1="25" y1="34" x2="80" y2="38" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="25" y1="44" x2="80" y2="48" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="25" y1="54" x2="65" y2="58" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

        {/* Right page lines */}
        <line x1="120" y1="38" x2="175" y2="34" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="120" y1="48" x2="175" y2="44" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="135" y1="58" x2="175" y2="54" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

        {/* Bookmark ribbon */}
        <path d="M100 22 L100 88 L106 82 L112 88 L112 24 Z" fill="#d97845" />
      </g>

      {/* Graduation Cap / Rising Star */}
      <g className="animate-float-reverse" transform="translate(205, 55)">
        <polygon points="25,5 45,15 25,25 5,15" fill="url(#bookGrad)" />
        <polygon points="25,21 39,15 39,26 25,33 11,26 11,15" fill="#1f5c70" opacity="0.9" />
        <path d="M40 16 L45 28" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="45" cy="29" r="1.5" fill="#f59e0b" />
      </g>

      {/* Rising stars */}
      <polygon points="75,40 77,46 83,47 78,51 80,57 75,53 70,57 72,51 67,47 73,46" fill="#f59e0b" opacity="0.9" />
    </svg>
  );
}

export function WaterHealthIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="waterBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2f8f8a" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#1f5c70" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="dropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
      </defs>

      {/* Ambient background rings */}
      <circle cx="160" cy="110" r="95" fill="url(#waterBgGrad)" />
      <ellipse cx="160" cy="170" rx="90" ry="16" fill="#e0f2fe" opacity="0.6" />
      <ellipse cx="160" cy="170" rx="60" ry="10" fill="#bae6fd" opacity="0.5" />

      {/* Water Droplet Core with Glow */}
      <g className="animate-float-slow">
        {/* Glowing water drop */}
        <path
          d="M160 55 C160 55 125 105 125 130 C125 150 141 165 160 165 C179 165 195 150 195 130 C195 105 160 55 160 55 Z"
          fill="url(#dropGrad)"
          style={{ filter: "drop-shadow(0 10px 18px rgba(14,165,233,0.35))" }}
        />
        {/* Reflection Highlight */}
        <path
          d="M145 110 C140 120 140 135 146 145"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* Internal Heart / Medical Pulse */}
        <path
          d="M148 126 L154 126 L157 118 L162 136 L166 123 L169 126 L174 126"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Health Shield on Right */}
      <g className="animate-float-reverse" transform="translate(195, 80)">
        <path
          d="M30 10 L55 20 C55 45 42 62 30 70 C18 62 5 45 5 20 Z"
          fill="url(#shieldGrad)"
          style={{ filter: "drop-shadow(0 6px 14px rgba(15,118,110,0.3))" }}
        />
        {/* Cross on shield */}
        <path d="M30 28 V46 M21 37 H39" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Wellness Plant Sprout on Left */}
      <g transform="translate(75, 115)">
        <path
          d="M30 50 C30 25 15 15 5 15 C5 35 15 48 30 50 Z"
          fill="#34d399"
          opacity="0.9"
        />
        <path
          d="M28 48 C35 30 45 22 55 25 C55 40 42 46 28 48 Z"
          fill="#10b981"
        />
        <path d="M29 50 V32" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Small floating droplets */}
      <circle cx="105" cy="75" r="5" fill="#38bdf8" opacity="0.75" />
      <circle cx="215" cy="55" r="4" fill="#0ea5e9" opacity="0.6" />
    </svg>
  );
}

export function NutritionIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="foodBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97845" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="bowlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97845" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="wheatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="160" cy="110" r="95" fill="url(#foodBgGrad)" />
      <ellipse cx="160" cy="175" rx="85" ry="14" fill="#fed7aa" opacity="0.6" />

      {/* Nourishment Bowl */}
      <g transform="translate(90, 85)">
        {/* Steam rising */}
        <g className="animate-float-slow">
          <path d="M50 15 Q55 5 50 -5 Q45 -15 50 -25" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <path d="M70 12 Q75 2 70 -8 Q65 -18 70 -28" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <path d="M90 15 Q95 5 90 -5 Q85 -15 90 -25" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        </g>

        {/* Fresh Harvest Top (fruits/greens) */}
        <circle cx="50" cy="20" r="14" fill="#10b981" />
        <circle cx="70" cy="15" r="16" fill="#f59e0b" />
        <circle cx="90" cy="18" r="15" fill="#ef4444" />
        <circle cx="60" cy="10" r="12" fill="#34d399" />
        <circle cx="82" cy="12" r="11" fill="#f97316" />

        {/* Ceramic Bowl */}
        <path
          d="M10 25 C10 65 35 85 70 85 C105 85 130 65 130 25 Z"
          fill="url(#bowlGrad)"
          style={{ filter: "drop-shadow(0 8px 20px rgba(180,83,9,0.3))" }}
        />
        {/* Rim Highlight */}
        <ellipse cx="70" cy="25" rx="60" ry="12" fill="#fed7aa" />
        <ellipse cx="70" cy="25" rx="55" ry="9" fill="#fff" opacity="0.3" />
      </g>

      {/* Golden Wheat Stalk on Left */}
      <g className="animate-float-reverse" transform="translate(50, 45)">
        <path d="M30 110 Q30 50 15 15" stroke="url(#wheatGrad)" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="14" cy="22" rx="5" ry="9" transform="rotate(-25 14 22)" fill="url(#wheatGrad)" />
        <ellipse cx="23" cy="35" rx="5" ry="9" transform="rotate(35 23 35)" fill="url(#wheatGrad)" />
        <ellipse cx="15" cy="48" rx="5" ry="9" transform="rotate(-30 15 48)" fill="url(#wheatGrad)" />
        <ellipse cx="26" cy="62" rx="5" ry="9" transform="rotate(35 26 62)" fill="url(#wheatGrad)" />
        <ellipse cx="18" cy="76" rx="5" ry="9" transform="rotate(-30 18 76)" fill="url(#wheatGrad)" />
      </g>

      {/* Heart of Compassion */}
      <g className="animate-float-slow" transform="translate(230, 60)">
        <path
          d="M20 32 C20 32 5 22 5 12 C5 5 11 2 16 5 C19 7 20 10 20 10 C20 10 21 7 24 5 C29 2 35 5 35 12 C35 22 20 32 20 32 Z"
          fill="#f43f5e"
          style={{ filter: "drop-shadow(0 4px 10px rgba(244,63,94,0.4))" }}
        />
      </g>
    </svg>
  );
}

export function ShelterEmpowermentIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="shelterBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f5c70" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#d97845" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8915f" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="houseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      {/* Ambient background glow */}
      <circle cx="160" cy="110" r="95" fill="url(#shelterBgGrad)" />
      <ellipse cx="160" cy="175" rx="88" ry="14" fill="#e2e8f0" opacity="0.6" />

      {/* Rising Sun of Hope */}
      <circle cx="160" cy="75" r="32" fill="#fed7aa" opacity="0.7" />
      <circle cx="160" cy="75" r="22" fill="#fbbf24" opacity="0.9" />

      {/* Safe Home & Hearth Structure */}
      <g transform="translate(105, 70)">
        {/* Roof */}
        <polygon
          points="55,10 110,48 0,48"
          fill="url(#roofGrad)"
          style={{ filter: "drop-shadow(0 6px 14px rgba(194,65,12,0.3))" }}
        />
        {/* House Walls */}
        <rect x="15" y="48" width="80" height="55" rx="4" fill="url(#houseGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
        {/* Welcoming Door */}
        <path d="M42 103 V68 C42 63 47 60 55 60 C63 60 68 63 68 68 V103 Z" fill="#1f5c70" />
        <circle cx="62" cy="82" r="2" fill="#f59e0b" />
        {/* Windows */}
        <rect x="23" y="60" width="12" height="14" rx="2" fill="#38bdf8" opacity="0.8" />
        <rect x="75" y="60" width="12" height="14" rx="2" fill="#38bdf8" opacity="0.8" />
      </g>

      {/* Cupping Caring Hands Base */}
      <g className="animate-float-slow">
        {/* Left protective hand gesture */}
        <path
          d="M65 155 C80 145 105 150 120 162 C105 168 85 168 65 155 Z"
          fill="#2f8f8a"
          opacity="0.8"
        />
        {/* Right protective hand gesture */}
        <path
          d="M255 155 C240 145 215 150 200 162 C215 168 235 168 255 155 Z"
          fill="#2f8f8a"
          opacity="0.8"
        />
      </g>

      {/* Floating community stars */}
      <circle cx="80" cy="65" r="4" fill="#f59e0b" opacity="0.75" />
      <circle cx="240" cy="65" r="3" fill="#2f8f8a" opacity="0.7" />
    </svg>
  );
}

export function VerifiedLedgerIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="shieldVerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="70" fill="#ecfdf5" />
      <circle cx="80" cy="80" r="54" fill="#d1fae5" opacity="0.7" />
      <path
        d="M80 32 L116 48 C116 82 98 108 80 120 C62 108 44 82 44 48 Z"
        fill="url(#shieldVerGrad)"
        style={{ filter: "drop-shadow(0 8px 16px rgba(4,120,87,0.3))" }}
      />
      <path
        d="M66 78 L76 88 L96 68"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
