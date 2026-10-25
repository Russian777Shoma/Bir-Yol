import { CalendarPlus, Heart } from "lucide-react";

import { useAppState, type FavoriteItem, type PlanItem } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  item,
  className,
  label,
}: {
  item: FavoriteItem;
  className?: string;
  label?: boolean;
}) {
  const { isFavorite, toggleFavorite } = useAppState();
  const active = isFavorite(item.key);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Favoritlərdən çıxar" : "Favoritlərə əlavə et"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(item);
      }}
      className={cn(
        "inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border px-3 text-sm font-bold transition-colors",
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-card text-muted-foreground hover:border-accent hover:text-accent",
        !label && "w-11 px-0",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4 shrink-0", active && "fill-current")} />
      {label && <span>{active ? "Favoritdə" : "Favoritə əlavə et"}</span>}
    </button>
  );
}

export function AddToPlanButton({
  item,
  className,
}: {
  item: Omit<PlanItem, "key" | "day" | "status"> & { day?: number };
  className?: string;
}) {
  const { plan, addToPlan } = useAppState();
  const exists = plan.some((p) => p.key === `${item.slug}-${item.title}`);

  return (
    <button
      type="button"
      disabled={exists}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addToPlan(item);
      }}
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-primary bg-card px-3 text-sm font-bold text-primary transition-colors hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      <CalendarPlus className="h-4 w-4 shrink-0" />
      {exists ? "Planda var" : "Planıma əlavə et"}
    </button>
  );
}
