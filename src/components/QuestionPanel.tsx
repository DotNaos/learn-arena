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
  const showQuestionBody = !locked && question !== null;

  if (locked) {
    return (
      <p className="text-center text-sm text-neutral-500">
        Lade eine Payload. Fragen werden nach dem Start freigeschaltet.
      </p>
    );
  }

  if (!showQuestionBody) return null;

  return (
    <div className="w-full text-center">
      <div
        aria-hidden={hidden}
        className={`space-y-3 px-2 transition-[filter,opacity] duration-700 ease-out motion-reduce:transition-none ${
          hidden
            ? "pointer-events-none select-none blur-md opacity-30 brightness-50"
            : "opacity-100 blur-0 brightness-100"
        }`}
      >
        {payload?.task && (
          <p className="text-sm leading-relaxed text-neutral-400">
            {payload.task}
          </p>
        )}
        <h2 className="text-balance text-2xl font-semibold leading-snug tracking-tight text-neutral-100 sm:text-3xl">
          {question.prompt}
        </h2>
      </div>
    </div>
  );
}
