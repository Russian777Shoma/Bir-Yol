import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Star, Users, Wallet } from "lucide-react";

import { Badge, buttonClass, Card, SampleBadge } from "./primitives";
import { FavoriteButton } from "./item-actions";
import type { Activity, Destination, Hotel, Tour } from "@/data/destinations";
import type { TravelRoom } from "@/data/rooms";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <div className="relative">
      <FavoriteButton
        className="absolute right-3 top-3 z-10 bg-card/90"
        item={{
          key: `region-${destination.slug}`,
          kind: "region",
          title: destination.name,
          subtitle: destination.region,
          slug: destination.slug,
        }}
      />
      <Link
        to="/destinasiya/$slug"
        params={{ slug: destination.slug }}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-colors hover:border-primary"
      >
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={destination.image}
            alt={`${destination.name} mənzərəsi`}
            width={1280}
            height={800}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <SampleBadge className="absolute left-3 top-3 bg-card/90" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4">
          <h3 className="truncate font-heading text-lg">{destination.name}</h3>
          <p className="text-xs font-semibold text-muted-foreground">
            {destination.region}
          </p>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {destination.tagline}
          </p>
          <span className="mt-2 text-sm font-bold text-primary">Kəşf et →</span>
        </div>
      </Link>
    </div>
  );
}

export function HotelCard({
  hotel,
  onOpen,
  actions,
}: {
  hotel: Hotel;
  onOpen?: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <Badge tone="primary">{hotel.accommodationType}</Badge>
          <h3 className="mt-2 min-w-0 font-heading text-lg leading-snug">{hotel.name}</h3>
        </div>
        <Badge tone="accent">
          <Star className="h-3.5 w-3.5 fill-current" />
          {hotel.rating}/10
        </Badge>
      </div>
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 shrink-0" />
        <span className="min-w-0 break-words">{hotel.location} · mərkəzdən {hotel.distanceKm} km</span>
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {hotel.features.map((f) => (
          <li key={f}>
            <Badge>{f}</Badge>
          </li>
        ))}
        {hotel.freeCancellation && (
          <li>
            <Badge tone="primary">Pulsuz ləğv</Badge>
          </li>
        )}
      </ul>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
        <p className="text-sm">
          <span className="text-muted-foreground">Başlanğıc</span>{" "}
          <strong className="font-heading text-base">{hotel.priceFrom} AZN</strong>
          <span className="text-muted-foreground"> / gecə</span>
        </p>
        <SampleBadge />
      </div>
      {onOpen && (
        <button type="button" onClick={onOpen} className={buttonClass("secondary")}>
          Detallara bax
        </button>
      )}
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </Card>
  );
}

export function ActivityCard({
  activity,
  onOpen,
  actions,
}: {
  activity: Activity;
  onOpen?: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-2.5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <h3 className="min-w-0 font-heading text-lg leading-snug">{activity.name}</h3>
        <div className="flex flex-col items-end gap-1">
          <Badge tone="accent">{activity.type}</Badge>
          <span className="text-xs font-bold text-muted-foreground">{activity.rating}/10</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {activity.duration} · {activity.note}
      </p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
        <strong className="font-heading text-base">{activity.price} AZN</strong>
        <SampleBadge />
      </div>
      {onOpen && (
        <button type="button" onClick={onOpen} className={buttonClass("secondary")}>
          Detallara bax
        </button>
      )}
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </Card>
  );
}

export function TourCard({
  tour,
  onOpen,
  actions,
}: {
  tour: Tour;
  onOpen?: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-2.5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <Badge tone="accent">{tour.category}</Badge>
          <h3 className="mt-2 font-heading text-lg leading-snug">{tour.name}</h3>
        </div>
        <span className="text-xs font-bold text-muted-foreground">{tour.rating}/10</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {tour.duration}{tour.familyFriendly ? " · Ailə üçün uyğun" : ""}
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {tour.includes.map((i) => (
          <li key={i}>
            <Badge tone="primary">{i}</Badge>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
        <strong className="font-heading text-base">{tour.price} AZN</strong>
        <SampleBadge />
      </div>
      {onOpen && (
        <button type="button" onClick={onOpen} className={buttonClass("secondary")}>
          Detallara bax
        </button>
      )}
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </Card>
  );
}

export function RoomCard({
  room,
  onOpen,
  actions,
}: {
  room: TravelRoom;
  onOpen: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-3 border-l-4 border-l-accent">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <h3 className="min-w-0 font-heading text-lg leading-snug">{room.title}</h3>
        <Badge tone="accent">Request ilə</Badge>
      </div>
      <p className="text-sm font-semibold text-muted-foreground">Host: {room.host}</p>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
          <span className="min-w-0 break-words">{room.dates}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 shrink-0 text-primary" />
          <span>
            {room.joined} / {room.capacity} iştirakçı
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wallet className="h-4 w-4 shrink-0 text-primary" />
          <span className="min-w-0 break-words">{room.budget}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge>{room.language}</Badge>
          <Badge>{room.ageRule}</Badge>
        </div>
      </dl>
      <p className="text-sm text-muted-foreground">{room.description}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
        <button type="button" onClick={onOpen} className={buttonClass("primary")}>
          Room-a bax
        </button>
        <SampleBadge />
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </Card>
  );
}
