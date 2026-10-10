"use client";

import { useState, useTransition } from "react";
import { submitContactForm } from "@/lib/actions/content";
import { Alert, Button, Input, Label, Textarea } from "@/components/ui";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null
  );
  const [submitted, setSubmitted] = useState(false);

  if (submitted && message?.tone === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: "var(--c-emerald-pale)", color: "var(--c-emerald)" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-[var(--c-text)]">
          Message sent!
        </h3>
        <p className="mt-2 text-sm text-[var(--c-text-3)] max-w-xs">
          Thank you for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
        <button
          type="button"
          className="btn btn-ghost btn-sm mt-5"
          onClick={() => {
            setSubmitted(false);
            setMessage(null);
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const payload = {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          subject: String(form.get("subject") ?? ""),
          message: String(form.get("message") ?? ""),
          website: String(form.get("website") ?? ""),
        };
        startTransition(async () => {
          try {
            await submitContactForm(payload);
            setMessage({
              tone: "success",
              text: "Thank you. Your message has been sent.",
            });
            setSubmitted(true);
          } catch (err) {
            setMessage({
              tone: "error",
              text: err instanceof Error ? err.message : "Unable to send message.",
            });
          }
        });
      }}
    >
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <Label htmlFor="name" required>Full name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Your full name"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email" required>Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+234 ..."
          />
        </div>
      </div>

      <div>
        <Label htmlFor="subject" required>Subject</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="What is this about?"
          required
        />
      </div>

      <div>
        <Label htmlFor="message" required>Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Your message here..."
          required
        />
      </div>

      {message && message.tone === "error" && (
        <Alert tone="error">{message.text}</Alert>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="w-full"
        variant="primary"
      >
        {pending ? (
          <>
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Sending…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
            Send message
          </>
        )}
      </Button>
    </form>
  );
}
