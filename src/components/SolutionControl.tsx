import { Lightbulb } from "lucide-react";
import { getRevealBarClass, getRevealWarningClass } from "../domain/session";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

type SolutionControlProps = {
  solutionSeconds: number;
  solutionVisible: boolean;
  disabled: boolean;
  remaining: number;
  max: number;
  onRequest: () => void;
};

function getSolutionTooltip(
  solutionSeconds: number,
  solutionVisible: boolean,
  remaining: number,
): string {
  if (solutionVisible) return "Loesung wird angezeigt";
  if (remaining <= 0) return "Keine Reveals mehr uebrig";
  return `Loesung ${solutionSeconds}s anzeigen`;
}

export function SolutionControl({
  solutionSeconds,
  solutionVisible,
  disabled,
  remaining,
  max,
  onRequest,
}: SolutionControlProps) {
  if (max <= 0) return null;

  const ratio = Math.max(0, Math.min(1, remaining / max));
  const tooltip = getSolutionTooltip(solutionSeconds, solutionVisible, remaining);

  const controlButton = (
    <button
      type="button"
      disabled={disabled}
      onClick={onRequest}
      aria-label={tooltip}
      className="inline-flex w-fit shrink-0 flex-col overflow-hidden rounded-lg bg-neutral-900/70 text-left transition-colors hover:bg-neutral-800/80 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-neutral-900/70"
    >
      <span className="flex items-center gap-1.5 px-1.5 py-1">
        <Lightbulb
          className={`h-3.5 w-3.5 shrink-0 text-neutral-400 ${solutionVisible ? "text-indigo-400/80" : ""}`}
        />
        <span
          className={`text-[10px] font-medium leading-none tabular-nums sm:text-xs ${getRevealWarningClass(remaining)}`}
        >
          {remaining}/{max}
        </span>
      </span>

      <span className="block h-0.5 w-full bg-neutral-800/90" aria-hidden>
        <span
          className={`block h-full transition-[width] duration-300 ${getRevealBarClass(remaining)}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </span>
    </button>
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="inline-flex w-fit shrink-0">{controlButton}</span>
        }
      />
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  );
}
