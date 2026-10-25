import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Badge, Card, FieldError, buttonClass, inputClass } from "@/components/biryol/primitives";
import { ChipFilter, ConfirmDialog, Modal, SearchInput } from "@/components/biryol/ui-kit";
import { categoryLabels, destinations, type CategoryKey } from "@/data/destinations";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/admin/destinasiyalar")({
  component: AdminContent,
});

type Row = {
  id: string;
  destination: string;
  slug: string;
  category: CategoryKey;
  name: string;
  price: number;
  status: "Aktiv" | "Gizli";
};

function buildRows(): Row[] {
  const rows: Row[] = [];
  destinations.forEach((d) => {
    d.hotels.forEach((h) =>
      rows.push({
        id: h.id,
        destination: d.name,
        slug: d.slug,
        category: "oteller",
        name: h.name,
        price: h.priceFrom,
        status: "Aktiv",
      }),
    );
    d.activities.forEach((a) =>
      rows.push({
        id: a.id,
        destination: d.name,
        slug: d.slug,
        category: "eylenceler",
        name: a.name,
        price: a.price,
        status: "Aktiv",
      }),
    );
    d.tours.forEach((t) =>
      rows.push({
        id: t.id,
        destination: d.name,
        slug: d.slug,
        category: "turlar",
        name: t.name,
        price: t.price,
        status: "Aktiv",
      }),
    );
  });
  return rows;
}

function AdminContent() {
  const { toast } = useAppState();
  const [rows, setRows] = useState<Row[]>(() => buildRows());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryKey | "hamisi">("hamisi");
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (category === "hamisi" || r.category === category) &&
          (r.name.toLowerCase().includes(query.toLowerCase()) ||
            r.destination.toLowerCase().includes(query.toLowerCase())),
      ),
    [rows, query, category],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput value={query} onChange={setQuery} placeholder="Ad və ya region axtar" />
        <button type="button" onClick={() => setCreating(true)} className={buttonClass("primary")}>
          Yeni məzmun əlavə et
        </button>
      </div>

      <ChipFilter
        value={category}
        onChange={setCategory}
        options={[
          { key: "hamisi" as const, label: "Hamısı" },
          { key: "oteller" as const, label: categoryLabels.oteller },
          { key: "eylenceler" as const, label: categoryLabels.eylenceler },
          { key: "turlar" as const, label: categoryLabels.turlar },
        ]}
      />

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-4 py-3 font-bold">Ad</th>
              <th className="px-4 py-3 font-bold">Region</th>
              <th className="px-4 py-3 font-bold">Kateqoriya</th>
              <th className="px-4 py-3 font-bold">Qiymət</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Əməliyyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center font-semibold text-muted-foreground">
                  Nəticə tapılmadı.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-semibold">{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.destination}</td>
                <td className="px-4 py-3">{categoryLabels[r.category]}</td>
                <td className="px-4 py-3">{r.price} AZN</td>
                <td className="px-4 py-3">
                  <Badge tone={r.status === "Aktiv" ? "success" : "neutral"}>{r.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(r)}
                      className="text-sm font-bold text-primary"
                    >
                      Redaktə
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRows((prev) =>
                          prev.map((x) =>
                            x.id === r.id
                              ? { ...x, status: x.status === "Aktiv" ? "Gizli" : "Aktiv" }
                              : x,
                          ),
                        )
                      }
                      className="text-sm font-bold text-muted-foreground"
                    >
                      {r.status === "Aktiv" ? "Gizlət" : "Aktiv et"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(r.id)}
                      className="text-sm font-bold text-destructive"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {(editing || creating) && (
        <RowForm
          row={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={(row) => {
            setRows((prev) =>
              editing ? prev.map((x) => (x.id === row.id ? row : x)) : [row, ...prev],
            );
            toast(editing ? "Məzmun yeniləndi." : "Yeni məzmun əlavə edildi.");
            setEditing(null);
            setCreating(false);
          }}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          title="Məzmunu silim?"
          description="Bu prototipdə silmə yalnız cari görünüşdən çıxarır."
          confirmLabel="Sil"
          onConfirm={() => {
            setRows((prev) => prev.filter((x) => x.id !== deleteId));
            toast("Məzmun silindi.");
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

function RowForm({
  row,
  onClose,
  onSave,
}: {
  row: Row | null;
  onClose: () => void;
  onSave: (row: Row) => void;
}) {
  const [name, setName] = useState(row?.name ?? "");
  const [destination, setDestination] = useState(row?.destination ?? destinations[0]!.name);
  const [category, setCategory] = useState<CategoryKey>(row?.category ?? "oteller");
  const [price, setPrice] = useState(String(row?.price ?? ""));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next["name"] = "Bu sahə boş qala bilməz.";
    if (!price.trim() || Number.isNaN(Number(price))) next["price"] = "Düzgün qiymət yazın.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const slug = destinations.find((d) => d.name === destination)?.slug ?? "qebele";
    onSave({
      id: row?.id ?? `new-${Date.now()}`,
      name: name.trim(),
      destination,
      slug,
      category,
      price: Number(price),
      status: row?.status ?? "Aktiv",
    });
  };

  return (
    <Modal
      title={row ? "Məzmunu redaktə et" : "Yeni məzmun"}
      onClose={onClose}
      footer={
        <>
          <button type="submit" form="admin-row-form" className={buttonClass("primary")}>
            Yadda saxla
          </button>
          <button type="button" onClick={onClose} className={buttonClass("ghost")}>
            Ləğv et
          </button>
        </>
      }
    >
      <form id="admin-row-form" onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm font-bold" htmlFor="row-name">
            Ad
          </label>
          <input
            id="row-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass(Boolean(errors["name"]))}
          />
          <FieldError message={errors["name"]} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm font-bold" htmlFor="row-region">
              Region
            </label>
            <select
              id="row-region"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={inputClass(false)}
            >
              {destinations.map((d) => (
                <option key={d.slug} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="row-category">
              Kateqoriya
            </label>
            <select
              id="row-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryKey)}
              className={inputClass(false)}
            >
              {(Object.keys(categoryLabels) as CategoryKey[]).map((k) => (
                <option key={k} value={k}>
                  {categoryLabels[k]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-bold" htmlFor="row-price">
            Qiymət (AZN)
          </label>
          <input
            id="row-price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass(Boolean(errors["price"]))}
          />
          <FieldError message={errors["price"]} />
        </div>
      </form>
    </Modal>
  );
}
