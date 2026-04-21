import Link from "next/link";
import type { JobApplicationModel } from "@/generated/prisma/models";
import { DeleteButton } from "./delete-button";
import { StatusSelect } from "./status-select";
import { STATUS_LABELS } from "./status-labels";
import {
  STATUS_BADGE,
  STATUS_CARD_HOVER,
  STATUS_CARD_STRIPE,
} from "./status-styles";

type Props = { application: JobApplicationModel };

function formatDate(d: Date | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function ApplicationCard({ application }: Props) {
  const applied = formatDate(application.appliedAt);
  const updated = formatDate(application.updatedAt);
  const st = application.status;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] via-zinc-950/40 to-zinc-950/80 p-5 shadow-lg shadow-black/25 transition ${STATUS_CARD_HOVER[st]}`}
    >
      <div
        className={`absolute left-0 top-0 h-full w-1 opacity-80 transition group-hover:opacity-100 ${STATUS_CARD_STRIPE[st]}`}
        aria-hidden
      />

      <div className="flex flex-col gap-4 pl-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-lg font-semibold tracking-tight text-zinc-50">
              {application.roleTitle}
            </p>
            <span className={STATUS_BADGE[st]}>{STATUS_LABELS[st]}</span>
          </div>
          <p className="text-sm font-medium text-zinc-400">{application.company}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-zinc-500">
            {applied && <span>Applied {applied}</span>}
            {updated && (
              <span className="text-zinc-600">Updated {updated}</span>
            )}
          </div>
          {application.jobUrl && (
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block pt-1 text-xs font-medium text-[#d4af37] underline-offset-4 hover:underline"
            >
              View listing →
            </a>
          )}
          {application.notes && (
            <p className="pt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
              {application.notes}
            </p>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-44">
          <StatusSelect
            applicationId={application.id}
            value={application.status}
          />
          <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
            <Link
              href={`/?edit=${application.id}`}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-zinc-200"
            >
              Edit
            </Link>
            <DeleteButton applicationId={application.id} />
          </div>
        </div>
      </div>

      <p className="sr-only">Current status: {STATUS_LABELS[application.status]}</p>
    </article>
  );
}
