"use client";

import { useTransition } from "react";
import type { ApplicationStatus } from "@/generated/prisma/enums";
import { setApplicationStatus } from "@/app/actions";
import { STATUS_LABELS, STATUS_ORDER } from "./status-labels";
import { statusSelectClassNames } from "./status-styles";

type Props = {
  applicationId: string;
  value: ApplicationStatus;
};

export function StatusSelect({ applicationId, value }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="relative">
      <select
        aria-label="Application status"
        defaultValue={value}
        disabled={pending}
        key={`${applicationId}-${value}`}
        onChange={(e) => {
          const next = e.target.value as ApplicationStatus;
          startTransition(() => setApplicationStatus(applicationId, next));
        }}
        className={statusSelectClassNames(value)}
      >
        {STATUS_ORDER.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500"
        aria-hidden
      >
        ▼
      </span>
    </div>
  );
}
