"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/components/ui";
import { TourLaunchButton } from "@/components/admin-guide";
import type { Permission } from "@/lib/permissions";

/** Keep wheel/trackpad inside the sidebar — never chain into the dashboard pane. */
function useSidebarWheelContainment(asideRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const nav = el.querySelector(".admin-nav-scroll") as HTMLElement | null;
      if (!nav) {
        e.preventDefault();
        return;
      }

      const path = e.composedPath();
      const overNav = path.includes(nav);

      if (!overNav) {
        // Header / Quick guide / Sign out — absorb scroll
        e.preventDefault();
        return;
      }

      const atTop = nav.scrollTop <= 0 && e.deltaY < 0;
      const atBottom =
        nav.scrollTop + nav.clientHeight >= nav.scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atBottom) e.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [asideRef]);
}

type NavItem = {
  href: string;
  label: string;
  permission?: Permission | "HEAD_ONLY";
  icon?: ReactNode;
  group?: string;
};

function NavIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const items: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    group: "Overview",
    icon: (
      <NavIcon>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/students",
    label: "Students",
    permission: "view_students",
    group: "People",
    icon: (
      <NavIcon>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/parents",
    label: "Parents",
    permission: "manage_parents",
    group: "People",
    icon: (
      <NavIcon>
        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/classes",
    label: "Classes",
    permission: "manage_classes",
    group: "Academics",
    icon: (
      <NavIcon>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8M8 11h5" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/subjects",
    label: "Subjects",
    permission: "manage_subjects",
    group: "Academics",
    icon: (
      <NavIcon>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/sessions",
    label: "Sessions & Terms",
    permission: "manage_sessions",
    group: "Academics",
    icon: (
      <NavIcon>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/results",
    label: "Results",
    permission: "enter_results",
    group: "Results",
    icon: (
      <NavIcon>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="m9 15 2 2 4-4" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/results/publish",
    label: "Publish Results",
    permission: "publish_results",
    group: "Results",
    icon: (
      <NavIcon>
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/results/corrections",
    label: "Corrections",
    permission: "publish_results",
    group: "Results",
    icon: (
      <NavIcon>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/content",
    label: "Website Content",
    permission: "manage_content",
    group: "Content",
    icon: (
      <NavIcon>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/announcements",
    label: "Announcements",
    permission: "manage_content",
    group: "Content",
    icon: (
      <NavIcon>
        <path d="m3 11 18-5v12L3 13v-2z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/contacts",
    label: "Contact Submissions",
    permission: "view_contacts",
    group: "Content",
    icon: (
      <NavIcon>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="m22 6-10 7L2 6" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/administrators",
    label: "Administrators",
    permission: "HEAD_ONLY",
    group: "System",
    icon: (
      <NavIcon>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/settings",
    label: "School Settings",
    permission: "manage_settings",
    group: "System",
    icon: (
      <NavIcon>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </NavIcon>
    ),
  },
  {
    href: "/admin/audit",
    label: "Audit Logs",
    permission: "view_audit",
    group: "System",
    icon: (
      <NavIcon>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M12 18v-6" />
        <path d="M9 15h6" />
      </NavIcon>
    ),
  },
];

function SidebarBody({
  sortedGroups,
  grouped,
  pathname,
  role,
  roleLabel,
  name,
  email,
  onNavigate,
}: {
  sortedGroups: string[];
  grouped: Record<string, NavItem[]>;
  pathname: string;
  role: string;
  roleLabel: string;
  name: string;
  email?: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div
        className="shrink-0 px-3 py-3.5 min-[300px]:px-4 min-[300px]:py-4 md:px-5 md:py-5"
        style={{
          background: "linear-gradient(135deg, rgba(26,95,122,0.12), rgba(185,28,44,0.06))",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2.5 min-[300px]:gap-3">
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold min-[300px]:h-9 min-[300px]:w-9 min-[300px]:text-base"
            style={{
              background: "linear-gradient(135deg, var(--c-gold), var(--c-gold-light))",
              color: "var(--c-midnight)",
            }}
          >
            S
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white min-[300px]:text-sm">
              School Admin
            </p>
            <p className="truncate text-[0.65rem] text-white/45 min-[300px]:text-[0.7rem]">
              {roleLabel}
            </p>
          </div>
        </div>

        <div
          className="mt-3 flex items-center gap-2 rounded-xl px-2.5 py-2 min-[300px]:mt-4 min-[300px]:gap-2.5 min-[300px]:px-3 min-[300px]:py-2.5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[0.65rem] font-bold text-white min-[300px]:h-8 min-[300px]:w-8 min-[300px]:text-xs"
            style={{ background: "linear-gradient(135deg, var(--c-sky), var(--c-steel))" }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.7rem] font-semibold text-white/90 min-[300px]:text-xs">
              {name}
            </p>
            <p className="truncate text-[0.6rem] text-white/35 min-[300px]:text-[0.65rem]">
              {email || "Signed in"}
            </p>
          </div>
        </div>
      </div>

      <nav className="admin-nav-scroll min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-2 py-3 min-[300px]:px-3 min-[300px]:py-4">
        {sortedGroups.map((group, gi) => (
          <div key={group} className={gi > 0 ? "pt-2 min-[300px]:pt-3" : ""}>
            <p className="admin-nav-group">{group}</p>
            {grouped[group].map((item) => {
              const isActive =
                item.href === "/admin" || item.href === "/portal/teacher"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn("admin-nav-item group", isActive && "active")}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition",
                      isActive
                        ? "bg-white/10 text-white opacity-100"
                        : "opacity-65 group-hover:bg-white/5 group-hover:opacity-95",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0 truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div
        className="shrink-0 space-y-0.5 p-2 min-[300px]:p-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {role !== "TEACHER" ? <TourLaunchButton variant="nav" /> : null}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="admin-nav-item w-full text-left"
          style={{ color: "rgba(248,250,252,0.45)" }}
        >
          <span className="flex-shrink-0 opacity-60">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.65"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </span>
          <span>Sign out</span>
        </button>
      </div>
    </>
  );
}

export function AdminNav({
  role,
  permissions,
  name,
  email,
}: {
  role: string;
  permissions: Permission[];
  name: string;
  email?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuId = useId();
  const desktopAsideRef = useRef<HTMLElement>(null);
  const drawerAsideRef = useRef<HTMLElement>(null);

  useSidebarWheelContainment(desktopAsideRef);
  useSidebarWheelContainment(drawerAsideRef);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const navItems =
    role === "TEACHER"
      ? items.map((item) =>
          item.href === "/admin"
            ? {
                ...item,
                href: "/portal/teacher",
                label: "Teaching desk",
              }
            : item,
        )
      : items;

  const visible = navItems.filter((item) => {
    if (!item.permission) return true;
    if (role === "HEAD_ADMIN") return true;
    if (item.permission === "HEAD_ONLY") return false;
    if (role === "TEACHER") {
      // Desk link has no permission gate; academic tools stay least-privilege.
      if (!item.permission) return true;
      const teacherAllowed = new Set([
        "view_students",
        "enter_results",
        "edit_results",
        "publish_results",
      ]);
      return (
        teacherAllowed.has(item.permission) &&
        permissions.includes(item.permission)
      );
    }
    return permissions.includes(item.permission);
  });

  const grouped = visible.reduce<Record<string, NavItem[]>>((acc, item) => {
    const g = item.group || "General";
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  const groupOrder = ["Overview", "People", "Academics", "Results", "Content", "System", "General"];
  const sortedGroups = Object.keys(grouped).sort(
    (a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b)
  );

  const roleLabel =
    role === "HEAD_ADMIN"
      ? "Head Administrator"
      : role === "SUB_ADMIN"
        ? "Administrator"
        : "Teacher";

  const bodyProps = {
    sortedGroups,
    grouped,
    pathname,
    role,
    roleLabel,
    name,
    email,
  };

  const drawer =
    mounted &&
    open &&
    createPortal(
      <div className="fixed inset-0 z-[10070] md:hidden" role="dialog" aria-modal="true" aria-labelledby={menuId}>
        <button
          type="button"
          aria-label="Close menu"
          className="absolute inset-0 bg-[#140c08]/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <aside
          ref={drawerAsideRef}
          data-tour="tour-sidebar"
          className="admin-sidebar admin-drawer absolute inset-y-0 left-0 flex w-[min(100vw-2.5rem,16.5rem)] max-w-[calc(100vw-2rem)] flex-col overflow-hidden shadow-2xl min-[245px]:w-[min(100vw-2rem,17rem)]"
          style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5">
            <p id={menuId} className="truncate text-xs font-semibold text-white/80">
              Menu
            </p>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <SidebarBody {...bodyProps} onNavigate={() => setOpen(false)} />
          </div>
        </aside>
      </div>,
      document.body
    );

  return (
    <>
      {/* Mobile top bar */}
      <header className="admin-mobile-bar no-print sticky top-0 z-40 flex shrink-0 items-center justify-between gap-2 border-b border-[var(--c-border)] bg-[var(--c-surface)]/95 px-2.5 py-2 backdrop-blur-md min-[300px]:px-3 md:hidden">
        <button
          type="button"
          aria-label="Open admin menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] text-[var(--c-text)]"
        >
          <span className="relative block h-3.5 w-4">
            <span className="absolute left-0 top-0 h-[1.5px] w-full rounded-full bg-current" />
            <span className="absolute left-0 top-[6px] h-[1.5px] w-full rounded-full bg-current" />
            <span className="absolute left-0 top-[12px] h-[1.5px] w-full rounded-full bg-current" />
          </span>
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate font-display text-sm font-semibold text-[var(--c-text)]">
            School Admin
          </p>
          <p className="truncate text-[0.6rem] text-[var(--c-text-3)]">{roleLabel}</p>
        </div>
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.65rem] font-bold text-white"
          style={{ background: "linear-gradient(135deg, var(--c-sky), var(--c-steel))" }}
          aria-hidden
        >
          {name.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside
        ref={desktopAsideRef}
        data-tour="tour-sidebar"
        className="admin-sidebar no-print hidden h-svh max-h-svh w-60 shrink-0 flex-col overflow-hidden lg:w-64 md:flex"
      >
        <SidebarBody {...bodyProps} />
      </aside>

      {drawer}
    </>
  );
}
