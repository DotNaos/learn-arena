import { Clipboard, Download, FileUp, RotateCcw } from "lucide-react";
import type { Payload } from "../domain/payload";
import { Button } from "./ui/button";

type DoneStepProps = {
  payload: Payload;
  onCopy: () => void;
  onDownload: () => void;
  onRetry: () => void;
  onReset: () => void;
};

export function DoneStep({
  payload,
  onCopy,
  onDownload,
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

          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={onCopy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-100 px-4 py-3.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <Clipboard className="h-4 w-4" />
              Antworten kopieren
            </button>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={onDownload}
              className="h-auto gap-1.5 px-1 py-1 text-xs text-neutral-500 hover:text-neutral-200"
            >
              <Download className="h-3.5 w-3.5" />
              Als Datei speichern
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-800 px-3 py-3 text-sm text-neutral-400 transition-colors hover:border-neutral-700 hover:bg-neutral-900 hover:text-neutral-200"
            >
              <RotateCcw className="h-4 w-4 shrink-0" />
              Gleichen Test wiederholen
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-800 px-3 py-3 text-sm text-neutral-400 transition-colors hover:border-neutral-700 hover:bg-neutral-900 hover:text-neutral-200"
            >
              <FileUp className="h-4 w-4 shrink-0" />
              Neuen Payload laden
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
