"use client";

import { requestOtpSchema, verifyOtpSchema } from "@splendor/shared";
import {
  AuthButton,
  AuthShell,
  IconCheck,
  IconMail,
  IconShield,
  useToast,
} from "@splendor/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { sendVerificationOtp, verifyEmailOtp } from "@/lib/actions/otp";
import { schoolAuthSlides } from "@/lib/auth-promo";
import { Input, Label } from "@/components/ui";

function VerifyForm() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [previewCode, setPreviewCode] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Email</p>
        <h1 className="mt-2 font-display text-3xl text-neutral-900">Verify your email</h1>
        <p className="mt-2 text-sm text-neutral-600">
          We send a one-time code via Resend to confirm account ownership.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const parsed = verifyOtpSchema.safeParse({
            email,
            code,
            purpose: "VERIFY_EMAIL",
          });
          if (!parsed.success) {
            toast.push({
              title: "Invalid details",
              description: parsed.error.issues[0]?.message,
              tone: "warning",
            });
            return;
          }
          startTransition(async () => {
            try {
              await verifyEmailOtp(parsed.data);
              toast.push({
                title: "Email verified",
                description: "You can now sign in.",
                tone: "success",
              });
              router.push("/login");
            } catch (err) {
              toast.push({
                title: "Verification failed",
                description: err instanceof Error ? err.message : "Try again.",
                tone: "error",
              });
            }
          });
        }}
      >
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <IconMail />
            </span>
            <Input
              id="email"
              type="email"
              className="has-icon"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="code">6-digit code</Label>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <IconShield />
            </span>
            <Input
              id="code"
              className="has-icon tracking-[0.35em]"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              required
            />
          </div>
          {previewCode ? (
            <p className="mt-2 text-xs text-amber-700">
              Dev preview: <span className="font-mono font-semibold">{previewCode}</span>
            </p>
          ) : null}
        </div>
        <AuthButton type="submit" loading={pending} icon={<IconCheck />}>
          Confirm email
        </AuthButton>
      </form>

      <AuthButton
        type="button"
        variant="secondary"
        loading={pending}
        icon={<IconMail />}
        onClick={() => {
          const parsed = requestOtpSchema.safeParse({
            email,
            purpose: "VERIFY_EMAIL",
          });
          if (!parsed.success) {
            toast.push({
              title: "Enter a valid email",
              tone: "warning",
            });
            return;
          }
          startTransition(async () => {
            try {
              const res = await sendVerificationOtp(parsed.data);
              setPreviewCode(res.previewCode);
              toast.push({
                title: res.emailed ? "Code sent" : "Code ready",
                description: res.emailed
                  ? "Check your inbox."
                  : res.previewCode
                    ? `Use ${res.previewCode}`
                    : "Processed.",
                tone: "info",
              });
            } catch (err) {
              toast.push({
                title: "Could not send code",
                description: err instanceof Error ? err.message : "Try later.",
                tone: "error",
              });
            }
          });
        }}
      >
        Send / resend code
      </AuthButton>

      <p className="text-center text-sm text-neutral-600">
        <a href="/login" className="underline">
          Back to login
        </a>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthShell brand="Splendor Spring School" slides={schoolAuthSlides} accent="school">
      <Suspense fallback={<p className="text-sm text-neutral-600">Loading…</p>}>
        <VerifyForm />
      </Suspense>
    </AuthShell>
  );
}
