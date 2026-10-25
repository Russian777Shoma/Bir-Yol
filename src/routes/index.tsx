import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDays, MapPin, Minus, Plus, Search, Users } from "lucide-react";
import { useState } from "react";

import { DestinationCard } from "@/components/biryol/cards";
import {
  Badge,
  buttonClass,
  Card,
  SampleBadge,
  SectionHeading,
} from "@/components/biryol/primitives";
import { destinations } from "@/data/destinations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BirYol — Azərbaycanda hara getmək istəyirsən?" },
      {
        name: "description",
        content:
          "Qəbələ, Şəki, Quba və digər destinasiyalar üçün yerləşmə, əyləncə, tur və səyahət yoldaşı seçimlərini kəşf et.",
      },
      { property: "og:title", content: "BirYol — Azərbaycan üzrə səyahət kəşfi" },
      {
        property: "og:description",
        content: "Gəz · Kəşf et · Birlikdə get. Azərbaycan üzrə lokal travel discovery.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [guestPickerOpen, setGuestPickerOpen] = useState(false);

  const matches = query.trim()
    ? destinations.filter((d) =>
        d.name.toLocaleLowerCase("az").includes(query.trim().toLocaleLowerCase("az")),
      )
    : [];

  const explore = () => {
    const target =
      selected ?? (matches.length === 1 ? matches[0]!.slug : null);
    if (!target) {
      setError("Zəhmət olmasa siyahıdan bir destinasiya seçin.");
      return;
    }
    if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
      setError("Zəhmət olmasa həm giriş, həm də çıxış tarixini seçin.");
      return;
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      setError("Çıxış tarixi giriş tarixindən sonra olmalıdır.");
      return;
    }
    setError(null);
    navigate({ to: "/destinasiya/$slug", params: { slug: target } });
  };

  const guestSummary = `${rooms} otaq · ${adults} böyük · ${children === 0 ? "Uşaq yoxdur" : `${children} uşaq`}`;

  return (
    <div className="container-page py-8 sm:py-12">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="p-6 sm:p-10">
          <Badge tone="primary" className="mb-4">
            Lokal travel discovery
          </Badge>
          <h1 className="font-heading text-[clamp(2rem,5vw,3.4rem)] leading-[1.05]">
            Azərbaycanda hara getmək istəyirsən?
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Hotel, mənzil, ev, yataqxana, fəaliyyət, tur və sənin kimi səyahət edən insanları bir
            yerdə kəşf et.
          </p>

          <form
            className="relative mt-6 overflow-visible rounded-xl border-2 border-accent bg-card shadow-soft"
            onSubmit={(event) => {
              event.preventDefault();
              explore();
            }}
          >
            <div className="grid lg:grid-cols-[1.3fr_1.15fr_1fr_auto]">
              <label className="relative grid min-h-[74px] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border px-4 lg:border-b-0 lg:border-r">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-muted-foreground">Məkan</span>
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelected(null);
                      setError(null);
                    }}
                    aria-label="Destinasiya axtar"
                    placeholder="Qəbələ, Şəki, Quba..."
                    className="mt-1 min-h-7 w-full bg-transparent text-sm font-bold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground"
                  />
                </span>
              </label>

              <div className="grid min-h-[74px] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border px-4 lg:border-b-0 lg:border-r">
                <CalendarDays className="h-5 w-5 shrink-0 text-primary" />
                <div className="grid min-w-0 grid-cols-2 gap-3">
                  <label className="min-w-0">
                    <span className="block text-xs font-bold text-muted-foreground">Giriş</span>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(event) => {
                        setCheckIn(event.target.value);
                        setError(null);
                      }}
                      aria-label="Giriş tarixi"
                      className="mt-1 min-h-7 w-full min-w-0 bg-transparent text-xs font-bold text-foreground outline-none sm:text-sm"
                    />
                  </label>
                  <label className="min-w-0 border-l border-border pl-3">
                    <span className="block text-xs font-bold text-muted-foreground">Çıxış</span>
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || undefined}
                      onChange={(event) => {
                        setCheckOut(event.target.value);
                        setError(null);
                      }}
                      aria-label="Çıxış tarixi"
                      className="mt-1 min-h-7 w-full min-w-0 bg-transparent text-xs font-bold text-foreground outline-none sm:text-sm"
                    />
                  </label>
                </div>
              </div>

              <div className="relative border-b border-border lg:border-b-0 lg:border-r">
                <button
                  type="button"
                  onClick={() => setGuestPickerOpen((current) => !current)}
                  aria-expanded={guestPickerOpen}
                  aria-controls="guest-picker"
                  className="grid min-h-[74px] w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-4 text-left hover:bg-surface"
                >
                  <Users className="h-5 w-5 shrink-0 text-primary" />
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-muted-foreground">Qonaqlar</span>
                    <span className="mt-1 block truncate text-sm font-bold">{guestSummary}</span>
                  </span>
                </button>

                {guestPickerOpen && (
                  <div
                    id="guest-picker"
                    className="absolute right-2 top-[calc(100%+8px)] z-20 w-[min(330px,calc(100vw-3rem))] rounded-xl border border-border bg-card p-4 shadow-2xl"
                  >
                    <p className="mb-3 font-heading text-base">Qonaq və otaq sayı</p>
                    <Counter label="Otaq" value={rooms} min={1} max={10} onChange={setRooms} />
                    <Counter label="Böyük" hint="18+ yaş" value={adults} min={1} max={20} onChange={setAdults} />
                    <Counter label="Uşaq" hint="0–17 yaş" value={children} min={0} max={10} onChange={setChildren} />
                    <button
                      type="button"
                      onClick={() => setGuestPickerOpen(false)}
                      className={buttonClass("secondary", "mt-3 w-full")}
                    >
                      Hazırdır
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={buttonClass("primary", "min-h-[58px] rounded-none rounded-b-[10px] px-7 lg:min-h-[74px] lg:rounded-none lg:rounded-r-[10px]")}
              >
                <Search className="h-4 w-4" />
                Kəşf et
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-2 rounded-md border border-destructive/30 bg-destructive-soft px-3 py-2 text-sm font-semibold text-destructive">
              {error}
            </p>
          )}

          {matches.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {matches.map((d) => (
                <li key={d.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(d.slug);
                      setQuery(d.name);
                      setError(null);
                    }}
                    className={
                      "min-h-[44px] rounded-full border px-4 text-sm font-bold transition-colors " +
                      (selected === d.slug
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary")
                    }
                  >
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Prototipdə real rezervasiya, ödəniş və canlı qiymət yoxdur.
          </p>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">BirYol</p>
          <h2 className="mt-2 font-heading text-2xl text-primary-foreground">
            Gəz · Kəşf et · Birlikdə get
          </h2>
          <p className="mt-3 text-sm opacity-90">
            Destinasiya seç, məlumatı və nümunə təklifləri gör, sonra eyni istiqamətə
            gedən insanlarla Travel Room vasitəsilə əlaqə qur.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {["8 nümunə destinasiya", "Travel Rooms", "Join request axını"].map((c) => (
              <li
                key={c}
                className="rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5 text-xs font-bold"
              >
                {c}
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="mt-12">
        <SectionHeading
          kicker="Populyar istiqamətlər"
          title="Azərbaycan üzrə destinasiyalar"
          action={<SampleBadge className="hidden sm:inline-flex" />}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Counter({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex min-h-[58px] items-center justify-between gap-3 border-b border-border last:border-b-0">
      <div>
        <p className="text-sm font-bold">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex items-center gap-2" aria-label={`${label} sayı`}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`${label} sayını azalt`}
          className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary hover:border-primary disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-7 text-center text-sm font-bold" aria-live="polite">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`${label} sayını artır`}
          className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary hover:border-primary disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
