"use client";

import { resetPasswordSchema } from "@splendor/shared";
import {
  AuthButton,
  AuthShell,
  IconKey,
  IconLock,
  PasswordInput,
  useToast,
} from "@splendor/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useTransition } from "react";
import { completePasswordReset } from "@/lib/actions/auth";
import { ngoAuthSlides } from "@/lib/auth-promo";
import { Input, Label } from "@/components/ui";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const parsed = resetPasswordSchema.safeParse({
          token: String(form.get("token") ?? ""),
          password: String(form.get("password") ?? ""),
          confirmPassword: String(form.get("confirmPassword") ?? ""),
        });
        if (!parsed.success) {
          toast.push({
            title: "Check your password",
            description: parsed.error.issues[0]?.message,
            tone: "warning",
          });
          return;
        }
        startTransition(async () => {
          try {
            await completePasswordReset(parsed.data.token, parsed.data.password);
            toast.push({
              title: "Password updated",
              description: "You can sign in with your new password.",
              tone: "success",
            });
            router.push("/login");
          } catch (err) {
            toast.push({
              title: "Reset failed",
              description: err instanceof Error ? err.message : "Try again.",
              tone: "error",
            });
          }
        });
      }}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Security</p>
        <h1 className="mt-2 font-display text-3xl text-neutral-900">Set new password</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Choose a strong password with letters and numbers.
        </p>
      </div>
      <div>
        <Label htmlFor="token">Reset token</Label>
        <Input
          id="token"
          name="token"
          required
          defaultValue={params.get("token") ?? ""}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="password">New password</Label>
        <div className="mt-1 text-neutral-400">
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            required
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-teal"
            leading={<IconLock />}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="mt-1 text-neutral-400">
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            required
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-teal"
            leading={<IconLock />}
          />
        </div>
      </div>
      <AuthButton type="submit" loading={pending} icon={<IconKey />}>
        Update password
      </AuthButton>
      <p className="text-center text-sm text-neutral-600">
        <a href="/login" className="underline">
          Back to login
        </a>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell brand="Splendor NGO" slides={ngoAuthSlides} accent="ngo">
      <Suspense fallback={<p className="text-sm text-neutral-600">Loading…</p>}>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
