"use client";

import { useTransition } from "react";
import { deleteApplication } from "@/app/actions";

type Props = { applicationId: string };

export function DeleteButton({ applicationId }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (
          !confirm(
            "Remove this application from your tracker? This cannot be undone.",
          )
        ) {
          return;
        }
        startTransition(() => deleteApplication(applicationId));
      }}
      className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 transition hover:bg-red-950/40 hover:text-red-300 disabled:opacity-40"
    >
      {pending ? "…" : "Remove"}
    </button>
  );
}
