import { ArrowRight } from "lucide-react";
import type { Question } from "../domain/payload";
import { isChoiceQuestion } from "../domain/choice";
import { countWords } from "../domain/session";
import { AnswerEditor } from "./AnswerEditor";
import { ChoiceList } from "./ChoiceList";
import { ShortcutActionButton } from "./ShortcutActionButton";
import { QuestionProgressBlock } from "./QuestionProgress";
import { SolutionControl } from "./SolutionControl";
import { useI18n } from "../i18n";

type AnswerPanelProps = {
  question?: Question | null;
  value: string;
  disabled: boolean;
  layout?: "stacked" | "split";
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
  question,
  value,
  disabled,
  layout = "stacked",
  roundEnded = false,
  readRemaining = 0,
  writeRemaining = 0,
  readSeconds = 0,
  writeSeconds = 0,
  onChange,
  nextLabel = "Nächste Frage",
  nextDisabled = true,
  onNext,
  solutionAllowed = false,
  solutionButtonDisabled = true,
  solutionSeconds = 15,
  solutionVisible = false,
  solutionReveals = null,
  solutionRevealsMax = 1,
  onSolutionRequest,
  questionNumber,
  totalQuestions = 0,
}: AnswerPanelProps) {
  const { t } = useI18n();
  const hasAnswer = value.trim().length > 0;
  const choiceMode = isChoiceQuestion(question);
  const placeholder = roundEnded
    ? t("answer.placeholder.done")
    : readRemaining > 0
      ? t("answer.placeholder.read")
      : t("answer.placeholder.write");
  const revealCount = solutionReveals ?? 0;
  const showSolutionControl =
    Boolean(onSolutionRequest) && solutionAllowed;
  const showToolbar = onNext || showSolutionControl;
  const showProgress = totalQuestions > 0 && questionNumber !== undefined;
  const wordCount = choiceMode ? undefined : countWords(value);
  const splitLayout = layout === "split";

  return (
    <div className={`w-full ${splitLayout ? "flex min-h-0 flex-1 flex-col" : ""}`}>
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
          <span className="text-[11px] tabular-nums text-neutral-400 dark:text-neutral-600">
            {t("answer.words", { count: wordCount ?? 0 })}
          </span>
        </div>
      )}
      <div
        data-layout={layout}
        className={`answer-panel-frame w-full overflow-hidden rounded-3xl border border-neutral-200/90 dark:border-neutral-800/90 bg-neutral-100/50 dark:bg-neutral-900/50 shadow-sm ${splitLayout ? "flex min-h-0 flex-1 flex-col" : ""}`}
      >
        {choiceMode && question ? (
          <ChoiceList
            question={question}
            value={value}
            disabled={disabled}
            revealed={roundEnded || solutionVisible}
            onChange={onChange}
          />
        ) : (
          <AnswerEditor
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            questionNumber={questionNumber}
            fillHeight={splitLayout}
            onChange={onChange}
          />
        )}

        {showToolbar && (
          <div className="answer-panel-toolbar flex flex-col gap-2 px-3 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
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
                className={`inline-flex shrink-0 items-center gap-2 self-end rounded-full px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed sm:self-auto ${
                  hasAnswer
                    ? "bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-950 hover:bg-neutral-700 dark:hover:bg-neutral-300 disabled:border-transparent disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-600"
                    : "bg-transparent text-neutral-500 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 disabled:bg-transparent disabled:text-neutral-400 dark:disabled:text-neutral-600"
                }`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
