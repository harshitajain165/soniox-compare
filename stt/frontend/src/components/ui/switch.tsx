import { cn } from "@/lib/utils";

type Props = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
};

export const Switch = ({
  checked,
  onCheckedChange,
  disabled,
  id,
  className,
  ...props
}: Props) => (
  <button
    type="button"
    role="switch"
    id={id}
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-soniox/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40",
      checked ? "bg-soniox" : "bg-zinc-200 dark:bg-zinc-700",
      className
    )}
    {...props}
  >
    <span
      className={cn(
        "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform",
        checked ? "translate-x-[22px]" : "translate-x-0.5"
      )}
    />
  </button>
);
