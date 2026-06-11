import { useState } from "react";
import { LogOut } from "lucide-react";
import { CHORD_META_SLASH } from "../hooks/keyboardChords";
import { ShortcutActionButton } from "./ShortcutActionButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useI18n } from "../i18n";

type EndTestButtonProps = {
  onConfirm: () => void;
  disabled?: boolean;
};

export function EndTestButton({ onConfirm, disabled = false }: EndTestButtonProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <ShortcutActionButton
        label={t("end.confirm")}
        onAction={() => setOpen(true)}
        chord={CHORD_META_SLASH}
        disabled={disabled}
        enabled={!disabled && !open}
        icon={<LogOut className="h-3.5 w-3.5" />}
        labelClassName="text-xs font-medium"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500 transition-colors hover:text-neutral-800 dark:hover:text-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
      />

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="text-amber-400">
              <LogOut />
            </AlertDialogMedia>
            <AlertDialogTitle>{t("end.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("end.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("end.cancel")}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirm}>
              {t("end.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
