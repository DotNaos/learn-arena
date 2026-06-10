import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type IconTooltipButtonProps = {
  label: string;
  disabled?: boolean;
  primary?: boolean;
  size?: "sm" | "md";
  onClick: () => void;
  children: ReactNode;
};

export function IconTooltipButton({
  label,
  disabled = false,
  primary = false,
  size = "md",
  onClick,
  children,
}: IconTooltipButtonProps) {
  const sizeClass =
    size === "sm"
      ? "h-8 w-8 rounded-lg"
      : "h-9 w-9 rounded-full";

  const variantClass = primary
    ? "bg-neutral-900 dark:bg-white text-neutral-50 dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200"
    : "border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800";

  const button = (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={`inline-flex items-center justify-center transition-colors enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-600 ${sizeClass} ${variantClass}`}
    >
      {children}
    </button>
  );

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          disabled ? (
            <span className="inline-flex shrink-0">{button}</span>
          ) : (
            button
          )
        }
      />
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}
