import { Languages } from "lucide-react";
import { useI18n } from "../i18n";

export function LanguageToggle() {
  const { language, setLanguage, t } = useI18n();
  const nextLanguage = language === "de" ? "en" : "de";

  return (
    <div className="fixed bottom-4 left-28 z-50 sm:bottom-5 sm:left-28">
      <button
        type="button"
        onClick={() => setLanguage(nextLanguage)}
        aria-label={
          nextLanguage === "en"
            ? t("language.switchToEnglish")
            : t("language.switchToGerman")
        }
        title={t("language.label")}
        className="inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-full border border-neutral-200/90 bg-neutral-50/90 px-2 text-[11px] font-semibold text-neutral-500 shadow-sm backdrop-blur-sm transition-colors hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-800/90 dark:bg-neutral-950/90 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-200"
      >
        <Languages className="h-3.5 w-3.5" />
        <span>{language.toUpperCase()}</span>
      </button>
    </div>
  );
}
