import Link from "next/link";
import type { JobApplicationModel } from "@/generated/prisma/models";
import { updateApplication } from "@/app/actions";
import { STATUS_LABELS, STATUS_ORDER } from "./status-labels";

type Props = { application: JobApplicationModel };

function dateInputValue(d: Date | null) {
  if (!d) return "";
  const iso = d.toISOString();
  return iso.slice(0, 10);
}

export function EditApplicationOverlay({ application }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <Link
        href="/"
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        aria-label="Close editor"
      />
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-2xl shadow-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-dialog-title"
      >
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h2
            id="edit-dialog-title"
            className="text-base font-semibold tracking-tight text-zinc-50"
          >
            Edit application
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {application.company} · {application.roleTitle}
          </p>
        </div>

        <form action={updateApplication} className="space-y-4 px-6 py-5">
          <input type="hidden" name="id" value={application.id} />

          <div>
            <label
              htmlFor="edit-company"
              className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
            >
              Company
            </label>
            <input
              id="edit-company"
              name="company"
              required
              defaultValue={application.company}
              className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
            />
          </div>
          <div>
            <label
              htmlFor="edit-roleTitle"
              className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
            >
              Role
            </label>
            <input
              id="edit-roleTitle"
              name="roleTitle"
              required
              defaultValue={application.roleTitle}
              className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
            />
          </div>
          <div>
            <label
              htmlFor="edit-jobUrl"
              className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
            >
              Listing URL
            </label>
            <input
              id="edit-jobUrl"
              name="jobUrl"
              type="url"
              defaultValue={application.jobUrl ?? ""}
              className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-status"
                className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
              >
                Status
              </label>
              <select
                id="edit-status"
                name="status"
                defaultValue={application.status}
                className="mt-1.5 w-full cursor-pointer rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="edit-appliedAt"
                className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
              >
                Applied on
              </label>
              <input
                id="edit-appliedAt"
                name="appliedAt"
                type="date"
                defaultValue={dateInputValue(application.appliedAt)}
                className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="edit-notes"
              className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
            >
              Notes
            </label>
            <textarea
              id="edit-notes"
              name="notes"
              rows={4}
              defaultValue={application.notes ?? ""}
              className="mt-1.5 w-full resize-none rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
            />
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-white/[0.06] pt-5 sm:flex-row sm:justify-end">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/[0.1] px-5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.05]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-b from-[#d4af37] to-[#9a7b1a] px-6 text-sm font-semibold text-zinc-950 shadow-lg shadow-[#c9a227]/15 transition hover:brightness-110"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
