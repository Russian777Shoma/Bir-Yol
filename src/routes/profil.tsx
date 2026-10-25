import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BellRing,
  CalendarDays,
  Heart,
  Ticket as TicketIcon,
  Users,
} from "lucide-react";
import { useState } from "react";

import { BackLink } from "@/components/biryol/back-link";
import {
  Badge,
  Card,
  SampleBadge,
  SectionHeading,
  buttonClass,
} from "@/components/biryol/primitives";
import { ConfirmDialog, EmptyState, Tabs } from "@/components/biryol/ui-kit";
import {
  bookings as sampleBookings,
  myRooms,
  notifications,
  profileUser,
  reminders,
  tickets as sampleTickets,
  type BookingStatus,
} from "@/data/profile";
import { useAppState } from "@/lib/app-state";

type TabKey =
  | "profil"
  | "rezervasiyalar"
  | "biletler"
  | "favoritler"
  | "roomlar"
  | "bildirisler";

const tabKeys: TabKey[] = [
  "profil",
  "rezervasiyalar",
  "biletler",
  "favoritler",
  "roomlar",
  "bildirisler",
];

export const Route = createFileRoute("/profil")({
  validateSearch: (search: Record<string, unknown>) => {
    const raw = search["tab"];
    const tab = tabKeys.includes(raw as TabKey) ? (raw as TabKey) : "profil";
    return { tab };
  },
  head: () => {
    const title = "Profilim — rezervasiyalar, biletlər və favoritlər | BirYol";
    const description =
      "BirYol profilində səfər tarixçəni, otel rezervasiyalarını, aktivlik biletlərini, favoritlərini və Travel Room üzvlüklərini bir yerdə izlə.";
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
  component: ProfilePage,
});

function StatusBadge({ status }: { status: BookingStatus }) {
  const map = {
    Upcoming: { tone: "primary" as const, label: "Gələcək" },
    Completed: { tone: "success" as const, label: "Tamamlanmış" },
    Cancelled: { tone: "error" as const, label: "Ləğv edilmiş" },
  };
  const s = map[status];
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

function ProfilePage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const {
    favorites,
    toggleFavorite,
    readNotifications,
    markAllNotificationsRead,
    markNotificationRead,
    reviews,
    ready,
  } = useAppState();

  const [cancelled, setCancelled] = useState<string[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const setTab = (next: TabKey) =>
    navigate({ to: "/profil", search: { tab: next } });

  const bookings = sampleBookings.map((b) =>
    cancelled.includes(b.id) ? { ...b, status: "Cancelled" as BookingStatus } : b,
  );
  const tickets = sampleTickets;
  const unreadCount = ready
    ? notifications.filter((n) => !readNotifications.includes(n.id)).length
    : 0;
  const myReviewCount = Object.values(reviews).reduce((a, r) => a + r.length, 0);

  return (
    <div className="container-page py-6 sm:py-10">
      <BackLink to="/" label="Kəşf et səhifəsinə qayıt" />

      <header className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary-soft font-heading text-xl text-primary">
            İA
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-heading text-2xl sm:text-3xl">
              {profileUser.name}
            </h1>
            <p className="truncate text-sm font-semibold text-muted-foreground">
              {profileUser.handle} · {profileUser.trips} səfər
            </p>
          </div>
        </div>
        <SampleBadge />
      </header>

      <div className="mt-5">
        <Tabs<TabKey>
          value={tab}
          onChange={setTab}
          tabs={[
            { key: "profil", label: "Profil" },
            { key: "rezervasiyalar", label: "Rezervasiyalar", count: bookings.length },
            { key: "biletler", label: "Biletlər", count: tickets.length },
            { key: "favoritler", label: "Favoritlər", count: favorites.length },
            { key: "roomlar", label: "Room-larım", count: myRooms.length },
            { key: "bildirisler", label: "Bildirişlər", count: unreadCount },
          ]}
        />
      </div>

      <div className="mt-6 space-y-6">
        {tab === "profil" && (
          <>
            <Card className="space-y-3">
              <h2 className="font-heading text-xl">Şəxsi məlumat</h2>
              <p className="text-sm text-muted-foreground">{profileUser.bio}</p>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-widest text-primary">
                    Dillər
                  </dt>
                  <dd className="text-sm font-semibold">{profileUser.language}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-widest text-primary">
                    Rəylərim
                  </dt>
                  <dd className="text-sm font-semibold">
                    {profileUser.reviews + myReviewCount} rəy
                  </dd>
                </div>
              </dl>
              <ul className="flex flex-wrap gap-2">
                {profileUser.interests.map((i) => (
                  <li key={i}>
                    <Badge tone="primary">{i}</Badge>
                  </li>
                ))}
              </ul>
            </Card>

            <section>
              <SectionHeading kicker="Xatırlatma" title="Yaxınlaşan səfərlər" />
              <div className="grid gap-3 sm:grid-cols-3">
                {reminders.map((r) => (
                  <Card key={r.id} className="border-l-4 border-l-accent">
                    <p className="font-heading text-base">{r.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                    <Link
                      to="/destinasiya/$slug"
                      params={{ slug: r.slug }}
                      className="mt-3 inline-block text-sm font-bold text-primary"
                    >
                      Destinasiyaya bax →
                    </Link>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <SectionHeading kicker="Səfər tarixçəsi" title="Keçmiş fəaliyyətlər" />
              <div className="grid gap-3 sm:grid-cols-2">
                {bookings
                  .filter((b) => b.status === "Completed")
                  .map((b) => (
                    <Card key={b.id} className="space-y-2">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                        <p className="min-w-0 font-heading text-base">{b.title}</p>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {b.region} · {b.date}
                      </p>
                    </Card>
                  ))}
              </div>
            </section>
          </>
        )}

        {tab === "rezervasiyalar" && (
          <div className="grid gap-3 lg:grid-cols-2">
            {bookings.map((b) => (
              <Card key={b.id} className="space-y-2">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="min-w-0 font-heading text-base">{b.title}</p>
                  <StatusBadge status={b.status} />
                </div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0 break-words">
                    {b.region} · {b.date}
                  </span>
                </p>
                <p className="text-sm font-semibold">
                  {b.price} AZN ·{" "}
                  <span className="text-muted-foreground">Ref: {b.reference}</span>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    to="/destinasiya/$slug"
                    params={{ slug: b.slug }}
                    className={buttonClass("secondary")}
                  >
                    Destinasiya
                  </Link>
                  {b.status === "Upcoming" && (
                    <button
                      type="button"
                      onClick={() => setConfirmId(b.id)}
                      className={buttonClass("ghost")}
                    >
                      Rezervasiyanı ləğv et
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "biletler" && (
          <div className="grid gap-3 lg:grid-cols-2">
            {tickets.map((t) => (
              <Card key={t.id} className="space-y-2 border-l-4 border-l-primary">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="min-w-0 font-heading text-base">{t.title}</p>
                  <StatusBadge status={t.status} />
                </div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <TicketIcon className="h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0 break-words">
                    {t.date} · {t.time} · {t.guests} nəfər
                  </span>
                </p>
                <p className="text-sm font-semibold">
                  {t.price} AZN ·{" "}
                  <span className="text-muted-foreground">Bilet: {t.reference}</span>
                </p>
                <div className="rounded-md border border-dashed border-border bg-surface p-3 text-center">
                  <p className="font-heading text-sm tracking-widest">{t.reference}</p>
                  <p className="text-xs text-muted-foreground">
                    Nümunə QR kod yerinə istinad kodu
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "favoritler" && (
          <>
            {favorites.length === 0 ? (
              <EmptyState
                title="Hələ favorit yoxdur. Destinasiya, otel və ya fəaliyyət səhifəsində ürək ikonuna toxunun."
                action={
                  <Link to="/" className={buttonClass("primary")}>
                    Destinasiyalara bax
                  </Link>
                }
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.map((f) => (
                  <Card key={f.key} className="space-y-2">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <p className="min-w-0 font-heading text-base">{f.title}</p>
                      <Heart className="h-4 w-4 shrink-0 fill-accent text-accent" />
                    </div>
                    <p className="text-sm text-muted-foreground">{f.subtitle}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Link
                        to="/destinasiya/$slug"
                        params={{ slug: f.slug }}
                        className={buttonClass("secondary")}
                      >
                        Bax
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(f)}
                        className={buttonClass("ghost")}
                      >
                        Çıxar
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "roomlar" && (
          <div className="grid gap-3 lg:grid-cols-2">
            {myRooms.map((r) => (
              <Card key={r.id} className="space-y-2 border-l-4 border-l-accent">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <p className="min-w-0 font-heading text-base">{r.title}</p>
                  <Badge
                    tone={
                      r.role === "Host"
                        ? "accent"
                        : r.role === "Pending"
                          ? "warn"
                          : r.role === "Rejected"
                            ? "error"
                            : r.role === "Completed"
                              ? "neutral"
                              : "success"
                    }
                  >
                    {r.role}
                  </Badge>
                </div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0 break-words">
                    {r.destination} · {r.dates} · {r.members}/{r.capacity}
                  </span>
                </p>
                <Link
                  to="/destinasiya/$slug/rooms"
                  params={{ slug: r.slug }}
                  search={{ room: r.roomId }}
                  className={buttonClass("secondary")}
                >
                  Room-a bax
                </Link>
              </Card>
            ))}
          </div>
        )}

        {tab === "bildirisler" && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-muted-foreground">
                {unreadCount} oxunmamış bildiriş
              </p>
              <button
                type="button"
                onClick={() => markAllNotificationsRead(notifications.map((n) => n.id))}
                className={buttonClass("secondary")}
              >
                Hamısını oxundu et
              </button>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {notifications.map((n) => {
                const unread = ready && !readNotifications.includes(n.id);
                return (
                  <Card
                    key={n.id}
                    className={unread ? "border-l-4 border-l-accent" : undefined}
                  >
                    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                      <BellRing className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="font-heading text-base">{n.title}</p>
                        <p className="text-sm text-muted-foreground">{n.body}</p>
                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                          {n.time}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Link
                            to="/destinasiya/$slug/rooms"
                            params={{ slug: n.slug }}
                            search={{ room: n.roomId }}
                            onClick={() => markNotificationRead(n.id)}
                            className={buttonClass("secondary")}
                          >
                            Room-a keç
                          </Link>
                          {unread && (
                            <button
                              type="button"
                              onClick={() => markNotificationRead(n.id)}
                              className={buttonClass("ghost")}
                            >
                              Oxundu
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>

      {confirmId && (
        <ConfirmDialog
          title="Rezervasiyanı ləğv edim?"
          description="Bu prototipdə ləğv əməliyyatı yalnız görünüşü dəyişir, real rezervasiya yoxdur."
          confirmLabel="Bəli, ləğv et"
          onConfirm={() => {
            setCancelled((prev) => [...prev, confirmId]);
            setConfirmId(null);
          }}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}
