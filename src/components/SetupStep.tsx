import { useRef } from "react";
import { Braces, ClipboardPaste, Upload } from "lucide-react";
import { WizardProgress } from "./WizardProgress";

type SetupStepProps = {
  message: string;
  onLoad: (raw: string) => void;
  onError: (message: string) => void;
  onCopySchema: () => void;
};

export function SetupStep({
  message,
  onLoad,
  onError,
  onCopySchema,
}: SetupStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pasteRef = useRef<HTMLTextAreaElement>(null);

  const tryLoadFromPaste = () => {
    const raw = pasteRef.current?.value.trim();
    if (!raw) return;

    try {
      onLoad(raw);
      if (pasteRef.current) {
        pasteRef.current.value = "";
        pasteRef.current.blur();
      }
    } catch (error) {
      if (pasteRef.current) pasteRef.current.value = "";
      onError(
        error instanceof Error
          ? error.message
          : "Payload konnte nicht geladen werden.",
      );
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      onLoad(await file.text());
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : "Payload konnte nicht geladen werden.",
      );
    } finally {
      event.target.value = "";
    }
  };

  const handleClipboard = async () => {
    try {
      onLoad(await navigator.clipboard.readText());
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : "Zwischenablage konnte nicht gelesen werden.",
      );
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-neutral-950 text-neutral-100">
      <header className="shrink-0 border-b border-neutral-800/80 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-lg">
          <p className="mb-3 text-center text-xs text-neutral-500">Learn Arena</p>
          <WizardProgress current="setup" />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Payload laden
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Fuege deinen JSON-Payload ein, lade ihn hoch oder hole ihn aus der
              Zwischenablage. Erst danach startet der Recall-Test.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.json,application/json,text/plain"
            className="hidden"
            onChange={handleFileChange}
          />

          <textarea
            ref={pasteRef}
            rows={6}
            spellCheck={false}
            autoComplete="off"
            onPaste={() => window.setTimeout(tryLoadFromPaste, 0)}
            onInput={() => window.setTimeout(tryLoadFromPaste, 0)}
            className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-neutral-600"
            placeholder='{"title":"...","questions":[...]}'
          />

          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 px-4 py-2.5 text-sm text-neutral-200 hover:bg-neutral-800"
            >
              <Upload className="h-4 w-4" />
              TXT/JSON hochladen
            </button>
            <button
              type="button"
              onClick={handleClipboard}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 px-4 py-2.5 text-sm text-neutral-200 hover:bg-neutral-800"
            >
              <ClipboardPaste className="h-4 w-4" />
              Aus Zwischenablage
            </button>
            <button
              type="button"
              onClick={onCopySchema}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 px-4 py-2.5 text-sm text-neutral-200 hover:bg-neutral-800"
            >
              <Braces className="h-4 w-4" />
              Schema kopieren
            </button>
          </div>

          {message && (
            <p className="text-center text-sm text-neutral-400">{message}</p>
          )}
        </div>
      </main>
    </div>
  );
}
