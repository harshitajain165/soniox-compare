import { getProviderIcon, type ProviderName } from "@/lib/provider-features";
import { cn } from "@/lib/utils";

type Props = {
  provider: ProviderName;
  name: string;
  className?: string;
};

export const ProviderLogo = ({ provider, name, className }: Props) => (
  <img
    src={getProviderIcon(provider)}
    alt={`${name} logo`}
    loading="lazy"
    className={cn("h-6 w-6 object-contain", className)}
  />
);
