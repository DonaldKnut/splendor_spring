"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { PortalTourLaunchButton } from "@/components/portal-guide";
import { portalRoleLabel, type PortalRole } from "@/lib/portal-tour-steps";

type NavItem = { href: string; label: string; match?: "exact" | "prefix" };

const NAV: Record<PortalRole, NavItem[]> = {
  STUDENT: [{ href: "/portal/student", label: "Home", match: "exact" }],
  PARENT: [
    { href: "/portal/parent", label: "Children", match: "exact" },
  ],
  TEACHER: [
    { href: "/portal/teacher", label: "Desk", match: "exact" },
    { href: "/admin/results", label: "Results", match: "prefix" },
    { href: "/admin/students", label: "Students", match: "prefix" },
  ],
};

export function PortalShell({
  role,
  title,
  subtitle,
  children,
}: {
  role: PortalRole;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const items = NAV[role];

  return (
    <div className="min-h-screen" style={{ background: "var(--c-surface-2)" }}>
      <header
        className="sticky top-0 z-20 border-b border-[var(--c-border)] backdrop-blur-md"
        style={{ background: "color-mix(in srgb, var(--c-surface) 92%, transparent)" }}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--c-sky)]">
              Splendor Spring · {portalRoleLabel(role)}
            </p>
            <p className="truncate font-display text-base font-semibold text-[var(--c-text)] sm:text-lg">
              {title}
            </p>
            {subtitle ? (
              <p className="truncate text-xs text-[var(--c-text-3)]">{subtitle}</p>
            ) : null}
          </div>

          <div
            data-tour="portal-nav"
            className="no-print flex flex-wrap items-center gap-1 sm:gap-1.5"
          >
            {items.map((item) => {
              const active =
                item.match === "prefix"
                  ? pathname.startsWith(item.href)
                  : pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-sm font-semibold transition"
                  style={{
                    color: active ? "var(--c-sky)" : "var(--c-text-2)",
                    background: active
                      ? "color-mix(in srgb, var(--c-sky) 10%, white)"
                      : "transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <PortalTourLaunchButton variant="nav" />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <PortalTourLaunchButton variant="fab" />
    </div>
  );
}
