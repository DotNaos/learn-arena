import { Braces, Check, Clipboard, Download, FileUp, RotateCcw } from "lucide-react";
import {
  CHORD_META_1,
  CHORD_META_2,
  CHORD_META_3,
  CHORD_META_4,
} from "../hooks/keyboardChords";
import type { Payload } from "../domain/payload";
import { ShortcutActionButton } from "./ShortcutActionButton";

type DoneStepProps = {
  payload: Payload;
  onCopy: () => void;
  onDownloadAnswers: () => void;
  onDownloadPayload: () => void;
  onRetry: () => void;
  onReset: () => void;
};

export function DoneStep({
  payload,
  onCopy,
  onDownloadAnswers,
  onDownloadPayload,
  onRetry,
  onReset,
}: DoneStepProps) {
  return (
    <div className="flex h-dvh flex-col bg-neutral-950 text-neutral-100">
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-lg text-center">
          <div className="mb-10 sm:mb-12">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {payload.title}
            </h1>
            <p className="mt-3 text-xs leading-relaxed text-neutral-500 sm:text-sm">
              Alle {payload.questions.length} Fragen abgeschlossen. Deine
              Antworten sind bereit zum Export.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 text-left">
            <ShortcutActionButton
              label="Antworten kopieren"
              onAction={onCopy}
              icon={<Clipboard className="h-4 w-4" />}
              feedback={{
                label: "Kopiert",
                icon: <Check className="h-4 w-4" strokeWidth={2.5} />,
              }}
              chipVariant="light"
              className="flex w-full items-center gap-2 rounded-xl bg-neutral-100 px-4 py-3.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-300"
            />

            <div className="flex items-center gap-2 py-0.5">
              <div className="h-px flex-1 bg-neutral-800" />
              <span className="text-[11px] text-neutral-600">Optionen</span>
              <div className="h-px flex-1 bg-neutral-800" />
            </div>

            <div className="flex flex-col gap-2">
              <ShortcutActionButton
                label="Antworten als Datei"
                onAction={onDownloadAnswers}
                chord={CHORD_META_1}
                icon={<Download className="h-3.5 w-3.5" />}
                labelClassName="text-xs font-medium text-neutral-300"
                className="inline-flex w-full items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2.5 text-xs text-neutral-300 transition-colors hover:bg-neutral-800"
              />
              <ShortcutActionButton
                label="Fragensatz herunterladen"
                onAction={onDownloadPayload}
                chord={CHORD_META_2}
                icon={<Braces className="h-3.5 w-3.5" />}
                labelClassName="text-xs font-medium text-neutral-300"
                className="inline-flex w-full items-center gap-2 rounded-lg bg-neutral-900 px-3 py-2.5 text-xs text-neutral-300 transition-colors hover:bg-neutral-800"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 text-left">
            <ShortcutActionButton
              label="Gleichen Test wiederholen"
              onAction={onRetry}
              chord={CHORD_META_3}
              icon={<RotateCcw className="h-4 w-4 shrink-0" />}
              labelClassName="text-sm text-neutral-400"
              className="inline-flex w-full items-center gap-2 rounded-xl border border-neutral-800 px-3 py-3 text-sm text-neutral-400 transition-colors hover:border-neutral-700 hover:bg-neutral-900 hover:text-neutral-200"
            />
            <ShortcutActionButton
              label="Neuen Fragensatz laden"
              onAction={onReset}
              chord={CHORD_META_4}
              icon={<FileUp className="h-4 w-4 shrink-0" />}
              labelClassName="text-sm text-neutral-400"
              className="inline-flex w-full items-center gap-2 rounded-xl border border-neutral-800 px-3 py-3 text-sm text-neutral-400 transition-colors hover:border-neutral-700 hover:bg-neutral-900 hover:text-neutral-200"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
