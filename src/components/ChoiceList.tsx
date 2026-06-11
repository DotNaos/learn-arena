import { useEffect } from "react";
import { Check, X } from "lucide-react";
import type { Question } from "../domain/payload";
import {
  choiceLetter,
  formatChoiceSelection,
  parseChoiceSelection,
  toggleChoiceSelection,
} from "../domain/choice";
import { MathText } from "./MathText";
import { useI18n } from "../i18n";

type ChoiceListProps = {
  question: Question;
  value: string;
  disabled: boolean;
  revealed: boolean;
  onChange: (value: string) => void;
};

export function ChoiceList({
  question,
  value,
  disabled,
  revealed,
  onChange,
}: ChoiceListProps) {
  const { t } = useI18n();
  const multiple = question.type === "multiple";
  const selected = parseChoiceSelection(value);
  const correct = question.correctChoices;
  const optionCount = question.choices.length;

  useEffect(() => {
    if (disabled) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA")
      ) {
        return;
      }

      const digit = Number(event.key);
      if (Number.isInteger(digit) && digit >= 1 && digit <= optionCount) {
        event.preventDefault();
        const next = toggleChoiceSelection(
          parseChoiceSelection(value),
          digit - 1,
          multiple,
        );
        onChange(formatChoiceSelection(next));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [disabled, multiple, optionCount, onChange, value]);

  const select = (index: number) => {
    if (disabled) return;
    onChange(formatChoiceSelection(toggleChoiceSelection(selected, index, multiple)));
  };

  return (
    <div className="choice-list flex flex-col gap-2 p-3 sm:p-4">
      <p className="px-1 text-[11px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
        {multiple ? t("answer.multiple") : t("answer.chooseOne")}
      </p>
      {question.choices.map((choice, index) => {
        const isSelected = selected.includes(index);
        const isCorrect = correct.includes(index);
        const showCorrect = revealed && isCorrect;
        const showWrong = revealed && isSelected && !isCorrect;

        const stateClass = showCorrect
          ? "border-emerald-500/70 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : showWrong
            ? "border-red-500/70 bg-red-500/10 text-red-700 dark:text-red-300"
            : isSelected
              ? "border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60";

        const indicatorClass = showCorrect
          ? "border-emerald-500/70 text-emerald-600 dark:text-emerald-300"
          : showWrong
            ? "border-red-500/70 text-red-600 dark:text-red-300"
            : isSelected
              ? "border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-950"
              : "border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400";

        return (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => select(index)}
            aria-pressed={isSelected}
            className={`choice-list-option group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed sm:text-base ${stateClass}`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center border text-[11px] font-semibold ${
                multiple ? "rounded-md" : "rounded-full"
              } ${indicatorClass}`}
            >
              {isSelected && !revealed ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                choiceLetter(index)
              )}
            </span>
            <span className="min-w-0 flex-1 break-words">
              <MathText>{choice}</MathText>
            </span>
            {showCorrect && (
              <Check className="h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.5} />
            )}
            {showWrong && (
              <X className="h-4 w-4 shrink-0 text-red-500" strokeWidth={2.5} />
            )}
          </button>
        );
      })}
    </div>
  );
}
