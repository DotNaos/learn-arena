import { Eye, ListChecks, Timer } from "lucide-react";
import type { Payload, Question } from "../domain/payload";
import type { Settings } from "../domain/payload";
import { AnswerPanel } from "./AnswerPanel";
import { CircularTimer } from "./CircularTimer";
import { QuestionPanel } from "./QuestionPanel";
import { SolutionPanel } from "./SolutionPanel";
import { MockModeBadge } from "./MockModeBadge";
import { WizardProgress } from "./WizardProgress";

type ActiveStepProps = {
  mockMode?: boolean;
  payload: Payload;
  settings: Settings;
  question: Question;
  questionVisible: boolean;
  currentAnswer: string;
  answerDisabled: boolean;
  readRemaining: number;
  writeRemaining: number;
  progressLabel: string;
  solutionReveals: number | null;
  solutionRevealsMax: number;
  solutionTitle: string;
  solutionParts: string[];
  solutionRemaining: number;
  solutionVisible: boolean;
  solutionAllowed: boolean;
  solutionButtonDisabled: boolean;
  message: string;
  nextDisabled: boolean;
  nextLabel: string;
  onAnswerChange: (value: string) => void;
  onNext: () => void;
  onEndTest: () => void;
  onSolution: () => void;
};

export function ActiveStep({
  mockMode = false,
  payload,
  settings,
  question,
  questionVisible,
  currentAnswer,
  answerDisabled,
  readRemaining,
  writeRemaining,
  progressLabel,
  solutionReveals,
  solutionRevealsMax,
  solutionTitle,
  solutionParts,
  solutionRemaining,
  solutionVisible,
  solutionAllowed,
  solutionButtonDisabled,
  message,
  nextDisabled,
  nextLabel,
  onAnswerChange,
  onNext,
  onEndTest,
  onSolution,
}: ActiveStepProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-neutral-950 text-neutral-100">
      <header className="shrink-0 border-b border-neutral-800/80 px-3 py-2 sm:px-5">
        <div className="mb-2 hidden sm:block">
          <WizardProgress current="active" />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="min-w-0 shrink">
            <p className="hidden truncate text-[10px] text-neutral-500 sm:block">
              {payload.topic}
            </p>
            <div className="flex min-w-0 max-w-full items-center gap-1.5 sm:gap-2">
              {mockMode && <MockModeBadge />}
              <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
                {payload.title}
              </h1>
            </div>
          </div>

          <div className="ml-auto flex min-w-0 items-center gap-2 overflow-x-auto sm:gap-3">
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <ListChecks className="h-3.5 w-3.5" />
              <span className="font-semibold tabular-nums text-neutral-200">
                {progressLabel}
              </span>
            </div>

            <CircularTimer
              compact
              label="Sichtbar"
              icon={Eye}
              remaining={readRemaining}
              total={settings.readSeconds}
            />

            <CircularTimer
              compact
              label="Antwort"
              icon={Timer}
              remaining={writeRemaining}
              total={settings.writeSeconds}
            />

          </div>
        </div>
      </header>

      {message && (
        <p className="shrink-0 truncate border-b border-neutral-800/50 px-3 pt-2.5 pb-3 text-xs leading-relaxed text-neutral-500 sm:px-5">
          {message}
        </p>
      )}

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 pt-3 pb-2 sm:px-5 sm:pt-4 sm:pb-3">
        <div className="flex min-h-0 flex-1 flex-col">
          <QuestionPanel
            payload={payload}
            question={question}
            started
            finished={false}
            questionVisible={questionVisible}
            solutionVisible={solutionVisible}
            solutionAllowed={solutionAllowed}
            solutionButtonDisabled={solutionButtonDisabled}
            solutionSeconds={settings.solutionSeconds}
            solutionReveals={solutionReveals}
            solutionRevealsMax={solutionRevealsMax}
            onSolutionRequest={onSolution}
          />

          <SolutionPanel
            title={solutionTitle}
            parts={solutionParts}
            remaining={solutionRemaining}
            visible={solutionVisible}
          />

          <AnswerPanel
            value={currentAnswer}
            disabled={answerDisabled}
            onChange={onAnswerChange}
            nextLabel={nextLabel}
            nextDisabled={nextDisabled}
            onNext={onNext}
            onEndTest={onEndTest}
          />
        </div>
      </main>
    </div>
  );
}
