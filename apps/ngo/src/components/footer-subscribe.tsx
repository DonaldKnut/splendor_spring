"use client";

import { newsletterSubscribeSchema } from "@splendor/shared";
import { AuthButton, IconMail, IconSend, ToastProvider, useToast } from "@splendor/ui";
import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/lib/actions/newsletter";

function SubscribeFormInner() {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = newsletterSubscribeSchema.safeParse({ email, name });
        if (!parsed.success) {
          const msg = parsed.error.issues[0]?.message ?? "Invalid details";
          setError(msg);
          toast.push({ title: "Check your email", description: msg, tone: "warning" });
          return;
        }
        setError(null);
        startTransition(async () => {
          try {
            await subscribeNewsletter(parsed.data);
            setEmail("");
            setName("");
            toast.push({
              title: "You're subscribed",
              description: "Thank you for joining our community updates.",
              tone: "success",
            });
          } catch (err) {
            toast.push({
              title: "Could not subscribe",
              description: err instanceof Error ? err.message : "Try again.",
              tone: "error",
            });
          }
        });
      }}
    >
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35">
          <IconMail className="h-4 w-4" />
        </span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-white/12 bg-white/[0.06] py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-white/25 focus:bg-white/[0.09]"
        />
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35">
          <IconMail className="h-4 w-4" />
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/12 bg-white/[0.06] py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-white/25 focus:bg-white/[0.09]"
        />
      </div>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
      <AuthButton
        type="submit"
        loading={pending}
        icon={<IconSend className="h-4 w-4" />}
        className="!rounded-xl"
        style={{
          background: "linear-gradient(135deg, #d97845, #e8915f)",
          boxShadow: "0 8px 22px rgba(217,120,69,0.35)",
          color: "#fff",
        }}
      >
        Subscribe
      </AuthButton>
      <p className="text-[11px] leading-relaxed text-white/35">
        No spam. Unsubscribe anytime. Impact stories only.
      </p>
    </form>
  );
}

export function FooterSubscribe() {
  return (
    <ToastProvider>
      <SubscribeFormInner />
    </ToastProvider>
  );
}
