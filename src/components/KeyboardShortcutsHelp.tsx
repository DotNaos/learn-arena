import { Info } from "lucide-react";
import { getShortcutsForStep } from "../domain/keyboardShortcuts";
import type { WizardStep } from "../domain/wizard";

type KeyboardShortcutsHelpProps = {
  step: WizardStep;
};

export function KeyboardShortcutsHelp({ step }: KeyboardShortcutsHelpProps) {
  const shortcuts = getShortcutsForStep(step);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
      <div className="group pointer-events-auto relative">
        <button
          type="button"
          aria-label="Tastaturkuerzel"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-800/90 bg-neutral-950/90 text-neutral-500 shadow-sm backdrop-blur-sm transition-colors hover:border-neutral-700 hover:text-neutral-300"
        >
          <Info className="h-4 w-4" />
        </button>

        <div
          role="tooltip"
          className="pointer-events-none absolute right-0 bottom-full mb-2 w-56 origin-bottom-right scale-95 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-left opacity-0 shadow-xl transition-all duration-150 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100"
        >
          <p className="mb-2 text-[10px] font-medium tracking-wide text-neutral-500 uppercase">
            Tastaturkuerzel
          </p>
          <ul className="space-y-1.5">
            {shortcuts.map((shortcut) => (
              <li
                key={shortcut.label}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="text-neutral-400">{shortcut.label}</span>
                <span className="shrink-0 font-medium tabular-nums text-neutral-200">
                  {shortcut.keys}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
