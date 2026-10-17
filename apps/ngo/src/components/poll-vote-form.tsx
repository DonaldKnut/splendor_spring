"use client";

import { useState, useTransition } from "react";
import { castPollVote } from "@/lib/actions/engagement";
import { Alert, Button } from "@/components/ui";

export function PollVoteForm({
  pollId,
  allowMultiple,
  options,
}: {
  pollId: string;
  allowMultiple: boolean;
  options: Array<{ id: string; label: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null,
  );

  function toggle(id: string) {
    setSelected((prev) => {
      if (allowMultiple) {
        return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      }
      return [id];
    });
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          try {
            await castPollVote({ pollId, optionIds: selected });
            setMessage({ tone: "success", text: "Thanks — your vote was recorded." });
          } catch (err) {
            setMessage({
              tone: "error",
              text: err instanceof Error ? err.message : "Could not submit vote",
            });
          }
        });
      }}
    >
      <ul className="space-y-2">
        {options.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <li key={opt.id}>
              <button
                type="button"
                onClick={() => toggle(opt.id)}
                className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition"
                style={{
                  borderColor: active ? "#2f8f8a" : "var(--ngo-line)",
                  background: active ? "rgba(47,143,138,0.08)" : "white",
                }}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px]"
                  style={{
                    borderColor: active ? "#2f8f8a" : "#c5cdd4",
                    background: active ? "#2f8f8a" : "transparent",
                    color: "white",
                  }}
                >
                  {active ? "✓" : ""}
                </span>
                {opt.label}
              </button>
            </li>
          );
        })}
      </ul>
      {message ? <Alert tone={message.tone}>{message.text}</Alert> : null}
      <Button type="submit" disabled={pending || !selected.length}>
        {pending ? "Submitting..." : "Submit vote"}
      </Button>
    </form>
  );
}
