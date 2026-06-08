import type { Payload, Question } from "../domain/payload";
import { SolutionControl } from "./SolutionControl";

type QuestionPanelProps = {
  payload: Payload | null;
  question: Question | null;
  started: boolean;
  finished: boolean;
  questionVisible: boolean;
  solutionAllowed?: boolean;
  solutionButtonDisabled?: boolean;
  solutionVisible?: boolean;
  solutionSeconds?: number;
  solutionReveals?: number | null;
  solutionRevealsMax?: number;
  onSolutionRequest?: () => void;
};

export function QuestionPanel({
  payload,
  question,
  started,
  finished,
  questionVisible,
  solutionAllowed = false,
  solutionButtonDisabled = true,
  solutionSeconds = 10,
  solutionVisible = false,
  solutionReveals = null,
  solutionRevealsMax = 1,
  onSolutionRequest,
}: QuestionPanelProps) {
  const locked = !payload || !started || finished;
  const hidden =
    started && !finished && !questionVisible && question !== null;

  const badge = finished
    ? "abgeschlossen"
    : hidden
      ? "ausgeblendet"
      : started && question
        ? "sichtbar"
        : "gesperrt";

  const showSolutionControl = Boolean(onSolutionRequest) && solutionAllowed;
  const revealCount = solutionReveals ?? 0;

  return (
    <div className="shrink-0 pb-4 sm:pb-5">
      <div className="mb-2 flex items-start gap-2 sm:gap-3">
        <h2 className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-200">
          {question?.title ?? "Aufgabe"}
        </h2>

        {showSolutionControl && (
          <SolutionControl
            solutionSeconds={solutionSeconds}
            solutionVisible={solutionVisible}
            disabled={solutionButtonDisabled}
            remaining={revealCount}
            max={solutionRevealsMax}
            onRequest={onSolutionRequest!}
          />
        )}

        <span className="mt-0.5 shrink-0 rounded-md bg-neutral-800/80 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-400">
          {badge}
        </span>
      </div>

      <div className="max-h-40 overflow-y-auto pr-1 sm:max-h-48">
        {locked && (
          <p className="text-sm text-neutral-500">
            Lade eine Payload. Fragen werden nach dem Start freigeschaltet.
          </p>
        )}

        {!locked && questionVisible && question && (
          <div className="space-y-2">
            {payload?.task && (
              <p className="text-sm leading-relaxed text-neutral-400">
                {payload.task}
              </p>
            )}
            <p className="text-base font-medium leading-relaxed text-neutral-100 sm:text-lg">
              {question.prompt}
            </p>
          </div>
        )}

        {hidden && (
          <p className="text-sm text-neutral-500">
            Frage ausgeblendet. Schreibe aus dem Kopf weiter.
          </p>
        )}
      </div>
    </div>
  );
}
