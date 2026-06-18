import { useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Check, Copy, Link2, Loader2, Share2, TriangleAlert, X } from "lucide-react";
import { copyText } from "../domain/export";
import {
  createShare,
  serializeShareable,
  shareUrl,
  type Shareable,
} from "../domain/share";
import { useI18n } from "../i18n";

type ShareDialogProps = {
  shareable: Shareable | null;
  existingHash?: string;
  onClose: () => void;
  onShared?: (hash: string) => void;
};

type ShareStatus = "loading" | "ready" | "error";

export function ShareDialog({
  shareable,
  existingHash,
  onClose,
  onShared,
}: ShareDialogProps) {
  const { t } = useI18n();
  const [status, setStatus] = useState<ShareStatus>("loading");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<number | null>(null);
  const onSharedRef = useRef(onShared);
  onSharedRef.current = onShared;

  const isPlan = shareable?.kind === "plan";

  // Upload (or dedup to an existing share) whenever the dialog opens.
  useEffect(() => {
    if (!shareable) return;
    if (existingHash) {
      setStatus("ready");
      setCopied(false);
      const linkValue = shareUrl(existingHash);
      setLink(linkValue);
      onSharedRef.current?.(existingHash);
      return;
    }

    let cancelled = false;

    setStatus("loading");
    setLink("");
    setCopied(false);

    createShare(serializeShareable(shareable))
      .then(({ hash }) => {
        if (cancelled) return;
        setLink(shareUrl(hash));
        setStatus("ready");
        onSharedRef.current?.(hash);
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [existingHash, shareable]);

  useEffect(
    () => () => {
      if (copyTimeout.current !== null) window.clearTimeout(copyTimeout.current);
    },
    [],
  );

  const handleCopy = async () => {
    if (!link) return;
    await copyText(link);
    setCopied(true);
    if (copyTimeout.current !== null) window.clearTimeout(copyTimeout.current);
    copyTimeout.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog.Root
      open={shareable !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-neutral-900 shadow-xl ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                <Share2 className="h-4 w-4" />
              </span>
              <div>
                <Dialog.Title className="text-sm font-semibold tracking-tight">
                  {isPlan ? t("share.titlePlan") : t("share.title")}
                </Dialog.Title>
                <Dialog.Description className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-500">
                  {t("share.subtitle")}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close
              aria-label={t("share.close")}
              className="-mr-1 -mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-600 dark:hover:bg-neutral-900 dark:hover:text-neutral-300"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {status === "loading" && (
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-3 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t("share.creating")}
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-3 py-3 text-xs text-red-600 dark:text-red-400">
              <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
              {t("share.error")}
            </div>
          )}

          {status === "ready" && (
            <>
              <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
                <Link2 className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-600" />
                <input
                  readOnly
                  value={link}
                  onFocus={(event) => event.currentTarget.select()}
                  className="min-w-0 flex-1 bg-transparent text-xs text-neutral-700 outline-none dark:text-neutral-300"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-50 transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-950 dark:hover:bg-neutral-300"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? t("common.copied") : t("share.copy")}
                </button>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-500">
                {t("share.hint")}
              </p>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
