import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Lightbulb } from "lucide-react";
import { getMotionTransition } from "../ui/motionPresets";
import { MathText } from "./MathText";
import { SolutionRevealFrame } from "./SolutionRevealFrame";

type SolutionPanelProps = {
  title: string;
  parts: string[];
  remaining: number;
  totalSeconds: number;
  visible: boolean;
};

type SolutionSnapshot = {
  title: string;
  parts: string[];
  remaining: number;
};

export function SolutionPanel({
  title,
  parts,
  remaining,
  totalSeconds,
  visible,
}: SolutionPanelProps) {
  const reduceMotion = useReducedMotion();
  const snapshotRef = useRef<SolutionSnapshot>({
    title,
    parts,
    remaining,
  });

  useEffect(() => {
    if (!visible) return;
    snapshotRef.current = { title, parts, remaining };
  }, [visible, title, parts, remaining]);

  const display = visible
    ? { title, parts, remaining }
    : snapshotRef.current;
  const transition = getMotionTransition(reduceMotion, 0.28);

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {visible ? (
        <motion.div
          key="solution-panel"
          layout
          className="w-full shrink-0 overflow-visible rounded-[1.25rem]"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={transition}
        >
          <SolutionRevealFrame
            active={visible}
            totalSeconds={totalSeconds}
            remaining={display.remaining}
            reducedMotion={reduceMotion}
          >
            <div className="mb-3 flex items-center gap-2 pr-11 text-xs text-neutral-400">
              <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-200/90" />
              <span className="truncate font-medium text-neutral-200">
                {display.title}
              </span>
            </div>
            <div className="space-y-1.5 text-sm leading-relaxed text-neutral-50 sm:text-base">
              {display.parts.map((part, index) => (
                <p
                  key={`${index}-${part}`}
                  className={
                    index === 0 ? "font-semibold text-white" : undefined
                  }
                >
                  <MathText>{part}</MathText>
                </p>
              ))}
            </div>
          </SolutionRevealFrame>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
