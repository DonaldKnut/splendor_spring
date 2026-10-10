"use client";

import { useState, useTransition } from "react";
import { resetUserPassword, setUserStatus } from "@/lib/actions/users";
import { Alert, Button } from "@/components/ui";
import {
  CredentialsIssuedAlert,
  type IssuedCredentials,
} from "@/components/forms/credentials-issued";

export function StudentActions({
  userId,
  status,
}: {
  userId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [creds, setCreds] = useState<IssuedCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                setError(null);
                setCreds(null);
                const next = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                await setUserStatus(userId, next);
                setMessage(`Account set to ${next}.`);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to update status.");
              }
            })
          }
        >
          {status === "ACTIVE" ? "Deactivate account" : "Activate account"}
        </Button>
        <Button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                setError(null);
                setMessage(null);
                const res = await resetUserPassword(userId);
                setCreds({
                  email: res.email,
                  temporaryPassword: res.temporaryPassword,
                  emailed: res.emailed,
                });
              } catch (err) {
                setError(
                  err instanceof Error ? err.message : "Could not resend credentials."
                );
              }
            })
          }
        >
          {pending ? "Sending..." : "Resend credentials"}
        </Button>
      </div>
      {error ? <Alert tone="error">{error}</Alert> : null}
      {message ? <Alert tone="success">{message}</Alert> : null}
      {creds ? <CredentialsIssuedAlert creds={creds} roleLabel="Student" /> : null}
    </div>
  );
}
