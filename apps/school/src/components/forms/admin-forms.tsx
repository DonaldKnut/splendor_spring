"use client";

import { useState, useTransition } from "react";
import {
  createSubAdmin,
  createTeacher,
  resetUserPassword,
  setUserStatus,
  updateSubAdminPermissions,
} from "@/lib/actions/users";
import { Alert, Button, Input, Label } from "@/components/ui";
import { FieldIcons } from "@/components/field-icons";
import {
  CredentialsIssuedAlert,
  type IssuedCredentials,
} from "@/components/forms/credentials-issued";

export function CreateSubAdminForm({
  permissions,
}: {
  permissions: Array<{ id: string; label: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [creds, setCreds] = useState<IssuedCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            setError(null);
            const res = await createSubAdmin({
              name: String(form.get("name") ?? ""),
              email: String(form.get("email") ?? ""),
              permissions: form.getAll("permissions").map(String),
            });
            setCreds({
              email: res.email,
              temporaryPassword: res.temporaryPassword,
              emailed: res.emailed,
            });
            e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required icon={FieldIcons.user} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required icon={FieldIcons.mail} />
        </div>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Permissions</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {permissions.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="permissions" value={p.id} />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {creds ? <CredentialsIssuedAlert creds={creds} roleLabel="Sub-admin" /> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create Sub-Admin"}
      </Button>
    </form>
  );
}

export function CreateTeacherForm({
  defaultPermissions,
}: {
  defaultPermissions: Array<{ id: string; label: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [creds, setCreds] = useState<IssuedCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            setError(null);
            const selected = form.getAll("permissions").map(String);
            const res = await createTeacher({
              name: String(form.get("name") ?? ""),
              email: String(form.get("email") ?? ""),
              permissions: selected.length ? selected : defaultPermissions.map((p) => p.id),
            });
            setCreds({
              email: res.email,
              temporaryPassword: res.temporaryPassword,
              emailed: res.emailed,
            });
            e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <p className="text-sm text-ink/70">
        Teachers can view students and enter/edit unpublished results. They cannot manage admins,
        settings, or publish results unless explicitly granted. A temporary password is emailed
        when Resend/SMTP is configured.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label htmlFor="t-name">Name</Label>
          <Input id="t-name" name="name" required icon={FieldIcons.user} />
        </div>
        <div>
          <Label htmlFor="t-email">Email</Label>
          <Input id="t-email" name="email" type="email" required icon={FieldIcons.mail} />
        </div>
      </div>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Permissions (defaults pre-checked)</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {defaultPermissions.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="permissions" value={p.id} defaultChecked />
              {p.label}
            </label>
          ))}
        </div>
      </fieldset>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {creds ? <CredentialsIssuedAlert creds={creds} roleLabel="Teacher" /> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create Teacher"}
      </Button>
    </form>
  );
}

export function StaffCredentialActions({
  userId,
  role,
  status,
}: {
  userId: string;
  role: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const [creds, setCreds] = useState<IssuedCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  if (role === "HEAD_ADMIN") return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                setError(null);
                const res = await resetUserPassword(userId);
                setCreds({
                  email: res.email,
                  temporaryPassword: res.temporaryPassword,
                  emailed: res.emailed,
                });
              } catch (err) {
                setError(err instanceof Error ? err.message : "Could not resend credentials.");
              }
            })
          }
        >
          {pending ? "Sending..." : "Resend credentials"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                setError(null);
                const next = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                await setUserStatus(userId, next);
                setNote(`Account set to ${next}.`);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Status update failed.");
              }
            })
          }
        >
          {status === "ACTIVE" ? "Deactivate" : "Activate"}
        </Button>
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {note ? <Alert tone="success">{note}</Alert> : null}
      {creds ? (
        <CredentialsIssuedAlert
          creds={creds}
          roleLabel={role === "TEACHER" ? "Teacher" : "Sub-admin"}
        />
      ) : null}
    </div>
  );
}

export function StaffPermissionsForm({
  userId,
  role,
  permissions,
  selected,
}: {
  userId: string;
  role: string;
  permissions: Array<{ id: string; label: string }>;
  selected: string[];
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (role === "HEAD_ADMIN") return null;

  return (
    <form
      className="mt-4 space-y-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            setError(null);
            await updateSubAdminPermissions(
              userId,
              form.getAll("permissions").map(String)
            );
            setMessage("Permissions updated.");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <p className="text-sm font-semibold text-[var(--c-text)]">Permissions</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {permissions.map((p) => (
          <label key={p.id} className="flex items-center gap-2 text-sm text-[var(--c-text-2)]">
            <input
              type="checkbox"
              name="permissions"
              value={p.id}
              defaultChecked={selected.includes(p.id)}
            />
            {p.label}
          </label>
        ))}
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {message ? <Alert tone="success">{message}</Alert> : null}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving..." : "Save permissions"}
      </Button>
    </form>
  );
}
