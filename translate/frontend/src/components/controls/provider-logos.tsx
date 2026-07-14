import { getProviderIcon, type ProviderName } from "@/lib/provider-features";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_LOGOS = 6;

type Props = {
  providers: ProviderName[];
  getName: (provider: ProviderName) => string;
  className?: string;
};

export const ProviderLogos = ({ providers, getName, className }: Props) => {
  const byIcon = new Map<string, ProviderName[]>();
  for (const provider of providers) {
    const icon = getProviderIcon(provider);
    const group = byIcon.get(icon);
    if (group) group.push(provider);
    else byIcon.set(icon, [provider]);
  }

  const marks = [...byIcon.entries()].map(([icon, group]) => ({
    icon,
    label: group.map(getName).join(", "),
  }));
  const visible = marks.slice(0, MAX_VISIBLE_LOGOS);
  const overflow = marks.length - visible.length;

  return (
    <span
      className={cn(
        "flex items-center gap-1 opacity-35 transition-opacity group-hover:opacity-100 group-data-[selected=true]:opacity-100",
        className,
      )}
    >
      {visible.map(({ icon, label }) => (
        <span
          key={icon}
          title={label}
          className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white p-[3px]"
        >
          <img
            src={icon}
            alt={label}
            loading="lazy"
            className="h-full w-full object-contain"
          />
        </span>
      ))}
      {overflow > 0 && (
        <span className="text-[9px] font-semibold text-zinc-400">
          +{overflow}
        </span>
      )}
    </span>
  );
};
