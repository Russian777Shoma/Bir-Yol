export type BookingKind = "hotel" | "tour" | "activity";
export type BookingStatus = "Upcoming" | "Completed" | "Cancelled";

export type Booking = {
  id: string;
  kind: BookingKind;
  title: string;
  slug: string;
  region: string;
  date: string;
  price: number;
  status: BookingStatus;
  reference: string;
};

export type Ticket = {
  id: string;
  title: string;
  slug: string;
  region: string;
  date: string;
  time: string;
  guests: number;
  price: number;
  reference: string;
  status: BookingStatus;
};

export type MyRoomRole = "Host" | "Member" | "Pending" | "Rejected" | "Completed";

export type MyRoom = {
  id: string;
  roomId: string;
  title: string;
  slug: string;
  destination: string;
  dates: string;
  members: number;
  capacity: number;
  role: MyRoomRole;
};

export type JoinRequest = {
  id: string;
  roomId: string;
  user: string;
  age: number;
  budget: string;
  dates: string;
  message: string;
};

export type Notification = {
  id: string;
  type:
    | "request-accepted"
    | "request-rejected"
    | "new-request"
    | "plan-changed"
    | "poll-created"
    | "trip-soon";
  title: string;
  body: string;
  time: string;
  slug: string;
  roomId: string;
};

export type Reminder = {
  id: string;
  title: string;
  body: string;
  slug: string;
};

export const profileUser = {
  name: "İstifadəçi A",
  handle: "@istifadeci-a",
  language: "Azərbaycan dili, İngilis dili",
  interests: ["Təbiət", "Aktiv istirahət", "Lokal mətbəx", "Foto"],
  bio: "Azərbaycan regionlarını həftəsonu marşrutları ilə kəşf edirəm. Nümunə profil məlumatıdır.",
  trips: 6,
  reviews: 4,
};

export const bookings: Booking[] = [
  {
    id: "bk-1",
    kind: "hotel",
    title: "Qafqaz Meşə Oteli — 2 gecə",
    slug: "qebele",
    region: "Qəbələ",
    date: "12–14 sentyabr 2026",
    price: 190,
    status: "Upcoming",
    reference: "BY-HTL-10241",
  },
  {
    id: "bk-2",
    kind: "tour",
    title: "Şəki tarixi mərkəz turu",
    slug: "seki",
    region: "Şəki",
    date: "26 sentyabr 2026",
    price: 45,
    status: "Upcoming",
    reference: "BY-TUR-30188",
  },
  {
    id: "bk-3",
    kind: "activity",
    title: "Qəbələ Zipline",
    slug: "qebele",
    region: "Qəbələ",
    date: "12 sentyabr 2026",
    price: 50,
    status: "Upcoming",
    reference: "BY-ACT-55012",
  },
  {
    id: "bk-4",
    kind: "hotel",
    title: "Quba Canyon Lodge — 1 gecə",
    slug: "quba",
    region: "Quba",
    date: "14 iyun 2026",
    price: 85,
    status: "Completed",
    reference: "BY-HTL-09117",
  },
  {
    id: "bk-5",
    kind: "activity",
    title: "Quba Kvadrosikl",
    slug: "quba",
    region: "Quba",
    date: "15 iyun 2026",
    price: 45,
    status: "Completed",
    reference: "BY-ACT-54880",
  },
  {
    id: "bk-6",
    kind: "tour",
    title: "Lənkəran çay plantasiyası turu",
    slug: "lenkeran",
    region: "Lənkəran",
    date: "3 may 2026",
    price: 35,
    status: "Cancelled",
    reference: "BY-TUR-29904",
  },
];

export const tickets: Ticket[] = [
  {
    id: "tk-1",
    title: "Qəbələ Zipline",
    slug: "qebele",
    region: "Qəbələ",
    date: "12 sentyabr 2026",
    time: "14:30",
    guests: 2,
    price: 50,
    reference: "BY-TCK-77120",
    status: "Upcoming",
  },
  {
    id: "tk-2",
    title: "Şəki Şəbəkə emalatxanası",
    slug: "seki",
    region: "Şəki",
    date: "26 sentyabr 2026",
    time: "11:00",
    guests: 1,
    price: 18,
    reference: "BY-TCK-77241",
    status: "Upcoming",
  },
  {
    id: "tk-3",
    title: "Quba Kvadrosikl",
    slug: "quba",
    region: "Quba",
    date: "15 iyun 2026",
    time: "10:00",
    guests: 2,
    price: 90,
    reference: "BY-TCK-70118",
    status: "Completed",
  },
];

export const myRooms: MyRoom[] = [
  {
    id: "mr-1",
    roomId: "qebele-1",
    title: "5 günlük Qəbələ istirahəti",
    slug: "qebele",
    destination: "Qəbələ",
    dates: "12–17 sentyabr",
    members: 3,
    capacity: 6,
    role: "Host",
  },
  {
    id: "mr-2",
    roomId: "qebele-2",
    title: "Həftəsonu meşə yürüşü",
    slug: "qebele",
    destination: "Qəbələ",
    dates: "20–22 sentyabr",
    members: 2,
    capacity: 5,
    role: "Host",
  },
  {
    id: "mr-3",
    roomId: "seki-1",
    title: "Şəki mədəni marşrutu",
    slug: "seki",
    destination: "Şəki",
    dates: "8–11 sentyabr",
    members: 3,
    capacity: 6,
    role: "Member",
  },
  {
    id: "mr-4",
    roomId: "quba-1",
    title: "Quba kanyon və Xınalıq",
    slug: "quba",
    destination: "Quba",
    dates: "14–17 sentyabr",
    members: 4,
    capacity: 7,
    role: "Pending",
  },
  {
    id: "mr-5",
    roomId: "quba-2",
    title: "Kvadrosikl həftəsonu",
    slug: "quba",
    destination: "Quba",
    dates: "27–29 sentyabr",
    members: 3,
    capacity: 5,
    role: "Rejected",
  },
  {
    id: "mr-6",
    roomId: "lenkeran-1",
    title: "4 günlük Lənkəran səfəri",
    slug: "lenkeran",
    destination: "Lənkəran",
    dates: "12–15 may",
    members: 5,
    capacity: 6,
    role: "Completed",
  },
];

export const joinRequests: JoinRequest[] = [
  {
    id: "jr-1",
    roomId: "qebele-1",
    user: "İstifadəçi B",
    age: 24,
    budget: "350 AZN",
    dates: "12–17 sentyabr",
    message: "Təbiət gəzintisi və zipline planı mənə uyğundur, qrupla getmək istəyirəm.",
  },
  {
    id: "jr-2",
    roomId: "qebele-1",
    user: "İstifadəçi C",
    age: 29,
    budget: "420 AZN",
    dates: "13–17 sentyabr",
    message: "Bir gün gec qoşula bilərəm, qalan plan uyğundur.",
  },
  {
    id: "jr-3",
    roomId: "qebele-2",
    user: "İstifadəçi D",
    age: 22,
    budget: "200 AZN",
    dates: "20–22 sentyabr",
    message: "Həftəsonu yürüşü üçün təcrübəm var, nəqliyyatı bölüşə bilərik.",
  },
];

export const roomMembers: Record<string, { name: string; role: string }[]> = {
  "qebele-1": [
    { name: "Host A", role: "Host" },
    { name: "İstifadəçi A", role: "Member" },
    { name: "İstifadəçi E", role: "Member" },
  ],
  "qebele-2": [
    { name: "Host A", role: "Host" },
    { name: "İstifadəçi F", role: "Member" },
  ],
};

export const notifications: Notification[] = [
  {
    id: "nt-1",
    type: "request-accepted",
    title: "Request qəbul edildi",
    body: "«Şəki mədəni marşrutu» room-una qoşulma müraciətiniz qəbul olundu.",
    time: "10 dəqiqə əvvəl",
    slug: "seki",
    roomId: "seki-1",
  },
  {
    id: "nt-2",
    type: "new-request",
    title: "Yeni join request",
    body: "«5 günlük Qəbələ istirahəti» room-una İstifadəçi B müraciət etdi.",
    time: "1 saat əvvəl",
    slug: "qebele",
    roomId: "qebele-1",
  },
  {
    id: "nt-3",
    type: "poll-created",
    title: "Yeni sorğu yaradıldı",
    body: "«Hansı oteli seçək?» sorğusunda səs verməyiniz gözlənilir.",
    time: "3 saat əvvəl",
    slug: "qebele",
    roomId: "qebele-1",
  },
  {
    id: "nt-4",
    type: "plan-changed",
    title: "Trip planı dəyişdi",
    body: "Host 2-ci günün fəaliyyət saatını 14:30-a keçirdi.",
    time: "Dünən",
    slug: "qebele",
    roomId: "qebele-1",
  },
  {
    id: "nt-5",
    type: "request-rejected",
    title: "Request rədd edildi",
    body: "«Kvadrosikl həftəsonu» room-u dolduğu üçün müraciətiniz rədd olundu.",
    time: "2 gün əvvəl",
    slug: "quba",
    roomId: "quba-2",
  },
  {
    id: "nt-6",
    type: "trip-soon",
    title: "Səfər yaxınlaşır",
    body: "Qəbələ səfərinizə 2 gün qalıb. Planınızı yenidən yoxlayın.",
    time: "2 gün əvvəl",
    slug: "qebele",
    roomId: "qebele-1",
  },
];

export const reminders: Reminder[] = [
  {
    id: "rm-1",
    title: "Qəbələ səfərinizə 2 gün qalıb.",
    body: "Otel rezervasiyası: BY-HTL-10241 · 12–14 sentyabr",
    slug: "qebele",
  },
  {
    id: "rm-2",
    title: "Zipline fəaliyyətiniz sabah saat 14:30-dadır.",
    body: "Bilet: BY-TCK-77120 · 2 nəfər",
    slug: "qebele",
  },
  {
    id: "rm-3",
    title: "Travel Room səfəriniz sabah başlayır.",
    body: "«5 günlük Qəbələ istirahəti» — 6 nəfərlik qrup",
    slug: "qebele",
  },
];
