import { useState } from "react";
import { LogOut } from "lucide-react";
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

type EndTestButtonProps = {
  onConfirm: () => void;
  disabled?: boolean;
};

export function EndTestButton({ onConfirm, disabled = false }: EndTestButtonProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <LogOut className="h-3.5 w-3.5" />
        Test beenden
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="text-amber-400">
              <LogOut />
            </AlertDialogMedia>
            <AlertDialogTitle>Test wirklich beenden?</AlertDialogTitle>
            <AlertDialogDescription>
              Der aktuelle Fortschritt bleibt gespeichert. Du kannst danach die
              Antworten exportieren.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirm}>
              Test beenden
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
