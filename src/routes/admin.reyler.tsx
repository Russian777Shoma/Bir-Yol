import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Badge, Card, buttonClass } from "@/components/biryol/primitives";
import { ChipFilter, ConfirmDialog, SearchInput } from "@/components/biryol/ui-kit";
import { destinations } from "@/data/destinations";
import { getSampleReviews } from "@/data/reviews";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/admin/reyler")({
  component: AdminReviews,
});

type ModerationStatus = "Gözləyir" | "Təsdiqlənmiş" | "Silinmiş";

function AdminReviews() {
  const { toast } = useAppState();

  const [rows, setRows] = useState(() =>
    destinations.flatMap((d) =>
      [
        ...getSampleReviews(`region-${d.slug}`)
          .filter((r) => r.tone === "positive")
          .slice(0, 2),
        ...getSampleReviews(`region-${d.slug}`)
          .filter((r) => r.tone === "negative")
          .slice(0, 2),
      ].map((r, i) => ({
          ...r,
          region: d.name,
          status: (i === 0 ? "Gözləyir" : "Təsdiqlənmiş") as ModerationStatus,
        })),
    ),
  );
  const [query, setQuery] = useState("");
  const [tone, setTone] = useState<"hamisi" | "positive" | "negative">("hamisi");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (tone === "hamisi" || r.tone === tone) &&
          (r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.region.toLowerCase().includes(query.toLowerCase())),
      ),
    [rows, query, tone],
  );

  return (
    <div className="space-y-4">
      <SearchInput value={query} onChange={setQuery} placeholder="Rəy və ya region axtar" />

      <ChipFilter
        value={tone}
        onChange={setTone}
        options={[
          { key: "hamisi" as const, label: "Hamısı" },
          { key: "positive" as const, label: "Pozitiv" },
          { key: "negative" as const, label: "Neqativ" },
        ]}
      />

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.length === 0 && (
          <Card className="border-dashed lg:col-span-2">
            <p className="text-center text-sm font-semibold text-muted-foreground">
              Nəticə tapılmadı.
            </p>
          </Card>
        )}
        {filtered.map((r) => (
          <Card key={r.id} className="space-y-2">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <p className="min-w-0 font-heading text-base">{r.title}</p>
              <Badge tone={r.tone === "positive" ? "success" : "error"}>
                {r.tone === "positive" ? "Pozitiv" : "Neqativ"}
              </Badge>
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              {r.region} · {r.author} · {r.date}
            </p>
            <p className="text-sm text-muted-foreground">{r.text}</p>
            <Badge
              tone={
                r.status === "Təsdiqlənmiş"
                  ? "success"
                  : r.status === "Silinmiş"
                    ? "error"
                    : "warn"
              }
            >
              {r.status}
            </Badge>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setRows((prev) =>
                    prev.map((x) =>
                      x.id === r.id ? { ...x, status: "Təsdiqlənmiş" } : x,
                    ),
                  );
                  toast("Rəy təsdiqləndi.");
                }}
                className={buttonClass("secondary")}
              >
                Təsdiqlə
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(r.id)}
                className={buttonClass("ghost")}
              >
                Sil
              </button>
            </div>
          </Card>
        ))}
      </div>

      {deleteId && (
        <ConfirmDialog
          title="Rəyi silim?"
          description="Bu prototipdə silinən rəy yalnız «Silinmiş» statusu alır."
          confirmLabel="Sil"
          onConfirm={() => {
            setRows((prev) =>
              prev.map((x) => (x.id === deleteId ? { ...x, status: "Silinmiş" } : x)),
            );
            toast("Rəy silindi.");
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
