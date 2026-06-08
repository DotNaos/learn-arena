import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  CHORD_META_ENTER,
  type KeyboardChord,
} from "../hooks/keyboardChords";
import { cn } from "../lib/utils";
import { useMetaShortcut } from "../hooks/useMetaEnterAction";
import { ShortcutChipGroup } from "./ShortcutChipGroup";

type ShortcutFeedback = {
  label: string;
  icon: ReactNode;
  durationMs?: number;
};

type ShortcutActionButtonProps = {
  label: string;
  onAction: () => void;
  chord?: KeyboardChord;
  disabled?: boolean;
  enabled?: boolean;
  allowInEditable?: boolean;
  resetDep?: unknown;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  suffix?: ReactNode;
  feedback?: ShortcutFeedback;
  chipVariant?: "dark" | "light";
  showShortcut?: boolean;
  className?: string;
  labelClassName?: string;
  ariaLabel?: string;
};

function FeedbackIcon({
  icon,
  feedbackIcon,
  showFeedback,
}: {
  icon?: ReactNode;
  feedbackIcon: ReactNode;
  showFeedback: boolean;
}) {
  if (!icon) return showFeedback ? feedbackIcon : null;

  return (
    <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
          showFeedback ? "scale-75 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {icon}
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center text-emerald-600 transition-all duration-200 ${
          showFeedback ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {feedbackIcon}
      </span>
    </span>
  );
}

export function ShortcutActionButton({
  label,
  onAction,
  chord = CHORD_META_ENTER,
  disabled = false,
  enabled,
  allowInEditable = false,
  resetDep,
  icon,
  trailingIcon,
  suffix,
  feedback,
  chipVariant = "dark",
  showShortcut = true,
  className,
  labelClassName = "text-sm font-medium",
  ariaLabel,
}: ShortcutActionButtonProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackToken, setFeedbackToken] = useState(0);
  const feedbackTimeoutRef = useRef<number | null>(null);
  const onActionRef = useRef(onAction);
  const feedbackRef = useRef(feedback);

  onActionRef.current = onAction;
  feedbackRef.current = feedback;

  const clearFeedbackTimeout = () => {
    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  };

  useEffect(() => clearFeedbackTimeout, []);

  const triggerFeedback = useCallback(() => {
    const activeFeedback = feedbackRef.current;
    if (!activeFeedback) return;

    clearFeedbackTimeout();
    setShowFeedback(false);
    setFeedbackToken((token) => token + 1);

    window.requestAnimationFrame(() => {
      setShowFeedback(true);
      feedbackTimeoutRef.current = window.setTimeout(() => {
        setShowFeedback(false);
        feedbackTimeoutRef.current = null;
      }, activeFeedback.durationMs ?? 2000);
    });
  }, []);

  const handleAction = useCallback(() => {
    onActionRef.current();
    triggerFeedback();
  }, [triggerFeedback]);

  const highlight = useMetaShortcut({
    chord,
    onAction: handleAction,
    enabled: enabled ?? !disabled,
    allowInEditable,
    resetDep,
  });

  const currentLabel = showFeedback && feedback ? feedback.label : label;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleAction}
      aria-label={ariaLabel ?? currentLabel}
      className={cn("inline-flex items-center gap-2 text-left", className)}
    >
      {feedback ? (
        <FeedbackIcon
          key={feedbackToken}
          icon={icon}
          feedbackIcon={feedback.icon}
          showFeedback={showFeedback}
        />
      ) : (
        icon
      )}
      <span className={cn("shrink-0", labelClassName)}>{currentLabel}</span>
      <span className="min-w-0 flex-1" aria-hidden />
      {trailingIcon}
      {suffix}
      {showShortcut && (
        <ShortcutChipGroup
          chord={chord}
          highlight={highlight}
          variant={chipVariant}
          className="shrink-0"
        />
      )}
    </button>
  );
}
