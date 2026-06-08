import { FlaskConical } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

const SPIKE_PATH = buildSpikePath(12, 16, 16, 15, 12.5);

function buildSpikePath(
  spikes: number,
  cx: number,
  cy: number,
  outer: number,
  inner: number,
): string {
  const points: string[] = [];

  for (let index = 0; index < spikes * 2; index += 1) {
    const angle = (Math.PI * index) / spikes - Math.PI / 2;
    const radius = index % 2 === 0 ? outer : inner;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return `M${points.join(" L")} Z`;
}

export function MockModeBadge() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            role="status"
            aria-label="Mock-Modus"
            className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center sm:h-9 sm:w-9"
          >
            <svg
              viewBox="0 0 32 32"
              aria-hidden
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient
                  id="mock-badge-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path
                d={SPIKE_PATH}
                fill="url(#mock-badge-gradient)"
                stroke="url(#mock-badge-gradient)"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
            <FlaskConical className="relative z-10 h-3.5 w-3.5 rotate-[22deg] text-white sm:h-4 sm:w-4" />
          </span>
        }
      />
      <TooltipContent side="bottom">Mock-Modus</TooltipContent>
    </Tooltip>
  );
}
