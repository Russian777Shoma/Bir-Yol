import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { BackLink } from "@/components/biryol/back-link";
import {
  Badge,
  buttonClass,
  Card,
  FieldError,
  inputClass,
} from "@/components/biryol/primitives";
import { destinations } from "@/data/destinations";
import { languageOptions } from "@/data/rooms";

export const Route = createFileRoute("/room-yarat")({
  head: () => ({
    meta: [
      { title: "Yeni Travel Room yarat | BirYol" },
      {
        name: "description",
        content:
          "Destinasiya, tarix, büdcə və qrup şərtlərini yazaraq nümunə Travel Room yarat. Prototipdə heç bir məlumat saxlanılmır.",
      },
      { property: "og:title", content: "Yeni Travel Room yarat | BirYol" },
      {
        property: "og:description",
        content: "Öz səfər planını paylaş və eyni istiqamətə gedən insanları tap.",
      },
    ],
  }),
  component: CreateRoom,
});

type FormState = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  capacity: string;
  minAge: string;
  budget: string;
  language: string;
  description: string;
  plan: string;
};

const empty: FormState = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  capacity: "",
  minAge: "",
  budget: "",
  language: languageOptions[0]!,
  description: "",
  plan: "",
};

const labels: Record<keyof FormState, string> = {
  title: "Room adı",
  destination: "Destinasiya",
  startDate: "Başlama tarixi",
  endDate: "Bitmə tarixi",
  capacity: "Maksimum iştirakçı sayı",
  minAge: "Minimum yaş",
  budget: "Büdcə aralığı",
  language: "Dil",
  description: "Trip description",
  plan: "Plan",
};

function CreateRoom() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [created, setCreated] = useState<FormState | null>(null);

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
    if (form.capacity.trim() && !/^\d{1,2}$/.test(form.capacity.trim())) {
      next.capacity = "İştirakçı sayını rəqəmlə yazın (məsələn: 6).";
    }
    if (form.minAge.trim() && !/^\d{1,2}$/.test(form.minAge.trim())) {
      next.minAge = "Minimum yaşı rəqəmlə yazın (məsələn: 18).";
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setCreated(form);
  };

  if (created) {
    const slug = created.destination;
    const dest = destinations.find((d) => d.slug === slug);
    return (
      <div className="container-page py-10">
        <Card className="mx-auto max-w-xl border-success/40 bg-success-soft">
          <CheckCircle2 className="h-12 w-12 text-success" />
          <h1 className="mt-4 font-heading text-2xl">Room yaradıldı</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            “{created.title}” nümunə Travel Room kimi yaradıldı. Bu yalnız frontend
            prototipidir — heç bir məlumat saxlanılmır.
          </p>
          <ul className="mt-4 space-y-1.5 text-sm">
            <li>
              <strong>Destinasiya:</strong> {dest?.name ?? created.destination}
            </li>
            <li>
              <strong>Tarix:</strong> {created.startDate} – {created.endDate}
            </li>
            <li>
              <strong>Qrup:</strong> maksimum {created.capacity} nəfər · {created.minAge}+
            </li>
            <li>
              <strong>Büdcə:</strong> {created.budget}
            </li>
            <li>
              <strong>Dil:</strong> {created.language}
            </li>
          </ul>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            {dest && (
              <Link
                to="/destinasiya/$slug/rooms"
                params={{ slug: dest.slug }}
                search={{ room: "" }}
                className={buttonClass("primary")}
              >
                Room-lara qayıt
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                setCreated(null);
                setForm(empty);
              }}
              className={buttonClass("secondary")}
            >
              Yeni Room yarat
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-page py-6 sm:py-10">
      <BackLink to="/" label="Kəşf et səhifəsinə qayıt" />

      <header className="mt-3">
        <Badge tone="accent">Travel Room</Badge>
        <h1 className="mt-2 font-heading text-[clamp(1.8rem,4vw,2.6rem)]">
          Yeni Travel Room yarat
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Səfər planını paylaş, şərtləri yaz və eyni istiqamətə gedən insanların request
          göndərməsinə imkan ver.
        </p>
      </header>

      <Card className="mt-6 max-w-3xl">
        <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
          <Field label={labels.title} error={errors.title} className="sm:col-span-2">
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Məsələn: 5 günlük Qəbələ istirahəti"
              className={inputClass(Boolean(errors.title))}
            />
          </Field>

          <Field label={labels.destination} error={errors.destination}>
            <select
              value={form.destination}
              onChange={(e) => set("destination", e.target.value)}
              className={inputClass(Boolean(errors.destination))}
            >
              <option value="">Seçin</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label={labels.language} error={errors.language}>
            <select
              value={form.language}
              onChange={(e) => set("language", e.target.value)}
              className={inputClass(Boolean(errors.language))}
            >
              {languageOptions.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>

          <Field label={labels.startDate} error={errors.startDate}>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              className={inputClass(Boolean(errors.startDate))}
            />
          </Field>

          <Field label={labels.endDate} error={errors.endDate}>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
              className={inputClass(Boolean(errors.endDate))}
            />
          </Field>

          <Field label={labels.capacity} error={errors.capacity}>
            <input
              value={form.capacity}
              onChange={(e) => set("capacity", e.target.value)}
              inputMode="numeric"
              placeholder="6"
              className={inputClass(Boolean(errors.capacity))}
            />
          </Field>

          <Field label={labels.minAge} error={errors.minAge}>
            <input
              value={form.minAge}
              onChange={(e) => set("minAge", e.target.value)}
              inputMode="numeric"
              placeholder="18"
              className={inputClass(Boolean(errors.minAge))}
            />
          </Field>

          <Field label={labels.budget} error={errors.budget} className="sm:col-span-2">
            <input
              value={form.budget}
              onChange={(e) => set("budget", e.target.value)}
              placeholder="300–500 AZN"
              className={inputClass(Boolean(errors.budget))}
            />
          </Field>

          <Field
            label={labels.description}
            error={errors.description}
            className="sm:col-span-2"
          >
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Qrupun məqsədi və gözləntilər"
              className={inputClass(Boolean(errors.description)) + " min-h-[90px] py-2"}
            />
          </Field>

          <Field label={labels.plan} error={errors.plan} className="sm:col-span-2">
            <textarea
              value={form.plan}
              onChange={(e) => set("plan", e.target.value)}
              rows={4}
              placeholder="1-ci gün: gəliş və yerləşmə..."
              className={inputClass(Boolean(errors.plan)) + " min-h-[110px] py-2"}
            />
          </Field>

          <div className="sm:col-span-2">
            <button type="submit" className={buttonClass("primary", "w-full sm:w-auto")}>
              Room yarat
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              Real database yoxdur — məlumat yalnız bu səhifədə göstərilir.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string | undefined;
  className?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className={"grid gap-1.5 " + (className ?? "")}>
      <span className="text-xs font-bold">{label}</span>
      {children}
      <FieldError message={error} />
    </label>
  );
}
