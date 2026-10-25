import { X } from "lucide-react";
import { useEffect } from "react";

import { buttonClass, Card } from "./primitives";
import { cn } from "@/lib/utils";

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { key: T; label: string; count?: number }[];
  value: T;
  onChange: (key: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex w-full gap-1.5 overflow-x-auto rounded-full border border-border bg-surface p-1.5",
        className,
      )}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            "inline-flex min-h-[40px] shrink-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-bold transition-colors",
            value === t.key
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-card hover:text-primary",
          )}
        >
          {t.label}
          {typeof t.count === "number" && (
            <span className="text-xs font-bold opacity-80">({t.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-dashed text-center">
      <p className="text-sm font-semibold text-muted-foreground">{title}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </Card>
  );
}

export function ErrorState({
  title,
  onRetry,
}: {
  title: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-destructive/40 bg-destructive-soft text-center">
      <p className="text-sm font-bold text-destructive">{title}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={buttonClass("secondary", "mt-4")}
        >
          Yenidən cəhd et
        </button>
      )}
    </Card>
  );
}

export function Modal({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-3 sm:items-center"
    >
      <Card
        className={cn(
          "max-h-[88vh] w-full overflow-y-auto",
          wide ? "max-w-3xl" : "max-w-lg",
        )}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
          <h2 className="min-w-0 font-heading text-xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Bağla"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3">{children}</div>
        {footer && <div className="mt-5 flex flex-wrap gap-2">{footer}</div>}
      </Card>
    </div>
  );
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Təsdiq et",
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button
            type="button"
            onClick={onConfirm}
            className={buttonClass(
              "primary",
              "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
            )}
          >
            {confirmLabel}
          </button>
          <button type="button" onClick={onCancel} className={buttonClass("ghost")}>
            Ləğv et
          </button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">{description}</p>
    </Modal>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Axtar...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="min-h-[44px] w-full rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 sm:max-w-xs"
    />
  );
}

export function ChipFilter<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            "min-h-[40px] rounded-full border px-4 text-sm font-bold transition-colors",
            value === o.key
              ? "border-primary bg-primary-soft text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
