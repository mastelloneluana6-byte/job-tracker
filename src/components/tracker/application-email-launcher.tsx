"use client";

import { useState } from "react";
import { EmailGeneratorModal } from "./email-generator-modal";

type Props = {
  applicationId: string;
  company: string;
  roleTitle: string;
  recruiterName: string | null;
  /** Visual variant: full-width rail vs inline next to “View listing”. */
  variant?: "rail" | "inline";
};

export function ApplicationEmailLauncher({
  applicationId,
  company,
  roleTitle,
  recruiterName,
  variant = "rail",
}: Props) {
  const [open, setOpen] = useState(false);

  const rail =
    "w-full rounded-lg border border-white/[0.08] bg-zinc-900/50 py-2 text-xs font-semibold text-zinc-200 transition hover:border-[#c9a227]/35 hover:text-[#f0d78c]";
  const inline =
    "shrink-0 rounded-lg border border-[#c9a227]/35 bg-[#c9a227]/10 px-3 py-1.5 text-xs font-semibold text-[#f0d78c] transition hover:bg-[#c9a227]/20";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={variant === "inline" ? inline : rail}
      >
        Generate email
      </button>
      {open && (
        <EmailGeneratorModal
          applicationId={applicationId}
          company={company}
          roleTitle={roleTitle}
          recruiterName={recruiterName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
