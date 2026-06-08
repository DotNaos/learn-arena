import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import { AnswerPanel } from "./components/AnswerPanel";
import { QuestionPanel } from "./components/QuestionPanel";
import { SessionSidebar } from "./components/SessionSidebar";
import { SolutionPanel } from "./components/SolutionPanel";
import {
  buildExportFromSession,
  copyText,
  downloadText,
} from "./domain/export";
import { normalizePayload } from "./domain/payload";
import {
  createInitialSessionState,
  getSessionBadge,
  getSolutionRevealsRemaining,
  isQuestionVisible,
  type SessionState,
} from "./domain/session";

function getProgressLabel(state: SessionState): string {
  const total = state.payload?.questions.length ?? 0;
  if (!total) return "-- / --";
  return `${Math.min(state.currentIndex + 1, total)} / ${total}`;
}

function getPayloadStatus(state: SessionState): string {
  if (!state.payload) return "Keine Aufgabe geladen.";
  if (!state.started) {
    return "Payload geladen. Fragen bleiben bis zum Start gesperrt.";
  }
  return "Payload geladen.";
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
      message: "Alle Fragen abgeschlossen. Export ist bereit.",
    };
  }

  return {
    ...prev,
    roundEnded: true,
    writeRemaining: 0,
    solutionVisible: false,
    solutionRemaining: 0,
    message:
      "Frage beendet. Starte die naechste Frage, wenn du bereit bist.",
  };
}

export default function App() {
  const [session, setSession] = useState(createInitialSessionState);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [solutionParts, setSolutionParts] = useState<string[]>([]);
  const [solutionTitle, setSolutionTitle] = useState("Kurzsichtbare Loesung");
  const solutionActiveRef = useRef(false);

  const loadPayload = useCallback((raw: string) => {
    const payload = normalizePayload(raw);

    setSession({
      ...createInitialSessionState(),
      payload,
      settings: payload.settings,
      readRemaining: payload.settings.readSeconds,
      writeRemaining: payload.settings.writeSeconds,
      answers: Array(payload.questions.length).fill(""),
      solutionRequests: Array(payload.questions.length).fill(0),
      message: "Bereit. Jede Frage bekommt ihren eigenen Timer.",
    });
    setCurrentAnswer("");
    setSolutionParts([]);
    solutionActiveRef.current = false;
  }, []);

  const handlePayloadError = useCallback((message: string) => {
    setSession((prev) => ({ ...prev, message }));
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
          solutionActiveRef.current = false;
          setSolutionParts([]);
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
          solutionActiveRef.current = false;
          setSolutionParts([]);
          return {
            ...prev,
            solutionRemaining: 0,
            solutionVisible: false,
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

  const nextQuestion = () => {
    setSession((prev) => {
      if (!prev.payload || !prev.roundEnded || prev.finished) return prev;

      const nextIndex = prev.currentIndex + 1;
      setCurrentAnswer(prev.answers[nextIndex] || "");
      setSolutionParts([]);
      solutionActiveRef.current = false;

      return {
        ...prev,
        currentIndex: nextIndex,
        roundEnded: false,
        readRemaining: prev.settings.readSeconds,
        writeRemaining: prev.settings.writeSeconds,
        solutionVisible: false,
        solutionRemaining: 0,
        message: `Frage ${nextIndex + 1} gestartet.`,
      };
    });
  };

  const requestSolution = () => {
    setSession((prev) => {
      const { payload, started, finished, roundEnded, settings, currentIndex } =
        prev;
      if (!payload || !started || finished || roundEnded) return prev;
      if (!settings.allowSolution) return prev;
      if (solutionActiveRef.current) return prev;

      const used = prev.solutionRequests[currentIndex] || 0;
      if (used >= settings.maxSolutionRequestsPerQuestion) return prev;

      const question = payload.questions[currentIndex];
      const parts =
        question.solution.length > 0
          ? question.solution
          : ["Keine Loesung in der Payload vorhanden."];

      const nextRequests = [...prev.solutionRequests];
      nextRequests[currentIndex] = used + 1;

      solutionActiveRef.current = true;
      setSolutionTitle(`${question.title} · Loesung`);
      setSolutionParts(parts);

      return {
        ...prev,
        solutionRequests: nextRequests,
        solutionRemaining: settings.solutionSeconds,
        solutionVisible: true,
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
      message: "Zwischenstand kopiert.",
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

  const solutionReveals = getSolutionRevealsRemaining(session);
  const questionVisible = isQuestionVisible(session);
  const currentQuestion =
    session.payload?.questions[session.currentIndex] ?? null;

  const answerDisabled =
    !session.started ||
    session.finished ||
    session.roundEnded ||
    !session.payload;

  const startDisabled = !session.payload || session.started || session.finished;
  const nextDisabled =
    !session.payload || !session.roundEnded || session.finished;
  const solutionDisabled =
    !session.payload ||
    !session.started ||
    session.finished ||
    session.roundEnded ||
    !session.settings.allowSolution ||
    (solutionReveals ?? 0) <= 0 ||
    session.solutionVisible;

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100 antialiased">
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-400">
              {session.payload?.topic ?? "Benchmark"}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {session.payload?.title ?? "Recall Test"}
            </h1>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-300">
            <LockKeyhole className="h-4 w-4" />
            <span>{session.payload?.mode ?? "Payload laden"}</span>
          </div>
        </header>

        <main className="grid flex-1 gap-4 lg:grid-cols-[390px_1fr]">
          <SessionSidebar
            stateBadge={getSessionBadge(session)}
            payloadStatus={getPayloadStatus(session)}
            progressLabel={getProgressLabel(session)}
            readRemaining={session.readRemaining}
            writeRemaining={session.writeRemaining}
            settings={session.settings}
            solutionRevealsRemaining={solutionReveals}
            message={session.message}
            startDisabled={startDisabled}
            nextDisabled={nextDisabled}
            solutionDisabled={solutionDisabled}
            payloadLoadingDisabled={session.started && !session.finished}
            onLoadPayload={loadPayload}
            onPayloadError={handlePayloadError}
            onStart={startTest}
            onNext={nextQuestion}
            onSolution={requestSolution}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />

          <section className="grid gap-4">
            <QuestionPanel
              payload={session.payload}
              question={currentQuestion}
              started={session.started}
              finished={session.finished}
              questionVisible={questionVisible}
            />

            <SolutionPanel
              title={solutionTitle}
              parts={solutionParts}
              remaining={session.solutionRemaining}
              visible={session.solutionVisible}
            />

            {session.finished && (
              <article className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                <div className="mb-2 flex items-center gap-2 text-emerald-100">
                  <CheckCircle2 className="h-5 w-5" />
                  <h2 className="font-medium">Test beendet</h2>
                </div>
                <p className="text-sm text-emerald-100/80">
                  Alle Fragen sind abgeschlossen. Deine Antworten koennen jetzt
                  kopiert oder heruntergeladen werden.
                </p>
              </article>
            )}

            <AnswerPanel
              value={currentAnswer}
              disabled={answerDisabled}
              onChange={handleAnswerChange}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
