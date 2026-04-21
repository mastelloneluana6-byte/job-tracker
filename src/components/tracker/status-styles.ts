import type { ApplicationStatus } from "@/generated/prisma/enums";

/** Tailwind class strings per status — keep literals here so the compiler sees them. */
export const STATUS_STATS_TILE: Record<ApplicationStatus, string> = {
  WISHLIST:
    "rounded-xl border border-slate-500/35 bg-slate-500/[0.12] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
  APPLIED:
    "rounded-xl border border-sky-500/40 bg-sky-500/[0.12] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(56,189,248,0.08)]",
  INTERVIEWING:
    "rounded-xl border border-violet-500/40 bg-violet-500/[0.12] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(167,139,250,0.1)]",
  OFFER:
    "rounded-xl border border-emerald-500/45 bg-emerald-500/[0.14] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(52,211,153,0.12)]",
  REJECTED:
    "rounded-xl border border-red-500/40 bg-red-950/[0.35] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(248,113,113,0.06)]",
  WITHDRAWN:
    "rounded-xl border border-zinc-600/40 bg-zinc-800/[0.25] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
};

export const STATUS_STATS_LABEL: Record<ApplicationStatus, string> = {
  WISHLIST: "text-slate-400",
  APPLIED: "text-sky-300/90",
  INTERVIEWING: "text-violet-300/90",
  OFFER: "text-emerald-300/90",
  REJECTED: "text-red-300/85",
  WITHDRAWN: "text-zinc-500",
};

export const STATUS_STATS_NUMBER: Record<ApplicationStatus, string> = {
  WISHLIST: "text-slate-50",
  APPLIED: "text-sky-50",
  INTERVIEWING: "text-violet-50",
  OFFER: "text-emerald-50",
  REJECTED: "text-red-50",
  WITHDRAWN: "text-zinc-200",
};

export const STATUS_CARD_STRIPE: Record<ApplicationStatus, string> = {
  WISHLIST:
    "bg-gradient-to-b from-slate-400 via-slate-500/70 to-transparent",
  APPLIED:
    "bg-gradient-to-b from-sky-400 via-sky-500/75 to-transparent",
  INTERVIEWING:
    "bg-gradient-to-b from-violet-400 via-violet-500/75 to-transparent",
  OFFER:
    "bg-gradient-to-b from-emerald-400 via-emerald-500/80 to-transparent",
  REJECTED:
    "bg-gradient-to-b from-red-400 via-red-600/75 to-transparent",
  WITHDRAWN:
    "bg-gradient-to-b from-zinc-500 via-zinc-600/70 to-transparent",
};

export const STATUS_CARD_HOVER: Record<ApplicationStatus, string> = {
  WISHLIST: "hover:border-slate-500/30 hover:shadow-slate-500/[0.06]",
  APPLIED: "hover:border-sky-500/35 hover:shadow-sky-500/10",
  INTERVIEWING: "hover:border-violet-500/35 hover:shadow-violet-500/10",
  OFFER: "hover:border-emerald-500/40 hover:shadow-emerald-500/12",
  REJECTED: "hover:border-red-500/35 hover:shadow-red-500/10",
  WITHDRAWN: "hover:border-zinc-500/35 hover:shadow-zinc-500/[0.06]",
};

export const STATUS_SELECT: Record<ApplicationStatus, string> = {
  WISHLIST:
    "border-slate-500/35 bg-slate-950/50 text-slate-100 hover:border-slate-400/50 focus:border-slate-400/60 focus:ring-slate-400/20",
  APPLIED:
    "border-sky-500/40 bg-sky-950/40 text-sky-50 hover:border-sky-400/55 focus:border-sky-400/65 focus:ring-sky-400/25",
  INTERVIEWING:
    "border-violet-500/40 bg-violet-950/35 text-violet-50 hover:border-violet-400/55 focus:border-violet-400/65 focus:ring-violet-400/25",
  OFFER:
    "border-emerald-500/45 bg-emerald-950/35 text-emerald-50 hover:border-emerald-400/55 focus:border-emerald-400/65 focus:ring-emerald-400/25",
  REJECTED:
    "border-red-500/40 bg-red-950/45 text-red-50 hover:border-red-400/55 focus:border-red-400/65 focus:ring-red-400/25",
  WITHDRAWN:
    "border-zinc-600/45 bg-zinc-900/60 text-zinc-100 hover:border-zinc-500/55 focus:border-zinc-500/65 focus:ring-zinc-500/20",
};

const SELECT_BASE =
  "w-full cursor-pointer appearance-none rounded-xl border py-2.5 pl-3 pr-10 text-sm outline-none transition focus:ring-2 disabled:opacity-50";

export function statusSelectClassNames(current: ApplicationStatus) {
  return `${SELECT_BASE} ${STATUS_SELECT[current]}`;
}

/** Compact pill on cards for quick scanning. */
export const STATUS_BADGE: Record<ApplicationStatus, string> = {
  WISHLIST:
    "inline-flex rounded-md border border-slate-500/35 bg-slate-500/15 px-2 py-0.5 text-[11px] font-medium text-slate-200",
  APPLIED:
    "inline-flex rounded-md border border-sky-500/40 bg-sky-500/15 px-2 py-0.5 text-[11px] font-medium text-sky-100",
  INTERVIEWING:
    "inline-flex rounded-md border border-violet-500/40 bg-violet-500/15 px-2 py-0.5 text-[11px] font-medium text-violet-100",
  OFFER:
    "inline-flex rounded-md border border-emerald-500/45 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-100",
  REJECTED:
    "inline-flex rounded-md border border-red-500/40 bg-red-950/50 px-2 py-0.5 text-[11px] font-medium text-red-100",
  WITHDRAWN:
    "inline-flex rounded-md border border-zinc-600/45 bg-zinc-800/40 px-2 py-0.5 text-[11px] font-medium text-zinc-300",
};
