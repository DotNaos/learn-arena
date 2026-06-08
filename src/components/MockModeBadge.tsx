import { FlaskConical } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

const SEAL_PATH = buildSinusSealPath({
  cx: 16,
  cy: 16,
  baseRadius: 11.35,
  amplitude: 1.05,
  waves: 12,
  roundness: 0.5,
});

type SinusSealOptions = {
  cx: number;
  cy: number;
  baseRadius: number;
  amplitude: number;
  waves: number;
  roundness?: number;
  segments?: number;
};

function softenWave(value: number, roundness: number): number {
  if (value === 0) return 0;
  return Math.sign(value) * Math.pow(Math.abs(value), roundness);
}

function buildSinusSealPath({
  cx,
  cy,
  baseRadius,
  amplitude,
  waves,
  roundness = 1,
  segments = 224,
}: SinusSealOptions): string {
  const parts: string[] = [];

  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2 - Math.PI / 2;
    const wave = softenWave(Math.sin(waves * angle), roundness);
    const radius = baseRadius + amplitude * wave;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    parts.push(`${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  parts.push("Z");
  return parts.join(" ");
}

export function MockModeBadge() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            role="status"
            aria-label="Mock-Modus"
            className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-visible sm:h-9 sm:w-9"
          >
            <svg
              viewBox="0 0 32 32"
              aria-hidden
              overflow="visible"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              <defs>
                <linearGradient
                  id="mock-badge-fill"
                  x1="14%"
                  y1="10%"
                  x2="86%"
                  y2="90%"
                >
                  <stop offset="0%" stopColor="#ef4456" />
                  <stop offset="48%" stopColor="#d946a8" />
                  <stop offset="100%" stopColor="#6b4fd4" />
                </linearGradient>
                <filter
                  id="mock-badge-effect"
                  x="-35%"
                  y="-35%"
                  width="170%"
                  height="170%"
                  filterUnits="objectBoundingBox"
                  colorInterpolationFilters="sRGB"
                >
                  <feDropShadow
                    dx="0"
                    dy="1.4"
                    stdDeviation="1.15"
                    floodColor="#000000"
                    floodOpacity="0.48"
                    result="shadowed"
                  />
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.95"
                    numOctaves="4"
                    stitchTiles="stitch"
                    result="noise"
                  />
                  <feColorMatrix
                    in="noise"
                    type="matrix"
                    values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.38 0"
                    result="grain"
                  />
                  <feComposite
                    in="grain"
                    in2="SourceAlpha"
                    operator="in"
                    result="clippedGrain"
                  />
                  <feBlend
                    in="shadowed"
                    in2="clippedGrain"
                    mode="overlay"
                  />
                </filter>
              </defs>
              <path
                d={SEAL_PATH}
                fill="url(#mock-badge-fill)"
                filter="url(#mock-badge-effect)"
              />
            </svg>
            <FlaskConical className="relative z-10 h-3.5 w-3.5 rotate-[22deg] text-stone-50 sm:h-4 sm:w-4" />
          </span>
        }
      />
      <TooltipContent side="bottom">Mock-Modus</TooltipContent>
    </Tooltip>
  );
}
