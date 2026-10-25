import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, SearchX, Users, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import { BackLink } from "@/components/biryol/back-link";
import { RoomCard } from "@/components/biryol/cards";
import { FavoriteButton } from "@/components/biryol/item-actions";
import {
  ChoiceChips,
  FilterSection,
  ListingFilterPanel,
  NumberRange,
} from "@/components/biryol/listing-filters";
import { RoomGroupPlan, RoomPolls } from "@/components/biryol/room-group";
import {
  Badge,
  buttonClass,
  Card,
  FieldError,
  SampleBadge,
  SectionHeading,
  inputClass,
} from "@/components/biryol/primitives";
import { getDestination } from "@/data/destinations";
import { getRoomsForDestination, type TravelRoom } from "@/data/rooms";

export const Route = createFileRoute("/destinasiya/$slug/rooms")({
  validateSearch: (search: Record<string, unknown>) => ({
    room: typeof search["room"] === "string" ? (search["room"] as string) : "",
  }),
  loader: ({ params }) => {
    const destination = getDestination(params.slug);
    if (!destination) throw notFound();
    return {
      destination,
      rooms: getRoomsForDestination(
        destination.slug,
        destination.name,
        destination.nameDative,
      ),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Travel Rooms tapılmadı — BirYol" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { destination } = loaderData;
    const title = `${destination.nameDative} birlikdə get — Travel Rooms | BirYol`;
    const description = `${destination.name} üçün aktiv Travel Room-lara bax, tarix və büdcəyə uyğun qrup tap və qoşulmaq üçün request göndər.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: TravelRoomsPage,
});

function TravelRoomsPage() {
  const { destination, rooms } = Route.useLoaderData();
  const { room: roomId } = Route.useSearch();
  const navigate = useNavigate();
  const [sort, setSort] = useState("recommended");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [minSpots, setMinSpots] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [ageRules, setAgeRules] = useState<string[]>([]);
  const [months, setMonths] = useState<string[]>([]);

  const languageOptions = [...new Set(rooms.flatMap((room) => room.language.split(", ")))];
  const ageOptions = [...new Set(rooms.map((room) => room.ageRule))];
  const monthOptions = [...new Set(rooms.map((room) => room.dates.split(" ").at(-1) ?? room.dates))];

  const filteredRooms = useMemo(() => {
    const minBudget = budgetMin === "" ? 0 : Number(budgetMin);
    const maxBudget = budgetMax === "" ? Number.POSITIVE_INFINITY : Number(budgetMax);
    const spots = minSpots === "" ? 0 : Number(minSpots);
    const result = rooms.filter((room) => {
      const [roomMin, roomMax] = budgetRange(room.budget);
      const freeSpots = room.capacity - room.joined;
      return (
        roomMax >= minBudget &&
        roomMin <= maxBudget &&
        freeSpots >= spots &&
        (languages.length === 0 || languages.some((language) => room.language.includes(language))) &&
        (ageRules.length === 0 || ageRules.includes(room.ageRule)) &&
        (months.length === 0 || months.some((month) => room.dates.includes(month)))
      );
    });
    if (sort === "budget-asc") result.sort((a, b) => budgetRange(a.budget)[0] - budgetRange(b.budget)[0]);
    if (sort === "budget-desc") result.sort((a, b) => budgetRange(b.budget)[1] - budgetRange(a.budget)[1]);
    if (sort === "spots-desc") result.sort((a, b) => (b.capacity - b.joined) - (a.capacity - a.joined));
    return result;
  }, [ageRules, budgetMax, budgetMin, languages, minSpots, months, rooms, sort]);

  const activeFilterCount =
    Number(budgetMin !== "") +
    Number(budgetMax !== "") +
    Number(minSpots !== "") +
    languages.length +
    ageRules.length +
    months.length;

  const resetFilters = () => {
    setBudgetMin("");
    setBudgetMax("");
    setMinSpots("");
    setLanguages([]);
    setAgeRules([]);
    setMonths([]);
  };

  const activeRoom = rooms.find((r) => r.id === roomId);

  const openRoom = (id: string) =>
    navigate({
      to: "/destinasiya/$slug/rooms",
      params: { slug: destination.slug },
      search: { room: id },
    });

  const closeRoom = () =>
    navigate({
      to: "/destinasiya/$slug/rooms",
      params: { slug: destination.slug },
      search: { room: "" },
    });

  if (activeRoom) {
    return (
      <RoomDetail
        room={activeRoom}
        slug={destination.slug}
        destinationName={destination.name}
        onBack={closeRoom}
      />
    );
  }

  return (
    <div className="container-page py-6 sm:py-10">
      <BackLink
        to="/destinasiya/$slug"
        params={{ slug: destination.slug }}
        label={`${destination.name} səhifəsinə qayıt`}
      />

      <header className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="min-w-0">
          <Badge tone="accent">Travel Rooms</Badge>
          <h1 className="mt-2 font-heading text-[clamp(1.8rem,4.2vw,2.7rem)]">
            {destination.nameDative} birlikdə get
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tarixinə və səyahət planına uyğun Travel Room tap.
          </p>
        </div>
        <Link to="/room-yarat" className={buttonClass("secondary")}>
          Yeni Room yarat
        </Link>
      </header>

      <div className="mt-5">
        <ListingFilterPanel
          resultCount={filteredRooms.length}
          activeCount={activeFilterCount}
          sortValue={sort}
          sortOptions={[
            { value: "recommended", label: "Tövsiyə olunan" },
            { value: "budget-asc", label: "Büdcə: aşağıdan yuxarı" },
            { value: "budget-desc", label: "Büdcə: yuxarıdan aşağı" },
            { value: "spots-desc", label: "Ən çox boş yer" },
          ]}
          onSortChange={setSort}
          onReset={resetFilters}
        >
          <FilterSection title="Büdcə" description="Səfər üçün ümumi büdcə aralığı">
            <NumberRange minValue={budgetMin} maxValue={budgetMax} onMinChange={setBudgetMin} onMaxChange={setBudgetMax} min={0} max={3000} />
          </FilterSection>
          <FilterSection title="Tarix">
            <ChoiceChips options={monthOptions} selected={months} onToggle={(value) => setMonths((current) => toggleRoomValue(current, value))} />
          </FilterSection>
          <FilterSection title="Minimum boş yer">
            <ChoiceChips options={["1", "2", "3", "4"]} selected={minSpots ? [minSpots] : []} onToggle={(value) => setMinSpots((current) => current === value ? "" : value)} />
          </FilterSection>
          <FilterSection title="Dil">
            <ChoiceChips options={languageOptions} selected={languages} onToggle={(value) => setLanguages((current) => toggleRoomValue(current, value))} />
          </FilterSection>
          <FilterSection title="Yaş və qrup tipi">
            <ChoiceChips options={ageOptions} selected={ageRules} onToggle={(value) => setAgeRules((current) => toggleRoomValue(current, value))} />
          </FilterSection>
        </ListingFilterPanel>
      </div>

      {filteredRooms.length === 0 ? (
        <Card className="mt-6 text-center">
          <SearchX className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-3 font-heading text-xl">Uyğun səyahət yoldaşı qrupu tapılmadı</h2>
          <p className="mt-1 text-sm text-muted-foreground">Büdcə, tarix və qrup filterlərini dəyişin.</p>
          <button type="button" onClick={resetFilters} className={buttonClass("secondary", "mt-4")}>Filterləri sıfırla</button>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {filteredRooms.map((r) => (
            <RoomCard key={r.id} room={r} onOpen={() => openRoom(r.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

const toggleRoomValue = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

function budgetRange(value: string): [number, number] {
  const numbers = value.match(/\d+/g)?.map(Number) ?? [];
  return [numbers[0] ?? 0, numbers[1] ?? numbers[0] ?? 0];
}

type FormState = {
  name: string;
  age: string;
  budget: string;
  dates: string;
  message: string;
};

function RoomDetail({
  room,
  slug,
  destinationName,
  onBack,
}: {
  room: TravelRoom;
  slug: string;
  destinationName: string;
  onBack: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    name: "İstifadəçi A",
    age: "",
    budget: "",
    dates: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<keyof FormState, string>> = {};
    (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
      if (!form[key].trim()) next[key] = "Bu sahə boş qala bilməz.";
    });
    if (form.age.trim() && !/^\d{1,2}$/.test(form.age.trim())) {
      next.age = "Yaşı rəqəmlə yazın (məsələn: 24).";
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setSent(true);
  };

  if (sent) {
    return (
      <div className="container-page py-10">
        <Card className="mx-auto max-w-xl border-success/40 bg-success-soft text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          <h1 className="mt-4 font-heading text-2xl">Request göndərildi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Host müraciətinizi nəzərdən keçirəcək. Bu prototipdə real host və
            notification sistemi yoxdur.
          </p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              onBack();
            }}
            className={buttonClass("primary", "mt-6 w-full sm:w-auto")}
          >
            Room-lara qayıt
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-page py-6 sm:py-10">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-primary hover:underline"
      >
        ← Travel Rooms siyahısına qayıt
      </button>

      <div className="mt-3 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0 space-y-6">
          <Card>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <h1 className="min-w-0 font-heading text-[clamp(1.6rem,3.6vw,2.2rem)]">
                {room.title}
              </h1>
              <Badge tone="accent">Request ilə</Badge>
            </div>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              Host: {room.host}
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info icon={<CalendarDays className="h-4 w-4" />} label="Tarix" value={room.dates} />
              <Info
                icon={<Users className="h-4 w-4" />}
                label="İştirakçı"
                value={`${room.joined} / ${room.capacity}`}
              />
              <Info icon={<Wallet className="h-4 w-4" />} label="Büdcə" value={room.budget} />
              <Info label="Yaş şərti" value={room.ageRule} />
              <Info label="Dil" value={room.language} />
              <Info label="Destinasiya" value={slug.toUpperCase()} />
            </dl>
            <p className="mt-4 text-sm text-muted-foreground">{room.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <FavoriteButton
                label
                item={{
                  key: `room-${room.id}`,
                  kind: "room",
                  title: room.title,
                  subtitle: `${destinationName} · ${room.dates}`,
                  slug,
                }}
              />
              <SampleBadge />
            </div>
          </Card>

          <RoomGroupPlan roomId={room.id} destinationName={destinationName} />

          <RoomPolls roomId={room.id} />

          <Card>
            <SectionHeading kicker="Səfər planı" title="Nümunə trip plan" />
            <ol className="space-y-2 text-sm">
              {room.plan.map((step) => (
                <li key={step} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="min-w-0">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">
              Bu plan nümunə məlumatdır və qrup daxilində dəyişə bilər.
            </p>
          </Card>

          <Card className="border-accent/40 bg-accent-soft">
            <h2 className="font-heading text-lg">Host kriteriyaları</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {room.criteria.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="min-w-0">{c}</span>
                </li>
              ))}
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="min-w-0">Yaş şərti: {room.ageRule}</span>
              </li>
            </ul>
          </Card>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <h2 className="font-heading text-xl">Join Request</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Real şəxsi məlumat yazmayın — nümunə dəyərlərdən istifadə edin.
          </p>
          <form onSubmit={submit} noValidate className="mt-4 space-y-4">
            <Field label="Ad" error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="İstifadəçi A"
                className={inputClass(Boolean(errors.name))}
              />
            </Field>
            <Field label="Yaş" error={errors.age}>
              <input
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                inputMode="numeric"
                placeholder="24"
                className={inputClass(Boolean(errors.age))}
              />
            </Field>
            <Field label="Təxmini büdcə" error={errors.budget}>
              <input
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
                placeholder="350 AZN"
                className={inputClass(Boolean(errors.budget))}
              />
            </Field>
            <Field label="Səyahət tarixi" error={errors.dates}>
              <input
                value={form.dates}
                onChange={(e) => set("dates", e.target.value)}
                placeholder="12–17 sentyabr"
                className={inputClass(Boolean(errors.dates))}
              />
            </Field>
            <Field
              label="Niyə bu qrupa qoşulmaq istəyirsiniz?"
              error={errors.message}
            >
              <textarea
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                rows={4}
                placeholder="Qısa mesaj yazın"
                className={inputClass(Boolean(errors.message)) + " min-h-[110px] py-2"}
              />
            </Field>
            <button type="submit" className={buttonClass("primary", "w-full")}>
              Request göndər
            </button>
            <p className="text-xs text-muted-foreground">
              Request yalnız prototip state-i kimi simulyasiya olunur.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-surface p-3">
      <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-semibold">{value}</dd>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold">{label}</span>
      {children}
      <FieldError message={error} />
    </label>
  );
}
