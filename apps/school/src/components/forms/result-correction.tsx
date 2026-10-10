"use client";

import { useState, useTransition } from "react";
import { correctPublishedResult } from "@/lib/actions/results";
import { Alert, Button, Input, Label } from "@/components/ui";

export function ResultCorrectionForm({
  resultId,
  caScore,
  examScore,
  teacherComment,
  caMax,
  examMax,
}: {
  resultId: string;
  caScore: number | null;
  examScore: number | null;
  teacherComment: string | null;
  caMax: number;
  examMax: number;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null
  );

  return (
    <form
      className="mt-3 grid gap-2 rounded-md border border-line bg-sand/30 p-3 md:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            await correctPublishedResult({
              resultId,
              caScore: Number(form.get("caScore")),
              examScore: Number(form.get("examScore")),
              teacherComment: String(form.get("teacherComment") ?? "") || null,
              correctionNote: String(form.get("correctionNote") ?? ""),
            });
            setMessage({ tone: "success", text: "Correction saved and audited." });
          } catch (err) {
            setMessage({
              tone: "error",
              text: err instanceof Error ? err.message : "Correction failed",
            });
          }
        });
      }}
    >
      <div>
        <Label htmlFor={`ca_${resultId}`}>CA (/{caMax})</Label>
        <Input
          id={`ca_${resultId}`}
          name="caScore"
          type="number"
          step="0.01"
          min={0}
          max={caMax}
          defaultValue={caScore ?? 0}
          required
        />
      </div>
      <div>
        <Label htmlFor={`exam_${resultId}`}>Exam (/{examMax})</Label>
        <Input
          id={`exam_${resultId}`}
          name="examScore"
          type="number"
          step="0.01"
          min={0}
          max={examMax}
          defaultValue={examScore ?? 0}
          required
        />
      </div>
      <div>
        <Label htmlFor={`comment_${resultId}`}>Teacher comment</Label>
        <Input
          id={`comment_${resultId}`}
          name="teacherComment"
          defaultValue={teacherComment ?? ""}
        />
      </div>
      <div>
        <Label htmlFor={`note_${resultId}`}>Correction note (required)</Label>
        <Input id={`note_${resultId}`} name="correctionNote" required />
      </div>
      <div className="md:col-span-4 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Apply correction"}
        </Button>
        {message ? <Alert tone={message.tone}>{message.text}</Alert> : null}
      </div>
    </form>
  );
}
