"use client";

import { useState } from "react";
import { QuickAddModal } from "./quick-add-modal";

type Props = {
  /** Extra Tailwind classes for the trigger (e.g. `w-full` in the sidebar). */
  className?: string;
};

export function QuickAddLauncher({ className = "" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-[#d4af37] to-[#9a7b1a] px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-[#c9a227]/20 transition hover:brightness-110 active:scale-[0.99] sm:px-5 ${className}`}
      >
        Quick add job
      </button>
      {open && <QuickAddModal onClose={() => setOpen(false)} />}
    </>
  );
}
