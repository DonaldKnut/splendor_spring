"use client";

import { useState, useTransition } from "react";
import { upsertAnnouncement, upsertContentPage, updateSchoolSettings } from "@/lib/actions/content";
import { Alert, Button, Input, Label, Textarea } from "@/components/ui";
import { FieldIcons } from "@/components/field-icons";

const selectClass = "input-field";

export function ContentPageForm({
  initial,
}: {
  initial?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    pageType?: string | null;
    featured?: boolean;
  };
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const editing = Boolean(initial?.id);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            setError(null);
            await upsertContentPage({
              id: initial?.id,
              title: String(form.get("title") ?? ""),
              slug: String(form.get("slug") ?? "") || undefined,
              content: String(form.get("content") ?? ""),
              excerpt: String(form.get("excerpt") ?? ""),
              metaTitle: String(form.get("metaTitle") ?? ""),
              metaDescription: String(form.get("metaDescription") ?? ""),
              status: String(form.get("status") ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
              pageType: String(form.get("pageType") ?? "page"),
              featured: form.get("featured") === "on",
            });
            setMessage(editing ? "Page updated." : "Page created.");
            if (!editing) e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label htmlFor={`title-${initial?.id ?? "new"}`}>Title</Label>
          <Input
            id={`title-${initial?.id ?? "new"}`}
            name="title"
            required
            defaultValue={initial?.title}
            icon={FieldIcons.file}
          />
        </div>
        <div>
          <Label htmlFor={`slug-${initial?.id ?? "new"}`}>Slug</Label>
          <Input
            id={`slug-${initial?.id ?? "new"}`}
            name="slug"
            placeholder="auto from title if empty"
            defaultValue={initial?.slug}
            icon={FieldIcons.tag}
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`content-${initial?.id ?? "new"}`}>Content (HTML allowed; sanitized)</Label>
        <Textarea
          id={`content-${initial?.id ?? "new"}`}
          name="content"
          rows={8}
          required
          defaultValue={initial?.content}
          icon={FieldIcons.file}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <Label htmlFor={`excerpt-${initial?.id ?? "new"}`}>Excerpt</Label>
          <Input
            id={`excerpt-${initial?.id ?? "new"}`}
            name="excerpt"
            defaultValue={initial?.excerpt ?? ""}
            icon={FieldIcons.file}
          />
        </div>
        <div>
          <Label htmlFor={`status-${initial?.id ?? "new"}`}>Status</Label>
          <select
            id={`status-${initial?.id ?? "new"}`}
            name="status"
            className={selectClass}
            defaultValue={initial?.status ?? "DRAFT"}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <div>
          <Label htmlFor={`type-${initial?.id ?? "new"}`}>Type</Label>
          <Input
            id={`type-${initial?.id ?? "new"}`}
            name="pageType"
            defaultValue={initial?.pageType ?? "page"}
          />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label htmlFor={`mt-${initial?.id ?? "new"}`}>Meta title</Label>
          <Input
            id={`mt-${initial?.id ?? "new"}`}
            name="metaTitle"
            defaultValue={initial?.metaTitle ?? ""}
          />
        </div>
        <div>
          <Label htmlFor={`md-${initial?.id ?? "new"}`}>Meta description</Label>
          <Input
            id={`md-${initial?.id ?? "new"}`}
            name="metaDescription"
            defaultValue={initial?.metaDescription ?? ""}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-[var(--c-text-2)]">
        <input type="checkbox" name="featured" defaultChecked={initial?.featured} /> Featured
      </label>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {message ? <Alert tone="success">{message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : editing ? "Update page" : "Create page"}
      </Button>
    </form>
  );
}

export function AnnouncementForm({
  initial,
}: {
  initial?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    featured?: boolean;
  };
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const editing = Boolean(initial?.id);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            setError(null);
            await upsertAnnouncement({
              id: initial?.id,
              title: String(form.get("title") ?? ""),
              slug: String(form.get("slug") ?? "") || undefined,
              content: String(form.get("content") ?? ""),
              excerpt: String(form.get("excerpt") ?? ""),
              status: String(form.get("status") ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED",
              featured: form.get("featured") === "on",
            });
            setMessage(editing ? "Announcement updated." : "Announcement created.");
            if (!editing) e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label htmlFor={`a-title-${initial?.id ?? "new"}`}>Title</Label>
          <Input
            id={`a-title-${initial?.id ?? "new"}`}
            name="title"
            required
            defaultValue={initial?.title}
            icon={FieldIcons.file}
          />
        </div>
        <div>
          <Label htmlFor={`a-slug-${initial?.id ?? "new"}`}>Slug</Label>
          <Input
            id={`a-slug-${initial?.id ?? "new"}`}
            name="slug"
            defaultValue={initial?.slug}
            icon={FieldIcons.tag}
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`a-content-${initial?.id ?? "new"}`}>Content</Label>
        <Textarea
          id={`a-content-${initial?.id ?? "new"}`}
          name="content"
          rows={6}
          required
          defaultValue={initial?.content}
          icon={FieldIcons.file}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label htmlFor={`a-excerpt-${initial?.id ?? "new"}`}>Excerpt</Label>
          <Input
            id={`a-excerpt-${initial?.id ?? "new"}`}
            name="excerpt"
            defaultValue={initial?.excerpt ?? ""}
            icon={FieldIcons.file}
          />
        </div>
        <div>
          <Label htmlFor={`a-status-${initial?.id ?? "new"}`}>Status</Label>
          <select
            id={`a-status-${initial?.id ?? "new"}`}
            name="status"
            className={selectClass}
            defaultValue={initial?.status ?? "DRAFT"}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-[var(--c-text-2)]">
        <input type="checkbox" name="featured" defaultChecked={initial?.featured} /> Featured
      </label>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {message ? <Alert tone="success">{message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : editing ? "Update announcement" : "Create announcement"}
      </Button>
    </form>
  );
}

const SETTING_GROUPS: Array<{
  title: string;
  description: string;
  fields: Array<{ key: string; label: string; hint?: string; multiline?: boolean }>;
}> = [
  {
    title: "School identity",
    description: "Shown across the public website and emails.",
    fields: [
      { key: "school_name", label: "School name" },
      { key: "school_tagline", label: "Tagline / motto" },
      { key: "school_motto", label: "Motto" },
      { key: "school_proprietor", label: "Proprietor" },
      { key: "school_address", label: "Address" },
      { key: "school_phone", label: "Phone(s)", hint: "Separate with / if more than one" },
      { key: "school_email", label: "Public email" },
      { key: "school_facebook", label: "Facebook URL" },
    ],
  },
  {
    title: "About copy",
    description: "Homepage and About page content.",
    fields: [
      { key: "school_intro", label: "Introduction", multiline: true },
      { key: "mission", label: "Mission", multiline: true },
      { key: "vision", label: "Vision", multiline: true },
      { key: "values", label: "Values", multiline: true },
      { key: "educational_approach", label: "Educational approach", multiline: true },
      { key: "coming_soon", label: "Coming soon note", multiline: true },
    ],
  },
  {
    title: "WhatsApp",
    description: "Floating click-to-chat (E.164 digits without +).",
    fields: [
      { key: "whatsapp_number", label: "WhatsApp number", hint: "e.g. 2348012345678" },
      {
        key: "whatsapp_default_message",
        label: "Default message",
        multiline: true,
      },
    ],
  },
  {
    title: "Assessment",
    description: "Score ceilings used when entering and publishing results.",
    fields: [
      { key: "ca_max", label: "CA maximum" },
      { key: "exam_max", label: "Exam maximum" },
    ],
  },
];

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fields = SETTING_GROUPS.flatMap((g) => g.fields.map((f) => f.key));

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const entries: Record<string, string> = {};
        for (const key of fields) entries[key] = String(form.get(key) ?? "");
        startTransition(async () => {
          try {
            setError(null);
            await updateSchoolSettings(entries);
            setMessage("Settings saved.");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
          }
        });
      }}
    >
      {SETTING_GROUPS.map((group) => (
        <section key={group.title} className="space-y-4">
          <div>
            <h3 className="font-display text-base font-semibold text-[var(--c-text)]">
              {group.title}
            </h3>
            <p className="text-sm text-[var(--c-text-3)]">{group.description}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {group.fields.map((field) => (
              <div
                key={field.key}
                className={field.multiline ? "md:col-span-2" : undefined}
              >
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.multiline ? (
                  <Textarea
                    id={field.key}
                    name={field.key}
                    rows={3}
                    defaultValue={initial[field.key] ?? ""}
                    icon={
                      field.key.includes("whatsapp")
                        ? FieldIcons.phone
                        : FieldIcons.file
                    }
                  />
                ) : (
                  <Input
                    id={field.key}
                    name={field.key}
                    defaultValue={initial[field.key] ?? ""}
                    icon={
                      field.key.includes("email")
                        ? FieldIcons.mail
                        : field.key.includes("phone") || field.key.includes("whatsapp")
                          ? FieldIcons.phone
                          : field.key.includes("address")
                            ? FieldIcons.map
                            : field.key.includes("name") || field.key.includes("tagline")
                              ? FieldIcons.tag
                              : FieldIcons.hash
                    }
                  />
                )}
                {field.hint ? (
                  <p className="mt-1 text-xs text-[var(--c-text-3)]">{field.hint}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}
      {error ? <Alert tone="error">{error}</Alert> : null}
      {message ? <Alert tone="success">{message}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
