"use client";

import { useState, useTransition } from "react";
import { resetUserPassword, setUserStatus } from "@/lib/actions/users";
import { Button } from "@/components/ui";
import {
  CredentialsIssuedAlert,
  type IssuedCredentials,
} from "@/components/forms/credentials-issued";

export function ParentRowActions({
  userId,
  status,
}: {
  userId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const [creds, setCreds] = useState<IssuedCredentials | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const next = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
              await setUserStatus(userId, next);
            })
          }
        >
          {status === "ACTIVE" ? "Deactivate" : "Activate"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const res = await resetUserPassword(userId);
              setCreds({
                email: res.email,
                temporaryPassword: res.temporaryPassword,
                emailed: res.emailed,
              });
            })
          }
        >
          Resend
        </Button>
      </div>
      {creds ? <CredentialsIssuedAlert creds={creds} roleLabel="Parent" /> : null}
    </div>
  );
}
