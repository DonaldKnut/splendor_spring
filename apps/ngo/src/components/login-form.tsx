"use client";

import { loginSchema, verifyOtpSchema } from "@splendor/shared";
import {
  AuthButton,
  IconCheck,
  IconKey,
  IconLock,
  IconMail,
  IconShield,
  PasswordInput,
  useToast,
} from "@splendor/ui";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { preflightLogin, sendVerificationOtp, verifyEmailOtp } from "@/lib/actions/otp";
import { Input, Label } from "@/components/ui";

type Step = "credentials" | "otp";

export function LoginForm() {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [previewCode, setPreviewCode] = useState<string | null>(null);

  async function finishSignIn(creds: { email: string; password: string }) {
    const res = await signIn("credentials", {
      email: creds.email,
      password: creds.password,
      redirect: false,
    });
    if (res?.error) {
      toast.push({
        title: "Sign-in failed",
        description: "Please check your credentials and try again.",
        tone: "error",
      });
      setStep("credentials");
      return;
    }
    toast.push({ title: "Welcome back", tone: "success" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Admin access</p>
        <h1 className="mt-2 font-display text-3xl text-neutral-900">
          {step === "credentials" ? "Sign in" : "Verify email"}
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          {step === "credentials"
            ? "Secure NGO administration portal."
            : `Enter the 6-digit code sent to ${email}.`}
        </p>
      </div>

      {step === "credentials" ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const raw = {
              email: String(new FormData(e.currentTarget).get("email") ?? ""),
              password: String(new FormData(e.currentTarget).get("password") ?? ""),
            };
            const parsed = loginSchema.safeParse(raw);
            if (!parsed.success) {
              toast.push({
                title: "Check your details",
                description: parsed.error.issues[0]?.message,
                tone: "warning",
              });
              return;
            }
            setEmail(parsed.data.email);
            setPassword(parsed.data.password);
            startTransition(async () => {
              try {
                const gate = await preflightLogin(parsed.data);
                if (gate.status === "VERIFY_EMAIL") {
                  setPreviewCode(gate.previewCode);
                  setStep("otp");
                  toast.push({
                    title: gate.emailed ? "Code sent" : "Verification required",
                    description: gate.emailed
                      ? "Check your inbox for a 6-digit code."
                      : gate.previewCode
                        ? `Email not configured — use code ${gate.previewCode}`
                        : "Complete email verification to continue.",
                    tone: gate.emailed ? "info" : "warning",
                  });
                  return;
                }
                await finishSignIn(parsed.data);
              } catch (err) {
                toast.push({
                  title: "Unable to sign in",
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
              <Input id="email" name="email" type="email" required className="pl-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="mt-1 text-neutral-400">
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-teal"
                leading={<IconLock />}
              />
            </div>
          </div>
          <AuthButton type="submit" loading={pending} icon={<IconKey />}>
            Continue
          </AuthButton>
        </form>
      ) : (
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
                title: "Invalid code",
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
                  description: "Signing you in…",
                  tone: "success",
                });
                await finishSignIn({ email, password });
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
            <Label htmlFor="code">Verification code</Label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <IconShield />
              </span>
              <Input
                id="code"
                className="pl-10 tracking-[0.35em]"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
              />
            </div>
            {previewCode ? (
              <p className="mt-2 text-xs text-amber-700">
                Dev preview code: <span className="font-mono font-semibold">{previewCode}</span>
              </p>
            ) : null}
          </div>
          <AuthButton type="submit" loading={pending} icon={<IconCheck />}>
            Verify & sign in
          </AuthButton>
          <AuthButton
            type="button"
            variant="secondary"
            loading={pending}
            icon={<IconMail />}
            onClick={() => {
              startTransition(async () => {
                try {
                  const res = await sendVerificationOtp({
                    email,
                    purpose: "VERIFY_EMAIL",
                  });
                  setPreviewCode(res.previewCode);
                  toast.push({
                    title: res.emailed ? "Code resent" : "Code ready",
                    description: res.emailed
                      ? "A new code is in your inbox."
                      : res.previewCode
                        ? `Use code ${res.previewCode}`
                        : "Request processed.",
                    tone: "info",
                  });
                } catch (err) {
                  toast.push({
                    title: "Could not resend",
                    description: err instanceof Error ? err.message : "Try later.",
                    tone: "error",
                  });
                }
              });
            }}
          >
            Resend code
          </AuthButton>
        </form>
      )}

      <p className="text-center text-sm text-neutral-600">
        <a href="/forgot-password" className="underline">
          Forgot password?
        </a>
      </p>
    </div>
  );
}
