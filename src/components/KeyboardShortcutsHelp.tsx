import { Info } from "lucide-react";
import { getShortcutsForStep } from "../domain/keyboardShortcuts";
import type { WizardStep } from "../domain/wizard";
import { useI18n } from "../i18n";

type KeyboardShortcutsHelpProps = {
  step: WizardStep;
};

export function KeyboardShortcutsHelp({ step }: KeyboardShortcutsHelpProps) {
  const { t } = useI18n();
  const shortcuts = getShortcutsForStep(step);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
      <div className="group pointer-events-auto relative">
        <button
          type="button"
          aria-label={t("keyboard.title")}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/90 dark:border-neutral-800/90 bg-neutral-50/90 dark:bg-neutral-950/90 text-neutral-500 dark:text-neutral-500 shadow-sm backdrop-blur-sm transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          <Info className="h-4 w-4" />
        </button>

        <div
          role="tooltip"
          className="pointer-events-none absolute right-0 bottom-full mb-2 w-56 origin-bottom-right scale-95 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 px-3 py-2.5 text-left opacity-0 shadow-xl transition-all duration-150 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100"
        >
          <p className="mb-2 text-[10px] font-medium tracking-wide text-neutral-500 dark:text-neutral-500 uppercase">
            {t("keyboard.title")}
          </p>
          <ul className="space-y-1.5">
            {shortcuts.map((shortcut) => (
              <li
                key={shortcut.labelKey}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="text-neutral-600 dark:text-neutral-400">{t(shortcut.labelKey)}</span>
                <span className="shrink-0 font-medium tabular-nums text-neutral-800 dark:text-neutral-200">
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
