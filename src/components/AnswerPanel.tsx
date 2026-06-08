import { countWords } from "../domain/session";

type AnswerPanelProps = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
};

export function AnswerPanel({ value, disabled, onChange }: AnswerPanelProps) {
  return (
    <article className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-medium">Antwort zu aktueller Frage</h2>
        <span className="text-sm text-neutral-400">
          {countWords(value)} Woerter
        </span>
      </div>

      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-[360px] w-full resize-none rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-sm leading-6 text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-neutral-600 disabled:cursor-not-allowed disabled:opacity-60"
        placeholder="Starte den Test und schreibe dann die aktuelle Frage aus dem Kopf..."
      />
    </article>
  );
}
