import { prisma } from "@/lib/prisma";
import { ApplicationCard } from "@/components/tracker/application-card";
import { EditApplicationOverlay } from "@/components/tracker/edit-application-overlay";
import { NewApplicationForm } from "@/components/tracker/new-application-form";
import { StatsBar } from "@/components/tracker/stats-bar";

type SearchParams = Promise<{ edit?: string }>;

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { edit } = await searchParams;

  const [applications, editing] = await Promise.all([
    prisma.jobApplication.findMany({
      orderBy: { updatedAt: "desc" },
    }),
    edit
      ? prisma.jobApplication.findUnique({ where: { id: edit } })
      : Promise.resolve(null),
  ]);

  const statusList = applications.map((a) => a.status);

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <header className="border-b border-white/[0.06] bg-zinc-950/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
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
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-5 py-10 sm:px-8 lg:flex-row lg:gap-12">
        <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-8 lg:max-w-sm lg:self-start">
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
                No applications yet
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-500">
                Add your first role on the left. Everything stays on your Neon
                database — private and yours.
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

      {editing && <EditApplicationOverlay application={editing} />}
    </div>
  );
}
