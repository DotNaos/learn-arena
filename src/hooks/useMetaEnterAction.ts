import { useState } from "react";
import {
  CHORD_META_ENTER,
  formatChordLabel,
  type ChordHighlightState,
  type KeyboardChord,
} from "./keyboardChords";
import { useKeyboardAction } from "./useKeyboardAction";

export const META_ENTER_SHORTCUT = formatChordLabel(CHORD_META_ENTER);

type UseMetaShortcutOptions = {
  chord: KeyboardChord;
  onAction: () => void;
  enabled?: boolean;
  allowInEditable?: boolean;
  resetDep?: unknown;
};

export function useMetaShortcut({
  chord,
  onAction,
  enabled = true,
  allowInEditable = false,
  resetDep,
}: UseMetaShortcutOptions): ChordHighlightState {
  const [highlight, setHighlight] = useState<ChordHighlightState>("idle");

  useKeyboardAction({
    chord,
    enabled,
    onAction,
    allowInEditable,
    resetDep,
    onChordHighlightChange: setHighlight,
  });

  return highlight;
}

type UseMetaEnterActionOptions = Omit<UseMetaShortcutOptions, "chord">;

export function useMetaEnterAction(
  options: UseMetaEnterActionOptions,
): ChordHighlightState {
  return useMetaShortcut({ ...options, chord: CHORD_META_ENTER });
}
