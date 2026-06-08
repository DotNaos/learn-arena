import type { WizardStep } from "../domain/wizard";
import { WIZARD_STEPS } from "../domain/wizard";

type WizardProgressProps = {
  current: WizardStep;
};

const stepOrder: WizardStep[] = ["setup", "ready", "active", "done"];

export function WizardProgress({ current }: WizardProgressProps) {
  const currentIndex = stepOrder.indexOf(current);

  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-3">
      {WIZARD_STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = step.id === current;

        return (
          <li key={step.id} className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium tabular-nums ${
                  active
                    ? "bg-white text-neutral-950"
                    : done
                      ? "bg-neutral-700 text-neutral-200"
                      : "bg-neutral-900 text-neutral-500"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`hidden text-xs sm:inline ${
                  active ? "text-neutral-100" : "text-neutral-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < WIZARD_STEPS.length - 1 && (
              <span className="h-px w-4 bg-neutral-800 sm:w-8" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
