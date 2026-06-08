import { useEffect, useState } from "react";
import { ArrowRight, LogOut } from "lucide-react";
import { countWords } from "../domain/session";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

type AnswerPanelProps = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  onNext?: () => void;
  onEndTest?: () => void;
  endTestDisabled?: boolean;
};

export function AnswerPanel({
  value,
  disabled,
  onChange,
  nextLabel = "Naechste Frage",
  nextDisabled = true,
  onNext,
  onEndTest,
  endTestDisabled = false,
}: AnswerPanelProps) {
  const [endTestOpen, setEndTestOpen] = useState(false);
  const [metaHeld, setMetaHeld] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey) setMetaHeld(true);

      if (
        event.key === "Enter" &&
        event.metaKey &&
        onNext &&
        !nextDisabled
      ) {
        event.preventDefault();
        onNext();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Meta" || !event.metaKey) setMetaHeld(false);
    };

    const onBlur = () => setMetaHeld(false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [onNext, nextDisabled]);

  const handleConfirmEndTest = () => {
    onEndTest?.();
    setEndTestOpen(false);
  };

  const hasAnswer = value.trim().length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col border-t border-neutral-800/80 pt-4 sm:pt-5">
      <div className="mb-2 flex shrink-0 items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-neutral-300">Antwort</h2>
        <span className="text-xs text-neutral-500">
          {countWords(value)} Woerter
        </span>
      </div>

      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            event.metaKey &&
            onNext &&
            !nextDisabled
          ) {
            event.preventDefault();
            onNext();
          }
        }}
        className="min-h-0 flex-1 resize-none rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 text-sm leading-relaxed text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-neutral-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
        placeholder="Starte den Test und schreibe die aktuelle Frage aus dem Kopf..."
      />

      {(onNext || onEndTest) && (
        <div className="mt-2 flex shrink-0 items-center justify-between gap-3">
          <div className="min-w-0">
            {onEndTest && (
              <>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  disabled={endTestDisabled}
                  onClick={() => setEndTestOpen(true)}
                  className="h-auto gap-1.5 px-1 py-0.5 text-xs text-neutral-500 hover:text-neutral-200"
                >
                  <LogOut className="h-3 w-3" />
                  Test beenden
                </Button>

                <AlertDialog open={endTestOpen} onOpenChange={setEndTestOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogMedia className="text-amber-400">
                        <LogOut />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Test wirklich beenden?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Der aktuelle Fortschritt bleibt gespeichert. Du kannst
                        danach die Antworten exportieren.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={handleConfirmEndTest}
                      >
                        Test beenden
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>

          {onNext && (
            <button
              type="button"
              disabled={nextDisabled}
              onClick={onNext}
              aria-label={nextLabel}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:border-transparent disabled:bg-neutral-800 disabled:text-neutral-600 ${
                hasAnswer
                  ? "bg-neutral-100 text-neutral-950 hover:bg-neutral-300"
                  : "border border-neutral-600 bg-neutral-800/90 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800 hover:text-neutral-100"
              }`}
            >
              <span className="relative inline-flex items-center">
                <span
                  className={`text-sm font-medium ${
                    metaHeld ? "text-transparent" : "opacity-100"
                  }`}
                >
                  {nextLabel}
                </span>
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-1 text-sm font-medium ${
                    metaHeld ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span>⌘</span>
                  <span className="font-normal opacity-50">+</span>
                  <span>↵</span>
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
