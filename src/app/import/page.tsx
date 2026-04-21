import Link from "next/link";
import { JobImportWorkflow } from "@/components/tracker/job-import-workflow";

export default function ImportPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
        Job importer
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
        Bring listings into your tracker
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-500">
        Paste a public job URL and we&apos;ll try to read title, company, and
        location from the page. Always double-check the fields — sites differ.
        You can also switch to{" "}
        <strong className="text-zinc-400">Manual</strong> and type a role in
        seconds.
      </p>
      <p className="mt-2 text-sm text-zinc-600">
        After saving you&apos;ll land on the{" "}
        <Link
          href="/tracker"
          className="font-medium text-[#d4af37] underline-offset-2 hover:underline"
        >
          Tracker
        </Link>
        .
      </p>

      <div className="mt-10">
        <JobImportWorkflow layout="page" statusFieldId="import-page-status" />
      </div>
    </main>
  );
}
