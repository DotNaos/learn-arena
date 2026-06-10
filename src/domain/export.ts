import { choiceLetter, getChoiceAnswerLines, isChoiceQuestion } from "./choice";
import type { Payload, Question, Settings } from "./payload";

export function serializePayload(payload: Payload): string {
  return JSON.stringify(
    {
      title: payload.title,
      topic: payload.topic,
      mode: payload.mode,
      task: payload.task,
      questions: payload.questions,
      settings: payload.settings,
    },
    null,
    2,
  );
}

export function buildPayloadFilename(payload: Payload): string {
  const slug =
    payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "fragensatz";

  return `${slug}.json`;
}
import type { SessionState } from "./session";

type ExportInput = {
  payload: Payload | null;
  settings: Settings;
  started: boolean;
  finished: boolean;
  currentIndex: number;
  answers: string[];
  solutionRequests: number[];
  currentAnswer: string;
};

export function buildExportText(input: ExportInput): string {
  const {
    payload,
    started,
    finished,
    currentIndex,
    answers,
    currentAnswer,
  } = input;

  const resolvedAnswers = [...answers];
  if (payload && started && !finished) {
    resolvedAnswers[currentIndex] = currentAnswer;
  }

  const lines = [
    "Bitte bewerte meine Antworten zu diesem Recall-Test.",
    "Gib pro Frage kurzes Feedback (richtig / teilweise / falsch und was fehlt)",
    "und am Ende eine Gesamteinschaetzung mit ein paar Lerntipps.",
    "",
    `Test: ${payload?.title || "Recall Benchmark"}`,
    "",
  ];

  if (payload) {
    appendQuestionBlocks(lines, payload, resolvedAnswers);
  }

  return lines.join("\n");
}

function appendQuestionBlocks(
  lines: string[],
  payload: Payload,
  answers: string[],
): void {
  payload.questions.forEach((question, index) => {
    lines.push(`${index + 1}. ${question.title}`);
    lines.push(`Frage: ${question.prompt}`);

    if (isChoiceQuestion(question)) {
      lines.push(
        question.type === "multiple"
          ? "Typ: Multiple Choice (mehrere richtig)"
          : "Typ: Single Choice (eine richtig)",
      );
      lines.push("Optionen:");
      question.choices.forEach((choice, choiceIndex) => {
        lines.push(`  ${choiceLetter(choiceIndex)}) ${choice}`);
      });
    }

    lines.push("");
    lines.push(`Meine Antwort: ${getDisplayAnswer(question, answers[index])}`);

    const reference = getReferenceSolution(question);
    if (reference) {
      lines.push(`Musterloesung: ${reference}`);
    }

    lines.push("");
  });
}

/** Combined grading export across every completed test in a learn plan. */
export function buildPlanGradingExport(
  planTitle: string,
  tests: { payload: Payload; answers: string[] }[],
): string {
  const lines = [
    `Bitte bewerte meine Antworten zu diesem Lernplan: ${planTitle}.`,
    "Gib pro Test und Frage kurzes Feedback (richtig / teilweise / falsch und",
    "was fehlt) und am Ende eine Gesamteinschaetzung mit Lerntipps pro Test.",
    "",
  ];

  tests.forEach((test, index) => {
    lines.push("============================================================");
    lines.push(`Test ${index + 1}: ${test.payload.title}`);
    lines.push("============================================================");
    lines.push("");
    appendQuestionBlocks(lines, test.payload, test.answers);
  });

  return lines.join("\n");
}

function getDisplayAnswer(question: Question, raw: string | undefined): string {
  if (isChoiceQuestion(question)) {
    const lines = getChoiceAnswerLines(question, raw || "");
    return lines.length > 0 ? lines.join(", ") : "(keine Auswahl)";
  }

  const text = (raw || "").trim();
  return text || "(keine Antwort)";
}

function getReferenceSolution(question: Question): string {
  if (isChoiceQuestion(question) && question.correctChoices.length > 0) {
    return question.correctChoices
      .map((index) => `${choiceLetter(index)}) ${question.choices[index]}`)
      .join(", ");
  }

  return question.solution.join(" ").trim();
}

export function buildExportFromSession(
  state: SessionState,
  currentAnswer: string,
): string {
  return buildExportText({
    payload: state.payload,
    settings: state.settings,
    started: state.started,
    finished: state.finished,
    currentIndex: state.currentIndex,
    answers: state.answers,
    solutionRequests: state.solutionRequests,
    currentAnswer,
  });
}

export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
  }
}

export function downloadText(text: string, filename: string): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
