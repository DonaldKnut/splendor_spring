"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { PremiumModal } from "@/components/premium-modal";
import { BrandSpinner } from "@/components/brand-spinner";
import { HelpTooltip } from "@/components/admin-guide";

type DashItem = {
  id: string;
  label: string;
  value: number;
  blurb: string;
  detail: string;
  points: string[];
  href: string;
  cta: string;
  accent: string;
  icon: ReactNode;
  tip: string;
  locked?: boolean;
};

function StrokeIcon({
  children,
  size = 22,
}: {
  children: ReactNode;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const ICONS = {
  students: (
    <StrokeIcon>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </StrokeIcon>
  ),
  parents: (
    <StrokeIcon>
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </StrokeIcon>
  ),
  staff: (
    <StrokeIcon>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M12 12v.01" />
      <path d="M2 12h20" />
    </StrokeIcon>
  ),
  classes: (
    <StrokeIcon>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </StrokeIcon>
  ),
  draft: (
    <StrokeIcon>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
      <path d="M10 9H8" />
    </StrokeIcon>
  ),
  published: (
    <StrokeIcon>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </StrokeIcon>
  ),
  contacts: (
    <StrokeIcon>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </StrokeIcon>
  ),
};

export function AdminDashboardCards({
  studentCount,
  parentCount,
  teacherCount,
  classCount,
  draftResults,
  publishedResults,
  newContacts,
  isHeadAdmin,
}: {
  studentCount: number;
  parentCount: number;
  teacherCount: number;
  classCount: number;
  draftResults: number;
  publishedResults: number;
  newContacts: number;
  isHeadAdmin: boolean;
}) {
  const [active, setActive] = useState<DashItem | null>(null);
  const [navigating, setNavigating] = useState(false);

  const issue: DashItem[] = [
    {
      id: "students",
      label: "Students",
      value: studentCount,
      blurb: "Create student login · email temp password",
      detail:
        "Issue portal credentials for pupils. Each student receives a temporary password by email and must change it on first login.",
      points: [
        `${studentCount} active student account${studentCount === 1 ? "" : "s"}`,
        "Temporary password emailed securely",
        "Forced password change on first sign-in",
        "Link results and class enrolment from Students",
      ],
      href: "/admin/students",
      cta: "Open Students",
      accent: "var(--c-sky)",
      icon: ICONS.students,
      tip: "Make a student login here. We email a temporary password. They must change it on first sign-in.",
    },
    {
      id: "parents",
      label: "Parents",
      value: parentCount,
      blurb: "Create parent login · link to students",
      detail:
        "Create parent accounts and link them to their children so families can view published results from the portal.",
      points: [
        `${parentCount} active parent account${parentCount === 1 ? "" : "s"}`,
        "Link one parent to one or more students",
        "Temp password + first-login change",
        "Parents only see published results",
      ],
      href: "/admin/parents",
      cta: "Open Parents",
      accent: "var(--c-emerald)",
      icon: ICONS.parents,
      tip: "Create a parent login, then link them to their child. Parents only see published results.",
    },
    {
      id: "staff",
      label: isHeadAdmin ? "Teachers & staff" : "Teachers",
      value: teacherCount,
      blurb: isHeadAdmin
        ? "Issue teacher / sub-admin credentials"
        : "Only Head Admin can issue staff accounts",
      detail: isHeadAdmin
        ? "Issue teacher and sub-admin accounts with role-based permissions for academics, results, and content."
        : "Staff account issuance is reserved for the Head Administrator.",
      points: isHeadAdmin
        ? [
            `${teacherCount} teacher account${teacherCount === 1 ? "" : "s"}`,
            "Teachers can enter and edit draft results",
            "Sub-admins receive assigned permissions",
            "Credentials emailed with forced password change",
          ]
        : [
            `${teacherCount} teacher account${teacherCount === 1 ? "" : "s"}`,
            "Ask Head Admin to create new staff logins",
          ],
      href: "/admin/administrators",
      cta: isHeadAdmin ? "Open Administrators" : "Understood",
      accent: "#5b7cfa",
      locked: !isHeadAdmin,
      icon: ICONS.staff,
      tip: isHeadAdmin
        ? "Create teacher or sub-admin logins and choose what they can manage."
        : "Only the Head Admin can create staff logins.",
    },
  ];

  const overview: DashItem[] = [
    {
      id: "active-students",
      label: "Active students",
      value: studentCount,
      blurb: "Pupils with active portal status",
      detail: "Count of students currently marked active in the school system.",
      points: [
        "Manage enrolment under Students",
        "Assign classes and subjects",
        "Publish results when ready",
      ],
      href: "/admin/students",
      cta: "Manage students",
      accent: "var(--c-sky)",
      icon: ICONS.students,
      tip: "How many pupils currently have an active portal login.",
    },
    {
      id: "active-parents",
      label: "Active parents",
      value: parentCount,
      blurb: "Linked family portal accounts",
      detail: "Parents with active status who can sign in once linked to students.",
      points: [
        "Create and link parent logins",
        "Parents view published results only",
        "Reset access from Parents when needed",
      ],
      href: "/admin/parents",
      cta: "Manage parents",
      accent: "var(--c-emerald)",
      icon: ICONS.parents,
      tip: "Parents who can sign in. Link them to their children so they can see results.",
    },
    {
      id: "active-classes",
      label: "Active classes",
      value: classCount,
      blurb: "Classes open for this school",
      detail: "Active class programmes configured for early years and primary.",
      points: [
        "Edit class names, levels and subjects",
        "Assign teachers where needed",
        "Deactivate classes you no longer use",
      ],
      href: "/admin/classes",
      cta: "Manage classes",
      accent: "var(--c-gold)",
      icon: ICONS.classes,
      tip: "Classes that are open this year — like Nursery or Primary 1.",
    },
    {
      id: "draft-results",
      label: "Draft results",
      value: draftResults,
      blurb: "Results waiting to be published",
      detail: "Draft assessments are visible to staff only until published.",
      points: [
        "Enter or edit scores under Results",
        "Review carefully before publishing",
        "Parents and students see drafts only after publish",
      ],
      href: "/admin/results",
      cta: "Open results",
      accent: draftResults > 0 ? "var(--c-danger)" : "var(--c-sky)",
      icon: ICONS.draft,
      tip: "Scores saved as drafts. Parents cannot see these until you publish.",
    },
    {
      id: "published-results",
      label: "Published results",
      value: publishedResults,
      blurb: "Live results on the family portal",
      detail: "Published and corrected results currently available to linked families.",
      points: [
        "Publish from Results → Publish",
        "Use Corrections for post-publish fixes",
        "Families see updates after correction publish",
      ],
      href: "/admin/results/publish",
      cta: "Publish centre",
      accent: "var(--c-emerald)",
      icon: ICONS.published,
      tip: "Results that families can already view on the portal.",
    },
    {
      id: "contacts",
      label: "New contact messages",
      value: newContacts,
      blurb: "Unread enquiries from the website",
      detail: "New messages submitted through the public contact form.",
      points: [
        "Review and mark messages as handled",
        "Reply using school email or WhatsApp",
        "Keep families waiting as little as possible",
      ],
      href: "/admin/contacts",
      cta: "View contacts",
      accent: newContacts > 0 ? "var(--c-gold)" : "var(--c-sky)",
      icon: ICONS.contacts,
      tip: "New messages from the school website contact form. Reply soon.",
    },
  ];

  function openItem(item: DashItem) {
    setActive(item);
  }

  function go(href: string) {
    setNavigating(true);
    window.location.href = href;
  }

  return (
    <>
      {navigating ? <BrandSpinner fullscreen label="Opening…" size="xl" /> : null}

      <div data-tour="tour-issue">
        <div className="mb-3 flex items-center gap-2 min-[360px]:mb-4">
          <h2 className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[var(--c-text-3)] min-[360px]:text-xs">
            Issue accounts
          </h2>
          <HelpTooltip
            title="Issue accounts"
            label="Create logins for students, parents, and staff. Each person gets an email with a temporary password."
          />
        </div>
        <div className="grid gap-3 min-[360px]:gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {issue.map((item) => (
            <DashCard key={item.id} item={item} onOpen={() => openItem(item)} />
          ))}
        </div>
      </div>

      <div data-tour="tour-overview">
        <div className="mb-3 flex items-center gap-2 min-[360px]:mb-4">
          <h2 className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[var(--c-text-3)] min-[360px]:text-xs">
            Overview
          </h2>
          <HelpTooltip
            title="Overview"
            label="Quick counts for the school today. Tap any card for a plain-English explanation and a shortcut."
            tone="emerald"
          />
        </div>
        <div className="grid gap-3 min-[360px]:gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {overview.map((item) => (
            <DashCard key={item.id} item={item} onOpen={() => openItem(item)} compact />
          ))}
        </div>
      </div>

      <PremiumModal
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.label ?? ""}
        eyebrow="Dashboard"
        accent={active?.accent}
        footer={
          active ? (
            <>
              <button type="button" className="btn btn-ghost text-sm" onClick={() => setActive(null)}>
                Close
              </button>
              {active.locked ? null : (
                <button
                  type="button"
                  className="btn btn-gold text-sm"
                  onClick={() => {
                    setActive(null);
                    go(active.href);
                  }}
                >
                  {active.cta}
                </button>
              )}
            </>
          ) : null
        }
      >
        {active ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: `color-mix(in srgb, ${active.accent} 14%, white)`,
                  color: active.accent,
                }}
              >
                {active.icon}
              </div>
              <div
                className="inline-flex items-baseline gap-2 rounded-2xl px-4 py-3"
                style={{
                  background: `color-mix(in srgb, ${active.accent} 12%, white)`,
                  color: active.accent,
                }}
              >
                <span className="font-display text-3xl font-bold">{active.value}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] opacity-80">
                  total
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[var(--c-text-2)]">{active.detail}</p>
            <ul className="space-y-2.5">
              {active.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm text-[var(--c-text-2)]">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: active.accent }}
                  />
                  {p}
                </li>
              ))}
            </ul>
            {!active.locked ? (
              <p className="text-xs text-[var(--c-text-3)]">
                Or continue to{" "}
                <Link href={active.href} className="font-semibold text-[var(--c-sky)] underline-offset-2 hover:underline">
                  {active.href.replace("/admin/", "")}
                </Link>
                .
              </p>
            ) : null}
          </div>
        ) : null}
      </PremiumModal>
    </>
  );
}

function DashCard({
  item,
  onOpen,
  compact,
}: {
  item: DashItem;
  onOpen: () => void;
  compact?: boolean;
}) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer rounded-xl border border-[var(--c-border)] bg-white/80 p-3.5 text-left shadow-sm transition hover:border-[var(--c-sky)] hover:shadow-md min-[360px]:rounded-2xl min-[360px]:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--c-text-3)] min-[360px]:text-xs">
              {item.label}
            </p>
            <span
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="inline-flex"
            >
              <HelpTooltip title={item.label} label={item.tip} />
            </span>
          </div>
          <p className="mt-1.5 font-display text-xl font-bold text-[var(--c-text)] min-[360px]:mt-2 min-[360px]:text-2xl">
            {item.value}
          </p>
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105 min-[360px]:h-11 min-[360px]:w-11 min-[360px]:rounded-2xl"
          style={{
            background: `color-mix(in srgb, ${item.accent} 14%, white)`,
            color: item.accent,
            boxShadow: `0 8px 20px color-mix(in srgb, ${item.accent} 18%, transparent)`,
          }}
        >
          {item.icon}
        </div>
      </div>
      <p className="mt-2.5 text-xs text-[var(--c-text-3)] group-hover:text-[var(--c-sky)] min-[360px]:mt-3 min-[360px]:text-sm">
        {item.blurb}
      </p>
      {!compact ? (
        <p className="mt-3 inline-flex items-center gap-1 text-[0.7rem] font-semibold text-[var(--c-sky)]">
          View details
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </p>
      ) : (
        <p className="mt-3 text-[0.65rem] font-semibold text-[var(--c-sky)] opacity-0 transition group-hover:opacity-100">
          Tap for details →
        </p>
      )}
    </motion.div>
  );
}
