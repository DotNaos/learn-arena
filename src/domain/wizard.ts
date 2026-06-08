import type { SessionState } from "./session";

export type WizardStep = "setup" | "ready" | "active" | "done";

export function getWizardStep(state: SessionState): WizardStep {
  if (!state.payload) return "setup";
  if (!state.started) return "ready";
  if (state.finished) return "done";
  return "active";
}

export const WIZARD_STEPS: { id: WizardStep; label: string }[] = [
  { id: "setup", label: "Import" },
  { id: "ready", label: "Bereit" },
  { id: "active", label: "Test" },
  { id: "done", label: "Fertig" },
];
