"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] px-3.5 py-2 text-sm font-medium text-[var(--c-text-2)] shadow-[var(--shadow-xs)] transition-all duration-200 hover:border-[var(--c-border-dark)] hover:bg-[var(--c-surface-2)] hover:text-[var(--c-text)]"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
      </svg>
      Print
    </button>
  );
}
