import type { Question } from "./payload";

/** Letters used to label choice options (A, B, C, …). */
export function choiceLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

export function isChoiceQuestion(question: Question | null | undefined): boolean {
  return question?.type === "single" || question?.type === "multiple";
}

/** Parse the stored selection string ("0,2") into sorted indices. */
export function parseChoiceSelection(answer: string): number[] {
  if (!answer) return [];
  const indices = answer
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isInteger(value) && value >= 0);
  return Array.from(new Set(indices)).sort((a, b) => a - b);
}

/** Serialize selected indices back into the canonical "0,2" string. */
export function formatChoiceSelection(indices: number[]): string {
  return Array.from(new Set(indices))
    .filter((value) => Number.isInteger(value) && value >= 0)
    .sort((a, b) => a - b)
    .join(",");
}

/** Toggle an option for single (replace) or multiple (add/remove) choice. */
export function toggleChoiceSelection(
  current: number[],
  index: number,
  multiple: boolean,
): number[] {
  if (!multiple) return [index];
  return current.includes(index)
    ? current.filter((value) => value !== index)
    : [...current, index];
}

/** Human-readable selected option texts, in option order. */
export function getChoiceAnswerLines(
  question: Question,
  answer: string,
): string[] {
  return parseChoiceSelection(answer)
    .filter((index) => index < question.choices.length)
    .map((index) => `${choiceLetter(index)}) ${question.choices[index]}`);
}
