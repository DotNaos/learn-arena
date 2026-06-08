import { Lightbulb } from "lucide-react";
import { formatTime } from "../domain/session";

type SolutionPanelProps = {
  title: string;
  parts: string[];
  remaining: number;
  visible: boolean;
};

const revealTransition =
  "grid transition-[grid-template-rows] duration-700 ease-in-out motion-reduce:transition-none";

const revealOpacityVisible =
  "opacity-100 transition-opacity duration-500 ease-out motion-reduce:transition-none";

const revealOpacityHidden =
  "opacity-0 transition-opacity duration-700 ease-in motion-reduce:transition-none";

export function SolutionPanel({
  title,
  parts,
  remaining,
  visible,
}: SolutionPanelProps) {
  return (
    <div
      className={`${revealTransition} w-full shrink-0 ${visible ? `grid-rows-[1fr] ${revealOpacityVisible}` : `grid-rows-[0fr] ${revealOpacityHidden} pointer-events-none`}`}
      aria-hidden={!visible}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="solution-reveal-frame">
          <div className="solution-reveal-inner px-3 py-2.5">
            <div className="mb-1.5 flex items-center gap-2 text-xs text-neutral-400">
              <Lightbulb className="h-3.5 w-3.5 shrink-0 text-indigo-300/90" />
              <span className="truncate font-medium text-neutral-200">
                {title}
              </span>
              <span className="ml-auto shrink-0 font-mono tabular-nums text-neutral-400">
                {formatTime(remaining)}
              </span>
            </div>
            <div className="space-y-1 text-sm leading-relaxed text-neutral-100">
              {parts.map((part, index) => (
                <p key={`${index}-${part}`}>{part}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
