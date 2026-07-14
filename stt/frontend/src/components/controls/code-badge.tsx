import { cn } from "@/lib/utils";

type Props = {
  code: string;
  selected?: boolean;
};

export const CodeBadge = ({ code, selected }: Props) => (
  <span
    className={cn(
      "grid h-6 w-6 shrink-0 place-items-center rounded-full",
      selected
        ? "bg-soniox/15 text-soniox"
        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300"
    )}
  >
    <span className="block font-mono text-[9px] font-semibold uppercase leading-none tracking-normal">
      {code}
    </span>
  </span>
);
