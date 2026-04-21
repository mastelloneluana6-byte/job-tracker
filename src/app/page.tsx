import Link from "next/link";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ edit?: string }>;

const cards = [
  {
    title: "Tracker",
    desc: "See every application, status, dates, and listing links in one pipeline.",
    href: "/tracker",
    cta: "Open tracker",
  },
  {
    title: "Job importer",
    desc: "Paste a job board URL, preview what we could read, edit, then save to your board.",
    href: "/import",
    cta: "Import a job",
  },
  {
    title: "Email generator",
    desc: "On each tracker card, generate follow-ups, thank-yous, or cold outreach with tone controls — then copy or mark sent.",
    href: "/tracker",
    cta: "Go to tracker",
  },
] as const;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { edit } = await searchParams;
  if (edit) {
    redirect(`/tracker?edit=${encodeURIComponent(edit)}`);
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#c9a227]/35 bg-[var(--accent-soft)] text-3xl font-bold tracking-tight text-[#d4af37] shadow-lg shadow-[#c9a227]/10"
          aria-hidden
        >
          S
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Scope
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            Your job search, one calm workspace
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
            Scope helps you capture roles from the web, track where you are in
            each process, and draft human-sounding emails when you need them —
            without juggling spreadsheets and browser tabs.
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Where to go next
        </h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-3">
          {cards.map((c) => (
            <li key={c.title}>
              <Link
                href={c.href}
                className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[var(--surface-elevated)] p-6 shadow-lg shadow-black/20 transition hover:border-[#c9a227]/25 hover:shadow-[#c9a227]/5"
              >
                <h3 className="text-lg font-semibold tracking-tight text-zinc-50 group-hover:text-[#f0d78c]">
                  {c.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
                  {c.desc}
                </p>
                <span className="mt-4 text-sm font-semibold text-[#d4af37] underline-offset-4 group-hover:underline">
                  {c.cta} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-2xl border border-white/[0.06] bg-zinc-950/40 px-6 py-8 sm:px-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
          How it flows
        </h2>
        <ol className="mt-6 space-y-4 text-sm text-zinc-400">
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c9a227]/30 text-xs font-bold text-[#d4af37]">
              1
            </span>
            <span>
              <strong className="text-zinc-300">Import or add</strong> a role
              from the Job importer or the tracker sidebar form.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c9a227]/30 text-xs font-bold text-[#d4af37]">
              2
            </span>
            <span>
              <strong className="text-zinc-300">Track progress</strong> with
              statuses from wishlist to offer — everything stays in your
              database.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c9a227]/30 text-xs font-bold text-[#d4af37]">
              3
            </span>
            <span>
              <strong className="text-zinc-300">Generate email</strong> from any
              card when you want a draft; copy it into your mail client or mark
              it sent for your own records.
            </span>
          </li>
        </ol>
      </section>
    </main>
  );
}
