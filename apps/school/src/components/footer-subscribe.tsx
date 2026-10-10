"use client";

import { newsletterSubscribeSchema } from "@splendor/shared";
import { AuthButton, IconMail, IconSend, useToast, ToastProvider } from "@splendor/ui";
import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/lib/actions/newsletter";

function SubscribeFormInner({ accent = "gold" }: { accent?: "gold" | "coral" }) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const ctaStyle =
    accent === "coral"
      ? {
          background: "linear-gradient(135deg, #d97845, #e8915f)",
          boxShadow: "0 8px 22px rgba(217,120,69,0.35)",
          color: "#fff",
        }
      : {
          background: "linear-gradient(135deg, #b91c2c, #d42a3a)",
          boxShadow: "0 8px 22px rgba(185,28,44,0.35)",
          color: "#1c100a",
        };

  return (
    <form
      className="space-y-3.5"
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
              description: "We'll keep you informed with school updates.",
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
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35">
          <IconMail className="h-5 w-5" />
        </span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-white/12 bg-white/[0.06] py-3.5 pl-12 pr-4 text-base text-white outline-none placeholder:text-white/35 transition focus:border-white/25 focus:bg-white/[0.09]"
        />
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35">
          <IconMail className="h-5 w-5" />
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-white/12 bg-white/[0.06] py-3.5 pl-12 pr-4 text-base text-white outline-none placeholder:text-white/35 transition focus:border-white/25 focus:bg-white/[0.09]"
        />
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <AuthButton
        type="submit"
        loading={pending}
        icon={<IconSend className="h-5 w-5" />}
        className="!rounded-2xl !py-3.5 !text-base !shadow-none"
        style={ctaStyle}
      >
        Subscribe
      </AuthButton>
      <p className="text-xs leading-relaxed text-white/40 sm:text-sm">
        No spam. Unsubscribe anytime. We only send meaningful updates.
      </p>
    </form>
  );
}

export function FooterSubscribe({ accent = "gold" }: { accent?: "gold" | "coral" }) {
  return (
    <ToastProvider>
      <SubscribeFormInner accent={accent} />
    </ToastProvider>
  );
}
