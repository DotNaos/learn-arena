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
  buildPayloadGenerationPrompt,
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
import type { LearnPlan, LibraryTest } from "../domain/library";
import { HowToDialog } from "./HowToDialog";
import { LibraryPanel } from "./LibraryPanel";
import { ShortcutActionButton } from "./ShortcutActionButton";
import { useI18n } from "../i18n";

type SetupStepProps = {
  message: string;
  tests: LibraryTest[];
  plans: LearnPlan[];
  onLoad: (raw: string) => void;
  onError: (message: string) => void;
  onCopyPrompt: () => void;
  onOpenTest: (id: string) => void;
  onOpenPlan: (id: string) => void;
  onDeleteTest: (id: string) => void;
  onDeletePlan: (id: string) => void;
  onShareTest: (id: string) => void;
  onSharePlan: (id: string) => void;
  onExportLibrary: () => void;
  onImportLibraryFile: (file: File) => void;
};

type TutorialStepProps = {
  step: number;
  children: ReactNode;
};

function TutorialStep({ step, children }: TutorialStepProps) {
  return (
    <section className="flex gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
        {step}
      </div>
      <div className="min-w-0 flex-1 space-y-2.5 pt-px">{children}</div>
    </section>
  );
}

export function SetupStep({
  message,
  tests,
  plans,
  onLoad,
  onError,
  onCopyPrompt,
  onOpenTest,
  onOpenPlan,
  onDeleteTest,
  onDeletePlan,
  onShareTest,
  onSharePlan,
  onExportLibrary,
  onImportLibraryFile,
}: SetupStepProps) {
  const { t } = useI18n();
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pasteRef = useRef<HTMLTextAreaElement>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);
  const generationPrompt = useMemo(() => buildPayloadGenerationPrompt(), []);
  const chatGptUrl = buildChatGptUrl(generationPrompt);
  const claudeUrl = buildClaudeUrl(generationPrompt);

  const aiChatOptions = useMemo(
    () => [
      {
        id: "chatgpt" as const,
        href: chatGptUrl,
        icon: <ChatGptIcon />,
        label: t("setup.chatGpt"),
      },
      {
        id: "claude" as const,
        href: claudeUrl,
        icon: <ClaudeIcon />,
        label: t("setup.claude"),
      },
    ],
    [chatGptUrl, claudeUrl, t],
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
          : t("setup.invalidPayload"),
      );
    }
  }, [onError, onLoad, t]);

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
          : t("setup.invalidPayload"),
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
          : t("setup.invalidClipboard"),
      );
    }
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <main className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 py-6 sm:px-6">
        <div className="my-auto w-full max-w-sm space-y-8">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
              Learn Arena
            </h1>
            <HowToDialog />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.json,application/json,text/plain"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="space-y-5">
            <TutorialStep step={1}>
              <p className="text-xs leading-snug text-neutral-500 dark:text-neutral-500">
                {t("setup.step1")}
              </p>
              <div className="space-y-2">
                <AiChatOpenButton options={aiChatOptions} />
                <div className="flex items-center gap-2 py-0.5">
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                  <span className="text-[11px] text-neutral-400 dark:text-neutral-600">{t("setup.or")}</span>
                  <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <ShortcutActionButton
                  label={t("setup.copyPrompt")}
                  onAction={onCopyPrompt}
                  chord={CHORD_META_COMMA}
                  icon={<MessageSquareText className="h-3 w-3" />}
                  feedback={{
                    label: t("common.copied"),
                    icon: <Check className="h-3 w-3" strokeWidth={2.5} />,
                  }}
                  className="inline-flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-neutral-500 dark:text-neutral-500 transition-colors hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 hover:text-neutral-700 dark:hover:text-neutral-300"
                />
              </div>
            </TutorialStep>

            <TutorialStep step={2}>
              <p className="text-xs leading-snug text-neutral-500 dark:text-neutral-500">
                {t("setup.step2")}
              </p>
            </TutorialStep>

            <TutorialStep step={3}>
              <p className="text-xs leading-snug text-neutral-500 dark:text-neutral-500">
                {t("setup.step3")}
              </p>
              <div className="flex flex-col items-end gap-1.5">
                <ShortcutActionButton
                  label={t("setup.insert")}
                  onAction={handleClipboard}
                  chord={CHORD_META_ENTER}
                  icon={<ClipboardPaste className="h-3.5 w-3.5" />}
                  chipVariant="light"
                  labelClassName="text-xs font-medium"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900 dark:bg-neutral-100 px-4 py-2.5 text-xs font-medium text-neutral-50 dark:text-neutral-950 transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-300"
                />
                <div ref={moreOptionsRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={moreOptionsOpen}
                    aria-haspopup="dialog"
                    onClick={() => setMoreOptionsOpen((open) => !open)}
                    className="inline-flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-600 transition-colors hover:text-neutral-600 dark:hover:text-neutral-400"
                  >
                    {t("setup.more")}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${moreOptionsOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                  </button>
                  {moreOptionsOpen && (
                    <div
                      role="dialog"
                      aria-label={t("setup.uploadOptions")}
                      className="absolute right-0 bottom-[calc(100%+0.375rem)] z-10 w-72 space-y-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-4 shadow-xl shadow-black/40"
                    >
                      <textarea
                        ref={pasteRef}
                        rows={3}
                        spellCheck={false}
                        autoComplete="off"
                        onPaste={() => window.setTimeout(tryLoadFromPaste, 0)}
                        onInput={() => window.setTimeout(tryLoadFromPaste, 0)}
                        className="block h-20 w-full resize-none bg-transparent px-0 py-0 text-xs text-neutral-900 dark:text-neutral-100 outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                        placeholder={t("setup.pastePlaceholder")}
                      />
                      <div className="flex items-center gap-2 py-0.5">
                        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                        <span className="text-[11px] text-neutral-400 dark:text-neutral-600">{t("setup.or")}</span>
                        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 px-3 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
                      >
                        <Upload className="h-3 w-3" />
                        {t("setup.fileUpload")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </TutorialStep>
          </div>

          <LibraryPanel
            tests={tests}
            plans={plans}
            onOpenTest={onOpenTest}
            onOpenPlan={onOpenPlan}
            onDeleteTest={onDeleteTest}
            onDeletePlan={onDeletePlan}
            onShareTest={onShareTest}
            onSharePlan={onSharePlan}
            onExport={onExportLibrary}
            onImportFile={onImportLibraryFile}
          />

          {message && (
            <p className="text-center text-xs text-neutral-600 dark:text-neutral-400">{message}</p>
          )}
        </div>
      </main>
    </div>
  );
}
