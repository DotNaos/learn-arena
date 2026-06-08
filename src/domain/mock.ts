import { normalizePayload } from "./payload";
import { createInitialSessionState, type SessionState } from "./session";

export const MOCK_PAYLOAD_JSON = JSON.stringify({
  title: "Mock Recall Test",
  mode: "per-question",
  task: "Dies ist ein Mock-Payload zum Durchklicken aller Wizard-Schritte.",
  questions: [
    {
      title: "Frage 1",
      prompt: "Was ist die Hauptstadt von Frankreich?",
      solution: ["Paris", "Hauptstadt an der Seine."],
    },
    {
      title: "Frage 2",
      prompt: "Nenne die drei Zustandsformen von Wasser.",
      solution: ["fest (Eis)", "fluessig (Wasser)", "gasfoermig (Dampf)"],
    },
    {
      title: "Frage 3",
      prompt: "Was bedeutet HTML?",
      solution: ["HyperText Markup Language"],
    },
  ],
  settings: {
    readSeconds: 45,
    writeSeconds: 180,
    solutionSeconds: 10,
    maxSolutionRequestsPerQuestion: 2,
    allowSolution: true,
    hideQuestionAfterRead: true,
  },
});

export type MockConfig = {
  enabled: boolean;
  startActive: boolean;
};

export function getMockConfig(): MockConfig {
  const envEnabled = import.meta.env.VITE_MOCK_MODE === "true";
  if (typeof window === "undefined") {
    return { enabled: envEnabled, startActive: false };
  }

  const params = new URLSearchParams(window.location.search);
  const mockParam = params.get("mock");
  const enabled = envEnabled || mockParam !== null;
  const startActive =
    mockParam === "active" || params.get("start") === "active";

  return { enabled, startActive };
}

export function createMockInitialSession(startActive: boolean): SessionState {
  const payload = normalizePayload(MOCK_PAYLOAD_JSON);
  const base = {
    ...createInitialSessionState(),
    payload,
    settings: payload.settings,
    readRemaining: payload.settings.readSeconds,
    writeRemaining: payload.settings.writeSeconds,
    answers: Array(payload.questions.length).fill(""),
    solutionRequests: Array(payload.questions.length).fill(0),
    message: startActive
      ? "Mock-Modus: Test laeuft. Naechste Frage springt sofort weiter."
      : "Mock-Modus aktiv. Payload ist geladen.",
  };

  if (!startActive) return base;

  return {
    ...base,
    started: true,
    message: "Mock-Modus: Frage 1 gestartet.",
  };
}
