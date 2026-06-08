export const DEFAULT_SETTINGS = {
  readSeconds: 45,
  writeSeconds: 180,
  solutionSeconds: 10,
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

export type Question = {
  title: string;
  prompt: string;
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

function normalizeQuestion(item: RawQuestion, index: number): Question {
  if (typeof item === "string") {
    return {
      title: `Frage ${index + 1}`,
      prompt: item,
      solution: [],
    };
  }

  const rawSolution = item.solution;
  const solution = rawSolution === undefined
    ? []
    : formatSolutionParts(rawSolution);

  return {
    title: item.title || `Frage ${index + 1}`,
    prompt: item.prompt || item.question || "",
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

  return {
    title: parsed.title || "Recall Test",
    topic: parsed.topic || "Benchmark",
    mode: parsed.mode || "per-question",
    task: parsed.task || "",
    questions: parsed.questions.map(normalizeQuestion),
    settings: nextSettings,
  };
}
