"use client";

import { useState, useTransition } from "react";
import {
  assignSubjectToClass,
  createSession,
  setCurrentSession,
  setCurrentTerm,
  unassignSubjectFromClass,
  upsertClass,
  upsertSubject,
} from "@/lib/actions/academics";
import { Alert, Button, Input, Label } from "@/components/ui";
import { FieldIcons } from "@/components/field-icons";

export function ClassForm({
  subjects,
  initial,
}: {
  subjects: Array<{ id: string; name: string }>;
  initial?: {
    id: string;
    name: string;
    code: string;
    level?: string | null;
    description?: string | null;
    sortOrder?: number;
    isActive?: boolean;
  };
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const editing = Boolean(initial?.id);

  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            setError(null);
            const record = await upsertClass({
              id: initial?.id,
              name: String(form.get("name") ?? ""),
              code: String(form.get("code") ?? ""),
              level: String(form.get("level") ?? ""),
              description: String(form.get("description") ?? ""),
              sortOrder: Number(form.get("sortOrder") ?? 0),
              isActive: form.get("isActive") === "on",
            });
            const subjectId = String(form.get("subjectId") ?? "");
            if (subjectId) await assignSubjectToClass(record.id, subjectId);
            setMessage(editing ? "Class updated." : "Class created.");
            if (!editing) e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <div>
        <Label htmlFor={`name-${initial?.id ?? "new"}`}>Class name</Label>
        <Input
          id={`name-${initial?.id ?? "new"}`}
          name="name"
          required
          defaultValue={initial?.name}
          icon={FieldIcons.layers}
        />
      </div>
      <div>
        <Label htmlFor={`code-${initial?.id ?? "new"}`}>Code</Label>
        <Input
          id={`code-${initial?.id ?? "new"}`}
          name="code"
          required
          defaultValue={initial?.code}
          icon={FieldIcons.hash}
        />
      </div>
      <div>
        <Label htmlFor={`level-${initial?.id ?? "new"}`}>Level</Label>
        <Input
          id={`level-${initial?.id ?? "new"}`}
          name="level"
          placeholder="e.g. Nursery / Primary"
          defaultValue={initial?.level ?? ""}
          icon={FieldIcons.tag}
        />
      </div>
      <div>
        <Label htmlFor={`sort-${initial?.id ?? "new"}`}>Sort order</Label>
        <Input
          id={`sort-${initial?.id ?? "new"}`}
          name="sortOrder"
          type="number"
          defaultValue={initial?.sortOrder ?? 0}
          icon={FieldIcons.hash}
        />
      </div>
      <div>
        <Label htmlFor={`subject-${initial?.id ?? "new"}`}>Assign subject</Label>
        <div className="relative text-[var(--c-text-3)]">
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 opacity-70">
            {FieldIcons.book}
          </span>
          <select
            id={`subject-${initial?.id ?? "new"}`}
            name="subjectId"
            className="input-field"
            style={{ paddingLeft: "2.75rem" }}
          >
            <option value="">None</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-end">
        <label className="flex items-center gap-2 text-sm text-[var(--c-text-2)]">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={initial?.isActive ?? true}
          />
          Active
        </label>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor={`desc-${initial?.id ?? "new"}`}>Description</Label>
        <Input
          id={`desc-${initial?.id ?? "new"}`}
          name="description"
          defaultValue={initial?.description ?? ""}
          icon={FieldIcons.file}
        />
      </div>
      {error ? (
        <div className="md:col-span-2">
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}
      {message ? (
        <div className="md:col-span-2">
          <Alert tone="success">{message}</Alert>
        </div>
      ) : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : editing ? "Update class" : "Create class"}
        </Button>
      </div>
    </form>
  );
}

export function ClassSubjectActions({
  classId,
  subjectId,
  subjectName,
}: {
  classId: string;
  subjectId: string;
  subjectName: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="inline-flex items-center gap-1 rounded-full border border-[var(--c-border)] bg-[var(--c-surface-2)] px-2.5 py-1 text-xs font-medium text-[var(--c-text-2)] hover:border-[var(--c-danger)] hover:text-[var(--c-danger)]"
      onClick={() =>
        startTransition(async () => {
          await unassignSubjectFromClass(classId, subjectId);
        })
      }
      title={`Remove ${subjectName}`}
    >
      {subjectName}
      <span aria-hidden>×</span>
    </button>
  );
}

export function SubjectForm({
  initial,
}: {
  initial?: {
    id: string;
    name: string;
    code: string;
    description?: string | null;
    isActive?: boolean;
  };
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const editing = Boolean(initial?.id);

  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            setError(null);
            await upsertSubject({
              id: initial?.id,
              name: String(form.get("name") ?? ""),
              code: String(form.get("code") ?? ""),
              description: String(form.get("description") ?? ""),
              isActive: form.get("isActive") === "on",
            });
            setMessage(editing ? "Subject updated." : "Subject created.");
            if (!editing) e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <div>
        <Label htmlFor={`s-name-${initial?.id ?? "new"}`}>Name</Label>
        <Input
          id={`s-name-${initial?.id ?? "new"}`}
          name="name"
          required
          defaultValue={initial?.name}
          icon={FieldIcons.book}
        />
      </div>
      <div>
        <Label htmlFor={`s-code-${initial?.id ?? "new"}`}>Code</Label>
        <Input
          id={`s-code-${initial?.id ?? "new"}`}
          name="code"
          required
          defaultValue={initial?.code}
          icon={FieldIcons.hash}
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor={`s-desc-${initial?.id ?? "new"}`}>Description</Label>
        <Input
          id={`s-desc-${initial?.id ?? "new"}`}
          name="description"
          defaultValue={initial?.description ?? ""}
          icon={FieldIcons.file}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-[var(--c-text-2)]">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={initial?.isActive ?? true}
          />
          Active
        </label>
      </div>
      {error ? (
        <div className="md:col-span-2">
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}
      {message ? (
        <div className="md:col-span-2">
          <Alert tone="success">{message}</Alert>
        </div>
      ) : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : editing ? "Update subject" : "Create subject"}
        </Button>
      </div>
    </form>
  );
}

export function SessionForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            setError(null);
            await createSession({
              name: String(form.get("name") ?? ""),
              startDate: String(form.get("startDate") ?? "") || undefined,
              endDate: String(form.get("endDate") ?? "") || undefined,
              isCurrent: form.get("isCurrent") === "on",
            });
            setMessage("Session created with First / Second / Third term.");
            e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <div>
        <Label htmlFor="name">Session name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. 2025/2026"
          required
          icon={FieldIcons.calendar}
        />
      </div>
      <div className="flex items-end gap-2">
        <label className="flex items-center gap-2 text-sm text-[var(--c-text-2)]">
          <input type="checkbox" name="isCurrent" /> Set as current session
        </label>
      </div>
      <div>
        <Label htmlFor="startDate">Start date</Label>
        <Input id="startDate" name="startDate" type="date" icon={FieldIcons.calendar} />
      </div>
      <div>
        <Label htmlFor="endDate">End date</Label>
        <Input id="endDate" name="endDate" type="date" icon={FieldIcons.calendar} />
      </div>
      {error ? (
        <div className="md:col-span-2">
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}
      {message ? (
        <div className="md:col-span-2">
          <Alert tone="success">{message}</Alert>
        </div>
      ) : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create session"}
        </Button>
      </div>
    </form>
  );
}

export function TermActions({
  sessionId,
  termId,
  isCurrent,
}: {
  sessionId?: string;
  termId?: string;
  isCurrent?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (sessionId) {
    return (
      <Button
        type="button"
        variant={isCurrent ? "gold" : "secondary"}
        size="sm"
        disabled={pending || isCurrent}
        onClick={() =>
          startTransition(async () => {
            await setCurrentSession(sessionId);
          })
        }
      >
        {isCurrent ? "Current session" : "Make current"}
      </Button>
    );
  }

  if (termId) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={pending || isCurrent}
        onClick={() =>
          startTransition(async () => {
            await setCurrentTerm(termId);
          })
        }
      >
        {isCurrent ? "Current term" : "Set current"}
      </Button>
    );
  }

  return null;
}
