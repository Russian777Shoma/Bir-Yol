import { createFileRoute } from "@tanstack/react-router";
import { Building2, MessageSquare, Users, Users2 } from "lucide-react";

import { Card, SectionHeading } from "@/components/biryol/primitives";
import { destinations } from "@/data/destinations";
import { travelRooms } from "@/data/rooms";
import { adminUsers } from "@/data/admin";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const hotelCount = destinations.reduce((s, d) => s + d.hotels.length, 0);
  const activityCount = destinations.reduce((s, d) => s + d.activities.length, 0);
  const tourCount = destinations.reduce((s, d) => s + d.tours.length, 0);

  const stats = [
    { label: "Destinasiya", value: destinations.length, icon: Building2 },
    { label: "Travel Room", value: travelRooms.length, icon: Users2 },
    { label: "İstifadəçi", value: adminUsers.length, icon: Users },
    { label: "Otel / Əyləncə / Tur", value: `${hotelCount}/${activityCount}/${tourCount}`, icon: MessageSquare },
  ];

  const perRegion = destinations.map((d) => ({
    name: d.name,
    rooms: travelRooms.filter((r) => r.destinationSlug === d.slug).length,
    hotels: d.hotels.length,
  }));
  const maxRooms = Math.max(...perRegion.map((r) => r.rooms), 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="space-y-2">
            <s.icon className="h-5 w-5 text-primary" />
            <p className="font-heading text-2xl">{s.value}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {s.label}
            </p>
          </Card>
        ))}
      </div>

      <section>
        <SectionHeading kicker="Statistika" title="Regionlara görə Travel Room sayı" />
        <Card className="space-y-3">
          {perRegion.map((r) => (
            <div key={r.name} className="grid grid-cols-[6rem_minmax(0,1fr)_auto] items-center gap-3">
              <span className="truncate text-sm font-bold">{r.name}</span>
              <span className="h-2.5 min-w-0 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${(r.rooms / maxRooms) * 100}%` }}
                />
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                {r.rooms} room · {r.hotels} otel
              </span>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
