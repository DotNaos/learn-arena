import type { Payload, Settings } from "./payload";

export type SessionBadge =
  | "leer"
  | "geladen"
  | "frage sichtbar"
  | "abrufphase"
  | "frage beendet"
  | "beendet";

export type SessionState = {
  payload: Payload | null;
  settings: Settings;
  started: boolean;
  finished: boolean;
  roundEnded: boolean;
  currentIndex: number;
  readRemaining: number;
  writeRemaining: number;
  solutionRemaining: number;
  answers: string[];
  solutionRequests: number[];
  message: string;
  solutionVisible: boolean;
  solutionTitle: string;
  solutionParts: string[];
};

export function createInitialSessionState(): SessionState {
  return {
    payload: null,
    settings: {
      readSeconds: 45,
      writeSeconds: 180,
      solutionSeconds: 10,
      maxSolutionRequestsPerQuestion: 1,
      allowSolution: true,
      hideQuestionAfterRead: true,
    },
    started: false,
    finished: false,
    roundEnded: false,
    currentIndex: 0,
    readRemaining: 0,
    writeRemaining: 0,
    solutionRemaining: 0,
    answers: [],
    solutionRequests: [],
    message: "",
    solutionVisible: false,
    solutionTitle: "",
    solutionParts: [],
  };
}

export function getSessionBadge(state: SessionState): SessionBadge {
  if (!state.payload) return "leer";
  if (state.finished) return "beendet";
  if (!state.started) return "geladen";
  if (state.roundEnded) return "frage beendet";
  if (state.readRemaining > 0) return "frage sichtbar";
  return "abrufphase";
}

export function getRevealWarningClass(remaining: number): string {
  if (remaining <= 0) return "text-neutral-600";
  if (remaining === 1) return "text-red-400";
  if (remaining === 2) return "text-amber-400";
  return "text-emerald-400";
}

export function getRevealBarClass(remaining: number): string {
  if (remaining <= 0) return "bg-neutral-700";
  if (remaining === 1) return "bg-red-400";
  if (remaining === 2) return "bg-amber-400";
  return "bg-emerald-400";
}

export function getRevealBadgeClass(remaining: number): string {
  if (remaining <= 0) return "bg-neutral-800 text-neutral-500";
  if (remaining === 1) return "bg-red-500/20 text-red-400";
  if (remaining === 2) return "bg-amber-500/20 text-amber-400";
  return "bg-emerald-500/20 text-emerald-400";
}

export function getSolutionRevealsRemaining(
  state: SessionState,
): number | null {
  if (!state.payload) return null;

  const used = state.solutionRequests[state.currentIndex] || 0;
  if (!state.settings.allowSolution) return 0;

  return Math.max(
    state.settings.maxSolutionRequestsPerQuestion - used,
    0,
  );
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "--:--";
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60).toString().padStart(2, "0");
  const s = (safe % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function getRingColor(ratio: number): string {
  if (ratio > 0.5) return "#34d399";
  if (ratio > 0.2) return "#fbbf24";
  return "#fb7185";
}

export function getQuestionBudget(
  readSeconds: number,
  writeSeconds: number,
): number {
  return readSeconds + writeSeconds;
}

export function getCurrentQuestionRemaining(state: {
  roundEnded: boolean;
  readRemaining: number;
  writeRemaining: number;
}): number {
  if (state.roundEnded) return 0;
  return state.readRemaining + state.writeRemaining;
}

export function getTestTimeState(state: {
  questionNumber: number;
  totalQuestions: number;
  roundEnded: boolean;
  readRemaining: number;
  writeRemaining: number;
  readSeconds: number;
  writeSeconds: number;
}): {
  remaining: number;
  total: number;
  ratio: number;
  questionBudget: number;
} {
  const questionBudget = getQuestionBudget(state.readSeconds, state.writeSeconds);
  const testTotal = state.totalQuestions * questionBudget;
  const currentRemaining = getCurrentQuestionRemaining(state);
  const futureQuestions = state.totalQuestions - state.questionNumber;
  const testRemaining = currentRemaining + futureQuestions * questionBudget;

  return {
    remaining: testRemaining,
    total: testTotal,
    ratio:
      testTotal > 0 ? Math.max(0, Math.min(1, testRemaining / testTotal)) : 0,
    questionBudget,
  };
}

export function getSequentialSegmentFill(
  segmentIndex: number,
  testRemaining: number,
  testTotal: number,
  questionBudget: number,
): { widthRatio: number; leftRatio: number } {
  if (questionBudget <= 0 || testTotal <= 0) {
    return { widthRatio: 0, leftRatio: 0 };
  }

  const depletedUnits = (testTotal - testRemaining) / questionBudget;
  const fillStart = depletedUnits;
  const fillEnd = testTotal / questionBudget;
  const segmentStart = segmentIndex;
  const segmentEnd = segmentIndex + 1;
  const overlapStart = Math.max(fillStart, segmentStart);
  const overlapEnd = Math.min(fillEnd, segmentEnd);
  const overlap = Math.max(0, overlapEnd - overlapStart);

  return {
    widthRatio: Math.max(0, Math.min(1, overlap)),
    leftRatio: Math.max(0, Math.min(1, overlapStart - segmentStart)),
  };
}

export type QuestionTimerPhase = "read" | "write" | "done";

export function getQuestionTimerState(state: {
  roundEnded: boolean;
  readRemaining: number;
  writeRemaining: number;
  readSeconds: number;
  writeSeconds: number;
}): {
  remaining: number;
  total: number;
  ratio: number;
  phase: QuestionTimerPhase;
} {
  if (state.roundEnded) {
    return {
      remaining: 0,
      total: state.writeSeconds,
      ratio: 0,
      phase: "done",
    };
  }

  if (state.readRemaining > 0) {
    const total = state.readSeconds;
    const remaining = state.readRemaining;
    return {
      remaining,
      total,
      ratio: total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0,
      phase: "read",
    };
  }

  const total = state.writeSeconds;
  const remaining = state.writeRemaining;
  return {
    remaining,
    total,
    ratio: total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0,
    phase: "write",
  };
}

export const RING_CIRCUMFERENCE = 263.89;

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function getAnswerPlaceholder(state: {
  roundEnded: boolean;
  readRemaining: number;
}): string {
  if (state.roundEnded) {
    return "Optional noch ergaenzen, dann weiter...";
  }

  if (state.readRemaining > 0) {
    return "Lies die Frage — danach schreibst du aus dem Kopf...";
  }

  return "Schreibe deine Antwort aus dem Kopf...";
}

export function isQuestionVisible(state: SessionState): boolean {
  if (!state.payload || !state.started || state.finished) return false;
  if (!state.settings.hideQuestionAfterRead) return true;
  return state.readRemaining > 0;
}
