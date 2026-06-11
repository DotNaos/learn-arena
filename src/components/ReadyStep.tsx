import { FileUp, Play } from "lucide-react";
import type { Payload } from "../domain/payload";
import { MockModeBadge } from "./MockModeBadge";
import { ShortcutActionButton } from "./ShortcutActionButton";
import { useI18n } from "../i18n";

type ReadyStepProps = {
  mockMode?: boolean;
  payload: Payload;
  onStart: () => void;
  onReset: () => void;
};

export function ReadyStep({
  mockMode = false,
  payload,
  onStart,
  onReset,
}: ReadyStepProps) {
  const { t } = useI18n();
  const { settings } = payload;
  const questionCount = payload.questions.length;

  return (
    <div className="flex h-dvh flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-lg text-center">
          <div className="mb-10 sm:mb-12">
            <div className="inline-flex max-w-full items-center justify-center gap-2 sm:gap-2.5">
              {mockMode && <MockModeBadge />}
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {payload.title}
              </h1>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-500 sm:text-sm">
              {t("ready.description", {
                count: questionCount,
                read: settings.readSeconds,
                write: settings.writeSeconds,
              })}
            </p>
          </div>

          <ShortcutActionButton
            label={t("ready.start")}
            onAction={onStart}
            icon={<Play className="h-4 w-4" />}
            chipVariant="light"
            className="inline-flex min-w-56 items-center gap-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 px-5 py-3.5 text-sm font-medium text-neutral-50 dark:text-neutral-950 transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-300"
          />

          <button
            type="button"
            onClick={onReset}
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <FileUp className="h-3.5 w-3.5 shrink-0" />
            {t("ready.change")}
          </button>
        </div>
      </main>
    </div>
  );
}
