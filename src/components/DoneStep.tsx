import {
  ArrowRight,
  Braces,
  Check,
  Clipboard,
  Download,
  ExternalLink,
  FileUp,
  Layers,
  RotateCcw,
} from "lucide-react";
import {
  CHORD_META_1,
  CHORD_META_2,
  CHORD_META_3,
  CHORD_META_4,
} from "../hooks/keyboardChords";
import type { Payload } from "../domain/payload";
import { ChatGptIcon } from "./AiChatLink";
import { ShortcutActionButton } from "./ShortcutActionButton";

type DoneStepProps = {
  payload: Payload;
  planActive?: boolean;
  hasNextInPlan?: boolean;
  onCopy: () => void;
  onDownloadAnswers: () => void;
  onDownloadPayload: () => void;
  onRetry: () => void;
  onReset: () => void;
  onNextInPlan?: () => void;
  onBackToPlan?: () => void;
};

export function DoneStep({
  payload,
  planActive = false,
  hasNextInPlan = false,
  onCopy,
  onDownloadAnswers,
  onDownloadPayload,
  onRetry,
  onReset,
  onNextInPlan,
  onBackToPlan,
}: DoneStepProps) {
  return (
    <div className="flex h-dvh flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-lg text-center">
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {payload.title}
            </h1>
            <p className="mt-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-500 sm:text-sm">
              {planActive
                ? "Test abgeschlossen. Mach im Lernplan weiter — die Gesamt-Auswertung holst du dir am Ende im Plan."
                : `Alle ${payload.questions.length} Fragen abgeschlossen. Lass deine Antworten jetzt von der KI bewerten.`}
            </p>
          </div>

          {planActive ? (
            <div className="mb-6 flex w-full flex-col gap-2 text-left">
              {hasNextInPlan && onNextInPlan && (
                <ShortcutActionButton
                  label="Naechster Test"
                  onAction={onNextInPlan}
                  icon={<ArrowRight className="h-4 w-4" />}
                  chipVariant="light"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 px-4 py-3.5 text-sm font-medium text-neutral-50 dark:text-neutral-950 transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-300"
                />
              )}
              {onBackToPlan && (
                <button
                  type="button"
                  onClick={onBackToPlan}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <Layers className="h-4 w-4" />
                  Zurueck zum Lernplan
                </button>
              )}
            </div>
          ) : (
            <div className="mb-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/40 p-4 text-left">
              <ol className="space-y-1.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 sm:text-sm">
                <li>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    1.
                  </span>{" "}
                  Antworten kopieren.
                </li>
                <li>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    2.
                  </span>{" "}
                  Zurueck in deinen ChatGPT-Chat einfuegen — die KI bewertet deine
                  Antworten.
                </li>
              </ol>
            </div>
          )}

          <div className="flex w-full flex-col gap-3 text-left">
            {!planActive && (
              <>
                <ShortcutActionButton
                  label="Antworten kopieren"
                  onAction={onCopy}
                  icon={<Clipboard className="h-4 w-4" />}
                  feedback={{
                    label: "Kopiert",
                    icon: <Check className="h-4 w-4" strokeWidth={2.5} />,
                  }}
                  chipVariant="light"
                  className="flex w-full items-center gap-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 px-4 py-3.5 text-sm font-medium text-neutral-50 dark:text-neutral-950 transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-300"
                />

                <a
                  href="https://chatgpt.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <ChatGptIcon />
                  ChatGPT oeffnen
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600" />
                </a>
              </>
            )}

            <div className="flex items-center gap-2 py-0.5">
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
              <span className="text-[11px] text-neutral-400 dark:text-neutral-600">Optionen</span>
              <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            </div>

            <div className="flex flex-col gap-2">
              {planActive && (
                <ShortcutActionButton
                  label="Antworten dieses Tests kopieren"
                  onAction={onCopy}
                  icon={<Clipboard className="h-3.5 w-3.5" />}
                  feedback={{
                    label: "Kopiert",
                    icon: <Check className="h-3.5 w-3.5" strokeWidth={2.5} />,
                  }}
                  labelClassName="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  className="inline-flex w-full items-center gap-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 px-3 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
                />
              )}
              <ShortcutActionButton
                label="Antworten als Datei"
                onAction={onDownloadAnswers}
                chord={CHORD_META_1}
                icon={<Download className="h-3.5 w-3.5" />}
                labelClassName="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                className="inline-flex w-full items-center gap-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 px-3 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
              />
              <ShortcutActionButton
                label="Fragensatz herunterladen"
                onAction={onDownloadPayload}
                chord={CHORD_META_2}
                icon={<Braces className="h-3.5 w-3.5" />}
                labelClassName="text-xs font-medium text-neutral-700 dark:text-neutral-300"
                className="inline-flex w-full items-center gap-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 px-3 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 text-left">
            <ShortcutActionButton
              label="Gleichen Test wiederholen"
              onAction={onRetry}
              chord={CHORD_META_3}
              icon={<RotateCcw className="h-4 w-4 shrink-0" />}
              labelClassName="text-sm text-neutral-600 dark:text-neutral-400"
              className="inline-flex w-full items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 px-3 py-3 text-sm text-neutral-600 dark:text-neutral-400 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-800 dark:hover:text-neutral-200"
            />
            <ShortcutActionButton
              label="Neuen Fragensatz laden"
              onAction={onReset}
              chord={CHORD_META_4}
              icon={<FileUp className="h-4 w-4 shrink-0" />}
              labelClassName="text-sm text-neutral-600 dark:text-neutral-400"
              className="inline-flex w-full items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 px-3 py-3 text-sm text-neutral-600 dark:text-neutral-400 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-800 dark:hover:text-neutral-200"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
