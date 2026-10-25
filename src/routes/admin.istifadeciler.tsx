import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Badge, Card, buttonClass } from "@/components/biryol/primitives";
import { ChipFilter, ConfirmDialog, SearchInput } from "@/components/biryol/ui-kit";
import { adminUsers, type AdminUser } from "@/data/admin";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/admin/istifadeciler")({
  component: AdminUsers,
});

function AdminUsers() {
  const { toast } = useAppState();
  const [rows, setRows] = useState<AdminUser[]>(adminUsers);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"hamisi" | "Host" | "Member">("hamisi");
  const [blockId, setBlockId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter(
        (u) =>
          (role === "hamisi" || u.role === role) &&
          (u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())),
      ),
    [rows, query, role],
  );

  return (
    <div className="space-y-4">
      <SearchInput value={query} onChange={setQuery} placeholder="Ad və ya e-poçt axtar" />

      <ChipFilter
        value={role}
        onChange={setRole}
        options={[
          { key: "hamisi" as const, label: "Hamısı" },
          { key: "Host" as const, label: "Host" },
          { key: "Member" as const, label: "Member" },
        ]}
      />

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              <th className="px-4 py-3 font-bold">İstifadəçi</th>
              <th className="px-4 py-3 font-bold">Rol</th>
              <th className="px-4 py-3 font-bold">Region</th>
              <th className="px-4 py-3 font-bold">Səfər / Rəy</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Əməliyyat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center font-semibold text-muted-foreground"
                >
                  Nəticə tapılmadı.
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={u.role === "Host" ? "accent" : "primary"}>{u.role}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.region}</td>
                <td className="px-4 py-3">
                  {u.trips} / {u.reviews}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={u.status === "Active" ? "success" : "error"}>
                    {u.status === "Active" ? "Aktiv" : "Bloklanmış"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {u.status === "Active" ? (
                    <button
                      type="button"
                      onClick={() => setBlockId(u.id)}
                      className="text-sm font-bold text-destructive"
                    >
                      Blokla
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setRows((prev) =>
                          prev.map((x) =>
                            x.id === u.id ? { ...x, status: "Active" } : x,
                          ),
                        );
                        toast("İstifadəçi blokdan çıxarıldı.");
                      }}
                      className="text-sm font-bold text-primary"
                    >
                      Blokdan çıxar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="text-xs font-semibold text-muted-foreground">
        Bütün istifadəçi məlumatları nümunədir, real şəxsi məlumat saxlanmır.
      </p>

      {blockId && (
        <ConfirmDialog
          title="İstifadəçini bloklayım?"
          description="Bloklanan istifadəçi prototipdə yalnız «Bloklanmış» statusu alır."
          confirmLabel="Blokla"
          onConfirm={() => {
            setRows((prev) =>
              prev.map((x) => (x.id === blockId ? { ...x, status: "Blocked" } : x)),
            );
            toast("İstifadəçi bloklandı.");
            setBlockId(null);
          }}
          onCancel={() => setBlockId(null)}
        />
      )}
    </div>
  );
}
