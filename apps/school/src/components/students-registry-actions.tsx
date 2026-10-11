"use client";

import { useState } from "react";
import { PremiumModal } from "@/components/premium-modal";
import { CreateStudentForm, CsvImportForm } from "@/components/forms/student-forms";
import { CsvImportIllustration } from "@/components/illustrations";

type Mode = "create" | "csv" | null;

export function StudentsRegistryActions({
  classes,
  parents,
  variant = "hero",
}: {
  classes: Array<{ id: string; name: string }>;
  parents: Array<{ id: string; name: string }>;
  variant?: "hero" | "empty";
}) {
  const [mode, setMode] = useState<Mode>(null);

  return (
    <>
      {variant === "hero" ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setMode("create")}
            className="btn btn-primary btn-sm rounded-xl"
          >
            + Register single student
          </button>
          <button
            type="button"
            onClick={() => setMode("csv")}
            className="btn btn-ghost btn-sm rounded-xl border-[var(--c-border)]"
          >
            Upload CSV roster
          </button>
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setMode("create")}
            className="btn btn-primary btn-sm rounded-xl"
          >
            + Add student
          </button>
          <button
            type="button"
            onClick={() => setMode("csv")}
            className="btn btn-ghost btn-sm rounded-xl border-[var(--c-border)]"
          >
            Upload CSV
          </button>
        </div>
      )}

      <PremiumModal
        open={mode === "create"}
        onClose={() => setMode(null)}
        eyebrow="Pupil registry"
        title="Register student"
        accent="var(--c-sky)"
        size="lg"
      >
        <p className="mb-4 text-sm leading-relaxed text-[var(--c-text-3)]">
          Creates a portal login with a temporary password. When Resend is configured, credentials are
          emailed automatically.
        </p>
        <CreateStudentForm classes={classes} parents={parents} />
      </PremiumModal>

      <PremiumModal
        open={mode === "csv"}
        onClose={() => setMode(null)}
        eyebrow="Bulk import"
        title="Upload CSV roster"
        accent="var(--c-emerald)"
        size="lg"
      >
        <div className="mb-4 flex items-center justify-center rounded-2xl border border-dashed border-[var(--c-border)] bg-[var(--c-surface-2)] p-4">
          <CsvImportIllustration className="h-24 w-24" />
        </div>
        <p className="mb-4 text-sm leading-relaxed text-[var(--c-text-3)]">
          Paste a roster with columns{" "}
          <span className="font-mono text-xs text-[var(--c-text-2)]">
            admissionNumber, firstName, lastName, email
          </span>
          .
        </p>
        <CsvImportForm />
      </PremiumModal>
    </>
  );
}
