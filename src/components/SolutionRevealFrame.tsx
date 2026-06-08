import { useEffect, type ReactNode } from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "motion/react";
import { RING_CIRCUMFERENCE } from "../domain/session";

const MAX_DISPLAY_SECONDS = 60;

function formatSolutionSeconds(seconds: number): string {
  return Math.max(0, seconds).toString().padStart(2, "0");
}

function getCappedDuration(totalSeconds: number): number {
  return Math.min(Math.max(totalSeconds, 1), MAX_DISPLAY_SECONDS);
}

type SolutionRevealFrameProps = {
  active: boolean;
  totalSeconds: number;
  remaining: number;
  reducedMotion: boolean | null;
  children: ReactNode;
};

export function SolutionRevealFrame({
  active,
  totalSeconds,
  remaining,
  reducedMotion,
  children,
}: SolutionRevealFrameProps) {
  const cappedDuration = getCappedDuration(totalSeconds);
  const progress = useMotionValue(1);
  const displayRemaining = Math.min(Math.max(remaining, 0), cappedDuration);

  useEffect(() => {
    if (!active) {
      progress.set(1);
      return;
    }

    if (reducedMotion) {
      progress.set(displayRemaining / cappedDuration);
      return;
    }

    progress.set(1);
    const controls = animate(progress, 0, {
      duration: cappedDuration,
      ease: "linear",
    });

    return () => controls.stop();
  }, [active, cappedDuration, progress, reducedMotion]);

  useEffect(() => {
    if (!active || !reducedMotion) return;
    progress.set(displayRemaining / cappedDuration);
  }, [active, cappedDuration, displayRemaining, progress, reducedMotion]);

  const colorA = useTransform(
    progress,
    [0, 0.5, 1],
    [
      "rgba(239, 68, 68, 0.38)",
      "rgba(249, 115, 22, 0.42)",
      "rgba(34, 211, 238, 0.45)",
    ],
  );
  const colorB = useTransform(
    progress,
    [0, 0.5, 1],
    [
      "rgba(220, 38, 38, 0.38)",
      "rgba(251, 146, 60, 0.42)",
      "rgba(34, 197, 94, 0.45)",
    ],
  );
  const background = useMotionTemplate`linear-gradient(135deg, ${colorA}, ${colorB})`;
  const frameShadow = useTransform(
    progress,
    [0, 0.5, 1],
    [
      "0 4px 20px rgb(0 0 0 / 0.32), 0 0 16px rgb(239 68 68 / 0.12)",
      "0 4px 20px rgb(0 0 0 / 0.32), 0 0 16px rgb(249 115 22 / 0.11)",
      "0 4px 20px rgb(0 0 0 / 0.32), 0 0 16px rgb(34 211 238 / 0.12)",
    ],
  );
  const ringOffset = useTransform(progress, (value) => RING_CIRCUMFERENCE * (1 - value));
  const ringColor = useTransform(
    progress,
    [0, 0.5, 1],
    [
      "rgba(248, 113, 113, 0.75)",
      "rgba(251, 146, 60, 0.75)",
      "rgba(52, 211, 153, 0.75)",
    ],
  );

  return (
    <motion.div
      className="solution-reveal-frame"
      style={{ background, boxShadow: frameShadow }}
    >
      <div className="solution-reveal-inner">
        <div
          className="solution-reveal-timer"
          aria-label={`${formatSolutionSeconds(displayRemaining)} Sekunden verbleibend`}
        >
          <svg
            className="solution-reveal-timer-ring"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-neutral-800"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              style={{ stroke: ringColor, strokeDashoffset: ringOffset }}
            />
          </svg>
          <span className="solution-reveal-timer-label">
            {formatSolutionSeconds(displayRemaining)}
          </span>
        </div>
        {children}
      </div>
    </motion.div>
  );
}
