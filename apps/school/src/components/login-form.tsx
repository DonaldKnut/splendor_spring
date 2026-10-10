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
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { preflightLogin, sendVerificationOtp, verifyEmailOtp } from "@/lib/actions/otp";
import { Input, Label } from "@/components/ui";

type Step = "credentials" | "otp";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    router.push(params.get("callbackUrl") || "/portal");
    router.refresh();
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div
          className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em]"
          style={{
            background: "var(--c-ice)",
            color: "var(--c-sky)",
          }}
        >
          {step === "credentials" ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              Portal access
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              Email verification
            </>
          )}
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--c-text)]">
          {step === "credentials" ? "Sign in" : "Verify email"}
        </h1>
        <p className="mt-2 text-sm text-[var(--c-text-3)]">
          {step === "credentials"
            ? "Use your school account credentials to access your portal."
            : `Enter the 6-digit code sent to ${email}.`}
        </p>
      </div>

      {step === "credentials" ? (
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const raw = {
              email: String(new FormData(e.currentTarget).get("email") ?? ""),
              password: String(new FormData(e.currentTarget).get("password") ?? ""),
            };
            const parsed = loginSchema.safeParse(raw);
            if (!parsed.success) {
              const next: Record<string, string> = {};
              parsed.error.issues.forEach((i) => {
                next[String(i.path[0])] = i.message;
              });
              setFieldErrors(next);
              toast.push({
                title: "Check your details",
                description: parsed.error.issues[0]?.message,
                tone: "warning",
              });
              return;
            }
            setFieldErrors({});
            setEmail(parsed.data.email);
            setPassword(parsed.data.password);
            startTransition(async () => {
              try {
                const gate = await preflightLogin(parsed.data);
                if (gate.status === "INVALID") {
                  toast.push({
                    title: "Unable to sign in",
                    description: gate.error,
                    tone: "error",
                  });
                  return;
                }
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
            <Label htmlFor="email">Email address</Label>
            <div className="mt-1.5">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                defaultValue={email}
                placeholder="your@email.com"
                required
                icon={<IconMail />}
                style={fieldErrors.email ? { borderColor: "var(--c-danger)" } : {}}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--c-danger)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                href="/forgot-password"
                className="text-xs font-medium text-[var(--c-sky)] hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="mt-1.5 text-[var(--c-text-3)]">
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                className="input-field"
                placeholder="••••••••"
                required
                leading={<IconLock />}
                style={fieldErrors.password ? { borderColor: "var(--c-danger)" } : {}}
              />
            </div>
            {fieldErrors.password && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--c-danger)]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {fieldErrors.password}
              </p>
            )}
          </div>

          <AuthButton
            type="submit"
            loading={pending}
            icon={<IconKey />}
            className="cursor-pointer transition-all hover:brightness-105 active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, var(--c-gold) 0%, var(--c-gold-light) 100%)",
              color: "var(--c-text-inv, #fff)",
              boxShadow: "0 10px 26px rgba(185, 28, 44, 0.35)",
              border: "1px solid rgba(185, 28, 44, 0.25)",
            }}
          >
            Continue
          </AuthButton>
        </form>
      ) : (
        <form
          className="space-y-5"
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
            <Label htmlFor="code">6-digit verification code</Label>
            <div className="mt-1.5">
              <Input
                id="code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="• • • • • •"
                className="tracking-[0.4em] text-center font-mono text-lg"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                icon={<IconShield />}
              />
            </div>
            {previewCode && (
              <div
                className="mt-2 rounded-lg px-3 py-2 text-xs"
                style={{
                  background: "var(--c-gold-pale)",
                  border: "1px solid rgba(185,28,44,0.3)",
                  color: "#78350f",
                }}
              >
                Dev preview code:{" "}
                <span className="font-mono font-bold tracking-wider">{previewCode}</span>
              </div>
            )}
          </div>

          <AuthButton
            type="submit"
            loading={pending}
            icon={<IconCheck />}
            className="cursor-pointer transition-all hover:brightness-105 active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, var(--c-gold) 0%, var(--c-gold-light) 100%)",
              color: "var(--c-text-inv, #fff)",
              boxShadow: "0 10px 26px rgba(185, 28, 44, 0.35)",
              border: "1px solid rgba(185, 28, 44, 0.25)",
            }}
          >
            Verify & sign in
          </AuthButton>

          <AuthButton
            type="button"
            variant="secondary"
            loading={pending}
            icon={<IconMail />}
            className="cursor-pointer transition-all hover:bg-[var(--c-surface-3)]"
            style={{
              background: "var(--c-surface)",
              color: "var(--c-text)",
              border: "1px solid var(--c-border)",
            }}
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

          <button
            type="button"
            className="w-full text-center text-sm text-[var(--c-text-3)] hover:text-[var(--c-text)] transition-colors"
            onClick={() => {
              setStep("credentials");
              setCode("");
              setPreviewCode(null);
            }}
          >
            ← Back to password
          </button>
        </form>
      )}
    </div>
  );
}
