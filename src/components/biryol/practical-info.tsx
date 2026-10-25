import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Card, SampleBadge } from "./primitives";
import { getPracticalInfo } from "@/data/practical";
import type { Destination } from "@/data/destinations";
import { cn } from "@/lib/utils";

export function PracticalInfo({ destination }: { destination: Destination }) {
  const items = getPracticalInfo(destination);
  const [open, setOpen] = useState<string | null>(items[0]?.label ?? null);

  return (
    <Card className="space-y-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-xl">Praktik və təhlükəsizlik məlumatı</h3>
          <p className="text-sm text-muted-foreground">
            Səfərdən əvvəl yoxlamalı əsas məqamlar.
          </p>
        </div>
        <SampleBadge />
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
        {items.map((item) => {
          const isOpen = open === item.label;
          return (
            <div key={item.label} className="bg-surface">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.label)}
                aria-expanded={isOpen}
                className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 py-3.5 text-left"
              >
                <span className="min-w-0 truncate text-sm font-bold text-foreground">
                  {item.label}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen && (
                <p className="px-4 pb-4 text-sm text-muted-foreground">{item.text}</p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
