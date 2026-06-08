import { useEffect, useRef } from "react";
import {
  eventMatchesChordKey,
  matchesChord,
  type ChordHighlightState,
  type KeyboardChord,
} from "./keyboardChords";

type UseKeyboardActionOptions = {
  chord: KeyboardChord;
  enabled?: boolean;
  onAction: () => void;
  allowInEditable?: boolean;
  resetDep?: unknown;
  onChordHighlightChange?: (state: ChordHighlightState) => void;
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
}

function shouldHandleShortcut(
  event: KeyboardEvent,
  chord: KeyboardChord,
  allowInEditable: boolean,
): boolean {
  if (!matchesChord(event, chord)) return false;

  if (event.target instanceof HTMLButtonElement && !chord.meta) {
    return false;
  }

  const editable = isEditableTarget(event.target);
  if (!editable) return true;

  return allowInEditable && Boolean(chord.meta);
}

function resolveHighlight(
  event: KeyboardEvent,
  chord: KeyboardChord,
): ChordHighlightState {
  if (chord.meta && !event.metaKey) return "idle";
  if (matchesChord(event, chord)) return "active";
  if (chord.meta && event.metaKey) return "partial";
  return "idle";
}

export function useKeyboardAction({
  chord,
  enabled = true,
  onAction,
  allowInEditable = false,
  resetDep,
  onChordHighlightChange,
}: UseKeyboardActionOptions): void {
  const chordReadyRef = useRef(true);
  const enabledRef = useRef(enabled);
  const onActionRef = useRef(onAction);

  enabledRef.current = enabled;
  onActionRef.current = onAction;

  useEffect(() => {
    chordReadyRef.current = true;
  }, [resetDep]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      onChordHighlightChange?.(resolveHighlight(event, chord));

      if (
        !enabledRef.current ||
        !shouldHandleShortcut(event, chord, allowInEditable) ||
        !chordReadyRef.current ||
        event.repeat
      ) {
        return;
      }

      event.preventDefault();
      chordReadyRef.current = false;
      onActionRef.current();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (eventMatchesChordKey(event, chord.key)) {
        chordReadyRef.current = true;
      }

      if (
        event.key === "Meta" ||
        eventMatchesChordKey(event, chord.key) ||
        !event.metaKey
      ) {
        onChordHighlightChange?.(
          event.metaKey && chord.meta ? "partial" : "idle",
        );
      }
    };

    const onBlur = () => {
      chordReadyRef.current = true;
      onChordHighlightChange?.("idle");
    };

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("blur", onBlur);
      onChordHighlightChange?.("idle");
    };
  }, [allowInEditable, chord, onChordHighlightChange]);
}
