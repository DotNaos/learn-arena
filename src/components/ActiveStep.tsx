import { Eye, Timer } from "lucide-react";
import type { Payload, Question } from "../domain/payload";
import type { Settings } from "../domain/payload";
import { AnswerPanel } from "./AnswerPanel";
import { EndTestButton } from "./EndTestButton";
import { CircularTimer } from "./CircularTimer";
import { QuestionPanel } from "./QuestionPanel";
import { SolutionPanel } from "./SolutionPanel";
import { MockModeBadge } from "./MockModeBadge";

type ActiveStepProps = {
  mockMode?: boolean;
  payload: Payload;
  settings: Settings;
  question: Question;
  questionVisible: boolean;
  roundEnded: boolean;
  currentAnswer: string;
  answerDisabled: boolean;
  readRemaining: number;
  writeRemaining: number;
  questionNumber: number;
  totalQuestions: number;
  solutionReveals: number | null;
  solutionRevealsMax: number;
  solutionTitle: string;
  solutionParts: string[];
  solutionRemaining: number;
  solutionVisible: boolean;
  solutionAllowed: boolean;
  solutionButtonDisabled: boolean;
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
  roundEnded,
  currentAnswer,
  answerDisabled,
  readRemaining,
  writeRemaining,
  questionNumber,
  totalQuestions,
  solutionReveals,
  solutionRevealsMax,
  solutionTitle,
  solutionParts,
  solutionRemaining,
  solutionVisible,
  solutionAllowed,
  solutionButtonDisabled,
  nextDisabled,
  nextLabel,
  onAnswerChange,
  onNext,
  onEndTest,
  onSolution,
}: ActiveStepProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-neutral-950 text-neutral-100">
      <header className="shrink-0 border-b border-neutral-800/80 px-3 py-2.5 sm:px-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 max-w-full items-center gap-1.5 sm:gap-2">
              {mockMode && <MockModeBadge />}
              <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
                {payload.title}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <CircularTimer
              minimal
              label="Sichtbar"
              icon={Eye}
              remaining={readRemaining}
              total={settings.readSeconds}
            />
            <CircularTimer
              minimal
              label="Antwort"
              icon={Timer}
              remaining={writeRemaining}
              total={settings.writeSeconds}
            />
          </div>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-3 py-6 sm:px-5 sm:py-8">
        <div className="flex w-full max-w-2xl flex-col gap-6 sm:gap-8">
          <div className="flex w-full flex-col gap-4 sm:gap-5">
            <QuestionPanel
              payload={payload}
              question={question}
              started
              finished={false}
              questionVisible={questionVisible}
            />

            <SolutionPanel
              title={solutionTitle}
              parts={solutionParts}
              remaining={solutionRemaining}
              visible={solutionVisible}
            />
          </div>

          <div className="flex w-full flex-col gap-3">
            <AnswerPanel
              value={currentAnswer}
              disabled={answerDisabled}
              roundEnded={roundEnded}
              readRemaining={readRemaining}
              questionNumber={questionNumber}
              totalQuestions={totalQuestions}
              onChange={onAnswerChange}
              nextLabel={nextLabel}
              nextDisabled={nextDisabled}
              onNext={onNext}
              solutionAllowed={solutionAllowed}
              solutionButtonDisabled={solutionButtonDisabled}
              solutionSeconds={settings.solutionSeconds}
              solutionVisible={solutionVisible}
              solutionReveals={solutionReveals}
              solutionRevealsMax={solutionRevealsMax}
              onSolutionRequest={onSolution}
            />
            <div className="flex justify-end">
              <EndTestButton onConfirm={onEndTest} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
