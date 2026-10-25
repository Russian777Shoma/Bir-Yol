import { MapPin, Navigation } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge, Card, SampleBadge, buttonClass } from "./primitives";
import { getHotelMarkers, destinationCenters } from "@/data/geo";
import type { Destination, Hotel } from "@/data/destinations";
import { cn } from "@/lib/utils";

export function HotelMap({
  destination,
  hotels = destination.hotels,
  onOpenHotel,
}: {
  destination: Destination;
  hotels?: Hotel[];
  onOpenHotel?: (hotelId: string) => void;
}) {
  const markers = useMemo(() => getHotelMarkers(destination, hotels), [destination, hotels]);
  const center = destinationCenters[destination.slug];
  const [selected, setSelected] = useState<string | null>(markers[0]?.id ?? null);

  useEffect(() => {
    if (!markers.some((marker) => marker.id === selected)) {
      setSelected(markers[0]?.id ?? null);
    }
  }, [markers, selected]);

  if (!center || markers.length === 0) return null;

  const active = markers.find((m) => m.id === selected) ?? markers[0]!;
  const embedSrc = `https://www.google.com/maps?q=${active.position.lat},${active.position.lng}&z=12&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${active.position.lat},${active.position.lng}`;

  return (
    <Card className="space-y-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="font-heading text-xl">Xəritədə yerləşmə seçimləri</h3>
          <p className="text-sm text-muted-foreground">
            Hotel, mənzil, ev və yataqxana markerlərindən birini seçin.
          </p>
        </div>
        <SampleBadge />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 overflow-hidden rounded-lg border border-border">
          <iframe
            title={`${destination.name} yerləşmə xəritəsi`}
            src={embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[280px] w-full border-0 sm:h-[380px]"
          />
        </div>

        <div className="min-w-0 space-y-2">
          {markers.map((m, i) => {
            const isActive = m.id === active.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected(m.id)}
                className={cn(
                  "grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                  isActive
                    ? "border-primary bg-primary-soft"
                    : "border-border bg-surface hover:border-primary",
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-primary",
                  )}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-heading text-base">{m.name}</span>
                  <span className="text-xs font-bold text-primary">{m.accommodationType}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="min-w-0 truncate">{m.address}</span>
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge tone="accent">{m.rating}/10</Badge>
                    <Badge tone="primary">{m.priceFrom} AZN-dən</Badge>
                  </span>
                </span>
              </button>
            );
          })}

          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={directions}
              target="_blank"
              rel="noreferrer"
              className={buttonClass("secondary")}
            >
              <Navigation className="h-4 w-4" />
              Yol göstərişi
            </a>
            {onOpenHotel && (
              <button
                type="button"
                onClick={() => onOpenHotel(active.id)}
                className={buttonClass("primary")}
              >
                Yerləşmə detalları
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
