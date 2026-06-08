import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { countWords, getAnswerPlaceholder } from "../domain/session";
import { ShortcutActionButton } from "./ShortcutActionButton";
import { QuestionProgressBlock } from "./QuestionProgress";
import { SolutionControl } from "./SolutionControl";

type AnswerPanelProps = {
  value: string;
  disabled: boolean;
  roundEnded?: boolean;
  readRemaining?: number;
  writeRemaining?: number;
  readSeconds?: number;
  writeSeconds?: number;
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
  writeRemaining = 0,
  readSeconds = 0,
  writeSeconds = 0,
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
  const hasAnswer = value.trim().length > 0;
  const placeholder = getAnswerPlaceholder({ roundEnded, readRemaining });
  const revealCount = solutionReveals ?? 0;
  const showSolutionControl =
    Boolean(onSolutionRequest) && solutionAllowed;
  const showToolbar = onNext || showSolutionControl;
  const showProgress = totalQuestions > 0 && questionNumber !== undefined;
  const wordCount = countWords(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (disabled) return;

    const frame = window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [disabled, questionNumber]);

  return (
    <div className="w-full">
      {showProgress ? (
        <QuestionProgressBlock
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          wordCount={wordCount}
          roundEnded={roundEnded}
          readRemaining={readRemaining}
          writeRemaining={writeRemaining}
          readSeconds={readSeconds}
          writeSeconds={writeSeconds}
        />
      ) : (
        <div className="mb-2 flex justify-end">
          <span className="text-[11px] tabular-nums text-neutral-600">
            {wordCount} Woerter
          </span>
        </div>
      )}
      <div className="w-full overflow-hidden rounded-3xl border border-neutral-800/90 bg-neutral-900/50 shadow-sm">
        <textarea
          ref={textareaRef}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (
              event.metaKey &&
              (event.key === "Enter" ||
                event.key === "." ||
                event.key === "/")
            ) {
              event.preventDefault();
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
                  resetDep={questionNumber}
                  onRequest={onSolutionRequest!}
                />
              )}
            </div>

            {onNext && (
              <ShortcutActionButton
                label={nextLabel}
                onAction={onNext}
                disabled={nextDisabled}
                resetDep={questionNumber}
                allowInEditable
                icon={<ArrowRight className="h-4 w-4 shrink-0" />}
                chipVariant={hasAnswer ? "light" : "dark"}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                  hasAnswer
                    ? "bg-neutral-100 text-neutral-950 hover:bg-neutral-300 disabled:border-transparent disabled:bg-neutral-800 disabled:text-neutral-600"
                    : "bg-transparent text-neutral-500 hover:text-neutral-200 disabled:bg-transparent disabled:text-neutral-600"
                }`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
