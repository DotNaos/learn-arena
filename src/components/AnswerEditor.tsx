import { useEffect, useRef } from "react";
import { Editor } from "@aryazos/markdown-editor/Editor";

type AnswerEditorProps = {
  value: string;
  placeholder: string;
  disabled: boolean;
  questionNumber?: number;
  onChange: (value: string) => void;
};

export function AnswerEditor({
  value,
  placeholder,
  disabled,
  questionNumber,
  onChange,
}: AnswerEditorProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const frame = window.requestAnimationFrame(() => {
      rootRef.current
        ?.querySelector<HTMLElement>(".ProseMirror")
        ?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [disabled, questionNumber]);

  return (
    <div
      ref={rootRef}
      data-disabled={disabled ? "true" : "false"}
      className="answer-composer-editor"
      onKeyDownCapture={(event) => {
        if (
          event.metaKey &&
          (event.key === "Enter" || event.key === "." || event.key === "/")
        ) {
          event.preventDefault();
        }
      }}
    >
      <Editor
        key={questionNumber}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="px-4 pt-3 pb-1"
      />
    </div>
  );
}
