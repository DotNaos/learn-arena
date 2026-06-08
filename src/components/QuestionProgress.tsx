type QuestionProgressBaseProps = {
  questionNumber: number;
  totalQuestions: number;
};

type QuestionProgressHeaderProps = QuestionProgressBaseProps & {
  wordCount?: number;
};

function ProgressLabel({
  questionNumber,
  totalQuestions,
}: QuestionProgressBaseProps) {
  return (
    <span className="text-xs text-neutral-500">
      Frage{" "}
      <span className="font-semibold tabular-nums text-neutral-200">
        {questionNumber}
      </span>
      <span className="tabular-nums text-neutral-600"> / {totalQuestions}</span>
    </span>
  );
}

export function QuestionProgressHeader({
  questionNumber,
  totalQuestions,
  wordCount,
}: QuestionProgressHeaderProps) {
  return (
    <div
      className="mb-2 flex items-center justify-between gap-3"
      role="progressbar"
      aria-valuenow={questionNumber}
      aria-valuemin={1}
      aria-valuemax={totalQuestions}
      aria-label={`Frage ${questionNumber} von ${totalQuestions}`}
    >
      <ProgressLabel
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />
      {wordCount !== undefined && (
        <span className="text-[11px] tabular-nums text-neutral-600">
          {wordCount} Woerter
        </span>
      )}
    </div>
  );
}

export function QuestionProgressBar({
  questionNumber,
  totalQuestions,
}: QuestionProgressBaseProps) {
  return (
    <div className="flex w-fit gap-1" role="presentation" aria-hidden>
      {Array.from({ length: totalQuestions }, (_, index) => {
        const step = index + 1;
        const isCurrent = step === questionNumber;
        const isDone = step < questionNumber;

        return (
          <span
            key={step}
            className={`h-1.5 w-10 rounded-full transition-colors duration-300 sm:w-12 ${
              isCurrent
                ? "bg-neutral-300"
                : isDone
                  ? "bg-neutral-600"
                  : "bg-neutral-800"
            }`}
          />
        );
      })}
    </div>
  );
}

type QuestionProgressProps = QuestionProgressHeaderProps & {
  attached?: boolean;
};

export function QuestionProgress({
  questionNumber,
  totalQuestions,
  attached = false,
  wordCount,
}: QuestionProgressProps) {
  if (attached) {
    return (
      <>
        <QuestionProgressHeader
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          wordCount={wordCount}
        />
        <QuestionProgressBar
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
        />
      </>
    );
  }

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={questionNumber}
      aria-valuemin={1}
      aria-valuemax={totalQuestions}
      aria-label={`Frage ${questionNumber} von ${totalQuestions}`}
    >
      <div className="mb-2.5">
        <ProgressLabel
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
        />
      </div>
      <div className="flex w-full gap-1">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const step = index + 1;
          const isCurrent = step === questionNumber;
          const isDone = step < questionNumber;

          return (
            <span
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                isCurrent
                  ? "bg-neutral-300"
                  : isDone
                    ? "bg-neutral-600"
                    : "bg-neutral-800"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
