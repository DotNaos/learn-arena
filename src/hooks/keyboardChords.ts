export type KeyboardChord = {
  key: string;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
};

export const CHORD_META_ENTER: KeyboardChord = { meta: true, key: "Enter" };
export const CHORD_META_COMMA: KeyboardChord = { meta: true, key: "," };
export const CHORD_META_DOT: KeyboardChord = { meta: true, key: "." };
export const CHORD_META_SLASH: KeyboardChord = { meta: true, key: "/" };
export const CHORD_META_1: KeyboardChord = { meta: true, key: "1" };
export const CHORD_META_2: KeyboardChord = { meta: true, key: "2" };
export const CHORD_META_3: KeyboardChord = { meta: true, key: "3" };
export const CHORD_META_4: KeyboardChord = { meta: true, key: "4" };

export type ChordHighlightState = "idle" | "partial" | "active";

const MODIFIER_CHIP_PARTS = new Set(["⌘", "⌥", "⇧"]);

export function getChordParts(chord: KeyboardChord): string[] {
  const parts: string[] = [];

  if (chord.meta) parts.push("⌘");
  if (chord.alt) parts.push("⌥");
  if (chord.shift) parts.push("⇧");

  if (chord.key === "Enter") {
    parts.push("↵");
  } else {
    parts.push(chord.key);
  }

  return parts;
}

export function isModifierChordPart(part: string): boolean {
  return MODIFIER_CHIP_PARTS.has(part);
}

export function formatChordLabel(chord: KeyboardChord): string {
  return getChordParts(chord).join(" + ");
}

export function eventMatchesChordKey(
  event: KeyboardEvent,
  key: string,
): boolean {
  if (key === "Enter") return event.key === "Enter";
  return event.key === key;
}

export function matchesChord(
  event: KeyboardEvent,
  chord: KeyboardChord,
): boolean {
  if (!eventMatchesChordKey(event, chord.key)) return false;
  if (!!chord.meta !== event.metaKey) return false;
  if (!!chord.shift !== event.shiftKey) return false;
  if (!!chord.alt !== event.altKey) return false;
  return true;
}
