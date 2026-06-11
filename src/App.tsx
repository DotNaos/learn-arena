import { useCallback, useEffect, useRef, useState } from "react";
import { ActiveStep } from "./components/ActiveStep";
import { DoneStep } from "./components/DoneStep";
import { PlanView } from "./components/PlanView";
import { ReadyStep } from "./components/ReadyStep";
import { SetupStep } from "./components/SetupStep";
import {
  buildExportFromSession,
  buildPayloadFilename,
  buildPlanGradingExport,
  copyText,
  downloadText,
  serializePayload,
} from "./domain/export";
import { normalizeImport } from "./domain/payload";
import { buildPayloadGenerationPrompt } from "./domain/payloadSchema";
import {
  addTest,
  getPlanTests,
  importPlan,
  listPlans,
  listTests,
  loadLibrary,
  mergeLibrary,
  parseLibrary,
  recordResult,
  removePlan,
  removeTest,
  saveLibrary,
  serializeLibrary,
} from "./domain/library";
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
import { KeyboardShortcutsHelp } from "./components/KeyboardShortcutsHelp";
import { ThemeToggle } from "./components/ThemeToggle";
import { GitHubAccessDialog } from "./components/GitHubAccessDialog";
import { LanguageToggle } from "./components/LanguageToggle";
import { useI18n } from "./i18n";

type PlanContext = { planId: string; index: number };

const mockConfig = getMockConfig();

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
      message: "status.roundDone",
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
    message: "",
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
  const { t } = useI18n();
  const [session, setSession] = useState(() =>
    mockConfig.enabled
      ? createMockInitialSession(mockConfig.startActive)
      : createInitialSessionState(),
  );
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [library, setLibrary] = useState(loadLibrary);
  const [homeView, setHomeView] = useState<"setup" | "plan">("setup");
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [planContext, setPlanContext] = useState<PlanContext | null>(null);
  const recordedRef = useRef(false);

  const step = getWizardStep(session);
  const translateMessage = useCallback(
    (message: string) => {
      if (message.startsWith("status.questionStarted:")) {
        return t("status.questionStarted", {
          number: message.split(":")[1] ?? 1,
        });
      }
      return message.includes(".") ? t(message) : message;
    },
    [t],
  );

  useEffect(() => {
    saveLibrary(library);
  }, [library]);

  // Persist a finished test's answers into the library exactly once per run.
  useEffect(() => {
    if (!session.finished || !currentTestId || recordedRef.current) return;
    recordedRef.current = true;
    const completedAt = new Date().toISOString();
    setLibrary((lib) =>
      recordResult(lib, currentTestId, {
        answers: session.answers,
        solutionRequests: session.solutionRequests,
        completedAt,
      }),
    );
  }, [session.finished, session.answers, session.solutionRequests, currentTestId]);

  const handlePayloadError = useCallback((message: string) => {
    setSession((prev) => ({ ...prev, message }));
  }, []);

  const beginTest = useCallback(
    (
      payload: NonNullable<SessionState["payload"]>,
      testId: string,
      plan: PlanContext | null,
      message: string,
    ) => {
      setCurrentTestId(testId);
      setPlanContext(plan);
      recordedRef.current = false;
      setSession(createSessionFromPayload(payload, message));
      setCurrentAnswer("");
    },
    [],
  );

  // Import a pasted blob: either a single test (-> ready screen) or a whole plan.
  const handleImport = useCallback(
    (raw: string) => {
      const result = normalizeImport(raw);

      if (result.kind === "plan") {
        const { library: next, planId } = importPlan(
          library,
          result.title,
          result.tests,
        );
        setLibrary(next);
        setActivePlanId(planId);
        setHomeView("plan");
        return;
      }

      const { library: next, id } = addTest(library, result.payload);
      setLibrary(next);
      beginTest(
        result.payload,
        id,
        null,
        "status.loadedReview",
      );
    },
    [library, beginTest],
  );

  const openTest = useCallback(
    (id: string) => {
      const test = library.tests[id];
      if (!test) return;
      beginTest(test.payload, id, null, "status.loaded");
    },
    [library, beginTest],
  );

  const openPlan = useCallback((id: string) => {
    setActivePlanId(id);
    setHomeView("plan");
  }, []);

  const startTestInPlan = useCallback(
    (index: number) => {
      if (!activePlanId) return;
      const plan = library.plans[activePlanId];
      const testId = plan?.testIds[index];
      const test = testId ? library.tests[testId] : undefined;
      if (!plan || !testId || !test) return;
      beginTest(
        test.payload,
        testId,
        { planId: activePlanId, index },
        "status.questionStarted:1",
      );
    },
    [activePlanId, library, beginTest],
  );

  const backToPlan = useCallback(() => {
    const planId = planContext?.planId ?? activePlanId;
    setSession(createInitialSessionState());
    setCurrentAnswer("");
    setCurrentTestId(null);
    setPlanContext(null);
    recordedRef.current = false;
    if (planId) setActivePlanId(planId);
    setHomeView("plan");
  }, [planContext, activePlanId]);

  const nextInPlan = useCallback(() => {
    if (!planContext) return;
    const plan = library.plans[planContext.planId];
    const nextIndex = planContext.index + 1;
    const testId = plan?.testIds[nextIndex];
    const test = testId ? library.tests[testId] : undefined;
    if (!plan || !testId || !test) {
      backToPlan();
      return;
    }
    beginTest(
      test.payload,
      testId,
      { planId: planContext.planId, index: nextIndex },
      "status.nextStarted",
    );
  }, [planContext, library, beginTest, backToPlan]);

  const resetToSetup = useCallback(() => {
    setSession(
      mockConfig.enabled
        ? createMockInitialSession(false)
        : createInitialSessionState(),
    );
    setCurrentAnswer("");
    setCurrentTestId(null);
    setPlanContext(null);
    setActivePlanId(null);
    setHomeView("setup");
    recordedRef.current = false;
  }, []);

  const retryTest = useCallback(() => {
    if (mockConfig.enabled) {
      setSession(createMockInitialSession(false));
      setCurrentAnswer("");
      return;
    }

    recordedRef.current = false;
    setSession((prev) => {
      if (!prev.payload) return prev;
      return createSessionFromPayload(
        prev.payload,
        "status.readyAgain",
      );
    });
    setCurrentAnswer("");
  }, []);

  const deleteTest = useCallback((id: string) => {
    setLibrary((lib) => removeTest(lib, id));
  }, []);

  const deletePlan = useCallback((id: string) => {
    setLibrary((lib) => removePlan(lib, id));
  }, []);

  const deleteActivePlan = useCallback(() => {
    if (activePlanId) setLibrary((lib) => removePlan(lib, activePlanId));
    setActivePlanId(null);
    setHomeView("setup");
  }, [activePlanId]);

  const exportLibrary = useCallback(() => {
    downloadText(serializeLibrary(library), "learn-arena-bibliothek.json");
  }, [library]);

  const importLibraryFile = useCallback(
    async (file: File) => {
      try {
        const incoming = parseLibrary(await file.text());
        setLibrary((lib) => mergeLibrary(lib, incoming));
      } catch (error) {
        handlePayloadError(
          error instanceof Error
            ? error.message
            : t("setup.invalidPayload"),
        );
      }
    },
    [handlePayloadError, t],
  );

  const copyPlanGrading = useCallback(async () => {
    if (!activePlanId) return;
    const plan = library.plans[activePlanId];
    if (!plan) return;
    const done = getPlanTests(library, plan).filter((test) => test.lastResult);
    const text = buildPlanGradingExport(
      plan.title,
      done.map((test) => ({
        payload: test.payload,
        answers: test.lastResult!.answers,
      })),
    );
    await copyText(text);
  }, [activePlanId, library]);

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
        message: "status.questionStarted:1",
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
        message: `status.questionStarted:${nextIndex + 1}`,
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
        message: "status.finished",
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
          : [t("solution.empty")];

      const nextRequests = [...prev.solutionRequests];
      nextRequests[currentIndex] = used + 1;

      return {
        ...prev,
        solutionRequests: nextRequests,
        solutionRemaining: settings.solutionSeconds,
        solutionVisible: true,
        solutionTitle: t("solution.title", { title: question.title }),
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
      message: "done.answersCopied",
    }));
  };

  const handleDownloadAnswers = () => {
    const text = buildExportFromSession(session, currentAnswer);
    downloadText(text, "recall-benchmark-answer.txt");
  };

  const handleDownloadPayload = () => {
    if (!session.payload) return;

    downloadText(
      serializePayload(session.payload),
      buildPayloadFilename(session.payload),
    );
  };

  const handleCopyPrompt = async () => {
    await copyText(buildPayloadGenerationPrompt());
  };

  let content = null;

  const activePlan =
    homeView === "plan" && activePlanId ? library.plans[activePlanId] : null;

  if (step === "setup" && activePlan) {
    content = (
      <PlanView
        plan={activePlan}
        tests={getPlanTests(library, activePlan)}
        onStartTest={startTestInPlan}
        onCopyGrading={copyPlanGrading}
        onBack={resetToSetup}
        onDeletePlan={deleteActivePlan}
      />
    );
  } else if (step === "setup") {
    content = (
      <SetupStep
        message={translateMessage(session.message)}
        tests={listTests(library)}
        plans={listPlans(library)}
        onLoad={handleImport}
        onError={handlePayloadError}
        onCopyPrompt={handleCopyPrompt}
        onOpenTest={openTest}
        onOpenPlan={openPlan}
        onDeleteTest={deleteTest}
        onDeletePlan={deletePlan}
        onExportLibrary={exportLibrary}
        onImportLibraryFile={importLibraryFile}
      />
    );
  } else if (step === "ready" && session.payload) {
    content = (
      <ReadyStep
        mockMode={mockConfig.enabled}
        payload={session.payload}
        onStart={startTest}
        onReset={resetToSetup}
      />
    );
  } else if (step === "done" && session.payload) {
    const planActive = Boolean(planContext);
    const hasNextInPlan = planContext
      ? Boolean(
          library.plans[planContext.planId]?.testIds[planContext.index + 1],
        )
      : false;

    content = (
      <DoneStep
        payload={session.payload}
        planActive={planActive}
        hasNextInPlan={hasNextInPlan}
        onCopy={handleCopy}
        onDownloadAnswers={handleDownloadAnswers}
        onDownloadPayload={handleDownloadPayload}
        onRetry={retryTest}
        onReset={resetToSetup}
        onNextInPlan={nextInPlan}
        onBackToPlan={backToPlan}
      />
    );
  } else if (step === "active" && session.payload) {
    const currentQuestion =
      session.payload.questions[session.currentIndex];

    if (currentQuestion) {
      const hasMoreQuestions =
        session.currentIndex < session.payload.questions.length - 1;
      const hasAnswerInput = currentAnswer.trim().length > 0;

      content = (
        <ActiveStep
          mockMode={mockConfig.enabled}
          payload={session.payload}
          settings={session.settings}
          question={currentQuestion}
          questionVisible={isQuestionVisible(session)}
          roundEnded={session.roundEnded}
          currentAnswer={currentAnswer}
          answerDisabled={session.roundEnded}
          readRemaining={session.readRemaining}
          writeRemaining={session.writeRemaining}
          questionNumber={session.currentIndex + 1}
          totalQuestions={session.payload.questions.length}
          solutionReveals={getSolutionRevealsRemaining(session)}
          solutionRevealsMax={session.settings.maxSolutionRequestsPerQuestion}
          solutionTitle={session.solutionTitle}
          solutionParts={session.solutionParts}
          solutionRemaining={session.solutionRemaining}
          solutionVisible={session.solutionVisible}
          solutionAllowed={session.settings.allowSolution}
          solutionButtonDisabled={
            session.roundEnded ||
            session.solutionVisible ||
            (getSolutionRevealsRemaining(session) ?? 0) <= 0
          }
          nextLabel={
            !hasAnswerInput
              ? t("answer.skip")
              : hasMoreQuestions
                ? t("keyboard.next")
                : t("answer.finishQuestion")
          }
          nextDisabled={false}
          onAnswerChange={handleAnswerChange}
          onNext={handleNextOrFinish}
          onEndTest={endTest}
          onSolution={requestSolution}
        />
      );
    }
  }

  if (!content) return null;

  return (
    <>
      {content}
      <ThemeToggle />
      <GitHubAccessDialog />
      <LanguageToggle />
      <KeyboardShortcutsHelp step={step} />
    </>
  );
}
