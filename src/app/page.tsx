import { getPrisma } from "@/lib/prisma";
import { ApplicationCard } from "@/components/tracker/application-card";
import { DbErrorPanel } from "@/components/tracker/db-error-panel";
import { EditApplicationOverlay } from "@/components/tracker/edit-application-overlay";
import { NewApplicationForm } from "@/components/tracker/new-application-form";
import { QuickAddLauncher } from "@/components/tracker/quick-add-launcher";
import { StatsBar } from "@/components/tracker/stats-bar";
import type { JobApplicationModel } from "@/generated/prisma/models";

type SearchParams = Promise<{ edit?: string }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { edit } = await searchParams;

  let applications: JobApplicationModel[] = [];
  let editing: JobApplicationModel | null = null;
  let loadError: string | null = null;

  try {
    const db = getPrisma();
    [applications, editing] = await Promise.all([
      db.jobApplication.findMany({
        orderBy: { updatedAt: "desc" },
      }),
      edit
        ? db.jobApplication.findUnique({ where: { id: edit } })
        : Promise.resolve(null),
    ]);
  } catch (err) {
    loadError =
      err instanceof Error ? err.message : "Unknown error while loading data.";
  }

  const statusList = applications.map((a) => a.status);

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <header className="border-b border-white/[0.06] bg-zinc-950/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c9a227]/30 bg-[var(--accent-soft)] text-sm font-bold tracking-tight text-[#d4af37]"
              aria-hidden
            >
              S
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
                Scope
              </p>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-50 sm:text-xl">
                Application tracker
              </h1>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                Import listings · generate outreach
              </p>
            </div>
          </div>
          <QuickAddLauncher />
        </div>
      </header>

      {loadError ? (
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 py-12 sm:px-8">
          <DbErrorPanel message={loadError} />
        </main>
      ) : (
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-5 py-10 sm:px-8 lg:flex-row lg:gap-12">
        <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-8 lg:max-w-sm lg:self-start">
          <div className="rounded-2xl border border-white/[0.08] bg-[var(--surface-elevated)] p-5 shadow-xl shadow-black/30">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
              Import or quick add
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Paste a job URL — we pull title, company, and location when we can. You can edit before saving.
            </p>
            <div className="mt-4">
              <QuickAddLauncher className="w-full" />
            </div>
          </div>
          <StatsBar statuses={statusList} />
          <NewApplicationForm />
        </aside>

        <section className="min-w-0 flex-1">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Applications
              </h2>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
                Your pipeline
              </p>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[var(--surface)] px-8 py-16 text-center">
              <p className="text-sm font-medium text-zinc-300">
                No jobs yet — add your first role
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
                Use <strong className="text-zinc-400">Quick add job</strong> in the sidebar or header, or fill the form below.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {applications.map((app) => (
                <li key={app.id}>
                  <ApplicationCard application={app} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      )}

      <footer className="mt-auto border-t border-white/[0.06] bg-zinc-950/40 py-8 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-5 sm:flex-row sm:justify-between sm:px-8">
          <p className="text-center text-xs text-zinc-500 sm:text-left">
            Scope — job tracker · Next.js, Prisma, PostgreSQL
          </p>
          <a
            href="https://github.com/mastelloneluana6-byte/job-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold tracking-wide text-[#d4af37] underline-offset-4 transition hover:text-[#f0d78c] hover:underline"
          >
            View source on GitHub
          </a>
        </div>
      </footer>

      {editing && <EditApplicationOverlay application={editing} />}
    </div>
  );
}
