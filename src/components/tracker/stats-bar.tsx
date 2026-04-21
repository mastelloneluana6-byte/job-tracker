import type { ApplicationStatus } from "@/generated/prisma/enums";
import { STATUS_LABELS, STATUS_ORDER } from "./status-labels";
import {
  STATUS_STATS_LABEL,
  STATUS_STATS_NUMBER,
  STATUS_STATS_TILE,
} from "./status-styles";

type Counts = Record<ApplicationStatus, number>;

const initialCounts = (): Counts => ({
  WISHLIST: 0,
  APPLIED: 0,
  INTERVIEWING: 0,
  OFFER: 0,
  REJECTED: 0,
  WITHDRAWN: 0,
});

type Props = { statuses: ApplicationStatus[] };

export function StatsBar({ statuses }: Props) {
  const counts = statuses.reduce((acc, s) => {
    acc[s] += 1;
    return acc;
  }, initialCounts());

  const active =
    counts.APPLIED + counts.INTERVIEWING + counts.WISHLIST + counts.OFFER;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[var(--surface)] p-5 shadow-xl shadow-black/30">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Pipeline
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            {active}{" "}
            <span className="text-base font-normal text-zinc-500">active</span>
          </p>
        </div>
        <p className="text-right text-xs text-zinc-500">
          {statuses.length} total
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {STATUS_ORDER.map((key) => (
          <div key={key} className={STATUS_STATS_TILE[key]}>
            <p
              className={`text-[10px] font-medium uppercase tracking-wider ${STATUS_STATS_LABEL[key]}`}
            >
              {STATUS_LABELS[key]}
            </p>
            <p
              className={`mt-0.5 text-lg font-semibold tabular-nums ${STATUS_STATS_NUMBER[key]}`}
            >
              {counts[key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
