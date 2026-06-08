import type { LucideIcon } from "lucide-react";
import { formatTime, getRingColor, RING_CIRCUMFERENCE } from "../domain/session";

type CircularTimerProps = {
  label: string;
  icon: LucideIcon;
  remaining: number;
  total: number;
  compact?: boolean;
  minimal?: boolean;
};

export function CircularTimer({
  label,
  icon: Icon,
  remaining,
  total,
  compact = false,
  minimal = false,
}: CircularTimerProps) {
  const ratio =
    Number.isFinite(total) && total > 0
      ? Math.max(0, Math.min(1, remaining / total))
      : 0;
  const expired = remaining <= 0;
  const dashOffset = RING_CIRCUMFERENCE * (1 - ratio);
  const ringColor =
    Number.isFinite(total) && total > 0 ? getRingColor(ratio) : "#737373";

  if (minimal) {
    return (
      <div
        className="flex items-center gap-1.5 transition-colors duration-300"
        title={expired ? `${label}: abgelaufen` : label}
        aria-label={`${label}: ${formatTime(remaining)}${expired ? " (abgelaufen)" : ""}`}
      >
        <div className="relative h-7 w-7 shrink-0">
          <svg className="h-7 w-7 -rotate-90" viewBox="0 0 100 100" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              className="text-neutral-800"
            />
            {expired ? (
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray="4 6"
                className="text-neutral-600"
              />
            ) : (
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={ringColor}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
              />
            )}
          </svg>
        </div>
        <span
          className={`min-w-[2.65rem] text-sm tabular-nums ${expired ? "font-medium text-neutral-500" : "font-semibold text-neutral-200"}`}
        >
          {formatTime(remaining)}
        </span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative h-9 w-9 shrink-0">
          <svg className="h-9 w-9 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-neutral-800"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={ringColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-neutral-500">
            <Icon className="h-3 w-3" />
            <span className="truncate">{label}</span>
          </div>
          <div className="text-sm font-semibold tabular-nums">
            {formatTime(remaining)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
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
        <div className="absolute inset-0 grid place-items-center text-base font-semibold tabular-nums">
          {formatTime(remaining)}
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-neutral-400">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
    </div>
  );
}
