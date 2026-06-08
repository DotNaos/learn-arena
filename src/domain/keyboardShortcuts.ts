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
  label: string;
  keys: string;
};

export function getShortcutsForStep(step: WizardStep): ShortcutEntry[] {
  switch (step) {
    case "setup":
      return [
        {
          label: "In ChatGPT öffnen",
          keys: formatChordLabel(CHORD_META_DOT),
        },
        {
          label: "Prompt kopieren",
          keys: formatChordLabel(CHORD_META_COMMA),
        },
        {
          label: "Einfügen",
          keys: formatChordLabel(CHORD_META_ENTER),
        },
      ];
    case "ready":
      return [
        {
          label: "Test starten",
          keys: formatChordLabel(CHORD_META_ENTER),
        },
      ];
    case "active":
      return [
        {
          label: "Naechste Frage",
          keys: formatChordLabel(CHORD_META_ENTER),
        },
        {
          label: "Loesung",
          keys: formatChordLabel(CHORD_META_DOT),
        },
        {
          label: "Test beenden",
          keys: formatChordLabel(CHORD_META_SLASH),
        },
      ];
    case "done":
      return [
        {
          label: "Antworten kopieren",
          keys: formatChordLabel(CHORD_META_ENTER),
        },
        {
          label: "Antworten als Datei",
          keys: formatChordLabel(CHORD_META_1),
        },
        {
          label: "Fragensatz herunterladen",
          keys: formatChordLabel(CHORD_META_2),
        },
        {
          label: "Gleichen Test wiederholen",
          keys: formatChordLabel(CHORD_META_3),
        },
        {
          label: "Neuen Fragensatz laden",
          keys: formatChordLabel(CHORD_META_4),
        },
      ];
  }
}
