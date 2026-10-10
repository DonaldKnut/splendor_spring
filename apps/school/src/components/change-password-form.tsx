"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { IconKey, IconLock, PasswordInput, AuthButton } from "@splendor/ui";
import { changeOwnPassword } from "@/lib/actions/users";
import { Alert, Label } from "@/components/ui";

export function ChangePasswordForm() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const forced = Boolean(session?.user?.mustChangePassword);

  return (
    <div className="space-y-7">
      <div>
        <div
          className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ background: "var(--c-ice)", color: "var(--c-sky)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
          Security
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--c-text)]">
          Change password
        </h1>
        <p className="mt-2 text-sm text-[var(--c-text-3)]">
          {forced
            ? "Choose a new password to finish setting up your account."
            : "Enter your current password, then choose a new one."}
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          startTransition(async () => {
            try {
              setError(null);
              await changeOwnPassword(
                String(form.get("current") ?? ""),
                String(form.get("next") ?? "")
              );
              await update({ mustChangePassword: false });
              router.push("/portal");
              router.refresh();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Unable to change password.");
            }
          });
        }}
      >
        {!forced ? (
          <div>
            <Label htmlFor="current">Current password</Label>
            <div className="mt-1.5 text-[var(--c-text-3)]">
              <PasswordInput
                id="current"
                name="current"
                autoComplete="current-password"
                required
                className="input-field"
                leading={<IconLock />}
              />
            </div>
          </div>
        ) : null}
        <div>
          <Label htmlFor="next">New password</Label>
          <div className="mt-1.5 text-[var(--c-text-3)]">
            <PasswordInput
              id="next"
              name="next"
              autoComplete="new-password"
              className="input-field"
              minLength={8}
              required
              leading={<IconLock />}
            />
          </div>
          <p className="mt-1.5 text-xs text-[var(--c-text-3)]">At least 8 characters.</p>
        </div>
        {error ? <Alert tone="error">{error}</Alert> : null}
        <AuthButton type="submit" loading={pending} icon={<IconKey />}>
          Save password
        </AuthButton>
      </form>
    </div>
  );
}
