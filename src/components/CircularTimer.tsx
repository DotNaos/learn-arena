import type { LucideIcon } from "lucide-react";
import { formatTime, getRingColor, RING_CIRCUMFERENCE } from "../domain/session";

type CircularTimerProps = {
  label: string;
  icon: LucideIcon;
  remaining: number;
  total: number;
};

export function CircularTimer({
  label,
  icon: Icon,
  remaining,
  total,
}: CircularTimerProps) {
  const ratio =
    Number.isFinite(total) && total > 0
      ? Math.max(0, Math.min(1, remaining / total))
      : 0;
  const dashOffset = RING_CIRCUMFERENCE * (1 - ratio);
  const ringColor =
    Number.isFinite(total) && total > 0 ? getRingColor(ratio) : "#737373";

  return (
    <section className="rounded-2xl bg-neutral-950/70 p-4">
      <div className="mb-3 flex items-center justify-between text-sm text-neutral-400">
        <span>{label}</span>
        <Icon className="h-4 w-4" />
      </div>
      <div className="relative mx-auto h-28 w-28">
        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-neutral-800"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-xl font-semibold tabular-nums">
          {formatTime(remaining)}
        </div>
      </div>
    </section>
  );
}
