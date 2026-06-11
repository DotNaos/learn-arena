import { Dialog } from "@base-ui/react/dialog";
import { Bug, ExternalLink, X } from "lucide-react";
import { useI18n } from "../i18n";

const REPOSITORY_URL = "https://github.com/DotNaos/learn-arena";
const NEW_ISSUE_URL = `${REPOSITORY_URL}/issues/new`;

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 19 19"
      className={className}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844"
      />
    </svg>
  );
}

export function GitHubAccessDialog() {
  const { t } = useI18n();
  const actions = [
    {
      icon: GitHubMark,
      title: t("github.repo"),
      text: t("github.repoText"),
      href: REPOSITORY_URL,
    },
    {
      icon: Bug,
      title: t("github.bug"),
      text: t("github.bugText"),
      href: NEW_ISSUE_URL,
    },
  ];

  return (
    <Dialog.Root>
      <Dialog.Trigger className="fixed bottom-4 left-16 z-50 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/90 bg-neutral-50/90 text-neutral-500 shadow-sm backdrop-blur-sm transition-colors hover:border-neutral-300 hover:text-neutral-700 sm:bottom-5 sm:left-16 dark:border-neutral-800/90 dark:bg-neutral-950/90 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-200">
        <GitHubMark className="h-4 w-4" />
        <span className="sr-only">{t("github.trigger")}</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Popup className="fixed bottom-16 left-4 z-50 w-[calc(100vw-2rem)] max-w-xs origin-bottom-left rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-neutral-900 shadow-xl ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:bottom-17 sm:left-5 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
          <div className="mb-2 flex items-start justify-between gap-3 px-1 pt-1">
            <div>
              <Dialog.Title className="text-sm font-semibold tracking-tight">
                {t("github.title")}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-xs text-neutral-500">
                {t("github.description")}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={t("github.close")}
              className="-mr-1 -mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-600 dark:hover:bg-neutral-900 dark:hover:text-neutral-300"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="flex flex-col gap-2">
            {actions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-left transition-colors hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  <action.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {action.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {action.text}
                  </span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-neutral-400 transition-colors group-hover:text-neutral-600 dark:group-hover:text-neutral-300" />
              </a>
            ))}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
