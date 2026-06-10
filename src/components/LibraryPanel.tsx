import { useRef } from "react";
import {
  Download,
  FileText,
  Layers,
  Trash2,
  Upload,
} from "lucide-react";
import type { LearnPlan, LibraryTest } from "../domain/library";

type LibraryPanelProps = {
  tests: LibraryTest[];
  plans: LearnPlan[];
  onOpenTest: (id: string) => void;
  onOpenPlan: (id: string) => void;
  onDeleteTest: (id: string) => void;
  onDeletePlan: (id: string) => void;
  onExport: () => void;
  onImportFile: (file: File) => void;
};

export function LibraryPanel({
  tests,
  plans,
  onOpenTest,
  onOpenPlan,
  onDeleteTest,
  onDeletePlan,
  onExport,
  onImportFile,
}: LibraryPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  if (tests.length === 0 && plans.length === 0) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
          Meine Bibliothek
        </p>
        <div className="flex items-center gap-1">
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onImportFile(file);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            aria-label="Bibliothek importieren"
            title="Bibliothek importieren"
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 dark:text-neutral-600 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <Upload className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Bibliothek exportieren"
            title="Bibliothek als Datei sichern"
            onClick={onExport}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 dark:text-neutral-600 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {plans.map((plan) => (
          <LibraryRow
            key={plan.id}
            icon={<Layers className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />}
            title={plan.title}
            meta={`Lernplan · ${plan.testIds.length} ${plan.testIds.length === 1 ? "Test" : "Tests"}`}
            onOpen={() => onOpenPlan(plan.id)}
            onDelete={() => onDeletePlan(plan.id)}
          />
        ))}
        {tests.map((test) => (
          <LibraryRow
            key={test.id}
            icon={<FileText className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />}
            title={test.payload.title}
            meta={`${test.payload.questions.length} ${test.payload.questions.length === 1 ? "Frage" : "Fragen"}${test.lastResult ? " · erledigt" : ""}`}
            onOpen={() => onOpenTest(test.id)}
            onDelete={() => onDeleteTest(test.id)}
          />
        ))}
      </div>
    </div>
  );
}

type LibraryRowProps = {
  icon: React.ReactNode;
  title: string;
  meta: string;
  onOpen: () => void;
  onDelete: () => void;
};

function LibraryRow({ icon, title, meta, onOpen, onDelete }: LibraryRowProps) {
  return (
    <div className="group flex items-center gap-2 rounded-xl border border-transparent bg-neutral-50 dark:bg-neutral-950/40 px-3 py-2 transition-colors hover:border-neutral-200 dark:hover:border-neutral-800">
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
      >
        <span className="shrink-0">{icon}</span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {title}
          </span>
          <span className="block truncate text-[11px] text-neutral-500 dark:text-neutral-500">
            {meta}
          </span>
        </span>
      </button>
      <button
        type="button"
        aria-label="Loeschen"
        onClick={onDelete}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-400 dark:text-neutral-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-500 focus-visible:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
