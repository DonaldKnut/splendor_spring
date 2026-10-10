"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] px-3.5 py-2 text-sm font-medium text-[var(--c-text-2)] shadow-[var(--shadow-xs)] transition-all duration-200 hover:border-[var(--c-border-dark)] hover:bg-[var(--c-surface-2)] hover:text-[var(--c-text)]"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
      </svg>
      Sign out
    </button>
  );
}
