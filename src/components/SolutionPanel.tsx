import { formatTime } from "../domain/session";

type SolutionPanelProps = {
  title: string;
  parts: string[];
  remaining: number;
  visible: boolean;
};

export function SolutionPanel({
  title,
  parts,
  remaining,
  visible,
}: SolutionPanelProps) {
  if (!visible) return null;

  return (
    <article className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-medium text-amber-100">{title}</h2>
        <span className="font-mono text-sm text-amber-200">
          {formatTime(remaining)}
        </span>
      </div>
      <div className="space-y-2 text-sm leading-6 text-amber-100">
        {parts.map((part) => (
          <p key={part}>{part}</p>
        ))}
      </div>
    </article>
  );
}
