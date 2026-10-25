import { CheckCircle2, Vote } from "lucide-react";
import { useMemo } from "react";

import { Badge, Card, SampleBadge, SectionHeading } from "./primitives";
import { getGroupPlan, getPolls } from "@/data/polls";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export function RoomGroupPlan({
  roomId,
  destinationName,
}: {
  roomId: string;
  destinationName: string;
}) {
  const items = useMemo(() => getGroupPlan(roomId, destinationName), [roomId, destinationName]);
  const days = [...new Set(items.map((i) => i.day))];
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <Card>
      <SectionHeading kicker="Qrup planı" title="Ortaq gün planı" action={<SampleBadge />} />
      <div className="space-y-4">
        {days.map((day) => (
          <div key={day} className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              {day}. gün
            </p>
            <ul className="mt-2 space-y-2">
              {items
                .filter((i) => i.day === day)
                .map((i) => (
                  <li
                    key={i.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2 rounded-md border border-border bg-surface p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold">
                        {i.time} · {i.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {i.place} · Qoşulanlar: {i.joining.join(", ")}
                      </p>
                    </div>
                    <Badge tone={i.price === 0 ? "neutral" : "primary"}>
                      {i.price === 0 ? "Ödənişsiz" : `${i.price} AZN`}
                    </Badge>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-md border border-border bg-card p-3 text-sm font-semibold">
        Təxmini ortaq xərc: {total} AZN / nəfər
      </p>
    </Card>
  );
}

export function RoomPolls({ roomId }: { roomId: string }) {
  const { votes, vote, toast } = useAppState();
  const polls = useMemo(() => getPolls(roomId), [roomId]);

  return (
    <Card>
      <SectionHeading kicker="Qrup qərarları" title="Səsvermələr" action={<SampleBadge />} />
      <div className="space-y-5">
        {polls.map((poll) => {
          const myVote = votes[poll.id];
          const totalVotes =
            poll.options.reduce((s, o) => s + o.votes, 0) + (myVote ? 1 : 0);

          return (
            <div key={poll.id} className="min-w-0">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="min-w-0 font-heading text-base">{poll.question}</p>
                <Badge tone="warn">{poll.endsAt}</Badge>
              </div>
              <ul className="mt-3 space-y-2">
                {poll.options.map((o) => {
                  const count = o.votes + (myVote === o.id ? 1 : 0);
                  const pct = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
                  const active = myVote === o.id;
                  return (
                    <li key={o.id}>
                      <button
                        type="button"
                        onClick={() => {
                          vote(poll.id, o.id);
                          toast("Səsiniz qeyd olundu.");
                        }}
                        aria-pressed={active}
                        className={cn(
                          "w-full min-w-0 rounded-md border p-3 text-left transition-colors",
                          active
                            ? "border-primary bg-primary-soft"
                            : "border-border bg-surface hover:border-primary",
                        )}
                      >
                        <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                          <span className="min-w-0 text-sm font-bold">
                            {active && (
                              <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-primary" />
                            )}
                            {o.label}
                          </span>
                          <span className="text-xs font-bold text-muted-foreground">
                            {pct}% · {count} səs
                          </span>
                        </span>
                        <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <span
                            className="block h-full rounded-full bg-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Vote className="h-4 w-4 shrink-0" />
        Səslər yalnız bu prototipdə saxlanılır.
      </p>
    </Card>
  );
}
