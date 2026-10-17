"use client";

import { useState, useTransition } from "react";
import {
  setCampaignStatus,
  setEventStatus,
  setGrantStatus,
  setPollStatus,
  upsertEvent,
  upsertFundraisingCampaign,
  upsertGrant,
  upsertPoll,
} from "@/lib/actions/engagement";
import { Alert, Button, Input, Label, Textarea } from "@/components/ui";

type Option = { id: string; title: string };

function StatusSelect({
  name,
  options,
  defaultValue,
}: {
  name: string;
  options: string[];
  defaultValue: string;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-teal"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function FundraisingForm({
  programmes,
  events,
  initial,
}: {
  programmes: Option[];
  events: Option[];
  initial?: {
    id: string;
    title: string;
    summary: string | null;
    description: string | null;
    goalAmount: number | null;
    currency: string;
    featured: boolean;
    startsAt: string | null;
    endsAt: string | null;
    programmeId: string | null;
    eventId: string | null;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  };
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            setError(null);
            await upsertFundraisingCampaign({
              id: initial?.id,
              title: String(form.get("title") ?? ""),
              summary: String(form.get("summary") ?? ""),
              description: String(form.get("description") ?? ""),
              goalAmount: Number(form.get("goalAmount") || 0) || null,
              currency: String(form.get("currency") ?? "NGN"),
              featured: form.get("featured") === "on",
              startsAt: String(form.get("startsAt") ?? "") || null,
              endsAt: String(form.get("endsAt") ?? "") || null,
              programmeId: String(form.get("programmeId") ?? "") || null,
              eventId: String(form.get("eventId") ?? "") || null,
              status: String(form.get("status") ?? "DRAFT") as
                | "DRAFT"
                | "PUBLISHED"
                | "ARCHIVED",
            });
            setMessage(initial ? "Campaign updated." : "Campaign created.");
            if (!initial) e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
          }
        });
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Campaign title</Label>
          <Input id="title" name="title" required defaultValue={initial?.title} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="summary">Short summary</Label>
          <Input id="summary" name="summary" defaultValue={initial?.summary ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Story / appeal</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initial?.description ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="goalAmount">Goal amount</Label>
          <Input
            id="goalAmount"
            name="goalAmount"
            type="number"
            min={0}
            defaultValue={initial?.goalAmount ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" name="currency" defaultValue={initial?.currency ?? "NGN"} />
        </div>
        <div>
          <Label htmlFor="startsAt">Starts</Label>
          <Input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={initial?.startsAt ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="endsAt">Ends</Label>
          <Input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={initial?.endsAt ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="programmeId">Programme</Label>
          <select
            id="programmeId"
            name="programmeId"
            defaultValue={initial?.programmeId ?? ""}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
          >
            <option value="">None</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="eventId">Linked event</Label>
          <select
            id="eventId"
            name="eventId"
            defaultValue={initial?.eventId ?? ""}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
          >
            <option value="">None</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <StatusSelect
            name="status"
            options={["DRAFT", "PUBLISHED", "ARCHIVED"]}
            defaultValue={initial?.status ?? "DRAFT"}
          />
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={initial?.featured} />
          Feature on homepage
        </label>
      </div>
      {message ? <Alert tone="success">{message}</Alert> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : initial ? "Update campaign" : "Create campaign"}
      </Button>
    </form>
  );
}

export function GrantForm({
  programmes,
  initial,
}: {
  programmes: Option[];
  initial?: {
    id: string;
    title: string;
    summary: string | null;
    description: string;
    amountMin: number | null;
    amountMax: number | null;
    currency: string;
    category: string | null;
    eligibility: string | null;
    applicationUrl: string | null;
    deadline: string | null;
    featured: boolean;
    programmeId: string | null;
    status: "DRAFT" | "OPEN" | "CLOSED" | "AWARDED" | "ARCHIVED";
  };
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            setError(null);
            await upsertGrant({
              id: initial?.id,
              title: String(form.get("title") ?? ""),
              summary: String(form.get("summary") ?? ""),
              description: String(form.get("description") ?? ""),
              amountMin: Number(form.get("amountMin") || 0) || null,
              amountMax: Number(form.get("amountMax") || 0) || null,
              currency: String(form.get("currency") ?? "NGN"),
              category: String(form.get("category") ?? ""),
              eligibility: String(form.get("eligibility") ?? ""),
              applicationUrl: String(form.get("applicationUrl") ?? ""),
              deadline: String(form.get("deadline") ?? "") || null,
              featured: form.get("featured") === "on",
              programmeId: String(form.get("programmeId") ?? "") || null,
              status: String(form.get("status") ?? "DRAFT") as
                | "DRAFT"
                | "OPEN"
                | "CLOSED"
                | "AWARDED"
                | "ARCHIVED",
            });
            setMessage(initial ? "Grant updated." : "Grant created.");
            if (!initial) e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
          }
        });
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="gtitle">Grant title</Label>
          <Input id="gtitle" name="title" required defaultValue={initial?.title} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="gsummary">Summary</Label>
          <Input id="gsummary" name="summary" defaultValue={initial?.summary ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="gdescription">Full description</Label>
          <Textarea
            id="gdescription"
            name="description"
            rows={5}
            required
            defaultValue={initial?.description}
          />
        </div>
        <div>
          <Label htmlFor="amountMin">Min amount</Label>
          <Input
            id="amountMin"
            name="amountMin"
            type="number"
            defaultValue={initial?.amountMin ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="amountMax">Max amount</Label>
          <Input
            id="amountMax"
            name="amountMax"
            type="number"
            defaultValue={initial?.amountMax ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="gcurrency">Currency</Label>
          <Input id="gcurrency" name="currency" defaultValue={initial?.currency ?? "NGN"} />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" defaultValue={initial?.category ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="eligibility">Eligibility</Label>
          <Textarea
            id="eligibility"
            name="eligibility"
            rows={2}
            defaultValue={initial?.eligibility ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="applicationUrl">Application URL</Label>
          <Input
            id="applicationUrl"
            name="applicationUrl"
            defaultValue={initial?.applicationUrl ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            name="deadline"
            type="datetime-local"
            defaultValue={initial?.deadline ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="gprogrammeId">Programme</Label>
          <select
            id="gprogrammeId"
            name="programmeId"
            defaultValue={initial?.programmeId ?? ""}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
          >
            <option value="">None</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="gstatus">Status</Label>
          <StatusSelect
            name="status"
            options={["DRAFT", "OPEN", "CLOSED", "AWARDED", "ARCHIVED"]}
            defaultValue={initial?.status ?? "DRAFT"}
          />
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={initial?.featured} />
          Feature on homepage
        </label>
      </div>
      {message ? <Alert tone="success">{message}</Alert> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : initial ? "Update grant" : "Create grant"}
      </Button>
    </form>
  );
}

export function EventForm({
  programmes,
  initial,
}: {
  programmes: Option[];
  initial?: {
    id: string;
    title: string;
    summary: string | null;
    description: string;
    venue: string | null;
    location: string | null;
    startsAt: string;
    endsAt: string | null;
    capacity: number | null;
    featured: boolean;
    programmeId: string | null;
    status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED" | "ARCHIVED";
  };
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            setError(null);
            await upsertEvent({
              id: initial?.id,
              title: String(form.get("title") ?? ""),
              summary: String(form.get("summary") ?? ""),
              description: String(form.get("description") ?? ""),
              venue: String(form.get("venue") ?? ""),
              location: String(form.get("location") ?? ""),
              startsAt: String(form.get("startsAt") ?? ""),
              endsAt: String(form.get("endsAt") ?? "") || null,
              capacity: Number(form.get("capacity") || 0) || null,
              featured: form.get("featured") === "on",
              programmeId: String(form.get("programmeId") ?? "") || null,
              status: String(form.get("status") ?? "DRAFT") as
                | "DRAFT"
                | "PUBLISHED"
                | "CANCELLED"
                | "COMPLETED"
                | "ARCHIVED",
            });
            setMessage(initial ? "Event updated." : "Event created.");
            if (!initial) e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
          }
        });
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="etitle">Event title</Label>
          <Input id="etitle" name="title" required defaultValue={initial?.title} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="esummary">Summary</Label>
          <Input id="esummary" name="summary" defaultValue={initial?.summary ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="edescription">Description</Label>
          <Textarea
            id="edescription"
            name="description"
            rows={4}
            required
            defaultValue={initial?.description}
          />
        </div>
        <div>
          <Label htmlFor="venue">Venue</Label>
          <Input id="venue" name="venue" defaultValue={initial?.venue ?? ""} />
        </div>
        <div>
          <Label htmlFor="location">City / location</Label>
          <Input id="location" name="location" defaultValue={initial?.location ?? ""} />
        </div>
        <div>
          <Label htmlFor="estartsAt">Starts</Label>
          <Input
            id="estartsAt"
            name="startsAt"
            type="datetime-local"
            required
            defaultValue={initial?.startsAt}
          />
        </div>
        <div>
          <Label htmlFor="eendsAt">Ends</Label>
          <Input
            id="eendsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={initial?.endsAt ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={0}
            defaultValue={initial?.capacity ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="eprogrammeId">Programme</Label>
          <select
            id="eprogrammeId"
            name="programmeId"
            defaultValue={initial?.programmeId ?? ""}
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
          >
            <option value="">None</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="estatus">Status</Label>
          <StatusSelect
            name="status"
            options={["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED", "ARCHIVED"]}
            defaultValue={initial?.status ?? "DRAFT"}
          />
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={initial?.featured} />
          Feature on homepage
        </label>
      </div>
      {message ? <Alert tone="success">{message}</Alert> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : initial ? "Update event" : "Create event"}
      </Button>
    </form>
  );
}

export function PollForm({ events }: { events: Option[] }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const options = String(form.get("options") ?? "")
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        startTransition(async () => {
          try {
            setError(null);
            await upsertPoll({
              title: String(form.get("title") ?? ""),
              description: String(form.get("description") ?? ""),
              allowMultiple: form.get("allowMultiple") === "on",
              startsAt: String(form.get("startsAt") ?? "") || null,
              endsAt: String(form.get("endsAt") ?? "") || null,
              eventId: String(form.get("eventId") ?? "") || null,
              status: String(form.get("status") ?? "DRAFT") as
                | "DRAFT"
                | "OPEN"
                | "CLOSED"
                | "ARCHIVED",
              options,
            });
            setMessage("Poll created.");
            e.currentTarget.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
          }
        });
      }}
    >
      <div>
        <Label htmlFor="ptitle">Poll question</Label>
        <Input id="ptitle" name="title" required />
      </div>
      <div>
        <Label htmlFor="pdescription">Context (optional)</Label>
        <Textarea id="pdescription" name="description" rows={2} />
      </div>
      <div>
        <Label htmlFor="options">Options (one per line)</Label>
        <Textarea
          id="options"
          name="options"
          rows={5}
          required
          placeholder={"Yes, support this\nNeed more info\nNot this time"}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="pstartsAt">Opens</Label>
          <Input id="pstartsAt" name="startsAt" type="datetime-local" />
        </div>
        <div>
          <Label htmlFor="pendsAt">Closes</Label>
          <Input id="pendsAt" name="endsAt" type="datetime-local" />
        </div>
        <div>
          <Label htmlFor="peventId">Linked event</Label>
          <select
            id="peventId"
            name="eventId"
            className="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm"
          >
            <option value="">None</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="pstatus">Status</Label>
          <StatusSelect
            name="status"
            options={["DRAFT", "OPEN", "CLOSED", "ARCHIVED"]}
            defaultValue="DRAFT"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="allowMultiple" />
        Allow multiple choices
      </label>
      {message ? <Alert tone="success">{message}</Alert> : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Create poll"}
      </Button>
    </form>
  );
}

export function QuickStatusButton({
  kind,
  id,
  status,
  label,
}: {
  kind: "campaign" | "grant" | "event" | "poll";
  id: string;
  status: string;
  label: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="secondary"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          if (kind === "campaign") {
            await setCampaignStatus(id, status as "DRAFT" | "PUBLISHED" | "ARCHIVED");
          } else if (kind === "grant") {
            await setGrantStatus(
              id,
              status as "DRAFT" | "OPEN" | "CLOSED" | "AWARDED" | "ARCHIVED",
            );
          } else if (kind === "event") {
            await setEventStatus(
              id,
              status as "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED" | "ARCHIVED",
            );
          } else {
            await setPollStatus(id, status as "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED");
          }
        })
      }
    >
      {label}
    </Button>
  );
}

function toLocalInput(value?: Date | string | null) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export { toLocalInput };
