import { CloudRain, Sun, Wind } from "lucide-react";

import { Badge, Card, SampleBadge } from "./primitives";
import { getWeather } from "@/data/weather";
import type { Destination } from "@/data/destinations";

export function WeatherAdvice({ destination }: { destination: Destination }) {
  const days = getWeather(destination.slug);
  if (!days) return null;

  const suggest = (types: string[]) =>
    destination.activities.filter((a) => types.includes(a.type)).slice(0, 3);

  return (
    <Card className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-xl">Hava və tövsiyə</h3>
          <p className="text-sm text-muted-foreground">
            {destination.nameGenitive} nümunə proqnozuna görə uyğun fəaliyyətlər.
          </p>
        </div>
        <SampleBadge />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {days.map((d) => {
          const wet = d.rainChance >= 40;
          const picks = suggest(d.preferredTypes);
          return (
            <div
              key={d.label}
              className="rounded-lg border border-border bg-surface p-4 transition-colors"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    {d.label}
                  </p>
                  <p className="truncate font-heading text-2xl">{d.temp}°C</p>
                  <p className="truncate text-sm font-semibold text-muted-foreground">
                    {d.condition}
                  </p>
                </div>
                {wet ? (
                  <CloudRain className="h-8 w-8 shrink-0 text-primary" />
                ) : (
                  <Sun className="h-8 w-8 shrink-0 text-accent" />
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={wet ? "warn" : "success"}>
                  Yağış ehtimalı {d.rainChance}%
                </Badge>
                <Badge tone="neutral">
                  <Wind className="h-3.5 w-3.5" />
                  {d.wind}
                </Badge>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">{d.advice}</p>

              {picks.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {picks.map((p) => (
                    <li key={p.id} className="text-sm font-semibold text-foreground">
                      · {p.name} — {p.price} AZN
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
