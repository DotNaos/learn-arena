import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Check,
  ChevronDown,
  ClipboardPaste,
  MessageSquareText,
  Upload,
} from "lucide-react";
import {
  buildChatGptUrl,
  buildClaudeUrl,
  PAYLOAD_GENERATION_PROMPT,
} from "../domain/payloadSchema";
import {
  CHORD_META_COMMA,
  CHORD_META_ENTER,
} from "../hooks/keyboardChords";
import {
  AiChatOpenButton,
  ChatGptIcon,
  ClaudeIcon,
} from "./AiChatLink";
import { ShortcutActionButton } from "./ShortcutActionButton";

type SetupStepProps = {
  message: string;
  onLoad: (raw: string) => void;
  onError: (message: string) => void;
  onCopyPrompt: () => void;
};

type TutorialStepProps = {
  step: number;
  children: ReactNode;
};

function TutorialStep({ step, children }: TutorialStepProps) {
  return (
    <section className="flex gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-[11px] font-semibold text-neutral-400">
        {step}
      </div>
      <div className="min-w-0 flex-1 space-y-2.5 pt-px">{children}</div>
    </section>
  );
}

export function SetupStep({
  message,
  onLoad,
  onError,
  onCopyPrompt,
}: SetupStepProps) {
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pasteRef = useRef<HTMLTextAreaElement>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);
  const chatGptUrl = buildChatGptUrl(PAYLOAD_GENERATION_PROMPT);
  const claudeUrl = buildClaudeUrl(PAYLOAD_GENERATION_PROMPT);

  const aiChatOptions = useMemo(
    () => [
      {
        id: "chatgpt" as const,
        href: chatGptUrl,
        icon: <ChatGptIcon />,
        label: "In ChatGPT öffnen",
      },
      {
        id: "claude" as const,
        href: claudeUrl,
        icon: <ClaudeIcon />,
        label: "In Claude öffnen",
      },
    ],
    [chatGptUrl, claudeUrl],
  );

  const tryLoadFromPaste = useCallback(() => {
    const raw = pasteRef.current?.value.trim();
    if (!raw) return;

    try {
      onLoad(raw);
      setMoreOptionsOpen(false);
      if (pasteRef.current) {
        pasteRef.current.value = "";
        pasteRef.current.blur();
      }
    } catch (error) {
      if (pasteRef.current) pasteRef.current.value = "";
      onError(
        error instanceof Error
          ? error.message
          : "Fragensatz konnte nicht geladen werden.",
      );
    }
  }, [onError, onLoad]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      onLoad(await file.text());
      setMoreOptionsOpen(false);
    } catch (error) {
      onError(
        error instanceof Error
          ? error.message
          : "Fragensatz konnte nicht geladen werden.",
      );
    } finally {
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (!moreOptionsOpen) return;

    const closeMenu = (event: MouseEvent) => {
      if (!moreOptionsRef.current?.contains(event.target as Node)) {
        setMoreOptionsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, [moreOptionsOpen]);

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
    <div className="flex h-dvh flex-col overflow-hidden bg-neutral-950 text-neutral-100">
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-6">
        <div className="w-full max-w-sm space-y-8">
          <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
            Learn Arena
          </h1>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.json,application/json,text/plain"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="space-y-5">
            <TutorialStep step={1}>
              <p className="text-xs leading-snug text-neutral-500">
                KI-Chat öffnen — kurz sagen was du übst, PDF anhängen, fertig.
                Optional: „will tunen“ für mehr Kontrolle.
              </p>
              <div className="space-y-2">
                <AiChatOpenButton options={aiChatOptions} />
                <div className="flex items-center gap-2 py-0.5">
                  <div className="h-px flex-1 bg-neutral-800" />
                  <span className="text-[11px] text-neutral-600">oder</span>
                  <div className="h-px flex-1 bg-neutral-800" />
                </div>
                <ShortcutActionButton
                  label="Prompt kopieren"
                  onAction={onCopyPrompt}
                  chord={CHORD_META_COMMA}
                  icon={<MessageSquareText className="h-3 w-3" />}
                  feedback={{
                    label: "Kopiert",
                    icon: <Check className="h-3 w-3" strokeWidth={2.5} />,
                  }}
                  className="inline-flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-neutral-500 transition-colors hover:bg-neutral-900/60 hover:text-neutral-300"
                />
              </div>
            </TutorialStep>

            <TutorialStep step={2}>
              <p className="text-xs leading-snug text-neutral-500">
                Nach dem Gespräch liefert die KI einen{" "}
                <span className="text-neutral-400">json</span>-Codeblock — den
                komplett kopieren.
              </p>
            </TutorialStep>

            <TutorialStep step={3}>
              <p className="text-xs leading-snug text-neutral-500">
                JSON hier einfügen — der Test startet automatisch.
              </p>
              <div className="flex flex-col items-end gap-1.5">
                <ShortcutActionButton
                  label="Einfügen"
                  onAction={handleClipboard}
                  chord={CHORD_META_ENTER}
                  icon={<ClipboardPaste className="h-3.5 w-3.5" />}
                  chipVariant="light"
                  labelClassName="text-xs font-medium"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-100 px-4 py-2.5 text-xs font-medium text-neutral-950 transition-colors hover:bg-neutral-300"
                />
                <div ref={moreOptionsRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={moreOptionsOpen}
                    aria-haspopup="dialog"
                    onClick={() => setMoreOptionsOpen((open) => !open)}
                    className="inline-flex items-center gap-1 text-[11px] text-neutral-600 transition-colors hover:text-neutral-400"
                  >
                    Weitere Optionen
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${moreOptionsOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {moreOptionsOpen && (
                    <div
                      role="dialog"
                      aria-label="Weitere Import-Optionen"
                      className="absolute right-0 bottom-[calc(100%+0.375rem)] z-10 w-72 space-y-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4 shadow-xl shadow-black/40"
                    >
                      <textarea
                        ref={pasteRef}
                        rows={3}
                        spellCheck={false}
                        autoComplete="off"
                        onPaste={() => window.setTimeout(tryLoadFromPaste, 0)}
                        onInput={() => window.setTimeout(tryLoadFromPaste, 0)}
                        className="block h-20 w-full resize-none bg-transparent px-0 py-0 text-xs text-neutral-100 outline-none placeholder:text-neutral-600"
                        placeholder="JSON einfügen…"
                      />
                      <div className="flex items-center gap-2 py-0.5">
                        <div className="h-px flex-1 bg-neutral-800" />
                        <span className="text-[11px] text-neutral-600">oder</span>
                        <div className="h-px flex-1 bg-neutral-800" />
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2.5 text-xs text-neutral-300 transition-colors hover:bg-neutral-800"
                      >
                        <Upload className="h-3 w-3" />
                        Datei hochladen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </TutorialStep>
          </div>

          {message && (
            <p className="text-center text-xs text-neutral-400">{message}</p>
          )}
        </div>
      </main>
    </div>
  );
}
