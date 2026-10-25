import { cn } from "@/lib/utils";

export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-bold text-muted-foreground",
        className,
      )}
    >
      Nümunə məlumat
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "accent" | "success" | "warn" | "error";
  className?: string | undefined;
}) {
  const tones = {
    neutral: "border-border bg-surface text-muted-foreground",
    primary: "border-primary/25 bg-primary-soft text-primary",
    accent: "border-accent/30 bg-accent-soft text-accent",
    success: "border-success/30 bg-success-soft text-success",
    warn: "border-warn/30 bg-warn-soft text-warn",
    error: "border-destructive/30 bg-destructive-soft text-destructive",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const buttonClass = (
  variant: "primary" | "secondary" | "accent" | "ghost" = "primary",
  className?: string,
) =>
  cn(
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60",
    variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary-hover",
    variant === "secondary" &&
      "border border-primary bg-card text-primary hover:bg-primary-soft",
    variant === "accent" && "bg-accent text-accent-foreground hover:bg-accent-hover",
    variant === "ghost" && "text-foreground hover:bg-muted",
    className,
  );

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-soft transition-colors",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  action,
}: {
  kicker?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
      <div className="min-w-0">
        {kicker && (
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {kicker}
          </p>
        )}
        <h2 className="text-2xl sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return <p className="text-xs font-semibold text-destructive">{message}</p>;
}

export const inputClass = (hasError?: boolean) =>
  cn(
    "min-h-[44px] w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20",
    hasError ? "border-destructive bg-destructive-soft" : "border-input focus:border-primary",
  );
