export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-zinc-950/40 py-8 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-5 sm:flex-row sm:justify-between sm:px-8">
        <p className="text-center text-xs text-zinc-500 sm:text-left">
          Scope — job search workflow · Next.js, Prisma, PostgreSQL
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
  );
}
