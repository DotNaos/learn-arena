import {
  ArrowRight,
  Clipboard,
  Download,
  Eye,
  LifeBuoy,
  Lightbulb,
  ListChecks,
  Play,
  Timer,
} from "lucide-react";
import type { Settings } from "../domain/payload";
import type { SessionBadge } from "../domain/session";
import { CircularTimer } from "./CircularTimer";
import { PayloadLoader } from "./PayloadLoader";

type SessionSidebarProps = {
  stateBadge: SessionBadge;
  payloadStatus: string;
  progressLabel: string;
  readRemaining: number;
  writeRemaining: number;
  settings: Settings;
  solutionRevealsRemaining: number | null;
  message: string;
  startDisabled: boolean;
  nextDisabled: boolean;
  solutionDisabled: boolean;
  payloadLoadingDisabled: boolean;
  onLoadPayload: (raw: string) => void;
  onPayloadError: (message: string) => void;
  onStart: () => void;
  onNext: () => void;
  onSolution: () => void;
  onCopy: () => void;
  onDownload: () => void;
};

export function SessionSidebar({
  stateBadge,
  payloadStatus,
  progressLabel,
  readRemaining,
  writeRemaining,
  settings,
  solutionRevealsRemaining,
  message,
  startDisabled,
  nextDisabled,
  solutionDisabled,
  payloadLoadingDisabled,
  onLoadPayload,
  onPayloadError,
  onStart,
  onNext,
  onSolution,
  onCopy,
  onDownload,
}: SessionSidebarProps) {
  return (
    <aside className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium">Session</h2>
        <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-300">
          {stateBadge}
        </span>
      </div>

      <PayloadLoader
        payloadStatus={payloadStatus}
        onLoad={onLoadPayload}
        onError={onPayloadError}
        disabled={payloadLoadingDisabled}
      />

      <div className="mb-3 rounded-2xl bg-neutral-950/70 p-4">
        <div className="mb-2 flex items-center justify-between text-sm text-neutral-400">
          <span>Fortschritt</span>
          <ListChecks className="h-4 w-4" />
        </div>
        <div className="text-2xl font-semibold tabular-nums">
          {progressLabel}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <CircularTimer
          label="Frage sichtbar"
          icon={Eye}
          remaining={readRemaining}
          total={settings.readSeconds}
        />
        <CircularTimer
          label="Antwortzeit"
          icon={Timer}
          remaining={writeRemaining}
          total={settings.writeSeconds}
        />
      </div>

      <section className="mt-3 rounded-2xl bg-neutral-950/70 p-4">
        <div className="mb-2 flex items-center justify-between text-sm text-neutral-400">
          <span>Loesungs-Reveals fuer diese Frage</span>
          <LifeBuoy className="h-4 w-4" />
        </div>
        <div className="text-3xl font-semibold tabular-nums">
          {solutionRevealsRemaining ?? "--"}
        </div>
      </section>

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          disabled={startDisabled}
          onClick={onStart}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-medium text-neutral-950 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Play className="h-4 w-4" />
          Test starten
        </button>

        <button
          type="button"
          disabled={nextDisabled}
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-100 px-4 py-3 font-medium text-neutral-950 hover:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowRight className="h-4 w-4" />
          Naechste Frage
        </button>

        <button
          type="button"
          disabled={solutionDisabled}
          onClick={onSolution}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 px-4 py-3 font-medium text-neutral-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Lightbulb className="h-4 w-4" />
          Loesung 10s anzeigen
        </button>

        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 px-4 py-3 font-medium text-neutral-300 hover:bg-neutral-800"
        >
          <Clipboard className="h-4 w-4" />
          Zwischenstand kopieren
        </button>

        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 px-4 py-3 font-medium text-neutral-300 hover:bg-neutral-800"
        >
          <Download className="h-4 w-4" />
          Als Textdatei herunterladen
        </button>
      </div>

      <p className="mt-4 min-h-5 text-sm text-neutral-400">{message}</p>
    </aside>
  );
}
