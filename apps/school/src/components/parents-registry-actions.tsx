"use client";

import { useState } from "react";
import { PremiumModal } from "@/components/premium-modal";
import { CreateParentForm } from "@/components/forms/parent-form";

export function ParentsRegistryActions({
  students,
  variant = "hero",
}: {
  students: Array<{ id: string; label: string }>;
  variant?: "hero" | "empty" | "panel";
}) {
  const [open, setOpen] = useState(false);

  const button =
    variant === "panel" ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-primary btn-sm rounded-xl"
      >
        + Create parent
      </button>
    ) : variant === "empty" ? (
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn btn-primary btn-sm rounded-xl"
        >
          + Create parent
        </button>
      </div>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn btn-primary btn-sm rounded-xl"
      >
        + Create parent
      </button>
    );

  return (
    <>
      {button}

      <PremiumModal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="Guardian registry"
        title="Create parent"
        accent="var(--c-emerald)"
        size="lg"
      >
        <p className="mb-4 text-sm leading-relaxed text-[var(--c-text-3)]">
          Issues a parent portal login with a temporary password. When Resend is configured,
          credentials are emailed automatically.
        </p>
        <CreateParentForm students={students} />
      </PremiumModal>
    </>
  );
}
