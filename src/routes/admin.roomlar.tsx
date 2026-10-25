import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Badge, Card, buttonClass } from "@/components/biryol/primitives";
import { ChipFilter, ConfirmDialog, SearchInput } from "@/components/biryol/ui-kit";
import { travelRooms } from "@/data/rooms";
import { adminRoomStatuses, type AdminRoomStatus } from "@/data/admin";
import { destinations } from "@/data/destinations";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/admin/roomlar")({
  component: AdminRooms,
});

const statusTone: Record<AdminRoomStatus, "success" | "warn" | "neutral" | "error"> = {
  Active: "success",
  Pending: "warn",
  Completed: "neutral",
  Closed: "error",
};

function AdminRooms() {
  const { toast } = useAppState();
  const [rows, setRows] = useState(() =>
    travelRooms.map((r, i) => ({
      ...r,
      status: adminRoomStatuses[i % adminRoomStatuses.length]!,
    })),
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AdminRoomStatus | "hamisi">("hamisi");
  const [closeId, setCloseId] = useState<string | null>(null);

  const regionName = (slug: string) =>
    destinations.find((d) => d.slug === slug)?.name ?? slug;

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (status === "hamisi" || r.status === status) &&
          (r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.host.toLowerCase().includes(query.toLowerCase())),
      ),
    [rows, query, status],
  );

  return (
    <div className="space-y-4">
      <SearchInput value={query} onChange={setQuery} placeholder="Room və ya host axtar" />

      <ChipFilter
        value={status}
        onChange={setStatus}
        options={[
          { key: "hamisi" as const, label: "Hamısı" },
          ...adminRoomStatuses.map((s) => ({ key: s, label: s })),
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
              <Badge tone={statusTone[r.status]}>{r.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {regionName(r.destinationSlug)} · Host: {r.host} · {r.dates}
            </p>
            <p className="text-sm font-semibold">
              {r.joined}/{r.capacity} iştirakçı · {r.budget}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setRows((prev) =>
                    prev.map((x) => (x.id === r.id ? { ...x, status: "Active" } : x)),
                  );
                  toast("Room aktiv edildi.");
                }}
                className={buttonClass("secondary")}
              >
                Aktiv et
              </button>
              <button
                type="button"
                onClick={() => setCloseId(r.id)}
                className={buttonClass("ghost")}
              >
                Room-u bağla
              </button>
            </div>
          </Card>
        ))}
      </div>

      {closeId && (
        <ConfirmDialog
          title="Room-u bağlayım?"
          description="Bağlanan room yeni request qəbul etmir. Bu prototipdə dəyişiklik yalnız görünüşdədir."
          confirmLabel="Bağla"
          onConfirm={() => {
            setRows((prev) =>
              prev.map((x) => (x.id === closeId ? { ...x, status: "Closed" } : x)),
            );
            toast("Room bağlandı.");
            setCloseId(null);
          }}
          onCancel={() => setCloseId(null)}
        />
      )}
    </div>
  );
}
