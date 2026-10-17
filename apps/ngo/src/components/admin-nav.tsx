"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/components/ui";
import type { Permission } from "@/lib/permissions";

type NavItem = {
  href: string;
  label: string;
  permission?: Permission | "HEAD_ONLY";
  group: string;
};

const items: NavItem[] = [
  { href: "/admin", label: "Command centre", group: "Overview" },
  { href: "/admin/donations", label: "Donations", permission: "view_donations", group: "Impact" },
  {
    href: "/admin/fundraising",
    label: "Fundraising",
    permission: "manage_campaigns",
    group: "Impact",
  },
  { href: "/admin/grants", label: "Grants", permission: "manage_grants", group: "Impact" },
  { href: "/admin/events", label: "Events", permission: "manage_events", group: "Engage" },
  { href: "/admin/polls", label: "Polls", permission: "manage_polls", group: "Engage" },
  {
    href: "/admin/programmes",
    label: "Programmes",
    permission: "manage_programmes",
    group: "Content",
  },
  { href: "/admin/content", label: "Pages", permission: "manage_content", group: "Content" },
  { href: "/admin/contacts", label: "Inbox", permission: "view_contacts", group: "Content" },
  {
    href: "/admin/administrators",
    label: "Administrators",
    permission: "HEAD_ONLY",
    group: "System",
  },
  { href: "/admin/settings", label: "Settings", permission: "manage_settings", group: "System" },
  { href: "/admin/audit", label: "Audit log", permission: "view_audit", group: "System" },
];

export function AdminNav({
  name,
  role,
  permissions,
}: {
  name: string;
  role: string;
  permissions: Permission[];
}) {
  const pathname = usePathname();
  const visible = items.filter((item) => {
    if (!item.permission) return true;
    if (role === "HEAD_ADMIN") return true;
    if (item.permission === "HEAD_ONLY") return false;
    return permissions.includes(item.permission);
  });

  const groups = ["Overview", "Impact", "Engage", "Content", "System"];
  const grouped = groups
    .map((g) => ({
      name: g,
      items: visible.filter((i) => i.group === g),
    }))
    .filter((g) => g.items.length);

  return (
    <aside className="admin-sidebar flex w-full flex-col text-[#f3eee6] md:min-h-screen md:w-64 lg:w-72">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#e8915f]">
          Splendor NGO
        </p>
        <p className="mt-1 font-display text-xl text-white">Control room</p>
        <p className="mt-2 truncate text-xs text-white/55">{name}</p>
        <p className="text-[0.65rem] uppercase tracking-wider text-white/35">
          {role === "HEAD_ADMIN" ? "Head administrator" : "Administrator"}
        </p>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4 text-sm">
        {grouped.map((group) => (
          <div key={group.name}>
            <p className="mb-1.5 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/35">
              {group.name}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 transition",
                      active
                        ? "bg-white/15 font-semibold text-white"
                        : "text-white/65 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        <Link
          href="/"
          className="block rounded-xl px-3 py-2 text-sm text-white/55 transition hover:bg-white/8 hover:text-white"
        >
          View public site
        </Link>
        <button
          type="button"
          className="w-full rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
