import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function FilterBar({
  filters,
  note = "Filterlər prototip interaksiyasıdır — nümunə siyahını dəyişmir.",
}: {
  filters: string[];
  note?: string;
}) {
  const [active, setActive] = useState<string[]>([]);

  const toggle = (f: string) =>
    setActive((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4 shrink-0" />
        Filterlər
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = active.includes(f);
          return (
            <button
              key={f}
              type="button"
              aria-pressed={isActive}
              onClick={() => toggle(f)}
              className={cn(
                "min-h-[44px] rounded-full border px-4 text-sm font-bold transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
              )}
            >
              {f}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}
