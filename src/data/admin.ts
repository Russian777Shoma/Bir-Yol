export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "Host" | "Member";
  status: "Active" | "Blocked";
  joined: string;
  trips: number;
  reviews: number;
  region: string;
};

export type AdminNote = {
  id: string;
  text: string;
  owner: string;
  created: string;
  status: "Gözləyir" | "Tamamlandı";
};

export const adminCredentials = { email: "admin@biryol.az", password: "biryol2026" };

export const adminUsers: AdminUser[] = [
  { id: "u-1", name: "İstifadəçi A", email: "user.a@numune.az", role: "Member", status: "Active", joined: "Mart 2026", trips: 6, reviews: 4, region: "Bakı" },
  { id: "u-2", name: "İstifadəçi B", email: "user.b@numune.az", role: "Member", status: "Active", joined: "Aprel 2026", trips: 2, reviews: 1, region: "Qəbələ" },
  { id: "u-3", name: "Host A", email: "host.a@numune.az", role: "Host", status: "Active", joined: "Yanvar 2026", trips: 11, reviews: 9, region: "Qəbələ" },
  { id: "u-4", name: "Host B", email: "host.b@numune.az", role: "Host", status: "Active", joined: "Fevral 2026", trips: 8, reviews: 6, region: "Şəki" },
  { id: "u-5", name: "İstifadəçi C", email: "user.c@numune.az", role: "Member", status: "Blocked", joined: "May 2026", trips: 1, reviews: 0, region: "Quba" },
  { id: "u-6", name: "İstifadəçi D", email: "user.d@numune.az", role: "Member", status: "Active", joined: "İyun 2026", trips: 3, reviews: 2, region: "Lənkəran" },
  { id: "u-7", name: "Host C", email: "host.c@numune.az", role: "Host", status: "Active", joined: "Mart 2026", trips: 7, reviews: 5, region: "Şamaxı" },
  { id: "u-8", name: "İstifadəçi E", email: "user.e@numune.az", role: "Member", status: "Active", joined: "İyul 2026", trips: 2, reviews: 1, region: "Naftalan" },
];

export const adminNotesSeed: AdminNote[] = [
  { id: "an-1", text: "Qəbələ hotel məlumatlarını yoxla.", owner: "Admin A", created: "24 avqust 2026", status: "Gözləyir" },
  { id: "an-2", text: "Şəki activities siyahısını yenilə.", owner: "Admin A", created: "22 avqust 2026", status: "Gözləyir" },
  { id: "an-3", text: "Quba turlarında qiymət aralığını nəzərdən keçir.", owner: "Admin B", created: "18 avqust 2026", status: "Tamamlandı" },
  { id: "an-4", text: "Neqativ rəylərin moderasiya qaydasını sənədləşdir.", owner: "Admin B", created: "12 avqust 2026", status: "Tamamlandı" },
];

export const adminRoomStatuses = ["Active", "Pending", "Completed", "Closed"] as const;
export type AdminRoomStatus = (typeof adminRoomStatuses)[number];
