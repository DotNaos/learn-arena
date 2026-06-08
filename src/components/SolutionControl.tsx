import { Lightbulb } from "lucide-react";
import { CHORD_META_DOT } from "../hooks/keyboardChords";
import { getRevealBadgeClass } from "../domain/session";
import { ShortcutActionButton } from "./ShortcutActionButton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

type SolutionControlProps = {
  solutionSeconds: number;
  solutionVisible: boolean;
  roundEnded?: boolean;
  disabled: boolean;
  remaining: number;
  max: number;
  resetDep?: unknown;
  onRequest: () => void;
};

function getSolutionTooltip(
  solutionSeconds: number,
  solutionVisible: boolean,
  roundEnded: boolean,
  remaining: number,
  max: number,
): string {
  if (solutionVisible) return "Loesung wird angezeigt";
  if (roundEnded) return "Antwortzeit abgelaufen";
  if (remaining <= 0) return "Keine Reveals mehr uebrig";
  return `Loesung ${solutionSeconds}s anzeigen (${remaining}/${max})`;
}

export function SolutionControl({
  solutionSeconds,
  solutionVisible,
  roundEnded = false,
  disabled,
  remaining,
  max,
  resetDep,
  onRequest,
}: SolutionControlProps) {
  if (max <= 0) return null;

  const tooltip = getSolutionTooltip(
    solutionSeconds,
    solutionVisible,
    roundEnded,
    remaining,
    max,
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ShortcutActionButton
            label="Loesung"
            onAction={onRequest}
            chord={CHORD_META_DOT}
            disabled={disabled}
            allowInEditable
            resetDep={resetDep}
            ariaLabel={tooltip}
            labelClassName="text-xs font-medium text-neutral-400"
            icon={
              <Lightbulb
                className={`h-4 w-4 shrink-0 ${
                  solutionVisible ? "text-indigo-300/90" : "text-neutral-400"
                }`}
              />
            }
            suffix={
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${getRevealBadgeClass(remaining)}`}
              >
                {remaining}
              </span>
            }
            className="inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-neutral-500 transition-colors hover:bg-neutral-800/80 hover:text-neutral-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          />
        }
      />
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  );
}
