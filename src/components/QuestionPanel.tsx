import { motion, useReducedMotion } from "motion/react";
import type { Payload, Question } from "../domain/payload";
import { getMotionTransition } from "../ui/motionPresets";

type QuestionPanelProps = {
  payload: Payload | null;
  question: Question | null;
  started: boolean;
  finished: boolean;
  questionVisible: boolean;
};

export function QuestionPanel({
  payload,
  question,
  started,
  finished,
  questionVisible,
}: QuestionPanelProps) {
  const reduceMotion = useReducedMotion();
  const locked = !payload || !started || finished;
  const hidden =
    started && !finished && !questionVisible && question !== null;
  const transition = getMotionTransition(reduceMotion, 0.55);

  if (locked) {
    return (
      <p className="text-center text-sm text-neutral-500 dark:text-neutral-500">
        Lade einen Fragensatz. Fragen werden nach dem Start freigeschaltet.
      </p>
    );
  }

  if (!question) return null;

  return (
    <motion.div layout className="w-full text-center">
      <motion.div
        layout
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={
          reduceMotion
            ? { opacity: hidden ? 0.3 : 1, y: 0 }
            : {
                opacity: hidden ? 0.3 : 1,
                y: 0,
                filter: hidden
                  ? "blur(12px) brightness(0.5)"
                  : "blur(0px) brightness(1)",
              }
        }
        transition={transition}
        aria-hidden={hidden}
        className={`space-y-3 px-2 ${hidden ? "pointer-events-none select-none" : ""}`}
      >
        {payload?.task && (
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {payload.task}
          </p>
        )}
        <h2 className="text-balance text-2xl font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
          {question.prompt}
        </h2>
      </motion.div>
    </motion.div>
  );
}
