import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ types */

export type FavoriteKind = "region" | "hotel" | "activity" | "tour" | "room";

export type FavoriteItem = {
  key: string;
  kind: FavoriteKind;
  title: string;
  subtitle: string;
  slug: string;
  category?: "oteller" | "eylenceler" | "turlar";
  roomId?: string;
};

export type PlanItem = {
  key: string;
  day: number;
  time: string;
  title: string;
  category: string;
  location: string;
  price: number;
  slug: string;
  status: string;
};

export type UserRating = { stars: number; comment: string };

export type UserReview = {
  id: string;
  target: string;
  tone: "positive" | "negative";
  title: string;
  text: string;
  recommendation: string;
  visitedAt: string;
  author: string;
  date: string;
};

type ToastTone = "success" | "error" | "info";
type Toast = { id: number; message: string; tone: ToastTone };

type State = {
  ready: boolean;
  favorites: FavoriteItem[];
  plan: PlanItem[];
  ratings: Record<string, UserRating>;
  reviews: Record<string, UserReview[]>;
  readNotifications: string[];
  votes: Record<string, string>;
  admin: string | null;
};

type Ctx = State & {
  isFavorite: (key: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  addToPlan: (item: Omit<PlanItem, "key" | "day" | "status"> & { day?: number }) => void;
  removeFromPlan: (key: string) => void;
  movePlanItem: (key: string, day: number) => void;
  saveRating: (target: string, rating: UserRating) => void;
  addReview: (target: string, review: Omit<UserReview, "id" | "author" | "date">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (ids: string[]) => void;
  vote: (pollId: string, optionId: string) => void;
  loginAdmin: (email: string) => void;
  logoutAdmin: () => void;
  toast: (message: string, tone?: ToastTone) => void;
};

const STORAGE_KEY = "biryol-app-state";

const initialState: State = {
  ready: false,
  favorites: [],
  plan: [],
  ratings: {},
  reviews: {},
  readNotifications: [],
  votes: {},
  admin: null,
};

const AppStateContext = createContext<Ctx | null>(null);

/* ------------------------------------------------------------- provider */

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Partial<State>) : {};
      setState({ ...initialState, ...parsed, ready: true });
    } catch {
      setState({ ...initialState, ready: true });
    }
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    try {
      const { ready: _ready, ...persisted } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      /* ignore */
    }
  }, [state]);

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  }, []);

  const value = useMemo<Ctx>(() => {
    return {
      ...state,
      toast,
      isFavorite: (key) => state.favorites.some((f) => f.key === key),
      toggleFavorite: (item) => {
        setState((prev) => {
          const exists = prev.favorites.some((f) => f.key === item.key);
          return {
            ...prev,
            favorites: exists
              ? prev.favorites.filter((f) => f.key !== item.key)
              : [item, ...prev.favorites],
          };
        });
        const exists = state.favorites.some((f) => f.key === item.key);
        toast(exists ? "Favoritlərdən çıxarıldı." : "Favoritlərə əlavə edildi.");
      },
      addToPlan: (item) => {
        const key = `${item.slug}-${item.title}`;
        setState((prev) => {
          if (prev.plan.some((p) => p.key === key)) return prev;
          const day = item.day ?? Math.min(3, Math.floor(prev.plan.length / 2) + 1);
          return {
            ...prev,
            plan: [
              ...prev.plan,
              { ...item, key, day, status: "Planlaşdırılıb" } as PlanItem,
            ],
          };
        });
        toast("Planınıza əlavə edildi.");
      },
      removeFromPlan: (key) => {
        setState((prev) => ({ ...prev, plan: prev.plan.filter((p) => p.key !== key) }));
        toast("Plandan çıxarıldı.");
      },
      movePlanItem: (key, day) => {
        setState((prev) => ({
          ...prev,
          plan: prev.plan.map((p) => (p.key === key ? { ...p, day } : p)),
        }));
        toast("Planınız yeniləndi.");
      },
      saveRating: (target, rating) => {
        setState((prev) => ({ ...prev, ratings: { ...prev.ratings, [target]: rating } }));
        toast("Qiymətləndirməniz əlavə edildi.");
      },
      addReview: (target, review) => {
        const full: UserReview = {
          ...review,
          id: `rev-${Date.now()}`,
          author: "İstifadəçi A",
          date: "Bu gün",
        };
        setState((prev) => ({
          ...prev,
          reviews: { ...prev.reviews, [target]: [full, ...(prev.reviews[target] ?? [])] },
        }));
        toast("Rəyiniz əlavə edildi.");
      },
      markNotificationRead: (id) => {
        setState((prev) =>
          prev.readNotifications.includes(id)
            ? prev
            : { ...prev, readNotifications: [...prev.readNotifications, id] },
        );
      },
      markAllNotificationsRead: (ids) => {
        setState((prev) => ({
          ...prev,
          readNotifications: Array.from(new Set([...prev.readNotifications, ...ids])),
        }));
        toast("Bütün bildirişlər oxundu kimi işarələndi.");
      },
      vote: (pollId, optionId) => {
        setState((prev) => ({ ...prev, votes: { ...prev.votes, [pollId]: optionId } }));
        toast("Səsiniz qeydə alındı.");
      },
      loginAdmin: (email) => setState((prev) => ({ ...prev, admin: email })),
      logoutAdmin: () => setState((prev) => ({ ...prev, admin: null })),
    };
  }, [state, toast]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-lg border px-4 py-3 text-sm font-semibold shadow-soft",
              t.tone === "success" && "border-success/40 bg-success-soft text-success",
              t.tone === "error" &&
                "border-destructive/40 bg-destructive-soft text-destructive",
              t.tone === "info" && "border-border bg-card text-foreground",
            )}
          >
            {t.tone === "success" && <CheckCircle2 className="h-4 w-4 shrink-0" />}
            {t.tone === "error" && <XCircle className="h-4 w-4 shrink-0" />}
            {t.tone === "info" && <Info className="h-4 w-4 shrink-0" />}
            <span className="min-w-0">{t.message}</span>
          </div>
        ))}
      </div>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
