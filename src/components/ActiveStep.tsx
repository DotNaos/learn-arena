import { LayoutGroup, motion } from "motion/react";
import { Timer } from "lucide-react";
import { layoutTransition } from "../ui/motionPresets";
import type { Payload, Question } from "../domain/payload";
import type { Settings } from "../domain/payload";
import { getTestTimeState } from "../domain/session";
import { AnswerPanel } from "./AnswerPanel";
import { CircularTimer } from "./CircularTimer";
import { EndTestButton } from "./EndTestButton";
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
  const testTime = getTestTimeState({
    questionNumber,
    totalQuestions,
    roundEnded,
    readRemaining,
    writeRemaining,
    readSeconds: settings.readSeconds,
    writeSeconds: settings.writeSeconds,
  });

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-neutral-950 text-neutral-100">
      <header className="shrink-0 border-b border-neutral-800/80 px-3 py-3 sm:px-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            {mockMode && <MockModeBadge />}
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                Test
              </p>
              <h1 className="truncate text-base font-semibold tracking-tight text-neutral-100 sm:text-lg">
                {payload.title}
              </h1>
            </div>
          </div>
          <CircularTimer
            minimal
            label="Gesamt"
            icon={Timer}
            remaining={testTime.remaining}
            total={testTime.total}
          />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-3 py-6 sm:px-5 sm:py-8">
        <LayoutGroup>
          <motion.div
            layout
            transition={{ layout: layoutTransition }}
            className="flex w-full max-w-2xl flex-col gap-6 sm:gap-8"
          >
            <motion.div
              layout
              transition={{ layout: layoutTransition }}
              className="flex w-full flex-col gap-4 sm:gap-5"
            >
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
                totalSeconds={settings.solutionSeconds}
                visible={solutionVisible}
              />
            </motion.div>

            <motion.div
              layout
              transition={{ layout: layoutTransition }}
              className="flex w-full flex-col gap-3"
            >
            <AnswerPanel
              value={currentAnswer}
              disabled={answerDisabled}
              roundEnded={roundEnded}
              readRemaining={readRemaining}
              writeRemaining={writeRemaining}
              readSeconds={settings.readSeconds}
              writeSeconds={settings.writeSeconds}
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
            </motion.div>
          </motion.div>
        </LayoutGroup>
      </main>
    </div>
  );
}
