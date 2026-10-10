"use client";

import { Alert } from "@/components/ui";

export type IssuedCredentials = {
  email: string;
  temporaryPassword: string;
  emailed: boolean;
};

export function CredentialsIssuedAlert({
  creds,
  roleLabel,
}: {
  creds: IssuedCredentials;
  roleLabel: string;
}) {
  return (
    <Alert tone="success">
      <p className="font-semibold">
        {roleLabel} account ready for {creds.email}
      </p>
      <p className="mt-1.5 text-sm">
        Temporary password: <strong className="font-mono tracking-wide">{creds.temporaryPassword}</strong>
      </p>
      <p className="mt-1.5 text-sm">
        {creds.emailed
          ? "A welcome email with these credentials was sent. They must change the password on first login."
          : "Email is not configured — share this temporary password securely. Password change is required on first login."}
      </p>
    </Alert>
  );
}
