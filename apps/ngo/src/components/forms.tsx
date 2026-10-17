"use client";

import { useState, useTransition } from "react";
import { initializeDonation } from "@/lib/actions/donations";
import {
  createSubAdmin,
  markContactHandled,
  submitContact,
  updateOrgSettings,
  upsertCampaign,
  upsertPage,
  upsertProgramme,
} from "@/lib/actions/content";
import { Alert, Button, Input, Label, Textarea } from "@/components/ui";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            await submitContact({
              name: String(form.get("name") ?? ""),
              email: String(form.get("email") ?? ""),
              phone: String(form.get("phone") ?? ""),
              subject: String(form.get("subject") ?? ""),
              message: String(form.get("message") ?? ""),
              website: String(form.get("website") ?? ""),
            });
            setMessage({ tone: "success", text: "Message sent. Thank you." });
            e.currentTarget.reset();
          } catch (err) {
            setMessage({
              tone: "error",
              text: err instanceof Error ? err.message : "Failed to send",
            });
          }
        });
      }}
    >
      <div className="hidden" aria-hidden="true">
        <Input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={5} required />
      </div>
      {message ? <Alert tone={message.tone}>{message.text}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}

export function DonationForm({
  campaigns,
  providers,
  defaultProvider,
  defaultCampaignId,
}: {
  campaigns: Array<{ id: string; title: string }>;
  providers: Array<"paystack" | "flutterwave">;
  defaultProvider: "paystack" | "flutterwave";
  defaultCampaignId?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const presets = [1000, 2500, 5000, 10000];
  const configured = providers.length > 0;

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const custom = Number(form.get("customAmount") || 0);
        const preset = Number(form.get("presetAmount") || 0);
        const amount = custom > 0 ? custom : preset;
        startTransition(async () => {
          try {
            setError(null);
            const res = await initializeDonation({
              amount,
              currency: "NGN",
              email: String(form.get("email") ?? ""),
              name: String(form.get("name") ?? ""),
              phone: String(form.get("phone") ?? ""),
              anonymous: form.get("anonymous") === "on",
              campaignId: String(form.get("campaignId") ?? "") || null,
              message: String(form.get("message") ?? ""),
              provider: String(form.get("provider") ?? defaultProvider),
              frequency: String(form.get("frequency") ?? "one_time"),
            });
            window.location.href = res.authorizationUrl;
          } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to start donation");
          }
        });
      }}
    >
      {!configured ? (
        <Alert tone="error">
          No payment provider configured. Add Paystack and/or Flutterwave keys in{" "}
          <code>apps/ngo/.env</code>.
        </Alert>
      ) : null}
      {configured ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="provider">Payment provider</Label>
            <select
              id="provider"
              name="provider"
              defaultValue={defaultProvider}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            >
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p === "paystack" ? "Paystack" : "Flutterwave"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <select
              id="frequency"
              name="frequency"
              defaultValue="one_time"
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            >
              <option value="one_time">One-time</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      ) : null}
      <div>
        <Label>Select amount (NGN)</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {presets.map((amount) => (
            <label key={amount} className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm">
              <input type="radio" name="presetAmount" value={amount} defaultChecked={amount === 2500} />
              {amount.toLocaleString()}
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="customAmount">Or custom amount</Label>
        <Input id="customAmount" name="customAmount" type="number" min={1} step="1" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" />
      </div>
      <div>
        <Label htmlFor="campaignId">Campaign (optional)</Label>
        <select
          id="campaignId"
          name="campaignId"
          defaultValue={defaultCampaignId ?? ""}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
        >
          <option value="">General donation</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea id="message" name="message" rows={3} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="anonymous" /> Donate anonymously
      </label>
      {error ? <Alert tone="error">{error}</Alert> : null}
      <Button type="submit" disabled={pending || !configured}>
        {pending ? "Redirecting to checkout..." : "Continue to secure payment"}
      </Button>
      <p className="text-xs text-ink/60">
        Success is confirmed only after server-side verification with the selected provider.
        Reaching a return URL alone does not mark a donation as successful.
      </p>
    </form>
  );
}

export function AdminContentForms() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          startTransition(async () => {
            await upsertPage({
              title: String(form.get("title") ?? ""),
              slug: String(form.get("slug") ?? "") || undefined,
              content: String(form.get("content") ?? ""),
              status: String(form.get("status") ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
            });
            setMessage("Page saved.");
            e.currentTarget.reset();
          });
        }}
      >
        <h2 className="font-display text-lg">Create / update page</h2>
        <Input name="title" placeholder="Title" required />
        <Input name="slug" placeholder="Slug (optional)" />
        <Textarea name="content" rows={5} placeholder="Content HTML" required />
        <select name="status" className="w-full rounded-md border border-line px-3 py-2 text-sm">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <Button type="submit" disabled={pending}>Save page</Button>
      </form>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          startTransition(async () => {
            await upsertProgramme({
              title: String(form.get("title") ?? ""),
              summary: String(form.get("summary") ?? ""),
              content: String(form.get("content") ?? ""),
              status: String(form.get("status") ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
            });
            setMessage("Programme saved.");
            e.currentTarget.reset();
          });
        }}
      >
        <h2 className="font-display text-lg">Create programme</h2>
        <Input name="title" placeholder="Title" required />
        <Input name="summary" placeholder="Summary" />
        <Textarea name="content" rows={5} required />
        <select name="status" className="w-full rounded-md border border-line px-3 py-2 text-sm">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <Button type="submit" disabled={pending}>Save programme</Button>
      </form>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          startTransition(async () => {
            await upsertCampaign({
              title: String(form.get("title") ?? ""),
              description: String(form.get("description") ?? ""),
              goalAmount: Number(form.get("goalAmount") || 0) || null,
              status: String(form.get("status") ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
            });
            setMessage("Campaign saved.");
            e.currentTarget.reset();
          });
        }}
      >
        <h2 className="font-display text-lg">Create campaign</h2>
        <Input name="title" placeholder="Title" required />
        <Textarea name="description" rows={3} />
        <Input name="goalAmount" type="number" placeholder="Goal amount (optional)" />
        <select name="status" className="w-full rounded-md border border-line px-3 py-2 text-sm">
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <Button type="submit" disabled={pending}>Save campaign</Button>
      </form>
      {message ? <Alert tone="success">{message}</Alert> : null}
    </div>
  );
}

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const fields = [
    "org_name",
    "org_tagline",
    "org_intro",
    "mission",
    "vision",
    "values",
    "org_address",
    "org_phone",
    "org_email",
    "whatsapp_number",
    "whatsapp_default_message",
  ];

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const entries: Record<string, string> = {};
        for (const key of fields) entries[key] = String(form.get(key) ?? "");
        startTransition(async () => {
          await updateOrgSettings(entries);
          setMessage("Settings saved.");
        });
      }}
    >
      {fields.map((key) => (
        <div key={key}>
          <Label htmlFor={key}>{key}</Label>
          {["org_intro", "mission", "vision", "values", "whatsapp_default_message"].includes(key) ? (
            <Textarea id={key} name={key} rows={3} defaultValue={initial[key] ?? ""} />
          ) : (
            <Input id={key} name={key} defaultValue={initial[key] ?? ""} />
          )}
        </div>
      ))}
      {message ? <Alert tone="success">{message}</Alert> : null}
      <Button type="submit" disabled={pending}>Save settings</Button>
    </form>
  );
}

export function ContactHandleButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="secondary"
      disabled={pending}
      onClick={() => startTransition(async () => markContactHandled(id))}
    >
      Mark handled
    </Button>
  );
}

export function CreateSubAdminForm({
  permissions,
}: {
  permissions: Array<{ id: string; label: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [creds, setCreds] = useState<{ email: string; temporaryPassword: string } | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await createSubAdmin({
            name: String(form.get("name") ?? ""),
            email: String(form.get("email") ?? ""),
            permissions: form.getAll("permissions").map(String),
          });
          setCreds(res);
          e.currentTarget.reset();
        });
      }}
    >
      <Input name="name" placeholder="Name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <div className="grid gap-2 sm:grid-cols-2">
        {permissions.map((p) => (
          <label key={p.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="permissions" value={p.id} />
            {p.label}
          </label>
        ))}
      </div>
      {creds ? (
        <Alert tone="success">
          Created {creds.email}. Temporary password: <strong>{creds.temporaryPassword}</strong>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending}>Create Sub-Admin</Button>
    </form>
  );
}
