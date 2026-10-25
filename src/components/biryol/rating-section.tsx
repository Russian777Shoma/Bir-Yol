import { Star } from "lucide-react";
import { useState } from "react";

import { Badge, Card, FieldError, buttonClass, inputClass } from "./primitives";
import { Tabs } from "./ui-kit";
import { useAppState } from "@/lib/app-state";
import { getRatingSummary, getSampleReviews } from "@/data/reviews";
import { cn } from "@/lib/utils";

export function Stars({
  value,
  size = "sm",
  className,
}: {
  value: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const dim = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            dim,
            i <= Math.round(value) ? "fill-accent text-accent" : "text-border",
          )}
        />
      ))}
    </span>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          aria-label={`${i} ulduz`}
          className="grid h-11 w-11 place-items-center rounded-full hover:bg-muted"
        >
          <Star
            className={cn(
              "h-6 w-6",
              i <= value ? "fill-accent text-accent" : "text-border",
            )}
          />
        </button>
      ))}
    </div>
  );
}

type Tab = "all" | "positive" | "negative";

export function RatingSection({
  targetKey,
  targetName,
  baseRating,
  compact,
}: {
  targetKey: string;
  targetName: string;
  baseRating?: number;
  compact?: boolean;
}) {
  const { ratings, reviews, saveRating, addReview } = useAppState();
  const summary = getRatingSummary(targetKey, baseRating);
  const samples = getSampleReviews(targetKey);
  const mine = ratings[targetKey];
  const userReviews = reviews[targetKey] ?? [];

  const [tab, setTab] = useState<Tab>("all");
  const [stars, setStars] = useState(mine?.stars ?? 0);
  const [tone, setTone] = useState<"positive" | "negative">("positive");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [visitedAt, setVisitedAt] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const all = [
    ...userReviews.map((r) => ({ ...r, own: true })),
    ...samples.map((r) => ({ ...r, own: false })),
  ];
  const list = tab === "all" ? all : all.filter((r) => r.tone === tab);
  const positiveCount = all.filter((r) => r.tone === "positive").length;
  const negativeCount = all.length - positiveCount;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (stars === 0) next["stars"] = "Ulduz sayını seçin.";
    if (!title.trim()) next["title"] = "Bu sahə boş qala bilməz.";
    if (!text.trim()) next["text"] = "Bu sahə boş qala bilməz.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    saveRating(targetKey, { stars, comment: text.trim() });
    addReview(targetKey, {
      target: targetKey,
      tone,
      title: title.trim(),
      text: text.trim(),
      recommendation: recommendation.trim() || "—",
      visitedAt: visitedAt.trim() || "Bu ay",
    });
    setTitle("");
    setText("");
    setRecommendation("");
    setVisitedAt("");
    setErrors({});
  };

  return (
    <Card className={cn("space-y-5", compact && "p-4")}>
      <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <div className="min-w-0">
          <p className="font-heading text-4xl leading-none">{summary.average}</p>
          <Stars value={summary.average} size="md" className="mt-2" />
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {summary.count} nümunə rəy · {targetName}
          </p>
        </div>
        <div className="min-w-0 space-y-1.5">
          {summary.breakdown.map((b) => (
            <div key={b.stars} className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-xs font-bold text-muted-foreground">
                {b.stars}★
              </span>
              <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${b.percent}%` }}
                />
              </span>
              <span className="w-9 shrink-0 text-right text-xs font-semibold text-muted-foreground">
                {b.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <Tabs<Tab>
        value={tab}
        onChange={setTab}
        tabs={[
          { key: "all", label: "Hamısı", count: all.length },
          { key: "positive", label: "Pozitiv", count: positiveCount },
          { key: "negative", label: "Neqativ", count: negativeCount },
        ]}
      />

      <div className="space-y-3">
        {list.length === 0 && (
          <p className="text-sm font-semibold text-muted-foreground">
            Bu bölmədə hələ rəy yoxdur.
          </p>
        )}
        {list.map((r) => (
          <div
            key={r.id}
            className="rounded-lg border border-border bg-surface p-4 transition-colors"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <div className="min-w-0">
                <p className="truncate font-heading text-base">{r.title}</p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {r.author} · {r.date} · Səfər: {r.visitedAt}
                </p>
              </div>
              <Badge tone={r.tone === "positive" ? "success" : "error"}>
                {r.tone === "positive" ? "Pozitiv" : "Neqativ"}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
            <p className="mt-2 text-xs font-bold text-primary">
              Tövsiyə: {r.recommendation}
            </p>
          </div>
        ))}
      </div>

      <form
        onSubmit={submit}
        className="space-y-3 rounded-lg border border-border bg-surface p-4"
      >
        <p className="font-heading text-base">Rəy və qiymətləndirmə əlavə et</p>
        {mine && (
          <p className="text-xs font-bold text-success">
            Sizin qiymətiniz: {mine.stars} ulduz
          </p>
        )}
        <div>
          <StarPicker value={stars} onChange={setStars} />
          <FieldError message={errors["stars"]} />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["positive", "negative"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tone === t}
              onClick={() => setTone(t)}
              className={cn(
                "min-h-[40px] rounded-full border px-4 text-sm font-bold",
                tone === t
                  ? t === "positive"
                    ? "border-success bg-success-soft text-success"
                    : "border-destructive bg-destructive-soft text-destructive"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {t === "positive" ? "Pozitiv" : "Neqativ"}
            </button>
          ))}
        </div>
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Başlıq"
            className={inputClass(Boolean(errors["title"]))}
          />
          <FieldError message={errors["title"]} />
        </div>
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Təcrübəniz"
            className={cn(inputClass(Boolean(errors["text"])), "min-h-[96px]")}
          />
          <FieldError message={errors["text"]} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            placeholder="Tövsiyəniz (opsional)"
            className={inputClass(false)}
          />
          <input
            value={visitedAt}
            onChange={(e) => setVisitedAt(e.target.value)}
            placeholder="Səfər tarixi (opsional)"
            className={inputClass(false)}
          />
        </div>
        <button type="submit" className={buttonClass("primary")}>
          Rəyi göndər
        </button>
      </form>
    </Card>
  );
}
