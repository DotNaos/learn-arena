import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type MathTextProps = {
  children: string;
  className?: string;
};

type Segment =
  | { type: "text"; value: string }
  | { type: "math"; value: string; display: boolean };

// $$display$$ | $inline$ | \[display\] | \(inline\)
const MATH_PATTERN =
  /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)/g;

function parseSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  MATH_PATTERN.lastIndex = 0;
  while ((match = MATH_PATTERN.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: input.slice(lastIndex, match.index) });
    }
    const display = match[1] !== undefined || match[3] !== undefined;
    const tex = match[1] ?? match[2] ?? match[3] ?? match[4] ?? "";
    segments.push({ type: "math", value: tex, display });
    lastIndex = MATH_PATTERN.lastIndex;
  }

  if (lastIndex < input.length) {
    segments.push({ type: "text", value: input.slice(lastIndex) });
  }

  return segments;
}

function renderMath(tex: string, display: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      output: "htmlAndMathml",
    });
  } catch {
    return tex;
  }
}

/**
 * Render a string that may contain KaTeX math. Inline math uses `$...$` or
 * `\(...\)`, display math `$$...$$` or `\[...\]`; everything else is plain text.
 */
export function MathText({ children, className }: MathTextProps) {
  const segments = useMemo(() => parseSegments(children ?? ""), [children]);

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        segment.type === "text" ? (
          <span key={index}>{segment.value}</span>
        ) : (
          <span
            key={index}
            // KaTeX output is trusted markup (trust:false by default blocks unsafe commands).
            dangerouslySetInnerHTML={{
              __html: renderMath(segment.value, segment.display),
            }}
          />
        ),
      )}
    </span>
  );
}
