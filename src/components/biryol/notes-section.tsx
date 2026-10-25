import { useMemo, useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { Badge, buttonClass, Card, FieldError, SampleBadge, inputClass } from "./primitives";
import type { NoteTone, TravelNote } from "@/data/notes";
import { cn } from "@/lib/utils";

export function NotesSection({
  notes,
  title = "Köhnə səyahətçilərin notları",
  subtitle = "Keçmiş səyahətçilərin görməyə dəyər saydığı yerlər, tövsiyələr və məsləhət görmədikləri məqamlar.",
  compact = false,
}: {
  notes: TravelNote[];
  title?: string;
  subtitle?: string;
  compact?: boolean;
}) {
  const [added, setAdded] = useState<TravelNote[]>([]);
  const [tab, setTab] = useState<NoteTone>("positive");
  const [tone, setTone] = useState<NoteTone>("positive");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [saved, setSaved] = useState(false);

  const all = useMemo(() => [...added, ...notes], [added, notes]);
  const counts = {
    positive: all.filter((n) => n.tone === "positive").length,
    negative: all.filter((n) => n.tone === "negative").length,
  };
  const visible = all.filter((n) => n.tone === tab);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Bu sahə boş qala bilməz.");
      setSaved(false);
      return;
    }
    setError(undefined);
    setAdded((prev) => [
      {
        id: `new-${Date.now()}`,
        author: "İstifadəçi A",
        date: "Bu gün",
        tone,
        text: text.trim(),
      },
      ...prev,
    ]);
    setText("");
    setTab(tone);
    setSaved(true);
  };

  return (
    <section className={compact ? "" : "mt-10"}>
      <div className="mb-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Rəylər</p>
          <h2 className={compact ? "font-heading text-lg" : "text-2xl sm:text-3xl"}>{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <SampleBadge />
      </div>

      <div
        role="tablist"
        aria-label="Rəy tipi"
        className="flex flex-wrap gap-2 rounded-full border border-border bg-surface p-1.5"
      >
        {(
          [
            { key: "positive", label: "Pozitiv", icon: ThumbsUp },
            { key: "negative", label: "Neqativ", icon: ThumbsDown },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "inline-flex min-h-[40px] flex-1 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition-colors",
              tab === t.key
                ? t.key === "positive"
                  ? "border border-success/40 bg-success-soft text-success"
                  : "border border-destructive/40 bg-destructive-soft text-destructive"
                : "text-muted-foreground hover:bg-card",
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {visible.map((n) => (
          <li key={n.id}>
            <Card className="h-full">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="min-w-0 truncate text-sm font-bold">{n.author}</p>
                <Badge tone={n.tone === "positive" ? "success" : "error"}>
                  {n.tone === "positive" ? "Pozitiv" : "Neqativ"}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.date}</p>
              <p className="mt-2 text-sm text-muted-foreground">{n.text}</p>
            </Card>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="text-sm text-muted-foreground">Bu bölmədə hələ rəy yoxdur.</li>
        )}
      </ul>

      <Card className="mt-4">
        <form onSubmit={submit} className="grid gap-3">
          <h3 className="font-heading text-base">Öz notunu əlavə et</h3>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "positive", label: "Pozitiv" },
                { key: "negative", label: "Neqativ" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                aria-pressed={tone === t.key}
                onClick={() => setTone(t.key)}
                className={cn(
                  "inline-flex min-h-[40px] items-center rounded-full border px-4 text-sm font-bold transition-colors",
                  tone === t.key
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="grid gap-1.5">
            <label htmlFor={`note-${title}`} className="text-sm font-semibold">
              Şərh
            </label>
            <textarea
              id={`note-${title}`}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setSaved(false);
              }}
              rows={3}
              placeholder="Görməyə dəyər yerlər, tövsiyə və ya xəbərdarlıq yaz..."
              className={cn(inputClass(Boolean(error)), "min-h-[88px] py-2")}
            />
            <FieldError message={error} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className={buttonClass("primary")}>
              Şərh əlavə et
            </button>
            {saved && (
              <p className="text-sm font-bold text-success">Şərh əlavə edildi (nümunə).</p>
            )}
          </div>
        </form>
      </Card>
    </section>
  );
}
