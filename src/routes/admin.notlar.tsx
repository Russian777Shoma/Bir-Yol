import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  Badge,
  Card,
  FieldError,
  buttonClass,
  inputClass,
} from "@/components/biryol/primitives";
import { ConfirmDialog } from "@/components/biryol/ui-kit";
import { adminNotesSeed, type AdminNote } from "@/data/admin";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/notlar")({
  component: AdminNotes,
});

function AdminNotes() {
  const { toast } = useAppState();
  const [notes, setNotes] = useState<AdminNote[]>(adminNotesSeed);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Bu sahə boş qala bilməz.");
      return;
    }
    setError(undefined);
    setNotes((prev) => [
      {
        id: `an-${Date.now()}`,
        text: text.trim(),
        owner: "Admin A",
        created: "Bu gün",
        status: "Gözləyir",
      },
      ...prev,
    ]);
    setText("");
    toast("Qeyd əlavə edildi.");
  };

  return (
    <div className="space-y-4">
      <Card>
        <form onSubmit={submit} className="space-y-3">
          <label className="font-heading text-base" htmlFor="note-text">
            Yeni daxili qeyd
          </label>
          <textarea
            id="note-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Məsələn: Qəbələ otel qiymətlərini yenilə."
            className={cn(inputClass(Boolean(error)), "min-h-[96px]")}
          />
          <FieldError message={error} />
          <button type="submit" className={buttonClass("primary")}>
            Qeydi əlavə et
          </button>
        </form>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        {notes.map((n) => (
          <Card key={n.id} className="space-y-2">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <p className="min-w-0 text-sm font-semibold">{n.text}</p>
              <Badge tone={n.status === "Tamamlandı" ? "success" : "warn"}>
                {n.status}
              </Badge>
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              {n.owner} · {n.created}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setNotes((prev) =>
                    prev.map((x) =>
                      x.id === n.id
                        ? {
                            ...x,
                            status: x.status === "Tamamlandı" ? "Gözləyir" : "Tamamlandı",
                          }
                        : x,
                    ),
                  );
                }}
                className={buttonClass("secondary")}
              >
                {n.status === "Tamamlandı" ? "Geri qaytar" : "Tamamlandı et"}
              </button>
              <button
                type="button"
                onClick={() => setDeleteId(n.id)}
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
          title="Qeydi silim?"
          description="Qeyd cari siyahıdan silinəcək."
          confirmLabel="Sil"
          onConfirm={() => {
            setNotes((prev) => prev.filter((x) => x.id !== deleteId));
            toast("Qeyd silindi.");
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
