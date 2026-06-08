import { useRef } from "react";
import { ClipboardPaste, FileJson, Upload } from "lucide-react";

type PayloadLoaderProps = {
  payloadStatus: string;
  onLoad: (raw: string) => void;
  onError: (message: string) => void;
  disabled?: boolean;
};

export function PayloadLoader({
  payloadStatus,
  onLoad,
  onError,
  disabled = false,
}: PayloadLoaderProps) {
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
      const text = await file.text();
      onLoad(text);
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
      const text = await navigator.clipboard.readText();
      onLoad(text);
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : "Zwischenablage konnte nicht gelesen werden.",
      );
    }
  };

  return (
    <section className="mb-4 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-neutral-400">Aufgaben-Payload</p>
        <FileJson className="h-4 w-4 text-neutral-500" />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.json,application/json,text/plain"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      <textarea
        ref={pasteRef}
        rows={2}
        spellCheck={false}
        autoComplete="off"
        disabled={disabled}
        onPaste={() => window.setTimeout(tryLoadFromPaste, 0)}
        onInput={() => window.setTimeout(tryLoadFromPaste, 0)}
        className="mb-2 h-10 w-full resize-none rounded-xl border border-neutral-900 bg-neutral-950/30 px-3 py-2 text-xs text-transparent outline-none caret-neutral-400 placeholder:text-neutral-700 focus:border-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
        placeholder="Payload hier einfuegen..."
      />

      <div className="grid gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 px-4 py-3 text-sm font-medium text-neutral-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Upload className="h-4 w-4" />
          TXT/JSON hochladen
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={handleClipboard}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 px-4 py-3 text-sm font-medium text-neutral-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ClipboardPaste className="h-4 w-4" />
          Aus Zwischenablage laden
        </button>
      </div>

      <p className="mt-3 text-sm text-neutral-500">{payloadStatus}</p>
    </section>
  );
}
