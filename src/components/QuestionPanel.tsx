import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Payload, Question } from "../domain/payload";
import { getMotionTransition } from "../ui/motionPresets";
import { MathText } from "./MathText";

type QuestionPanelProps = {
  payload: Payload | null;
  question: Question | null;
  started: boolean;
  finished: boolean;
  questionVisible: boolean;
};

type FitState = {
  fontSize: number;
  maxHeight: number;
  needsScroll: boolean;
};

const DEFAULT_FIT: FitState = {
  fontSize: 30,
  maxHeight: 260,
  needsScroll: false,
};

function getFitBounds(width: number, height: number) {
  const narrow = width < 640;
  return {
    maxFont: narrow ? 24 : 30,
    minFont: narrow ? 13 : 14,
    maxHeight: Math.max(
      narrow ? 120 : 140,
      Math.min(height * (narrow ? 0.32 : 0.36), narrow ? 260 : 300),
    ),
  };
}

function useQuestionTextFit(prompt: string, task?: string) {
  const blockRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLHeadingElement>(null);
  const [fit, setFit] = useState(DEFAULT_FIT);

  useLayoutEffect(() => {
    const block = blockRef.current;
    const promptEl = promptRef.current;
    if (!block || !promptEl) return;

    let frame = 0;

    const scheduleFit = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const width = block.clientWidth || window.innerWidth;
        const height = window.innerHeight || 720;
        const { maxFont, minFont, maxHeight } = getFitBounds(width, height);

        const originalFontSize = promptEl.style.fontSize;
        const originalLineHeight = promptEl.style.lineHeight;

        const fitsAt = (size: number) => {
          promptEl.style.fontSize = `${size}px`;
          promptEl.style.lineHeight = "1.16";
          const main = block.closest("main");
          return (
            block.scrollHeight <= maxHeight &&
            block.scrollWidth <= block.clientWidth + 1 &&
            (!main || main.scrollHeight <= main.clientHeight + 1)
          );
        };

        let low = minFont;
        let high = maxFont;
        let best = minFont;

        if (fitsAt(maxFont)) {
          best = maxFont;
        } else {
          for (let index = 0; index < 8; index += 1) {
            const mid = (low + high) / 2;
            if (fitsAt(mid)) {
              best = mid;
              low = mid;
            } else {
              high = mid;
            }
          }
        }

        const needsScroll = !fitsAt(minFont);
        promptEl.style.fontSize = originalFontSize;
        promptEl.style.lineHeight = originalLineHeight;

        const next = {
          fontSize: Math.floor(best),
          maxHeight: Math.round(maxHeight),
          needsScroll,
        };
        setFit((current) =>
          current.fontSize === next.fontSize &&
          current.maxHeight === next.maxHeight &&
          current.needsScroll === next.needsScroll
            ? current
            : next,
        );
      });
    };

    const observer = new ResizeObserver(scheduleFit);
    observer.observe(block);
    window.addEventListener("resize", scheduleFit);
    scheduleFit();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", scheduleFit);
    };
  }, [prompt, task]);

  return { blockRef, promptRef, fit };
}

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
  const { blockRef, promptRef, fit } = useQuestionTextFit(
    question?.prompt ?? "",
    payload?.task,
  );

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
        ref={blockRef}
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
        style={{
          maxHeight: fit.needsScroll ? fit.maxHeight : undefined,
          overflowY: fit.needsScroll ? "auto" : undefined,
        }}
        className={`flex flex-col gap-3 px-2 ${hidden ? "pointer-events-none select-none" : ""}`}
      >
        {payload?.task && (
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            <MathText>{payload.task}</MathText>
          </p>
        )}
        <h2
          ref={promptRef}
          style={{ fontSize: fit.fontSize, lineHeight: 1.16 }}
          className="question-prompt text-balance break-words font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
        >
          <MathText>{question.prompt}</MathText>
        </h2>
      </motion.div>
    </motion.div>
  );
}
