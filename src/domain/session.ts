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

export const RING_CIRCUMFERENCE = 263.89;

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function isQuestionVisible(state: SessionState): boolean {
  if (!state.payload || !state.started || state.finished) return false;
  if (!state.settings.hideQuestionAfterRead) return true;
  return state.readRemaining > 0;
}
