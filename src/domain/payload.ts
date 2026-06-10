import {
  SOLUTION_SECONDS_DEFAULT,
  SOLUTION_SECONDS_MAX,
  SOLUTION_SECONDS_MIN,
} from "./payloadSchema";

export const DEFAULT_SETTINGS = {
  readSeconds: 45,
  writeSeconds: 180,
  solutionSeconds: SOLUTION_SECONDS_DEFAULT,
  maxSolutionRequestsPerQuestion: 1,
  allowSolution: true,
  hideQuestionAfterRead: true,
} as const;

export type Settings = {
  readSeconds: number;
  writeSeconds: number;
  solutionSeconds: number;
  maxSolutionRequestsPerQuestion: number;
  allowSolution: boolean;
  hideQuestionAfterRead: boolean;
};

export type QuestionType = "open" | "single" | "multiple";

export type Question = {
  title: string;
  prompt: string;
  type: QuestionType;
  choices: string[];
  correctChoices: number[];
  solution: string[];
};

export type Payload = {
  title: string;
  topic: string;
  mode: string;
  task: string;
  questions: Question[];
  settings: Settings;
};

type RawQuestion = string | {
  title?: string;
  prompt?: string;
  question?: string;
  type?: string;
  choices?: unknown;
  options?: unknown;
  correct?: unknown;
  correctChoices?: unknown;
  answer?: unknown;
  solution?: string | string[];
};

type RawPayload = {
  title?: string;
  topic?: string;
  mode?: string;
  task?: string;
  questions?: RawQuestion[];
  settings?: Partial<Settings>;
};

export function normalizeText(text: unknown): string {
  return String(text ?? "").replaceAll("\\n", "\n");
}

export function formatSolutionParts(content: string | string[]): string[] {
  if (Array.isArray(content)) {
    return content.map(normalizeText).filter(Boolean);
  }
  return normalizeText(content).split("\n").filter(Boolean);
}

function normalizeChoices(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeText).map((value) => value.trim()).filter(Boolean);
}

function normalizeCorrectChoices(raw: unknown, choiceCount: number): number[] {
  const list = Array.isArray(raw) ? raw : raw === undefined ? [] : [raw];
  const indices = list
    .map((value) => Number(value))
    .filter(
      (value) => Number.isInteger(value) && value >= 0 && value < choiceCount,
    );
  return Array.from(new Set(indices)).sort((a, b) => a - b);
}

function normalizeQuestion(item: RawQuestion, index: number): Question {
  if (typeof item === "string") {
    return {
      title: `Frage ${index + 1}`,
      prompt: item,
      type: "open",
      choices: [],
      correctChoices: [],
      solution: [],
    };
  }

  const rawSolution = item.solution;
  const solution = rawSolution === undefined
    ? []
    : formatSolutionParts(rawSolution);

  const choices = normalizeChoices(item.choices ?? item.options);
  const hasChoices = choices.length > 0;
  const requestedType = String(item.type ?? "").toLowerCase();
  const type: QuestionType = !hasChoices
    ? "open"
    : requestedType === "multiple"
      ? "multiple"
      : "single";
  const correctChoices = hasChoices
    ? normalizeCorrectChoices(
        item.correct ?? item.correctChoices ?? item.answer,
        choices.length,
      )
    : [];

  return {
    title: item.title || `Frage ${index + 1}`,
    prompt: item.prompt || item.question || "",
    type,
    choices,
    correctChoices,
    solution,
  };
}

function stripCodeFence(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

export function normalizePayload(raw: string): Payload {
  const parsed = JSON.parse(stripCodeFence(raw)) as RawPayload;

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Payload ist kein JSON-Objekt.");
  }
  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error("Feld 'questions' muss eine nicht-leere Liste sein.");
  }

  const nextSettings: Settings = {
    ...DEFAULT_SETTINGS,
    ...(parsed.settings || {}),
  };

  nextSettings.readSeconds = Number(nextSettings.readSeconds);
  nextSettings.writeSeconds = Number(nextSettings.writeSeconds);
  nextSettings.solutionSeconds = Number(nextSettings.solutionSeconds);
  nextSettings.maxSolutionRequestsPerQuestion = Number(
    nextSettings.maxSolutionRequestsPerQuestion,
  );
  nextSettings.allowSolution = Boolean(nextSettings.allowSolution);
  nextSettings.hideQuestionAfterRead = Boolean(nextSettings.hideQuestionAfterRead);

  if (nextSettings.readSeconds < 0 || nextSettings.writeSeconds <= 0) {
    throw new Error("Timer-Werte sind ungueltig.");
  }

  if (
    Number.isNaN(nextSettings.solutionSeconds) ||
    nextSettings.solutionSeconds < SOLUTION_SECONDS_MIN ||
    nextSettings.solutionSeconds > SOLUTION_SECONDS_MAX
  ) {
    throw new Error(
      `'solutionSeconds' muss zwischen ${SOLUTION_SECONDS_MIN} und ${SOLUTION_SECONDS_MAX} liegen.`,
    );
  }

  return {
    title: parsed.title || "Recall Test",
    topic: parsed.topic || "Benchmark",
    mode: parsed.mode || "per-question",
    task: parsed.task || "",
    questions: parsed.questions.map(normalizeQuestion),
    settings: nextSettings,
  };
}
