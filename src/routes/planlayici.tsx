import { Link, createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Trash2 } from "lucide-react";

import { BackLink } from "@/components/biryol/back-link";
import {
  Badge,
  Card,
  SampleBadge,
  SectionHeading,
  buttonClass,
} from "@/components/biryol/primitives";
import { EmptyState } from "@/components/biryol/ui-kit";
import { useAppState } from "@/lib/app-state";

const days = [1, 2, 3] as const;

export const Route = createFileRoute("/planlayici")({
  head: () => {
    const title = "Səyahət planlayıcısı — günlərə görə marşrut | BirYol";
    const description =
      "Seçdiyin yerləşmə, əyləncə və turları günlərə böl, təxmini büdcəni gör və marşrutunu BirYol planlayıcısında düzənlə.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PlannerPage,
});

function PlannerPage() {
  const { plan, removeFromPlan, movePlanItem } = useAppState();
  const total = plan.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="container-page py-6 sm:py-10">
      <BackLink to="/" label="Kəşf et səhifəsinə qayıt" />

      <header className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <Badge tone="primary">Planlayıcı</Badge>
          <h1 className="mt-2 font-heading text-[clamp(1.8rem,4.2vw,2.7rem)]">
            Səyahət planım
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Favoritlərdən və kateqoriya siyahılarından əlavə etdiyin fəaliyyətləri günlərə
            böl.
          </p>
        </div>
        <SampleBadge />
      </header>

      {plan.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Planınız hələ boşdur. Yerləşmə, əyləncə və ya tur kartında «Planıma əlavə et» düyməsinə toxunun."
            action={
              <Link to="/" className={buttonClass("primary")}>
                Destinasiyalara bax
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <Card className="mt-6 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Fəaliyyət sayı
              </p>
              <p className="font-heading text-2xl">{plan.length}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Təxmini büdcə
              </p>
              <p className="font-heading text-2xl">{total} AZN</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Gün sayı
              </p>
              <p className="font-heading text-2xl">
                {new Set(plan.map((p) => p.day)).size}
              </p>
            </div>
          </Card>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {days.map((day) => {
              const items = plan.filter((p) => p.day === day);
              return (
                <section key={day} className="min-w-0">
                  <SectionHeading title={`${day}-ci gün`} />
                  <div className="space-y-3">
                    {items.length === 0 && (
                      <Card className="border-dashed">
                        <p className="text-sm font-semibold text-muted-foreground">
                          Bu gün üçün fəaliyyət yoxdur.
                        </p>
                      </Card>
                    )}
                    {items.map((item) => (
                      <Card key={item.key} className="space-y-2">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                          <p className="min-w-0 font-heading text-base">{item.title}</p>
                          <button
                            type="button"
                            onClick={() => removeFromPlan(item.key)}
                            aria-label="Plandan çıxar"
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground hover:bg-muted"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0 text-primary" />
                          <span className="min-w-0 break-words">{item.location}</span>
                        </p>
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 shrink-0 text-primary" />
                          {item.time} · {item.category}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <strong className="font-heading text-base">
                            {item.price} AZN
                          </strong>
                          <Badge tone="success">{item.status}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {days
                            .filter((d) => d !== item.day)
                            .map((d) => (
                              <button
                                key={d}
                                type="button"
                                onClick={() => movePlanItem(item.key, d)}
                                className="min-h-[40px] rounded-full border border-border bg-surface px-3 text-xs font-bold text-primary hover:border-primary"
                              >
                                {d}-ci günə keçir
                              </button>
                            ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
