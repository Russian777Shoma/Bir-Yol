import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Building2, Compass, Map, Users } from "lucide-react";

import { BackLink } from "@/components/biryol/back-link";
import { ActivityCard, HotelCard, TourCard } from "@/components/biryol/cards";
import { FavoriteButton } from "@/components/biryol/item-actions";
import { NotesSection } from "@/components/biryol/notes-section";
import { PracticalInfo } from "@/components/biryol/practical-info";
import { RatingSection } from "@/components/biryol/rating-section";
import { WeatherAdvice } from "@/components/biryol/weather-advice";
import {
  Badge,
  buttonClass,
  Card,
  SampleBadge,
  SectionHeading,
} from "@/components/biryol/primitives";
import { getDestination } from "@/data/destinations";
import { getDestinationNotes } from "@/data/notes";

export const Route = createFileRoute("/destinasiya/$slug/")({
  loader: ({ params }) => {
    const destination = getDestination(params.slug);
    if (!destination) throw notFound();
    return { destination };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Destinasiya tapılmadı — BirYol" }, { name: "robots", content: "noindex" }],
      };
    }
    const { destination } = loaderData;
    const title = `${destination.name} — yerləşmə, əyləncələr və Travel Rooms | BirYol`;
    const description = `${destination.name}: ${destination.tagline}. Hotel, mənzil, ev, yataqxana, əyləncə və tur seçimlərini gör.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: DestinationDetail,
});

function DestinationDetail() {
  const { destination } = Route.useLoaderData();

  const categories = [
    { key: "oteller", label: "Yerləşmə", icon: Building2 },
    { key: "eylenceler", label: "Əyləncələr", icon: Compass },
    { key: "turlar", label: "Turlar", icon: Map },
  ] as const;

  return (
    <div className="container-page py-6 sm:py-10">
      <BackLink to="/" label="Kəşf et səhifəsinə qayıt" />

      <section className="mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
        <div className="relative h-56 w-full sm:h-80">
          <img
            src={destination.image}
            alt={`${destination.name} mənzərəsi`}
            width={1280}
            height={800}
            className="h-full w-full object-cover"
          />
          <SampleBadge className="absolute right-3 top-3 bg-card/90" />
        </div>
        <div className="p-5 sm:p-8">
          <Badge tone="primary">{destination.region}</Badge>
          <h1 className="mt-3 font-heading text-[clamp(1.9rem,4.5vw,3rem)] leading-tight">
            {destination.name}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-muted-foreground">
            {destination.description}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            <li>
              <Badge>Ən yaxşı mövsüm: {destination.bestSeason}</Badge>
            </li>
            <li>
              <Badge>Bakıdan: {destination.distanceFromBaku}</Badge>
            </li>
            {destination.highlights.map((h) => (
              <li key={h}>
                <Badge tone="accent">{h}</Badge>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              to="/destinasiya/$slug/rooms"
              params={{ slug: destination.slug }}
              search={{ room: "" }}
              className={buttonClass("primary")}
            >
              <Users className="h-4 w-4" />
              Səyahət yoldaşı tap
            </Link>
            <Link
              to="/destinasiya/$slug/$category"
              params={{ slug: destination.slug, category: "oteller" }}
              className={buttonClass("secondary")}
            >
              Yerləşməyə bax
            </Link>
            <FavoriteButton
              label
              item={{
                key: `region-${destination.slug}`,
                kind: "region",
                title: destination.name,
                subtitle: destination.region,
                slug: destination.slug,
              }}
            />
          </div>
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading kicker="Kateqoriyalar" title="Növbəti addımı seç" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.key}
              to="/destinasiya/$slug/$category"
              params={{ slug: destination.slug, category: c.key }}
              className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-4 text-center text-sm font-bold transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
            >
              <c.icon className="h-5 w-5" />
              {c.label}
            </Link>
          ))}
          <Link
            to="/destinasiya/$slug/rooms"
            params={{ slug: destination.slug }}
            search={{ room: "" }}
            className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent-soft p-4 text-center text-sm font-bold text-accent transition-colors hover:border-accent"
          >
            <Users className="h-5 w-5" />
            Səyahət yoldaşı
          </Link>
        </div>
      </section>

      <NotesSection
        key={destination.slug}
        notes={getDestinationNotes(destination.slug, destination.name)}
        subtitle={`${destination.nameDative} əvvəl getmiş səyahətçilərin görməyə dəyər saydığı yerlər, tövsiyələr və məsləhət görmədikləri məqamlar.`}
      />

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <WeatherAdvice destination={destination} />
        <PracticalInfo destination={destination} />
      </section>

      <section className="mt-10">
        <SectionHeading
          kicker="Reytinq və rəylər"
          title={`${destination.name} üçün istifadəçi qiymətləndirmələri`}
        />
        <RatingSection
          key={destination.slug}
          targetKey={`region-${destination.slug}`}
          targetName={destination.name}
        />
      </section>

      <section className="mt-10">
        <SectionHeading
          kicker="Yerləşmə"
          title={`${destination.name} üçün hotel, mənzil, ev və yataqxanalar`}
          action={
            <Link
              to="/destinasiya/$slug/$category"
              params={{ slug: destination.slug, category: "oteller" }}
              className="text-sm font-bold text-primary hover:underline"
            >
              Hamısı →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destination.hotels.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading
          kicker="Əyləncələr"
          title={`${destination.name}-da nə etmək olar`}
          action={
            <Link
              to="/destinasiya/$slug/$category"
              params={{ slug: destination.slug, category: "eylenceler" }}
              className="text-sm font-bold text-primary hover:underline"
            >
              Hamısı →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destination.activities.slice(0, 6).map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading
          kicker="Turlar"
          title="Nümunə lokal tur təklifləri"
          action={
            <Link
              to="/destinasiya/$slug/$category"
              params={{ slug: destination.slug, category: "turlar" }}
              className="text-sm font-bold text-primary hover:underline"
            >
              Hamısı →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destination.tours.map((t) => (
            <TourCard key={t.id} tour={t} />
          ))}
        </div>
      </section>

      <Card className="mt-10 grid gap-3 border-accent/40 bg-accent-soft sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <h2 className="font-heading text-xl">
            {destination.nameDative} birlikdə getmək istəyirsən?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tarixinə və səyahət planına uyğun Travel Room tap.
          </p>
        </div>
        <Link
          to="/destinasiya/$slug/rooms"
          params={{ slug: destination.slug }}
          search={{ room: "" }}
          className={buttonClass("accent")}
        >
          Səyahət yoldaşı tap
        </Link>
      </Card>
    </div>
  );
}
