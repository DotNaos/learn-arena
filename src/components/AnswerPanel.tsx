import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { countWords, getAnswerPlaceholder } from "../domain/session";
import {
  QuestionProgressBar,
  QuestionProgressHeader,
} from "./QuestionProgress";
import { SolutionControl } from "./SolutionControl";

type AnswerPanelProps = {
  value: string;
  disabled: boolean;
  roundEnded?: boolean;
  readRemaining?: number;
  onChange: (value: string) => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  onNext?: () => void;
  solutionAllowed?: boolean;
  solutionButtonDisabled?: boolean;
  solutionSeconds?: number;
  solutionVisible?: boolean;
  solutionReveals?: number | null;
  solutionRevealsMax?: number;
  onSolutionRequest?: () => void;
  questionNumber?: number;
  totalQuestions?: number;
};

export function AnswerPanel({
  value,
  disabled,
  roundEnded = false,
  readRemaining = 0,
  onChange,
  nextLabel = "Naechste Frage",
  nextDisabled = true,
  onNext,
  solutionAllowed = false,
  solutionButtonDisabled = true,
  solutionSeconds = 10,
  solutionVisible = false,
  solutionReveals = null,
  solutionRevealsMax = 1,
  onSolutionRequest,
  questionNumber,
  totalQuestions = 0,
}: AnswerPanelProps) {
  const [metaHeld, setMetaHeld] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey) setMetaHeld(true);

      if (
        event.key === "Enter" &&
        event.metaKey &&
        onNext &&
        !nextDisabled
      ) {
        event.preventDefault();
        onNext();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Meta" || !event.metaKey) setMetaHeld(false);
    };

    const onBlur = () => setMetaHeld(false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [onNext, nextDisabled]);

  const hasAnswer = value.trim().length > 0;
  const placeholder = getAnswerPlaceholder({ roundEnded, readRemaining });
  const revealCount = solutionReveals ?? 0;
  const showSolutionControl =
    Boolean(onSolutionRequest) && solutionAllowed;
  const showToolbar = onNext || showSolutionControl;
  const showProgress = totalQuestions > 0 && questionNumber !== undefined;
  const wordCount = countWords(value);

  return (
    <div className="w-full">
      {showProgress ? (
        <div className="mb-3">
          <QuestionProgressHeader
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            wordCount={wordCount}
          />
          <QuestionProgressBar
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
          />
        </div>
      ) : (
        <div className="mb-2 flex justify-end">
          <span className="text-[11px] tabular-nums text-neutral-600">
            {wordCount} Woerter
          </span>
        </div>
      )}
      <div className="w-full overflow-hidden rounded-3xl border border-neutral-800/90 bg-neutral-900/50 shadow-sm">
        <textarea
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              event.metaKey &&
              onNext &&
              !nextDisabled
            ) {
              event.preventDefault();
              onNext();
            }
          }}
          className="block h-20 w-full resize-none bg-transparent px-4 pt-4 pb-1 text-sm leading-relaxed text-neutral-100 outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-60 sm:h-24 sm:text-base"
          placeholder={placeholder}
        />

        {showToolbar && (
          <div className="flex items-center justify-between gap-3 px-3 pb-3">
            <div className="min-w-0">
              {showSolutionControl && (
                <SolutionControl
                  solutionSeconds={solutionSeconds}
                  solutionVisible={solutionVisible}
                  roundEnded={roundEnded}
                  disabled={solutionButtonDisabled}
                  remaining={revealCount}
                  max={solutionRevealsMax}
                  onRequest={onSolutionRequest!}
                />
              )}
            </div>

            {onNext && (
              <button
                type="button"
                disabled={nextDisabled}
                onClick={onNext}
                aria-label={nextLabel}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:border-transparent disabled:bg-neutral-800 disabled:text-neutral-600 ${
                  hasAnswer
                    ? "bg-neutral-100 text-neutral-950 hover:bg-neutral-300"
                    : "bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
                }`}
              >
                <span className="relative inline-flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      metaHeld ? "text-transparent" : "opacity-100"
                    }`}
                  >
                    {nextLabel}
                  </span>
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-1 text-sm font-medium ${
                      metaHeld ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span>⌘</span>
                    <span className="font-normal opacity-50">+</span>
                    <span>↵</span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
