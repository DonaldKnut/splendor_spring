"use client";

import { useState, useTransition } from "react";
import { createParent } from "@/lib/actions/students";
import { Alert, Button, Input, Label } from "@/components/ui";
import { FieldIcons } from "@/components/field-icons";
import {
  CredentialsIssuedAlert,
  type IssuedCredentials,
} from "@/components/forms/credentials-issued";

export function CreateParentForm({
  students,
}: {
  students: Array<{ id: string; label: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [creds, setCreds] = useState<IssuedCredentials | null>(null);
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
            const res = await createParent({
              name: String(form.get("name") ?? ""),
              email: String(form.get("email") ?? ""),
              phone: String(form.get("phone") ?? ""),
              address: String(form.get("address") ?? ""),
              studentIds: form.getAll("studentIds").map(String),
            });
            setCreds({
              email: res.email,
              temporaryPassword: res.temporaryPassword,
              emailed: res.emailed,
            });
            e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create parent.");
          }
        });
      }}
    >
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required icon={FieldIcons.user} />
      </div>
      <div>
        <Label htmlFor="email">Login email</Label>
        <Input id="email" name="email" type="email" required icon={FieldIcons.mail} />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" icon={FieldIcons.phone} />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" icon={FieldIcons.map} />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="studentIds">Linked students</Label>
        <div className="relative text-[var(--c-text-3)]">
          <span className="pointer-events-none absolute left-3.5 top-3 z-[1] opacity-70">
            {FieldIcons.layers}
          </span>
        <select
          id="studentIds"
          name="studentIds"
          multiple
          className="input-field h-32"
          style={{ paddingLeft: "2.75rem" }}
        >
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        </div>
      </div>
      {error ? (
        <div className="md:col-span-2">
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}
      {creds ? (
        <div className="md:col-span-2">
          <CredentialsIssuedAlert creds={creds} roleLabel="Parent" />
        </div>
      ) : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create parent"}
        </Button>
      </div>
    </form>
  );
}
