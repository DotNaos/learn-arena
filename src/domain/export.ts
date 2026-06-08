import type { Payload, Settings } from "./payload";
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
    settings,
    started,
    finished,
    currentIndex,
    answers,
    solutionRequests,
    currentAnswer,
  } = input;

  const resolvedAnswers = [...answers];
  if (payload && started && !finished) {
    resolvedAnswers[currentIndex] = currentAnswer;
  }

  const now = new Date().toLocaleString("de-DE");
  const lines = [
    payload?.title || "Recall Benchmark",
    `Zeitpunkt: ${now}`,
    `Modus: ${payload?.mode || "-"}`,
    `Status: ${finished ? "beendet" : started ? "laufend" : "nicht gestartet"}`,
    "",
  ];

  if (payload) {
    payload.questions.forEach((question, index) => {
      lines.push(`${index + 1}. ${question.title}`);
      lines.push(question.prompt);
      lines.push("");
      lines.push("Antwort:");
      lines.push((resolvedAnswers[index] || "").trim());
      lines.push("");
      lines.push(
        `Loesungs-Reveals verwendet: ${solutionRequests[index] || 0}/${settings.maxSolutionRequestsPerQuestion}`,
      );
      lines.push("");
    });
  }

  return lines.join("\n");
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
