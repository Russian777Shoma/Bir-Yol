import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useState } from "react";

import { notifications } from "@/data/profile";
import { useAppState } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { readNotifications, markAllNotificationsRead, markNotificationRead, ready } =
    useAppState();
  const [open, setOpen] = useState(false);
  const unread = ready
    ? notifications.filter((n) => !readNotifications.includes(n.id))
    : [];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Bildirişlər"
        aria-expanded={open}
        className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
      >
        <Bell className="h-4 w-4" />
        {unread.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
            {unread.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Bağla"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 z-50 mt-2 w-[min(88vw,22rem)] overflow-hidden rounded-xl border border-border bg-card shadow-soft">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border px-4 py-3">
              <strong className="min-w-0 truncate font-heading text-sm">
                Bildirişlər
              </strong>
              <button
                type="button"
                onClick={() => markAllNotificationsRead(notifications.map((n) => n.id))}
                className="shrink-0 text-xs font-bold text-primary"
              >
                Hamısını oxu
              </button>
            </div>
            <ul className="max-h-80 divide-y divide-border overflow-y-auto">
              {notifications.map((n) => {
                const isUnread = !readNotifications.includes(n.id);
                return (
                  <li key={n.id}>
                    <Link
                      to="/destinasiya/$slug/rooms"
                      params={{ slug: n.slug }}
                      search={{ room: n.roomId }}
                      onClick={() => {
                        markNotificationRead(n.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "block px-4 py-3 transition-colors hover:bg-muted",
                        isUnread && "bg-primary-soft/40",
                      )}
                    >
                      <span className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                        <strong className="min-w-0 truncate text-sm">{n.title}</strong>
                        {isUnread && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {n.body}
                      </span>
                      <span className="mt-1 block text-[11px] font-semibold text-muted-foreground">
                        {n.time}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-border px-4 py-3">
              <Link
                to="/profil"
                search={{ tab: "bildirisler" }}
                onClick={() => setOpen(false)}
                className="text-xs font-bold text-primary"
              >
                Bütün bildirişlərə bax →
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
