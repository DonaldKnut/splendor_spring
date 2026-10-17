"use client";

import { forgotPasswordSchema } from "@splendor/shared";
import { AuthButton, AuthShell, IconMail, IconSend, useToast } from "@splendor/ui";
import { useState, useTransition } from "react";
import { requestPasswordReset } from "@/lib/actions/auth";
import { ngoAuthSlides } from "@/lib/auth-promo";
import { Input, Label } from "@/components/ui";

function ForgotForm() {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [token, setToken] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const email = String(new FormData(e.currentTarget).get("email") ?? "");
        const parsed = forgotPasswordSchema.safeParse({ email });
        if (!parsed.success) {
          toast.push({
            title: "Invalid email",
            description: parsed.error.issues[0]?.message,
            tone: "warning",
          });
          return;
        }
        startTransition(async () => {
          const res = await requestPasswordReset(parsed.data.email);
          setToken(res.token);
          toast.push({
            title: res.emailed ? "Check your inbox" : "Reset ready",
            description: res.emailed
              ? "If an account exists, a reset link was sent via Resend."
              : "Email is not configured — use the recovery token below if shown.",
            tone: res.emailed ? "success" : "warning",
          });
        });
      }}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Recovery</p>
        <h1 className="mt-2 font-display text-3xl text-neutral-900">Forgot password</h1>
        <p className="mt-2 text-sm text-neutral-600">
          We will email a secure reset link (or show a one-time token in development).
        </p>
      </div>
      <div>
        <Label htmlFor="email">Account email</Label>
        <div className="relative mt-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <IconMail />
          </span>
          <Input id="email" name="email" type="email" required className="pl-10" />
        </div>
      </div>
      {token ? (
        <p className="break-all rounded-xl border border-amber-300/50 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
          Recovery token: {token}
        </p>
      ) : null}
      <AuthButton type="submit" loading={pending} icon={<IconSend />}>
        Send reset link
      </AuthButton>
      <p className="text-center text-sm text-neutral-600">
        <a href="/login" className="underline">
          Back to login
        </a>
      </p>
    </form>
  );
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell brand="Splendor NGO" slides={ngoAuthSlides} accent="ngo">
      <ForgotForm />
    </AuthShell>
  );
}
