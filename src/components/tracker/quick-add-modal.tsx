"use client";

import { JobImportWorkflow } from "./job-import-workflow";

type Props = { onClose: () => void };

export function QuickAddModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2
              id="quick-add-title"
              className="text-base font-semibold tracking-tight text-zinc-50"
            >
              Quick add
            </h2>
            <p className="text-xs text-zinc-500">
              Paste a link or enter basics in seconds
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-zinc-500 transition hover:bg-white/[0.06] hover:text-zinc-300"
          >
            ✕
          </button>
        </div>
        <JobImportWorkflow
          layout="modal"
          statusFieldId="quick-status"
          onClose={onClose}
        />
      </div>
    </div>
  );
}
