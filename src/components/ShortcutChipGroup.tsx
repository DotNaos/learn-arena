import {
  getChordParts,
  isModifierChordPart,
  type ChordHighlightState,
  type KeyboardChord,
} from "../hooks/keyboardChords";

type ShortcutChipGroupProps = {
  chord: KeyboardChord;
  highlight?: ChordHighlightState;
  variant?: "dark" | "light";
  className?: string;
};

type ChipTone = ChordHighlightState;

const CHIP_STYLES: Record<
  "dark" | "light",
  Record<ChipTone, string>
> = {
  dark: {
    idle: "bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500",
    partial: "bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 ring-1 ring-neutral-400/70 dark:ring-neutral-600/70",
    active:
      "bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-950 shadow-[0_0_10px_rgba(255,255,255,0.4)]",
  },
  light: {
    idle: "bg-neutral-800/90 dark:bg-neutral-200/90 text-neutral-500 dark:text-neutral-500",
    partial: "bg-neutral-700 dark:bg-neutral-300 text-neutral-200 dark:text-neutral-800",
    active: "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
  },
};

function getChipTone(
  part: string,
  highlight: ChordHighlightState,
): ChipTone {
  if (highlight === "active") return "active";
  if (highlight === "partial" && isModifierChordPart(part)) return "partial";
  return "idle";
}

export function ShortcutChipGroup({
  chord,
  highlight = "idle",
  variant = "dark",
  className = "",
}: ShortcutChipGroupProps) {
  const parts = getChordParts(chord);
  const styles = CHIP_STYLES[variant];

  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center gap-0.5 ${className}`}
    >
      {parts.map((part) => {
        const tone = getChipTone(part, highlight);

        return (
          <span
            key={part}
            className={`rounded px-1.5 py-0.5 text-[10px] font-medium leading-none transition-all duration-150 ${styles[tone]}`}
          >
            {part}
          </span>
        );
      })}
    </span>
  );
}
