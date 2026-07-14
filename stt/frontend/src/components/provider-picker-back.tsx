import type { ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
  children: ReactNode;
};

export const ProviderPickerBack = ({ onClose, children }: Props) => (
  <div className="flex h-full w-full flex-col rounded-xl border-2 border-dashed border-zinc-300 bg-white/40 p-2 dark:border-zinc-700 dark:bg-zinc-900/40">
    <div className="mb-2 flex items-center justify-between px-1">
      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Compare with
      </span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cancel"
        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
    <div className="flex-1 overflow-y-auto p-0.5">{children}</div>
  </div>
);
