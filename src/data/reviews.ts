export type RatingSummary = {
  average: number;
  count: number;
  breakdown: { stars: number; percent: number }[];
};

export type SampleReview = {
  id: string;
  author: string;
  date: string;
  tone: "positive" | "negative";
  title: string;
  text: string;
  recommendation: string;
  visitedAt: string;
};

const authors = ["Səyahətçi A", "Səyahətçi B", "Səyahətçi C", "Səyahətçi D"];
const dates = ["İyul 2026", "İyun 2026", "May 2026", "Aprel 2026"];
const seasons = ["İyul 2026", "Sentyabr 2025", "May 2026", "Oktyabr 2025"];

const hash = (key: string) =>
  key.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

export function getRatingSummary(key: string, base = 4.6): RatingSummary {
  const h = hash(key);
  const average = Math.round((base - 0.3 + (h % 7) / 10) * 10) / 10;
  const count = 40 + (h % 160);
  const five = 55 + (h % 18);
  const four = 18 + (h % 7);
  const three = 10;
  const two = 100 - five - four - three > 4 ? 4 : 3;
  const one = 100 - five - four - three - two;
  return {
    average: Math.min(5, average),
    count,
    breakdown: [
      { stars: 5, percent: five },
      { stars: 4, percent: four },
      { stars: 3, percent: three },
      { stars: 2, percent: two },
      { stars: 1, percent: Math.max(1, one) },
    ],
  };
}

const positive: [string, string, string][] = [
  [
    "Gözlədiyimdən yaxşı çıxdı",
    "Qiymət-keyfiyyət balansı yaxşı idi, planımızı dəyişməyə ehtiyac qalmadı.",
    "Səhər erkən başlamağı tövsiyə edirəm.",
  ],
  [
    "Ailə ilə rahat oldu",
    "Uşaqlarla getdik, gözləmə vaxtı az idi və personal köməkçi davrandı.",
    "Həftə içi getmək daha sakitdir.",
  ],
  [
    "Yenidən gedərəm",
    "Mənzərə və təşkilatçılıq yaxşı idi, qrup halında endirim aldıq.",
    "Qrup halında əvvəlcədən razılaşın.",
  ],
];

const negative: [string, string, string][] = [
  [
    "Həftəsonu izdiham",
    "Populyar nöqtələrdə uzun növbə oldu, planımızın yarısını çatdırmadıq.",
    "Həftəsonundan yayınmağı tövsiyə edirəm.",
  ],
  [
    "Qiymət yüksək göründü",
    "Bəzi xidmətlər üçün əlavə ödəniş istəndi, əvvəlcədən deyilməmişdi.",
    "Nə daxildir — əvvəlcədən soruşun.",
  ],
  [
    "Nəqliyyat problemi",
    "Axşam geri dönüş üçün nəqliyyat tapmaq çətin oldu.",
    "Geri dönüşü əvvəlcədən planlayın.",
  ],
];

export function getSampleReviews(key: string): SampleReview[] {
  const h = hash(key);
  const out: SampleReview[] = [];
  positive.forEach(([title, text, recommendation], i) => {
    out.push({
      id: `${key}-p-${i}`,
      author: authors[(h + i) % authors.length]!,
      date: dates[(h + i) % dates.length]!,
      tone: "positive",
      title,
      text,
      recommendation,
      visitedAt: seasons[(h + i) % seasons.length]!,
    });
  });
  negative.slice(0, 2 + (h % 2)).forEach(([title, text, recommendation], i) => {
    out.push({
      id: `${key}-n-${i}`,
      author: authors[(h + i + 1) % authors.length]!,
      date: dates[(h + i + 2) % dates.length]!,
      tone: "negative",
      title,
      text,
      recommendation,
      visitedAt: seasons[(h + i + 1) % seasons.length]!,
    });
  });
  return out;
}
