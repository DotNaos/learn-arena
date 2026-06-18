import { useEffect, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { Columns2, Rows3, Timer } from "lucide-react";
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
import { useI18n } from "../i18n";

type ActiveLayout = "stacked" | "split";

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

const ACTIVE_LAYOUT_STORAGE_KEY = "learn-arena-active-layout";

function getInitialActiveLayout(): ActiveLayout {
  if (typeof window === "undefined") return "split";
  return window.localStorage.getItem(ACTIVE_LAYOUT_STORAGE_KEY) === "stacked"
    ? "stacked"
    : "split";
}

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
  const { t } = useI18n();
  const [layout, setLayout] = useState<ActiveLayout>(getInitialActiveLayout);
  const splitLayout = layout === "split";
  const testTime = getTestTimeState({
    questionNumber,
    totalQuestions,
    roundEnded,
    readRemaining,
    writeRemaining,
    readSeconds: settings.readSeconds,
    writeSeconds: settings.writeSeconds,
  });

  useEffect(() => {
    window.localStorage.setItem(ACTIVE_LAYOUT_STORAGE_KEY, layout);
  }, [layout]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <header className="shrink-0 border-b border-neutral-200/80 dark:border-neutral-800/80 px-3 py-3 sm:px-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            {mockMode && <MockModeBadge />}
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-500">
                {t("active.test")}
              </p>
              <h1 className="truncate text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-lg">
                {payload.title}
              </h1>
            </div>
          </div>
          <CircularTimer
            minimal
            label={t("active.total")}
            icon={Timer}
            remaining={testTime.remaining}
            total={testTime.total}
          />
          <div className="hidden shrink-0 items-center rounded-full border border-neutral-200/90 bg-neutral-100/70 p-0.5 text-neutral-500 shadow-sm dark:border-neutral-800/90 dark:bg-neutral-900/70 dark:text-neutral-400 lg:inline-flex">
            <button
              type="button"
              onClick={() => setLayout("stacked")}
              aria-label={t("active.layout.stacked")}
              title={t("active.layout.stacked")}
              data-active={layout === "stacked" ? "true" : "false"}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:text-neutral-900 data-[active=true]:bg-neutral-50 data-[active=true]:text-neutral-900 data-[active=true]:shadow-sm dark:hover:text-neutral-100 dark:data-[active=true]:bg-neutral-800 dark:data-[active=true]:text-neutral-100"
            >
              <Rows3 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setLayout("split")}
              aria-label={t("active.layout.split")}
              title={t("active.layout.split")}
              data-active={layout === "split" ? "true" : "false"}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:text-neutral-900 data-[active=true]:bg-neutral-50 data-[active=true]:text-neutral-900 data-[active=true]:shadow-sm dark:hover:text-neutral-100 dark:data-[active=true]:bg-neutral-800 dark:data-[active=true]:text-neutral-100"
            >
              <Columns2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <main
        data-layout={layout}
        className={`active-test-main flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-3 py-6 sm:px-5 sm:py-8 ${
          splitLayout
            ? "lg:overflow-hidden lg:py-5"
            : "justify-[safe_center]"
        }`}
      >
        <LayoutGroup>
          <motion.div
            layout
            transition={{ layout: layoutTransition }}
            data-layout={layout}
            className={`active-test-stack flex w-full flex-col gap-6 sm:gap-8 ${
              splitLayout
                ? "max-w-2xl lg:grid lg:h-full lg:max-w-7xl lg:grid-cols-[minmax(0,0.95fr)_minmax(28rem,1.05fr)] lg:items-stretch lg:gap-6"
                : "max-w-2xl"
            }`}
          >
            <motion.div
              layout
              transition={{ layout: layoutTransition }}
              className={`active-test-question-stack flex w-full flex-col gap-4 sm:gap-5 ${
                splitLayout ? "lg:min-h-0 lg:overflow-y-auto lg:pr-1" : ""
              }`}
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
              className={`active-test-answer-stack flex w-full flex-col gap-3 ${
                splitLayout ? "lg:h-full lg:min-h-0" : ""
              }`}
            >
            <AnswerPanel
              question={question}
              value={currentAnswer}
              disabled={answerDisabled}
              layout={splitLayout ? "split" : "stacked"}
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
