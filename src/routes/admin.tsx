import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  Badge,
  Card,
  FieldError,
  SampleBadge,
  buttonClass,
  inputClass,
} from "@/components/biryol/primitives";
import { adminCredentials } from "@/data/admin";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/admin")({
  head: () => {
    const title = "Admin panel — BirYol platforma idarəsi";
    const description =
      "BirYol admin paneli: destinasiya, otel, tur, Travel Room və istifadəçi məlumatlarının nümunə idarəetmə görünüşü.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: AdminLayout,
});

const navItems = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/destinasiyalar", label: "Destinasiyalar", exact: false },
  { to: "/admin/roomlar", label: "Travel Rooms", exact: false },
  { to: "/admin/istifadeciler", label: "İstifadəçilər", exact: false },
  { to: "/admin/reyler", label: "Rəylər", exact: false },
  { to: "/admin/notlar", label: "Qeydlər", exact: false },
] as const;

function AdminLogin() {
  const { loginAdmin, toast } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!email.trim()) next["email"] = "Bu sahə boş qala bilməz.";
    if (!password.trim()) next["password"] = "Bu sahə boş qala bilməz.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (
      email.trim() !== adminCredentials["email"] ||
      password !== adminCredentials["password"]
    ) {
      setErrors({ password: "E-poçt və ya şifrə yanlışdır." });
      toast("Giriş uğursuz oldu.", "error");
      return;
    }
    loginAdmin(email.trim());
    toast("Admin panelinə daxil oldunuz.");
  };

  return (
    <div className="container-page py-10">
      <Card className="mx-auto max-w-md space-y-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
          <h1 className="min-w-0 font-heading text-2xl">Admin girişi</h1>
          <SampleBadge />
        </div>
        <p className="text-sm text-muted-foreground">
          Bu prototipdə giriş simulyasiyadır. Nümunə məlumat:{" "}
          <strong>{adminCredentials["email"]}</strong> / {adminCredentials["password"]}
        </p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm font-bold" htmlFor="admin-email">
              E-poçt
            </label>
            <input
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass(Boolean(errors["email"]))}
              placeholder="admin@biryol.az"
            />
            <FieldError message={errors["email"]} />
          </div>
          <div>
            <label className="text-sm font-bold" htmlFor="admin-password">
              Şifrə
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass(Boolean(errors["password"]))}
              placeholder="••••••••"
            />
            <FieldError message={errors["password"]} />
          </div>
          <button type="submit" className={buttonClass("primary", "w-full")}>
            Daxil ol
          </button>
        </form>
        <Link to="/" className="block text-center text-sm font-bold text-primary">
          Sayta qayıt
        </Link>
      </Card>
    </div>
  );
}

function AdminLayout() {
  const { admin, logoutAdmin, ready } = useAppState();

  if (!ready) {
    return (
      <div className="container-page py-10">
        <Card className="mx-auto max-w-md">
          <p className="text-sm font-semibold text-muted-foreground">Yüklənir...</p>
        </Card>
      </div>
    );
  }

  if (!admin) return <AdminLogin />;

  return (
    <div className="container-page py-6 sm:py-10">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <Badge tone="accent">Admin panel</Badge>
          <h1 className="mt-2 truncate font-heading text-2xl sm:text-3xl">
            Platforma idarəsi
          </h1>
          <p className="truncate text-sm font-semibold text-muted-foreground">{admin}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <SampleBadge />
          <button
            type="button"
            onClick={logoutAdmin}
            className={buttonClass("secondary")}
          >
            Çıxış
          </button>
        </div>
      </header>

      <nav className="mt-5 flex gap-2 overflow-x-auto rounded-full border border-border bg-surface p-1.5">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            activeProps={{ className: "bg-primary text-primary-foreground" }}
            inactiveProps={{ className: "text-muted-foreground hover:bg-card" }}
            className="inline-flex min-h-[40px] shrink-0 items-center whitespace-nowrap rounded-full px-4 text-sm font-bold transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}
