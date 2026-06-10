import { Dialog } from "@base-ui/react/dialog";
import {
  ClipboardCopy,
  ClipboardPaste,
  HelpCircle,
  ListChecks,
  MessageSquareText,
  Sparkles,
  X,
} from "lucide-react";

const STEPS = [
  {
    icon: MessageSquareText,
    title: "KI-Chat oeffnen",
    text: 'Tippe auf "In ChatGPT oeffnen" (oder "Prompt kopieren"). Sag der KI kurz, was du uebst — optional ein PDF anhaengen.',
  },
  {
    icon: ClipboardCopy,
    title: "Fragensatz erhalten",
    text: "Die KI antwortet mit einem JSON-Codeblock. Kopiere ihn komplett.",
  },
  {
    icon: ClipboardPaste,
    title: "Hier einfuegen",
    text: 'Zurueck in Learn Arena auf "Einfuegen" — der Test startet automatisch.',
  },
  {
    icon: ListChecks,
    title: "Test machen",
    text: "Frage lesen, dann aus dem Kopf antworten. Offene Fragen tippst du, Single-/Multiple-Choice klickst du an. Mit „Ueberspringen“ geht es jederzeit weiter.",
  },
  {
    icon: Sparkles,
    title: "Bewerten lassen",
    text: 'Am Ende "Antworten kopieren" und zurueck in den ChatGPT-Chat einfuegen — die KI bewertet deine Antworten.',
  },
];

export function HowToDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100">
        <HelpCircle className="h-3.5 w-3.5" />
        Wie verwende ich das?
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 shadow-xl ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <div className="flex items-start justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 px-5 py-4">
            <div>
              <Dialog.Title className="text-base font-semibold tracking-tight">
                So funktioniert Learn Arena
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                In fuenf Schritten vom Thema zum bewerteten Test.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Schliessen"
              className="-mr-1.5 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 dark:text-neutral-600 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <ol className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
                    <step.icon className="h-4 w-4" />
                  </span>
                  {index < STEPS.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                  )}
                </div>
                <div className="min-w-0 pb-1">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {index + 1}. {step.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/50 px-5 py-3">
            <Dialog.Close className="flex w-full items-center justify-center rounded-xl bg-neutral-900 dark:bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-50 dark:text-neutral-950 transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-300">
              Los geht's
            </Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
