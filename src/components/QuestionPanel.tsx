import type { Payload, Question } from "../domain/payload";

type QuestionPanelProps = {
  payload: Payload | null;
  question: Question | null;
  started: boolean;
  finished: boolean;
  questionVisible: boolean;
};

export function QuestionPanel({
  payload,
  question,
  started,
  finished,
  questionVisible,
}: QuestionPanelProps) {
  const locked = !payload || !started || finished;
  const hidden =
    started && !finished && !questionVisible && question !== null;

  const badge = finished
    ? "abgeschlossen"
    : hidden
      ? "ausgeblendet"
      : started && question
        ? "freigeschaltet"
        : "gesperrt";

  return (
    <article className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-medium">
          {question?.title ?? "Aufgabe"}
        </h2>
        <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-300">
          {badge}
        </span>
      </div>

      {locked && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">
          Lade eine Payload. Die Fragen werden einzeln nach dem Start
          freigeschaltet.
        </div>
      )}

      {!locked && questionVisible && question && (
        <div className="space-y-4">
          {payload?.task && (
            <p className="text-sm leading-6 text-neutral-400">
              {payload.task}
            </p>
          )}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
            <p className="text-lg font-medium leading-8 text-neutral-100">
              {question.prompt}
            </p>
          </div>
        </div>
      )}

      {hidden && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-400">
          Frage ist ausgeblendet. Schreibe jetzt aus dem Kopf weiter.
        </div>
      )}
    </article>
  );
}
