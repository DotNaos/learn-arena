import {
  formatTime,
  getCurrentQuestionRemaining,
  getRingColor,
  getSequentialSegmentFill,
  getTestTimeState,
} from "../domain/session";

type QuestionProgressBaseProps = {
  questionNumber: number;
  totalQuestions: number;
};

type QuestionTimerProps = {
  roundEnded: boolean;
  readRemaining: number;
  writeRemaining: number;
  readSeconds: number;
  writeSeconds: number;
};

type QuestionProgressHeaderProps = QuestionProgressBaseProps &
  QuestionTimerProps & {
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

function QuestionProgressLabelRow({
  questionNumber,
  totalQuestions,
  roundEnded,
  readRemaining,
  writeRemaining,
}: QuestionProgressBaseProps & {
  roundEnded: boolean;
  readRemaining: number;
  writeRemaining: number;
}) {
  const currentRemaining = getCurrentQuestionRemaining({
    roundEnded,
    readRemaining,
    writeRemaining,
  });

  return (
    <div className="flex w-full items-baseline justify-between whitespace-nowrap">
      <ProgressLabel
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />
      <span className="shrink-0 text-sm font-semibold tabular-nums text-neutral-200">
        {formatTime(currentRemaining)}
      </span>
    </div>
  );
}

export function QuestionProgressBlock({
  questionNumber,
  totalQuestions,
  wordCount,
  roundEnded,
  readRemaining,
  writeRemaining,
  readSeconds,
  writeSeconds,
}: QuestionProgressHeaderProps) {
  const timerProps = {
    roundEnded,
    readRemaining,
    writeRemaining,
    readSeconds,
    writeSeconds,
  };

  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div className="inline-flex min-w-0 flex-col gap-2">
        <QuestionProgressLabelRow
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          roundEnded={roundEnded}
          readRemaining={readRemaining}
          writeRemaining={writeRemaining}
        />
        <QuestionProgressBar
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          {...timerProps}
        />
      </div>
      {wordCount !== undefined ? (
        <span className="shrink-0 pb-px text-[11px] tabular-nums text-neutral-600">
          {wordCount} Woerter
        </span>
      ) : null}
    </div>
  );
}

export function QuestionProgressBar({
  questionNumber,
  totalQuestions,
  roundEnded,
  readRemaining,
  writeRemaining,
  readSeconds,
  writeSeconds,
}: QuestionProgressBaseProps & QuestionTimerProps) {
  const test = getTestTimeState({
    questionNumber,
    totalQuestions,
    roundEnded,
    readRemaining,
    writeRemaining,
    readSeconds,
    writeSeconds,
  });
  const currentIndex = questionNumber - 1;

  return (
    <div
      className="flex w-full gap-1"
      role="progressbar"
      aria-valuenow={Math.round(test.remaining)}
      aria-valuemin={0}
      aria-valuemax={test.total}
      aria-label={`${formatTime(test.remaining)} vom Test verbleibend`}
    >
      {Array.from({ length: totalQuestions }, (_, index) => {
        const segmentFill = getSequentialSegmentFill(
          index,
          test.remaining,
          test.total,
          test.questionBudget,
        );
        const isCurrent = index === currentIndex;
        const fillColor = getRingColor(test.ratio);

        return (
          <span
            key={index}
            className="relative h-1.5 w-11 overflow-hidden rounded-full bg-neutral-800 sm:w-12"
          >
            {segmentFill.widthRatio > 0 ? (
              <span
                className={`absolute inset-y-0 rounded-full transition-[width,left,opacity] duration-1000 ease-linear motion-reduce:transition-none ${
                  isCurrent ? "opacity-100" : "opacity-35"
                }`}
                style={{
                  left: `${segmentFill.leftRatio * 100}%`,
                  width: `${segmentFill.widthRatio * 100}%`,
                  backgroundColor: fillColor,
                }}
              />
            ) : null}
          </span>
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
  roundEnded,
  readRemaining,
  writeRemaining,
  readSeconds,
  writeSeconds,
}: QuestionProgressProps) {
  const timerProps = {
    roundEnded,
    readRemaining,
    writeRemaining,
    readSeconds,
    writeSeconds,
  };

  if (attached) {
    return (
      <QuestionProgressBlock
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        wordCount={wordCount}
        {...timerProps}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="mb-2.5">
        <ProgressLabel
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
        />
      </div>
      <QuestionProgressBar
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        {...timerProps}
      />
    </div>
  );
}
