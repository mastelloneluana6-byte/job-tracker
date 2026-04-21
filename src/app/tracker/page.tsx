import { getPrisma } from "@/lib/prisma";
import { ApplicationCard } from "@/components/tracker/application-card";
import { DbErrorPanel } from "@/components/tracker/db-error-panel";
import { EditApplicationOverlay } from "@/components/tracker/edit-application-overlay";
import { NewApplicationForm } from "@/components/tracker/new-application-form";
import { StatsBar } from "@/components/tracker/stats-bar";
import type { JobApplicationModel } from "@/generated/prisma/models";

type SearchParams = Promise<{ edit?: string }>;

export default async function TrackerPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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
    <>
      {loadError ? (
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 py-12 sm:px-8">
          <DbErrorPanel message={loadError} />
        </main>
      ) : (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-5 py-10 sm:px-8 lg:flex-row lg:gap-12">
          <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-24 lg:max-w-sm lg:self-start">
            <StatsBar statuses={statusList} />
            <NewApplicationForm />
          </aside>

          <section className="min-w-0 flex-1">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h1 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Tracker
                </h1>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
                  Your pipeline
                </p>
                <p className="mt-2 max-w-xl text-sm text-zinc-500">
                  Move stages, edit details, and use{" "}
                  <span className="text-zinc-400">Generate email</span> on each
                  card for AI drafts.
                </p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[var(--surface)] px-8 py-16 text-center">
                <p className="text-sm font-medium text-zinc-300">
                  No jobs yet — add your first role
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
                  Use <strong className="text-zinc-400">Quick add job</strong> in
                  the menu, the{" "}
                  <a
                    href="/import"
                    className="font-medium text-[#d4af37] underline-offset-2 hover:underline"
                  >
                    Job importer
                  </a>
                  , or the form on the left.
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

      {editing && <EditApplicationOverlay application={editing} />}
    </>
  );
}
