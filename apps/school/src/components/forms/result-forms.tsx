"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { bulkSaveResultDrafts, publishResults } from "@/lib/actions/results";
import { Alert, Button, Input, Label } from "@/components/ui";

type StudentRow = {
  id: string;
  label: string;
  caScore: number | null;
  examScore: number | null;
  status: string | null;
  teacherComment: string;
};

export function ResultEntryForm({
  sessions,
  classes,
  subjects,
  selected,
  students,
  limits,
}: {
  sessions: Array<{ id: string; name: string; terms: Array<{ id: string; name: string }> }>;
  classes: Array<{ id: string; name: string }>;
  subjects: Array<{ id: string; name: string }>;
  selected: {
    sessionId: string;
    termId: string;
    classId: string;
    subjectId: string;
  };
  students: StudentRow[];
  limits: { caMax: number; examMax: number };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const currentSession = sessions.find((s) => s.id === selected.sessionId);

  function navigate(next: Partial<typeof selected>) {
    const q = new URLSearchParams({ ...selected, ...next });
    router.push(`/admin/results?${q.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <div>
          <Label>Session</Label>
          <select
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            value={selected.sessionId}
            onChange={(e) => navigate({ sessionId: e.target.value, termId: "" })}
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Term</Label>
          <select
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            value={selected.termId}
            onChange={(e) => navigate({ termId: e.target.value })}
          >
            {(currentSession?.terms ?? []).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Class</Label>
          <select
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            value={selected.classId}
            onChange={(e) => navigate({ classId: e.target.value })}
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Subject</Label>
          <select
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
            value={selected.subjectId}
            onChange={(e) => navigate({ subjectId: e.target.value })}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const rows = students.map((s) => ({
            studentId: s.id,
            classId: selected.classId,
            subjectId: selected.subjectId,
            sessionId: selected.sessionId,
            termId: selected.termId,
            caScore: Number(form.get(`ca_${s.id}`) ?? 0),
            examScore: Number(form.get(`exam_${s.id}`) ?? 0),
            teacherComment: String(form.get(`comment_${s.id}`) ?? "") || null,
          }));
          startTransition(async () => {
            const res = await bulkSaveResultDrafts(rows);
            setMessage(
              `Saved ${res.savedCount} draft(s). ${res.errors.length ? `Errors: ${res.errors.length}` : ""}`
            );
            router.refresh();
          });
        }}
      >
        {students.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-line bg-sand/40">
                <tr>
                  <th className="px-2 py-2">Student</th>
                  <th className="px-2 py-2">CA (/{limits.caMax})</th>
                  <th className="px-2 py-2">Exam (/{limits.examMax})</th>
                  <th className="px-2 py-2">Comment</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-line/60">
                    <td className="px-2 py-2">{s.label}</td>
                    <td className="px-2 py-2">
                      <Input
                        name={`ca_${s.id}`}
                        type="number"
                        step="0.01"
                        min={0}
                        max={limits.caMax}
                        defaultValue={s.caScore ?? ""}
                        disabled={s.status === "PUBLISHED" || s.status === "CORRECTED"}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <Input
                        name={`exam_${s.id}`}
                        type="number"
                        step="0.01"
                        min={0}
                        max={limits.examMax}
                        defaultValue={s.examScore ?? ""}
                        disabled={s.status === "PUBLISHED" || s.status === "CORRECTED"}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <Input
                        name={`comment_${s.id}`}
                        defaultValue={s.teacherComment}
                        disabled={s.status === "PUBLISHED" || s.status === "CORRECTED"}
                      />
                    </td>
                    <td className="px-2 py-2">{s.status ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-ink/65">
            No enrolled students for this class/session. Enroll students first.
          </p>
        )}
        {message ? <Alert className="mt-3">{message}</Alert> : null}
        <div className="mt-4">
          <Button type="submit" disabled={pending || !students.length}>
            {pending ? "Saving..." : "Save drafts"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function PublishResultsForm({
  sessions,
  classes,
  subjects,
}: {
  sessions: Array<{ id: string; name: string; terms: Array<{ id: string; name: string }> }>;
  classes: Array<{ id: string; name: string }>;
  subjects: Array<{ id: string; name: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState(sessions[0]?.id ?? "");
  const terms = sessions.find((s) => s.id === sessionId)?.terms ?? [];

  return (
    <form
      className="grid gap-3 md:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        startTransition(async () => {
          try {
            const res = await publishResults({
              sessionId: String(form.get("sessionId") ?? ""),
              termId: String(form.get("termId") ?? ""),
              classId: String(form.get("classId") ?? ""),
              subjectId: String(form.get("subjectId") ?? ""),
            });
            setMessage(`Published ${res.published} result(s).`);
          } catch (err) {
            setMessage(err instanceof Error ? err.message : "Publish failed");
          }
        });
      }}
    >
      <div>
        <Label>Session</Label>
        <select
          name="sessionId"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm"
        >
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Term</Label>
        <select name="termId" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm">
          {terms.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Class</Label>
        <select name="classId" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm">
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Subject</Label>
        <select name="subjectId" className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm">
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      {message ? <div className="md:col-span-2"><Alert>{message}</Alert></div> : null}
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Publishing..." : "Publish draft results"}
        </Button>
      </div>
    </form>
  );
}
