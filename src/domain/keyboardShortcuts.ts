import {
  CHORD_META_1,
  CHORD_META_2,
  CHORD_META_3,
  CHORD_META_4,
  CHORD_META_COMMA,
  CHORD_META_DOT,
  CHORD_META_ENTER,
  CHORD_META_SLASH,
  formatChordLabel,
} from "../hooks/keyboardChords";
import type { WizardStep } from "./wizard";

export type ShortcutEntry = {
  labelKey: string;
  keys: string;
};

export function getShortcutsForStep(step: WizardStep): ShortcutEntry[] {
  switch (step) {
    case "setup":
      return [
        {
          labelKey: "keyboard.openChat",
          keys: formatChordLabel(CHORD_META_DOT),
        },
        {
          labelKey: "keyboard.copyPrompt",
          keys: formatChordLabel(CHORD_META_COMMA),
        },
        {
          labelKey: "keyboard.insert",
          keys: formatChordLabel(CHORD_META_ENTER),
        },
      ];
    case "ready":
      return [
        {
          labelKey: "keyboard.start",
          keys: formatChordLabel(CHORD_META_ENTER),
        },
      ];
    case "active":
      return [
        {
          labelKey: "keyboard.next",
          keys: formatChordLabel(CHORD_META_ENTER),
        },
        {
          labelKey: "keyboard.solution",
          keys: formatChordLabel(CHORD_META_DOT),
        },
        {
          labelKey: "keyboard.endTest",
          keys: formatChordLabel(CHORD_META_SLASH),
        },
      ];
    case "done":
      return [
        {
          labelKey: "keyboard.copyAnswers",
          keys: formatChordLabel(CHORD_META_ENTER),
        },
        {
          labelKey: "keyboard.downloadAnswers",
          keys: formatChordLabel(CHORD_META_1),
        },
        {
          labelKey: "keyboard.downloadPayload",
          keys: formatChordLabel(CHORD_META_2),
        },
        {
          labelKey: "keyboard.retry",
          keys: formatChordLabel(CHORD_META_3),
        },
        {
          labelKey: "keyboard.loadNew",
          keys: formatChordLabel(CHORD_META_4),
        },
      ];
  }
}
