"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { IconLock, PasswordInput } from "@splendor/ui";
import { changeOwnPassword } from "@/lib/actions/content";
import { Alert, Button, Label } from "@/components/ui";

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-teal";

function ChangePasswordInner() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const forced = Boolean(session?.user?.mustChangePassword);

  return (
    <form
      className="w-full max-w-md space-y-4 rounded-2xl border border-line bg-white p-8"
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
            await update?.({ mustChangePassword: false });
            router.push("/admin");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <h1 className="font-display text-2xl">Change password</h1>
      <p className="text-sm text-ink/70">
        {forced
          ? "Choose a new password to finish setting up your account."
          : "Enter your current password, then choose a new one."}
      </p>
      {!forced ? (
        <div>
          <Label htmlFor="current">Current password</Label>
          <div className="mt-1 text-neutral-400">
            <PasswordInput
              id="current"
              name="current"
              autoComplete="current-password"
              required
              className={fieldClass}
              leading={<IconLock />}
            />
          </div>
        </div>
      ) : null}
      <div>
        <Label htmlFor="next">New password</Label>
        <div className="mt-1 text-neutral-400">
          <PasswordInput
            id="next"
            name="next"
            autoComplete="new-password"
            minLength={8}
            required
            className={fieldClass}
            leading={<IconLock />}
          />
        </div>
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save password"}
      </Button>
    </form>
  );
}

export default function ChangePasswordPage() {
  return (
    <SessionProvider>
      <div className="flex min-h-screen items-center justify-center px-4">
        <ChangePasswordInner />
      </div>
    </SessionProvider>
  );
}
