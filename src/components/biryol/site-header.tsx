import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, User, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/biryol-logo.png";
import { buttonClass } from "./primitives";
import { NotificationBell } from "./notification-bell";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

function NavLinks({
  className,
  onNavigate,
}: {
  className: string;
  onNavigate?: () => void;
}) {
  const activeProps = { className: "bg-primary-soft text-primary" };
  return (
    <>
      <Link
        to="/"
        activeOptions={{ exact: true }}
        activeProps={activeProps}
        onClick={onNavigate}
        className={className}
      >
        Kəşf et
      </Link>
      <Link
        to="/destinasiya/$slug/rooms"
        params={{ slug: "qebele" }}
        search={{ room: "" }}
        activeProps={activeProps}
        onClick={onNavigate}
        className={className}
      >
        Travel Rooms
      </Link>
      <Link
        to="/room-yarat"
        activeProps={activeProps}
        onClick={onNavigate}
        className={className}
      >
        Room yarat
      </Link>
      <Link
        to="/planlayici"
        activeProps={activeProps}
        onClick={onNavigate}
        className={className}
      >
        Planlayıcı
      </Link>
      <Link
        to="/profil"
        search={{ tab: "profil" }}
        activeProps={activeProps}
        onClick={onNavigate}
        className={className}
      >
        Profil
      </Link>
      <Link
        to="/admin"
        activeProps={activeProps}
        onClick={onNavigate}
        className={className}
      >
        Admin
      </Link>
    </>
  );
}

function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç"}
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted",
        className,
      )}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="container-page grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={logo}
            alt="BirYol loqosu"
            className="h-11 w-11 shrink-0 object-contain"
          />

          <span className="flex min-w-0 flex-col leading-tight">
            <strong className="truncate font-heading text-base">BirYol</strong>
            <small className="truncate text-[10px] font-semibold text-muted-foreground">
              Gəz · Kəşf et · Birlikdə get
            </small>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            <NavLinks className="rounded-full px-3 py-2 text-[13px] font-bold text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary" />
          </nav>
          <NotificationBell />
          <Link
            to="/profil"
            search={{ tab: "profil" }}
            aria-label="Profilim"
            className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-primary-soft text-primary transition-colors hover:bg-primary hover:text-primary-foreground sm:grid"
          >
            <User className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menyu"
            aria-expanded={open}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-card lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-card lg:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            <NavLinks
              className={buttonClass("ghost", "justify-start")}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </nav>
      )}
    </header>
  );
}
