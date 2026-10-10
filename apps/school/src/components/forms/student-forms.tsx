"use client";

import { useState, useTransition } from "react";
import { createStudent, importStudentsCsv, updateStudent } from "@/lib/actions/students";
import { enrollStudent } from "@/lib/actions/academics";
import { Alert, Button, Input, Label, Textarea } from "@/components/ui";
import { FieldIcons } from "@/components/field-icons";
import {
  CredentialsIssuedAlert,
  type IssuedCredentials,
} from "@/components/forms/credentials-issued";

export function CreateStudentForm({
  classes,
  parents,
}: {
  classes: Array<{ id: string; name: string }>;
  parents: Array<{ id: string; name: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [creds, setCreds] = useState<IssuedCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const parentIds = form.getAll("parentIds").map(String);
        startTransition(async () => {
          try {
            setError(null);
            const res = await createStudent({
              admissionNumber: String(form.get("admissionNumber") ?? ""),
              firstName: String(form.get("firstName") ?? ""),
              lastName: String(form.get("lastName") ?? ""),
              otherNames: String(form.get("otherNames") ?? "") || null,
              email: String(form.get("email") ?? ""),
              classId: String(form.get("classId") ?? "") || null,
              gender: String(form.get("gender") ?? "") || null,
              notes: String(form.get("notes") ?? "") || null,
              parentIds,
            });
            setCreds({
              email: res.email,
              temporaryPassword: res.temporaryPassword,
              emailed: res.emailed,
            });
            e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create student.");
          }
        });
      }}
    >
      {/* ── Section 1: Basic Identity & Login ────────────────────────── */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--c-sky)]">
          1. Pupil Identity & Portal Access
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="admissionNumber">Admission number</Label>
            <Input id="admissionNumber" name="admissionNumber" placeholder="e.g. SSS/2026/001" required icon={FieldIcons.hash} />
          </div>
          <div>
            <Label htmlFor="email">Login email</Label>
            <Input id="email" name="email" type="email" placeholder="student@splendor.edu.ng" required icon={FieldIcons.mail} />
          </div>
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" name="firstName" placeholder="First name" required icon={FieldIcons.user} />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" name="lastName" placeholder="Surname" required icon={FieldIcons.user} />
          </div>
          <div>
            <Label htmlFor="otherNames">Other names</Label>
            <Input id="otherNames" name="otherNames" placeholder="Middle name (optional)" icon={FieldIcons.user} />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <div className="relative text-[var(--c-text-3)]">
              <span className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 opacity-70">
                {FieldIcons.tag}
              </span>
              <select id="gender" name="gender" className="input-field" style={{ paddingLeft: "2.75rem" }}>
                <option value="">Select gender (optional)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Class & Guardian Placement ───────────────────── */}
      <div className="border-t border-[var(--c-border)] pt-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--c-gold)]">
          2. Academic Cohort & Guardians
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="classId">Assigned class</Label>
            <div className="relative text-[var(--c-text-3)]">
              <span className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 opacity-70">
                {FieldIcons.layers}
              </span>
              <select id="classId" name="classId" className="input-field" style={{ paddingLeft: "2.75rem" }}>
                <option value="">Unassigned (enroll later)</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="parentIds">
              Linked parents{" "}
              <span className="text-[11px] font-normal text-[var(--c-text-3)]">
                (Hold Ctrl / Cmd to multi-select)
              </span>
            </Label>
            <div className="relative text-[var(--c-text-3)]">
              <span className="pointer-events-none absolute left-3.5 top-3 z-[1] opacity-70">
                {FieldIcons.user}
              </span>
              <select
                id="parentIds"
                name="parentIds"
                multiple
                className="input-field h-24"
                style={{ paddingLeft: "2.75rem" }}
              >
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Notes ────────────────────────────────────────── */}
      <div className="border-t border-[var(--c-border)] pt-4">
        <Label htmlFor="notes">Special notes / health / background</Label>
        <Textarea id="notes" name="notes" rows={2} placeholder="Optional notes for administration and teachers..." icon={FieldIcons.file} />
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}
      {creds ? <CredentialsIssuedAlert creds={creds} roleLabel="Student" /> : null}

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-[var(--c-text-3)]">
          Generates a temporary password and emails it automatically.
        </p>
        <Button type="submit" disabled={pending} className="btn-primary min-w-[10rem]">
          {pending ? "Creating pupil..." : "Create student →"}
        </Button>
      </div>
    </form>
  );
}

export function CsvImportForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);
  const [sampleLoaded, setSampleLoaded] = useState(false);

  const sampleCsv = `admissionNumber,firstName,lastName,email
SSS/2026/010,Daniel,Adeyemi,daniel.adeyemi@splendorschool.edu.ng
SSS/2026/011,Grace,Okon,grace.okon@splendorschool.edu.ng
SSS/2026/012,Emmanuel,Bello,emmanuel.bello@splendorschool.edu.ng`;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const csv = String(new FormData(e.currentTarget).get("csv") ?? "");
        startTransition(async () => {
          try {
            const res = await importStudentsCsv(csv);
            setResult(
              `Successfully created ${res.created} students. Failed: ${res.results.filter((r) => !r.ok).length}`
            );
          } catch (err) {
            setResult(err instanceof Error ? err.message : "Import failed");
          }
        });
      }}
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="csv">CSV Data</Label>
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("csv") as HTMLTextAreaElement | null;
            if (el) {
              el.value = sampleCsv;
              setSampleLoaded(true);
            }
          }}
          className="text-xs font-semibold text-[var(--c-sky)] hover:underline"
        >
          {sampleLoaded ? "✓ Sample pasted" : "+ Insert sample CSV"}
        </button>
      </div>

      <div className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface-2)] p-2.5 text-xs text-[var(--c-text-3)] font-mono">
        <span className="font-semibold text-[var(--c-text-2)]">Header columns required:</span>
        <br />
        admissionNumber, firstName, lastName, email
      </div>

      <Textarea
        id="csv"
        name="csv"
        rows={6}
        required
        placeholder={`admissionNumber,firstName,lastName,email\nSSS/2026/001,John,Doe,john@example.com`}
        className="font-mono text-xs"
      />

      {result ? <Alert tone="info">{result}</Alert> : null}

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-[var(--c-text-3)]">Comma-separated format</span>
        <Button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Processing..." : "Import CSV roster"}
        </Button>
      </div>
    </form>
  );
}

export function EditStudentForm({
  studentId,
  initial,
  classes,
  parents,
}: {
  studentId: string;
  initial: {
    admissionNumber: string;
    firstName: string;
    lastName: string;
    otherNames?: string | null;
    email: string;
    classId?: string | null;
    gender?: string | null;
    notes?: string | null;
    parentIds: string[];
  };
  classes: Array<{ id: string; name: string }>;
  parents: Array<{ id: string; name: string }>;
}) {
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
            await updateStudent(studentId, {
              admissionNumber: String(form.get("admissionNumber") ?? ""),
              firstName: String(form.get("firstName") ?? ""),
              lastName: String(form.get("lastName") ?? ""),
              otherNames: String(form.get("otherNames") ?? "") || null,
              email: String(form.get("email") ?? ""),
              classId: String(form.get("classId") ?? "") || null,
              gender: String(form.get("gender") ?? "") || null,
              notes: String(form.get("notes") ?? "") || null,
              parentIds: form.getAll("parentIds").map(String),
            });
            setMessage("Student profile updated.");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Update failed.");
          }
        });
      }}
    >
      <div>
        <Label htmlFor="edit-adm">Admission number</Label>
        <Input
          id="edit-adm"
          name="admissionNumber"
          required
          defaultValue={initial.admissionNumber}
          icon={FieldIcons.hash}
        />
      </div>
      <div>
        <Label htmlFor="edit-email">Login email</Label>
        <Input
          id="edit-email"
          name="email"
          type="email"
          required
          defaultValue={initial.email}
          icon={FieldIcons.mail}
        />
      </div>
      <div>
        <Label htmlFor="edit-fn">First name</Label>
        <Input
          id="edit-fn"
          name="firstName"
          required
          defaultValue={initial.firstName}
          icon={FieldIcons.user}
        />
      </div>
      <div>
        <Label htmlFor="edit-ln">Last name</Label>
        <Input
          id="edit-ln"
          name="lastName"
          required
          defaultValue={initial.lastName}
          icon={FieldIcons.user}
        />
      </div>
      <div>
        <Label htmlFor="edit-on">Other names</Label>
        <Input
          id="edit-on"
          name="otherNames"
          defaultValue={initial.otherNames ?? ""}
          icon={FieldIcons.user}
        />
      </div>
      <div>
        <Label htmlFor="edit-gender">Gender</Label>
        <Input
          id="edit-gender"
          name="gender"
          defaultValue={initial.gender ?? ""}
          icon={FieldIcons.tag}
        />
      </div>
      <div>
        <Label htmlFor="edit-class">Class</Label>
        <div className="relative text-[var(--c-text-3)]">
          <span className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 opacity-70">
            {FieldIcons.layers}
          </span>
          <select
            id="edit-class"
            name="classId"
            className="input-field"
            style={{ paddingLeft: "2.75rem" }}
            defaultValue={initial.classId ?? ""}
          >
            <option value="">Unassigned</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="edit-parents">Linked parents</Label>
        <div className="relative text-[var(--c-text-3)]">
          <span className="pointer-events-none absolute left-3.5 top-3 z-[1] opacity-70">
            {FieldIcons.user}
          </span>
          <select
            id="edit-parents"
            name="parentIds"
            multiple
            className="input-field h-28"
            style={{ paddingLeft: "2.75rem" }}
            defaultValue={initial.parentIds}
          >
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="edit-notes">Notes</Label>
        <Textarea
          id="edit-notes"
          name="notes"
          rows={2}
          defaultValue={initial.notes ?? ""}
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
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

export function EnrollStudentForm({
  studentId,
  classes,
  sessions,
}: {
  studentId: string;
  classes: Array<{ id: string; name: string }>;
  sessions: Array<{ id: string; name: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3 sm:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            setError(null);
            await enrollStudent({
              studentId,
              classId: String(form.get("classId") ?? ""),
              sessionId: String(form.get("sessionId") ?? ""),
            });
            setMessage("Enrollment saved for this session.");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Enrollment failed.");
          }
        });
      }}
    >
      <div>
        <Label htmlFor="enroll-session">Session</Label>
        <select id="enroll-session" name="sessionId" required className="input-field">
          <option value="">Select session</option>
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="enroll-class">Class</Label>
        <select id="enroll-class" name="classId" required className="input-field">
          <option value="">Select class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Saving..." : "Enroll"}
        </Button>
      </div>
      {error ? (
        <div className="sm:col-span-3">
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}
      {message ? (
        <div className="sm:col-span-3">
          <Alert tone="success">{message}</Alert>
        </div>
      ) : null}
    </form>
  );
}
