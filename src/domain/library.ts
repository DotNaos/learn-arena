import type { Payload } from "./payload";

const STORAGE_KEY = "learn-arena:library:v1";

export type TestResult = {
  answers: string[];
  solutionRequests: number[];
  completedAt: string;
};

export type LibraryTest = {
  id: string;
  payload: Payload;
  createdAt: string;
  updatedAt: string;
  lastResult?: TestResult;
};

export type LearnPlan = {
  id: string;
  title: string;
  testIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type Library = {
  tests: Record<string, LibraryTest>;
  plans: Record<string, LearnPlan>;
};

export function createEmptyLibrary(): Library {
  return { tests: {}, plans: {} };
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function now(): string {
  return new Date().toISOString();
}

/** Stable signature of a test's content, used to avoid duplicate imports. */
function testSignature(payload: Payload): string {
  return JSON.stringify({
    title: payload.title,
    questions: payload.questions.map((q) => ({
      prompt: q.prompt,
      type: q.type,
      choices: q.choices,
    })),
  });
}

function isLibrary(value: unknown): value is Library {
  return (
    !!value &&
    typeof value === "object" &&
    "tests" in value &&
    "plans" in value &&
    typeof (value as Library).tests === "object" &&
    typeof (value as Library).plans === "object"
  );
}

export function loadLibrary(): Library {
  if (typeof window === "undefined") return createEmptyLibrary();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyLibrary();
    const parsed = JSON.parse(raw);
    return isLibrary(parsed) ? parsed : createEmptyLibrary();
  } catch {
    return createEmptyLibrary();
  }
}

export function saveLibrary(library: Library): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
  } catch {
    // ignore quota / private-mode errors
  }
}

/** Add a test; returns the existing id when an identical test is already saved. */
export function addTest(
  library: Library,
  payload: Payload,
): { library: Library; id: string } {
  const signature = testSignature(payload);
  const existing = Object.values(library.tests).find(
    (test) => testSignature(test.payload) === signature,
  );
  if (existing) {
    return { library, id: existing.id };
  }

  const id = newId();
  const timestamp = now();
  return {
    id,
    library: {
      ...library,
      tests: {
        ...library.tests,
        [id]: { id, payload, createdAt: timestamp, updatedAt: timestamp },
      },
    },
  };
}

export function removeTest(library: Library, id: string): Library {
  const tests = { ...library.tests };
  delete tests[id];

  const plans = Object.fromEntries(
    Object.entries(library.plans).map(([planId, plan]) => [
      planId,
      { ...plan, testIds: plan.testIds.filter((testId) => testId !== id) },
    ]),
  );

  return { tests, plans };
}

export function removePlan(library: Library, id: string): Library {
  const plans = { ...library.plans };
  delete plans[id];
  return { ...library, plans };
}

/** Import a plan: save all its tests (deduped) and create the plan over them. */
export function importPlan(
  library: Library,
  title: string,
  payloads: Payload[],
): { library: Library; planId: string } {
  let next = library;
  const testIds: string[] = [];

  for (const payload of payloads) {
    const result = addTest(next, payload);
    next = result.library;
    testIds.push(result.id);
  }

  const planId = newId();
  const timestamp = now();
  return {
    planId,
    library: {
      ...next,
      plans: {
        ...next.plans,
        [planId]: { id: planId, title, testIds, createdAt: timestamp, updatedAt: timestamp },
      },
    },
  };
}

export function recordResult(
  library: Library,
  testId: string,
  result: TestResult,
): Library {
  const test = library.tests[testId];
  if (!test) return library;

  return {
    ...library,
    tests: {
      ...library.tests,
      [testId]: { ...test, lastResult: result, updatedAt: result.completedAt },
    },
  };
}

export function listTests(library: Library): LibraryTest[] {
  return Object.values(library.tests).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

export function listPlans(library: Library): LearnPlan[] {
  return Object.values(library.plans).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
}

/** Resolve a plan's test ids into the actual saved tests (skips missing ones). */
export function getPlanTests(library: Library, plan: LearnPlan): LibraryTest[] {
  return plan.testIds
    .map((id) => library.tests[id])
    .filter((test): test is LibraryTest => Boolean(test));
}

export function serializeLibrary(library: Library): string {
  return JSON.stringify(library, null, 2);
}

export function parseLibrary(raw: string): Library {
  const parsed = JSON.parse(raw);
  if (!isLibrary(parsed)) {
    throw new Error("Datei ist keine gueltige Learn-Arena-Bibliothek.");
  }
  return parsed;
}

/** Merge an imported library into the current one (imported entries win on id clash). */
export function mergeLibrary(base: Library, incoming: Library): Library {
  return {
    tests: { ...base.tests, ...incoming.tests },
    plans: { ...base.plans, ...incoming.plans },
  };
}
