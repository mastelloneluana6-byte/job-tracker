import { createApplication } from "@/app/actions";
import { STATUS_LABELS, STATUS_ORDER } from "./status-labels";

export function NewApplicationForm() {
  return (
    <form
      action={createApplication}
      className="rounded-2xl border border-white/[0.08] bg-[var(--surface-elevated)] p-6 shadow-xl shadow-black/30"
    >
      <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
        New application
      </h2>
      <p className="mt-1 text-xs text-zinc-500">
        Capture the role before the details fade.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="company"
            className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
          >
            Company
          </label>
          <input
            id="company"
            name="company"
            required
            placeholder="Acme Inc."
            className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
          />
        </div>
        <div>
          <label
            htmlFor="roleTitle"
            className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
          >
            Role
          </label>
          <input
            id="roleTitle"
            name="roleTitle"
            required
            placeholder="Senior Product Engineer"
            className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
          />
        </div>
        <div>
          <label
            htmlFor="jobUrl"
            className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
          >
            Listing URL
          </label>
          <input
            id="jobUrl"
            name="jobUrl"
            type="url"
            placeholder="https://…"
            className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
          />
        </div>
        <details className="rounded-xl border border-white/[0.06] bg-zinc-950/30 px-3.5 py-2">
          <summary className="cursor-pointer text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Optional details
          </summary>
          <div className="mt-3 space-y-4 pb-1">
            <div>
              <label
                htmlFor="location"
                className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
              >
                Location
              </label>
              <input
                id="location"
                name="location"
                placeholder="City, remote…"
                className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
              />
            </div>
            <div>
              <label
                htmlFor="recruiterName"
                className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
              >
                Recruiter name
              </label>
              <input
                id="recruiterName"
                name="recruiterName"
                placeholder="For outreach emails"
                className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
              >
                Description snippet
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Paste from listing if you like"
                className="mt-1.5 w-full resize-none rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
              />
            </div>
          </div>
        </details>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="status"
              className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue="APPLIED"
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
              htmlFor="appliedAt"
              className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
            >
              Applied on
            </label>
            <input
              id="appliedAt"
              name="appliedAt"
              type="date"
              className="mt-1.5 w-full rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="notes"
            className="text-[11px] font-medium uppercase tracking-wider text-zinc-500"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Recruiter name, stack, comp range…"
            className="mt-1.5 w-full resize-none rounded-xl border border-white/[0.1] bg-zinc-950/60 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/15"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-gradient-to-b from-[#d4af37] to-[#9a7b1a] py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-[#c9a227]/20 transition hover:brightness-110 active:scale-[0.99]"
      >
        Add to tracker
      </button>
    </form>
  );
}
