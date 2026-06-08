import { useCallback, useEffect, useState } from "react";
import { ActiveStep } from "./components/ActiveStep";
import { DoneStep } from "./components/DoneStep";
import { ReadyStep } from "./components/ReadyStep";
import { SetupStep } from "./components/SetupStep";
import {
  buildExportFromSession,
  copyText,
  downloadText,
} from "./domain/export";
import { normalizePayload } from "./domain/payload";
import { PAYLOAD_GENERATION_PROMPT } from "./domain/payloadSchema";
import {
  createInitialSessionState,
  getSolutionRevealsRemaining,
  isQuestionVisible,
  type SessionState,
} from "./domain/session";
import {
  createMockInitialSession,
  getMockConfig,
} from "./domain/mock";
import { getWizardStep } from "./domain/wizard";

const mockConfig = getMockConfig();

function getProgressLabel(state: SessionState): string {
  const total = state.payload?.questions.length ?? 0;
  if (!total) return "-- / --";
  return `${Math.min(state.currentIndex + 1, total)} / ${total}`;
}

function finishRound(prev: SessionState): SessionState {
  const isLast =
    prev.currentIndex >= (prev.payload?.questions.length ?? 1) - 1;

  if (isLast) {
    return {
      ...prev,
      roundEnded: true,
      finished: true,
      writeRemaining: 0,
      solutionVisible: false,
      solutionRemaining: 0,
      solutionTitle: "",
      solutionParts: [],
      message: "Alle Fragen abgeschlossen. Export ist bereit.",
    };
  }

  return {
    ...prev,
    roundEnded: true,
    writeRemaining: 0,
    solutionVisible: false,
    solutionRemaining: 0,
    solutionTitle: "",
    solutionParts: [],
    message:
      "Frage beendet. Starte die naechste Frage, wenn du bereit bist.",
  };
}

function createSessionFromPayload(
  payload: NonNullable<SessionState["payload"]>,
  message: string,
): SessionState {
  return {
    ...createInitialSessionState(),
    payload,
    settings: payload.settings,
    readRemaining: payload.settings.readSeconds,
    writeRemaining: payload.settings.writeSeconds,
    answers: Array(payload.questions.length).fill(""),
    solutionRequests: Array(payload.questions.length).fill(0),
    message,
  };
}

export default function App() {
  const [session, setSession] = useState(() =>
    mockConfig.enabled
      ? createMockInitialSession(mockConfig.startActive)
      : createInitialSessionState(),
  );
  const [currentAnswer, setCurrentAnswer] = useState("");

  const step = getWizardStep(session);

  const loadPayload = useCallback((raw: string) => {
    const payload = normalizePayload(raw);

    setSession(
      createSessionFromPayload(
        payload,
        "Payload geladen. Pruefe die Uebersicht und starte den Test.",
      ),
    );
    setCurrentAnswer("");
  }, []);

  const handlePayloadError = useCallback((message: string) => {
    setSession((prev) => ({ ...prev, message }));
  }, []);

  const resetToSetup = useCallback(() => {
    setSession(
      mockConfig.enabled
        ? createMockInitialSession(false)
        : createInitialSessionState(),
    );
    setCurrentAnswer("");
  }, []);

  const retryTest = useCallback(() => {
    if (mockConfig.enabled) {
      setSession(createMockInitialSession(false));
      setCurrentAnswer("");
      return;
    }

    setSession((prev) => {
      if (!prev.payload) return prev;
      return createSessionFromPayload(
        prev.payload,
        "Bereit fuer einen neuen Durchlauf.",
      );
    });
    setCurrentAnswer("");
  }, []);

  useEffect(() => {
    const { started, finished, roundEnded, payload } = session;
    if (!started || finished || roundEnded || !payload) return;

    const interval = window.setInterval(() => {
      setSession((prev) => {
        const nextRead = prev.readRemaining > 0 ? prev.readRemaining - 1 : 0;
        const nextWrite =
          prev.writeRemaining > 0 ? prev.writeRemaining - 1 : 0;

        if (nextWrite <= 0 && prev.writeRemaining > 0) {
          return finishRound({ ...prev, readRemaining: nextRead, writeRemaining: 0 });
        }

        return {
          ...prev,
          readRemaining: nextRead,
          writeRemaining: nextWrite,
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [
    session.started,
    session.finished,
    session.roundEnded,
    session.currentIndex,
    session.payload,
  ]);

  useEffect(() => {
    if (!session.solutionVisible || session.solutionRemaining <= 0) return;

    const interval = window.setInterval(() => {
      setSession((prev) => {
        const next = prev.solutionRemaining - 1;
        if (next <= 0) {
          return {
            ...prev,
            solutionRemaining: 0,
            solutionVisible: false,
            solutionTitle: "",
            solutionParts: [],
          };
        }
        return { ...prev, solutionRemaining: next };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [session.solutionVisible, session.solutionRemaining]);

  const startTest = () => {
    setSession((prev) => {
      if (!prev.payload || prev.started) return prev;

      setCurrentAnswer(prev.answers[0] || "");
      return {
        ...prev,
        started: true,
        finished: false,
        currentIndex: 0,
        roundEnded: false,
        readRemaining: prev.settings.readSeconds,
        writeRemaining: prev.settings.writeSeconds,
        message: "Frage 1 gestartet.",
      };
    });
  };

  const handleNextOrFinish = () => {
    setSession((prev) => {
      if (!prev.payload || !prev.started || prev.finished) return prev;

      const total = prev.payload.questions.length;
      const isLast = prev.currentIndex >= total - 1;

      let state = prev;
      if (!state.roundEnded) {
        state = finishRound({
          ...state,
          readRemaining: 0,
          writeRemaining: 0,
        });
      }

      if (state.finished || isLast) return state;

      const nextIndex = state.currentIndex + 1;
      setCurrentAnswer(state.answers[nextIndex] || "");
      return {
        ...state,
        currentIndex: nextIndex,
        roundEnded: false,
        readRemaining: state.settings.readSeconds,
        writeRemaining: state.settings.writeSeconds,
        solutionVisible: false,
        solutionRemaining: 0,
        solutionTitle: "",
        solutionParts: [],
        message: `Frage ${nextIndex + 1} gestartet.`,
      };
    });
  };

  const endTest = () => {
    setSession((prev) => {
      if (!prev.payload || !prev.started || prev.finished) return prev;

      let state = prev;
      if (!state.roundEnded) {
        state = finishRound({
          ...state,
          readRemaining: 0,
          writeRemaining: 0,
        });
      }

      if (state.finished) return state;

      return {
        ...state,
        finished: true,
        message: "Test beendet. Export ist bereit.",
      };
    });
  };

  const requestSolution = () => {
    setSession((prev) => {
      const { payload, started, finished, roundEnded, settings, currentIndex } =
        prev;
      if (!payload || !started || finished || roundEnded) return prev;
      if (!settings.allowSolution || prev.solutionVisible) return prev;

      const used = prev.solutionRequests[currentIndex] || 0;
      if (used >= settings.maxSolutionRequestsPerQuestion) return prev;

      const question = payload.questions[currentIndex];
      const parts =
        question.solution.length > 0
          ? question.solution
          : ["Keine Loesung in der Payload vorhanden."];

      const nextRequests = [...prev.solutionRequests];
      nextRequests[currentIndex] = used + 1;

      return {
        ...prev,
        solutionRequests: nextRequests,
        solutionRemaining: settings.solutionSeconds,
        solutionVisible: true,
        solutionTitle: `${question.title} · Loesung`,
        solutionParts: parts,
      };
    });
  };

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
    setSession((prev) => {
      const nextAnswers = [...prev.answers];
      nextAnswers[prev.currentIndex] = value;
      return { ...prev, answers: nextAnswers };
    });
  };

  const handleCopy = async () => {
    const text = buildExportFromSession(session, currentAnswer);
    await copyText(text);
    setSession((prev) => ({
      ...prev,
      message: "Antworten kopiert.",
    }));
  };

  const handleDownload = () => {
    const text = buildExportFromSession(session, currentAnswer);
    downloadText(text, "recall-benchmark-answer.txt");
    setSession((prev) => ({
      ...prev,
      message: "Textdatei heruntergeladen.",
    }));
  };

  const handleCopySchema = async () => {
    await copyText(PAYLOAD_GENERATION_PROMPT);
    setSession((prev) => ({
      ...prev,
      message: "Schema fuer ChatGPT kopiert.",
    }));
  };

  if (step === "setup") {
    return (
      <SetupStep
        message={session.message}
        onLoad={loadPayload}
        onError={handlePayloadError}
        onCopySchema={handleCopySchema}
      />
    );
  }

  if (step === "ready" && session.payload) {
    return (
      <ReadyStep
        mockMode={mockConfig.enabled}
        payload={session.payload}
        onStart={startTest}
        onReset={resetToSetup}
      />
    );
  }

  if (step === "done" && session.payload) {
    return (
      <DoneStep
        payload={session.payload}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onRetry={retryTest}
        onReset={resetToSetup}
      />
    );
  }

  if (step === "active" && session.payload) {
    const currentQuestion =
      session.payload.questions[session.currentIndex];

    if (!currentQuestion) return null;

    const totalQuestions = session.payload.questions.length;
    const hasMoreQuestions = session.currentIndex < totalQuestions - 1;

    return (
      <ActiveStep
        mockMode={mockConfig.enabled}
        payload={session.payload}
        settings={session.settings}
        question={currentQuestion}
        questionVisible={isQuestionVisible(session)}
        currentAnswer={currentAnswer}
        answerDisabled={session.roundEnded}
        readRemaining={session.readRemaining}
        writeRemaining={session.writeRemaining}
        progressLabel={getProgressLabel(session)}
        solutionReveals={getSolutionRevealsRemaining(session)}
        solutionRevealsMax={session.settings.maxSolutionRequestsPerQuestion}
        solutionTitle={session.solutionTitle}
        solutionParts={session.solutionParts}
        solutionRemaining={session.solutionRemaining}
        solutionVisible={session.solutionVisible}
        solutionAllowed={
          session.settings.allowSolution && !session.roundEnded
        }
        solutionButtonDisabled={
          session.solutionVisible ||
          (getSolutionRevealsRemaining(session) ?? 0) <= 0
        }
        message={session.message}
        nextLabel={
          hasMoreQuestions ? "Naechste Frage" : "Frage abschliessen"
        }
        nextDisabled={mockConfig.enabled ? false : !session.roundEnded}
        onAnswerChange={handleAnswerChange}
        onNext={handleNextOrFinish}
        onEndTest={endTest}
        onSolution={requestSolution}
      />
    );
  }

  return null;
}
