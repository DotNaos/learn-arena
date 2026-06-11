import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "../i18n";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  if (typeof document !== "undefined") {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  }
  return "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore storage failures (private mode, etc.)
  }
}

export function ThemeToggle() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <div className="fixed bottom-4 left-4 z-50 sm:bottom-5 sm:left-5">
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={isDark ? t("theme.light") : t("theme.dark")}
        title={isDark ? t("theme.titleLight") : t("theme.titleDark")}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/90 bg-neutral-50/90 text-neutral-500 shadow-sm backdrop-blur-sm transition-colors hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-800/90 dark:bg-neutral-950/90 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-200"
      >
        {isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
