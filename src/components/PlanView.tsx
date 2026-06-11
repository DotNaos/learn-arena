import { ArrowLeft, Check, ClipboardCheck, Play, Trash2 } from "lucide-react";
import type { LearnPlan, LibraryTest } from "../domain/library";
import { ShortcutActionButton } from "./ShortcutActionButton";
import { useI18n } from "../i18n";

type PlanViewProps = {
  plan: LearnPlan;
  tests: LibraryTest[];
  onStartTest: (index: number) => void;
  onCopyGrading: () => void;
  onBack: () => void;
  onDeletePlan: () => void;
};

export function PlanView({
  plan,
  tests,
  onStartTest,
  onCopyGrading,
  onBack,
  onDeletePlan,
}: PlanViewProps) {
  const { t } = useI18n();
  const doneCount = tests.filter((test) => test.lastResult).length;
  const hasResults = doneCount > 0;

  return (
    <div className="flex h-dvh flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <header className="shrink-0 border-b border-neutral-200 dark:border-neutral-800/80 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label={t("plan.back")}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 dark:text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-500">
              {t("plan.title")}
            </p>
            <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
              {plan.title}
            </h1>
          </div>
          <span className="shrink-0 text-xs tabular-nums text-neutral-500 dark:text-neutral-500">
            {t("plan.doneCount", { done: doneCount, total: tests.length })}
          </span>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-lg">
          <ol className="flex flex-col gap-2">
            {tests.map((test, index) => {
              const done = Boolean(test.lastResult);
              return (
                <li
                  key={test.id}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/40 px-3 py-3"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                      done
                        ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                        : "border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {test.payload.title}
                    </p>
                    <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-500">
                      {t("library.testCount", { count: test.payload.questions.length })}
                      {done ? ` · ${t("library.done")}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartTest(index)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100 px-3.5 py-2 text-xs font-medium text-neutral-50 dark:text-neutral-950 transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-300"
                  >
                    <Play className="h-3.5 w-3.5" />
                    {done ? t("plan.restart") : t("plan.start")}
                  </button>
                </li>
              );
            })}
          </ol>

          {tests.length === 0 && (
            <p className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-500">
              {t("plan.empty")}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <ShortcutActionButton
              label={t("plan.copyAll")}
              onAction={onCopyGrading}
              disabled={!hasResults}
              icon={<ClipboardCheck className="h-4 w-4" />}
              feedback={{
                label: t("common.copied"),
                icon: <Check className="h-4 w-4" strokeWidth={2.5} />,
              }}
              chipVariant="light"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-50 dark:text-neutral-950 transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-300 disabled:cursor-not-allowed disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-600"
            />
            <p className="px-1 text-center text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-500">
              {hasResults
                ? t("plan.copyHintReady")
                : t("plan.copyHintDisabled")}
            </p>

            <button
              type="button"
              onClick={onDeletePlan}
              className="mt-2 inline-flex items-center justify-center gap-1.5 self-center text-xs text-neutral-400 dark:text-neutral-600 transition-colors hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("plan.delete")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
