import Link from "next/link";
import type { ReactNode } from "react";
import { cn, PageHeader, Card, Badge, EmptyState, Button } from "@/components/ui";
import { FieldIcons } from "@/components/field-icons";

export function AdminShell({
  title,
  description,
  actions,
  children,
  icon,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} actions={actions} icon={icon} />
      {children}
    </div>
  );
}

export function AdminPanel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {(title || actions) && (
        <div className="mb-4 flex flex-col gap-2.5 border-b border-[var(--c-border)] pb-3 min-[360px]:mb-5 min-[360px]:gap-3 min-[360px]:pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {title ? (
              <h2 className="font-display text-base font-semibold text-[var(--c-text)] min-[360px]:text-lg">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-xs text-[var(--c-text-3)] min-[360px]:text-sm">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex max-w-full flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>
      )}
      {children}
    </Card>
  );
}

export function StatusPill({
  active,
  label,
}: {
  active: boolean;
  label?: string;
}) {
  return (
    <Badge tone={active ? "green" : "gray"}>
      {label ?? (active ? "Active" : "Inactive")}
    </Badge>
  );
}

export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="admin-table-wrap -mx-0.5 overflow-x-auto rounded-xl border border-[var(--c-border)]">
      <table className="table-premium min-w-[28rem] w-full text-left text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="whitespace-nowrap px-2.5 py-2.5 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--c-text-3)] min-[360px]:px-3 sm:px-4 sm:py-3 sm:text-xs"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function AdminSearch({
  action,
  defaultValue,
  placeholder = "Search…",
  extra,
}: {
  action?: string;
  defaultValue?: string;
  placeholder?: string;
  extra?: ReactNode;
}) {
  return (
    <form
      method="get"
      action={action}
      className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center"
    >
      <div className="relative w-full min-w-0 max-w-md flex-1 text-[var(--c-text-3)]">
        <span className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 opacity-70 min-[360px]:left-3.5">
          {FieldIcons.search}
        </span>
        <input
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="input-field w-full min-w-0"
          style={{ paddingLeft: "2.5rem" }}
        />
      </div>
      {extra ? <div className="flex min-w-0 flex-wrap gap-2">{extra}</div> : null}
      <Button type="submit" variant="secondary" size="sm" className="w-full sm:w-auto">
        Search
      </Button>
    </form>
  );
}

export function AdminEmpty({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={
        actionHref && actionLabel ? (
          <Link href={actionHref} className="btn btn-primary btn-sm">
            {actionLabel}
          </Link>
        ) : undefined
      }
    />
  );
}

export function Pagination({
  page,
  pages,
  total,
  baseHref,
}: {
  page: number;
  pages: number;
  total: number;
  baseHref: string;
}) {
  const sep = baseHref.includes("?") ? "&" : "?";
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--c-text-3)]">
      <span>
        Page {page} of {pages} · {total} total
      </span>
      {page > 1 ? (
        <Link
          href={`${baseHref}${sep}page=${page - 1}`}
          className="font-semibold text-[var(--c-sky)] hover:underline"
        >
          Previous
        </Link>
      ) : null}
      {page < pages ? (
        <Link
          href={`${baseHref}${sep}page=${page + 1}`}
          className="font-semibold text-[var(--c-sky)] hover:underline"
        >
          Next
        </Link>
      ) : null}
    </div>
  );
}
