import { ArrowUpDown, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { Badge, buttonClass } from "./primitives";
import { cn } from "@/lib/utils";

export type SortOption = { value: string; label: string };

export function ListingFilterPanel({
  resultCount,
  activeCount,
  sortValue,
  sortOptions,
  onSortChange,
  onReset,
  children,
}: {
  resultCount: number;
  activeCount: number;
  sortValue: string;
  sortOptions: SortOption[];
  onSortChange: (value: string) => void;
  onReset: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const sortId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  return (
    <>
      <div className="grid gap-3 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[auto_minmax(240px,360px)] sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={buttonClass("secondary", "w-full justify-center sm:w-auto")}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filterlər
          {activeCount > 0 && <Badge tone="primary">{activeCount}</Badge>}
        </button>
        <label className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 text-sm font-bold">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <select
            id={sortId}
            aria-label="Sıralama"
            value={sortValue}
            onChange={(event) => onSortChange(event.target.value)}
            className="min-h-11 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-foreground/50" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Nəticələri filtrlə"
            className="ml-auto flex h-full w-full max-w-xl flex-col bg-card shadow-2xl"
          >
            <header className="grid grid-cols-[44px_minmax(0,1fr)_auto] items-center border-b border-border px-3 py-3 sm:px-5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Filterləri bağla"
                className="grid h-11 w-11 place-items-center rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-center font-heading text-lg">Filterlər</h2>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-bold text-primary hover:underline"
              >
                <RotateCcw className="h-4 w-4" />
                Sıfırla
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-28">{children}</div>

            <footer className="absolute inset-x-0 bottom-0 ml-auto w-full max-w-xl border-t border-border bg-card/95 p-4 backdrop-blur">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={buttonClass("primary", "w-full")}
              >
                {resultCount} nəticəni göstər
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}

export function FilterSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-b border-border py-6 last:border-b-0">
      <legend className="font-heading text-lg">{title}</legend>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4 space-y-3">{children}</div>
    </fieldset>
  );
}

export function CheckFilter({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-md px-1 hover:bg-surface">
      <span className="min-w-0 text-sm font-semibold">
        {label}
        {hint && <span className="ml-1 font-normal text-muted-foreground">{hint}</span>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 shrink-0 accent-primary"
      />
    </label>
  );
}

export function NumberRange({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  min,
  max,
  suffix = "AZN",
}: {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  min: number;
  max: number;
  suffix?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <RangeField label="Minimum" value={minValue} onChange={onMinChange} min={min} max={max} suffix={suffix} />
      <RangeField label="Maksimum" value={maxValue} onChange={onMaxChange} min={min} max={max} suffix={suffix} />
    </div>
  );
}

function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  suffix: string;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-bold text-muted-foreground">
      {label}
      <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center rounded-md border border-input bg-surface px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          placeholder={String(label === "Minimum" ? min : max)}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-11 min-w-0 bg-transparent text-sm text-foreground outline-none"
        />
        <span>{suffix}</span>
      </span>
    </label>
  );
}

export function ChoiceChips({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(option)}
            className={cn(
              "min-h-11 rounded-full border px-4 text-sm font-bold transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface hover:border-primary hover:text-primary",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
