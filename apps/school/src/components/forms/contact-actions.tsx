"use client";

import { useTransition } from "react";
import { markContactHandled } from "@/lib/actions/content";
import { Button } from "@/components/ui";

export function ContactActions({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="secondary"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await markContactHandled(id);
        })
      }
    >
      Mark handled
    </Button>
  );
}
