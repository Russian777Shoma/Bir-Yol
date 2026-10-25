import { createFileRoute, notFound } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { BackLink } from "@/components/biryol/back-link";
import { ActivityCard, HotelCard, TourCard } from "@/components/biryol/cards";
import { HotelMap } from "@/components/biryol/hotel-map";
import { AddToPlanButton, FavoriteButton } from "@/components/biryol/item-actions";
import {
  CheckFilter,
  ChoiceChips,
  FilterSection,
  ListingFilterPanel,
  NumberRange,
} from "@/components/biryol/listing-filters";
import { NotesSection } from "@/components/biryol/notes-section";
import {
  Badge,
  buttonClass,
  Card,
  SampleBadge,
} from "@/components/biryol/primitives";
import { RatingSection } from "@/components/biryol/rating-section";
import {
  categoryTitleSuffix,
  getDestination,
  isCategoryKey,
  type Activity,
  type CategoryKey,
  type Hotel,
  type Tour,
} from "@/data/destinations";
import { getDestinationNotes, getHotelNotes } from "@/data/notes";

export const Route = createFileRoute("/destinasiya/$slug/$category")({
  loader: ({ params }) => {
    const destination = getDestination(params.slug);
    if (!destination || !isCategoryKey(params.category)) throw notFound();
    return { destination, category: params.category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Siyahı tapılmadı — BirYol" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { destination, category } = loaderData;
    const title = `${destination.name} ${categoryTitleSuffix[category]} | BirYol`;
    const description = `${destination.name} üçün ${categoryTitleSuffix[category].toLocaleLowerCase("az")} — real filterlər, qiymət və rating sıralaması.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CategoryListing,
});

type DetailItem = {
  id: string;
  title: string;
  meta: string;
  points: string[];
};

const sortOptions = [
  { value: "recommended", label: "Tövsiyə olunan" },
  { value: "price-asc", label: "Qiymət: aşağıdan yuxarı" },
  { value: "price-desc", label: "Qiymət: yuxarıdan aşağı" },
  { value: "rating-desc", label: "Rating: yüksəkdən aşağı" },
];

const asNumber = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && value !== "" ? parsed : fallback;
};

const toggleValue = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

function CategoryListing() {
  const { destination, category } = Route.useLoaderData();
  const [detail, setDetail] = useState<DetailItem | null>(null);
  const [sort, setSort] = useState("recommended");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [ratingMin, setRatingMin] = useState(1);
  const [types, setTypes] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [durations, setDurations] = useState<string[]>([]);
  const [familyOnly, setFamilyOnly] = useState(false);
  const [freeCancellation, setFreeCancellation] = useState(false);
  const [distanceMax, setDistanceMax] = useState("");

  const accommodationTypes = [...new Set(destination.hotels.map((item) => item.accommodationType))];
  const facilityOptions = [...new Set(destination.hotels.flatMap((item) => item.features))];
  const activityTypes = [...new Set(destination.activities.map((item) => item.type))];
  const activityDurations = [...new Set(destination.activities.map((item) => item.duration))];
  const tourCategories = [...new Set(destination.tours.map((item) => item.category))];
  const tourDurations = [...new Set(destination.tours.map((item) => item.duration))];

  const filteredHotels = useMemo(
    () =>
      sortItems(
        destination.hotels.filter((item) => {
          const maxDistance = distanceMax ? Number(distanceMax) : Number.POSITIVE_INFINITY;
          return (
            item.priceFrom >= asNumber(priceMin, 0) &&
            item.priceFrom <= asNumber(priceMax, Number.POSITIVE_INFINITY) &&
            item.rating >= ratingMin &&
            (types.length === 0 || types.includes(item.accommodationType)) &&
            facilities.every((facility) => item.features.includes(facility)) &&
            (!freeCancellation || item.freeCancellation) &&
            item.distanceKm <= maxDistance
          );
        }),
        sort,
        (item) => item.priceFrom,
        (item) => item.rating,
      ),
    [destination.hotels, distanceMax, facilities, freeCancellation, priceMax, priceMin, ratingMin, sort, types],
  );

  const filteredActivities = useMemo(
    () =>
      sortItems(
        destination.activities.filter(
          (item) =>
            item.price >= asNumber(priceMin, 0) &&
            item.price <= asNumber(priceMax, Number.POSITIVE_INFINITY) &&
            item.rating >= ratingMin &&
            (types.length === 0 || types.includes(item.type)) &&
            (durations.length === 0 || durations.includes(item.duration)) &&
            (!familyOnly || item.familyFriendly),
        ),
        sort,
        (item) => item.price,
        (item) => item.rating,
      ),
    [destination.activities, durations, familyOnly, priceMax, priceMin, ratingMin, sort, types],
  );

  const filteredTours = useMemo(
    () =>
      sortItems(
        destination.tours.filter(
          (item) =>
            item.price >= asNumber(priceMin, 0) &&
            item.price <= asNumber(priceMax, Number.POSITIVE_INFINITY) &&
            item.rating >= ratingMin &&
            (types.length === 0 || types.includes(item.category)) &&
            (durations.length === 0 || durations.includes(item.duration)) &&
            (!familyOnly || item.familyFriendly),
        ),
        sort,
        (item) => item.price,
        (item) => item.rating,
      ),
    [destination.tours, durations, familyOnly, priceMax, priceMin, ratingMin, sort, types],
  );

  const resultCount =
    category === "oteller"
      ? filteredHotels.length
      : category === "eylenceler"
        ? filteredActivities.length
        : filteredTours.length;
  const activeCount =
    Number(priceMin !== "") +
    Number(priceMax !== "") +
    Number(ratingMin > 1) +
    types.length +
    facilities.length +
    durations.length +
    Number(familyOnly) +
    Number(freeCancellation) +
    Number(distanceMax !== "");

  const resetFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setRatingMin(1);
    setTypes([]);
    setFacilities([]);
    setDurations([]);
    setFamilyOnly(false);
    setFreeCancellation(false);
    setDistanceMax("");
  };

  return (
    <div className="container-page py-6 sm:py-10">
      <BackLink
        to="/destinasiya/$slug"
        params={{ slug: destination.slug }}
        label={`${destination.name} səhifəsinə qayıt`}
      />

      <header className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="min-w-0">
          <Badge tone="primary">{destination.region}</Badge>
          <h1 className="mt-2 font-heading text-[clamp(1.7rem,4vw,2.5rem)]">
            {destination.name} {categoryTitleSuffix[category]}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {resultCount} nəticə göstərilir. Filter və sıralama dərhal tətbiq olunur.
          </p>
        </div>
        <SampleBadge />
      </header>

      <div className="mt-5">
        <ListingFilterPanel
          resultCount={resultCount}
          activeCount={activeCount}
          sortValue={sort}
          sortOptions={sortOptions}
          onSortChange={setSort}
          onReset={resetFilters}
        >
          <FilterSection title="Qiymət" description="Bir nəfər üçün başlanğıc qiymət">
            <NumberRange
              minValue={priceMin}
              maxValue={priceMax}
              onMinChange={setPriceMin}
              onMaxChange={setPriceMax}
              min={0}
              max={1000}
            />
          </FilterSection>

          {category === "oteller" && (
            <>
              <FilterSection title="Yerləşmə tipi">
                <ChoiceChips
                  options={accommodationTypes}
                  selected={types}
                  onToggle={(value) => setTypes((current) => toggleValue(current, value))}
                />
              </FilterSection>
              <RatingFilter value={ratingMin} onChange={setRatingMin} />
              <FilterSection title="İmkanlar">
                <ChoiceChips
                  options={facilityOptions}
                  selected={facilities}
                  onToggle={(value) => setFacilities((current) => toggleValue(current, value))}
                />
              </FilterSection>
              <FilterSection title="Məsafə və rezervasiya">
                <ChoiceChips
                  options={["1 km", "3 km", "5 km"]}
                  selected={distanceMax ? [`${distanceMax} km`] : []}
                  onToggle={(value) => setDistanceMax((current) => (current === value.split(" ")[0] ? "" : value.split(" ")[0]!))}
                />
                <CheckFilter
                  label="Pulsuz ləğv"
                  checked={freeCancellation}
                  onChange={setFreeCancellation}
                />
              </FilterSection>
            </>
          )}

          {category === "eylenceler" && (
            <>
              <FilterSection title="Əyləncə tipi">
                <ChoiceChips options={activityTypes} selected={types} onToggle={(value) => setTypes((current) => toggleValue(current, value))} />
              </FilterSection>
              <FilterSection title="Müddət">
                <ChoiceChips options={activityDurations} selected={durations} onToggle={(value) => setDurations((current) => toggleValue(current, value))} />
              </FilterSection>
              <RatingFilter value={ratingMin} onChange={setRatingMin} />
              <FilterSection title="Kimlər üçün">
                <CheckFilter label="Ailə üçün uyğun" checked={familyOnly} onChange={setFamilyOnly} />
              </FilterSection>
            </>
          )}

          {category === "turlar" && (
            <>
              <FilterSection title="Tur kateqoriyası">
                <ChoiceChips options={tourCategories} selected={types} onToggle={(value) => setTypes((current) => toggleValue(current, value))} />
              </FilterSection>
              <FilterSection title="Müddət">
                <ChoiceChips options={tourDurations} selected={durations} onToggle={(value) => setDurations((current) => toggleValue(current, value))} />
              </FilterSection>
              <RatingFilter value={ratingMin} onChange={setRatingMin} />
              <FilterSection title="Kimlər üçün">
                <CheckFilter label="Ailə üçün uyğun" checked={familyOnly} onChange={setFamilyOnly} />
              </FilterSection>
            </>
          )}
        </ListingFilterPanel>
      </div>

      {resultCount === 0 ? (
        <Card className="mt-6 text-center">
          <SearchX className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-3 font-heading text-xl">Uyğun nəticə tapılmadı</h2>
          <p className="mt-1 text-sm text-muted-foreground">Qiymət aralığını və ya digər filterləri dəyişin.</p>
          <button type="button" onClick={resetFilters} className={buttonClass("secondary", "mt-4")}>Filterləri sıfırla</button>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category === "oteller" && filteredHotels.map((item) => (
            <HotelResult key={item.id} item={item} destinationName={destination.name} destinationSlug={destination.slug} onOpen={setDetail} />
          ))}
          {category === "eylenceler" && filteredActivities.map((item) => (
            <ActivityResult key={item.id} item={item} destinationName={destination.name} destinationSlug={destination.slug} onOpen={setDetail} />
          ))}
          {category === "turlar" && filteredTours.map((item) => (
            <TourResult key={item.id} item={item} destinationName={destination.name} destinationSlug={destination.slug} onOpen={setDetail} />
          ))}
        </div>
      )}

      {category === "oteller" && filteredHotels.length > 0 && (
        <div className="mt-10">
          <HotelMap
            destination={destination}
            hotels={filteredHotels}
            onOpenHotel={(hotelId) => {
              const item = destination.hotels.find((candidate) => candidate.id === hotelId);
              if (item) setDetail(accommodationDetail(item));
            }}
          />
        </div>
      )}

      {category === "oteller" && (
        <NotesSection
          key={`${destination.slug}-hotels`}
          notes={getDestinationNotes(destination.slug, destination.name)}
          title="Səyahətçilərin yerləşmə notları"
          subtitle={`${destination.name} yerləşmə seçimləri barədə tövsiyələr və şikayətlər.`}
        />
      )}

      {detail && (
        <div role="dialog" aria-modal="true" aria-label={detail.title} className="fixed inset-0 z-40 flex items-end justify-center bg-foreground/40 p-3 sm:items-center">
          <Card className="max-h-[88vh] w-full max-w-lg overflow-y-auto">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <h2 className="min-w-0 font-heading text-xl">{detail.title}</h2>
              <SampleBadge />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{detail.meta}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {detail.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="min-w-0">{point}</span>
                </li>
              ))}
            </ul>
            {category === "oteller" && (
              <div className="mt-5 border-t border-border pt-4">
                <NotesSection key={detail.id} compact notes={getHotelNotes(detail.id)} title="Burada qalanların notları" subtitle="Pozitiv və neqativ rəyləri seç, öz şərhini əlavə et." />
                <div className="mt-4">
                  <RatingSection key={`rating-${detail.id}`} compact targetKey={`hotel-${detail.id}`} targetName={detail.title} />
                </div>
              </div>
            )}
            <p className="mt-4 rounded-md border border-border bg-surface p-3 text-xs text-muted-foreground">Bu prototipdə real rezervasiya, canlı qiymət və availability yoxdur.</p>
            <button type="button" onClick={() => setDetail(null)} className={buttonClass("primary", "mt-4 w-full")}>Bağla</button>
          </Card>
        </div>
      )}
    </div>
  );
}

function RatingFilter({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <FilterSection title="Rating" description="Minimum qonaq qiymətləndirməsi: 1–10">
      <div className="flex items-center gap-4">
        <input type="range" min={1} max={10} step={0.5} value={value} onChange={(event) => onChange(Number(event.target.value))} className="min-h-11 flex-1 accent-primary" />
        <Badge tone="accent">{value}/10+</Badge>
      </div>
    </FilterSection>
  );
}

function sortItems<T>(items: T[], sort: string, price: (item: T) => number, rating: (item: T) => number) {
  const sorted = [...items];
  if (sort === "price-asc") sorted.sort((a, b) => price(a) - price(b));
  if (sort === "price-desc") sorted.sort((a, b) => price(b) - price(a));
  if (sort === "rating-desc") sorted.sort((a, b) => rating(b) - rating(a));
  return sorted;
}

function accommodationDetail(item: Hotel): DetailItem {
  return {
    id: item.id,
    title: item.name,
    meta: `${item.accommodationType} · ${item.location} · ${item.rating}/10 · ${item.priceFrom} AZN-dən`,
    points: [...item.features, item.freeCancellation ? "Pulsuz ləğv" : "Ləğv şərtləri tətbiq olunur"],
  };
}

function HotelResult({ item, destinationName, destinationSlug, onOpen }: { item: Hotel; destinationName: string; destinationSlug: string; onOpen: (detail: DetailItem) => void }) {
  return (
    <HotelCard hotel={item} onOpen={() => onOpen(accommodationDetail(item))} actions={<><FavoriteButton label item={{ key: `hotel-${item.id}`, kind: "hotel", title: item.name, subtitle: `${destinationName} · ${item.priceFrom} AZN-dən`, slug: destinationSlug }} /><AddToPlanButton item={{ time: "12:00", title: item.name, category: "Yerləşmə", location: item.location, price: item.priceFrom, slug: destinationSlug }} /></>} />
  );
}

function ActivityResult({ item, destinationName, destinationSlug, onOpen }: { item: Activity; destinationName: string; destinationSlug: string; onOpen: (detail: DetailItem) => void }) {
  return (
    <ActivityCard activity={item} onOpen={() => onOpen({ id: item.id, title: item.name, meta: `${item.type} · ${item.duration} · ${item.rating}/10 · ${item.price} AZN`, points: [item.note, item.familyFriendly ? "Ailə üçün uyğundur" : "Yetkin iştirakçılar üçün daha uyğundur"] })} actions={<><FavoriteButton label item={{ key: `activity-${item.id}`, kind: "activity", title: item.name, subtitle: `${destinationName} · ${item.price} AZN`, slug: destinationSlug }} /><AddToPlanButton item={{ time: "10:00", title: item.name, category: "Əyləncə", location: item.type, price: item.price, slug: destinationSlug }} /></>} />
  );
}

function TourResult({ item, destinationName, destinationSlug, onOpen }: { item: Tour; destinationName: string; destinationSlug: string; onOpen: (detail: DetailItem) => void }) {
  return (
    <TourCard tour={item} onOpen={() => onOpen({ id: item.id, title: item.name, meta: `${item.category} · ${item.duration} · ${item.rating}/10 · ${item.price} AZN`, points: item.includes })} actions={<><FavoriteButton label item={{ key: `tour-${item.id}`, kind: "tour", title: item.name, subtitle: `${destinationName} · ${item.price} AZN`, slug: destinationSlug }} /><AddToPlanButton item={{ time: "09:00", title: item.name, category: "Tur", location: item.duration, price: item.price, slug: destinationSlug }} /></>} />
  );
}
