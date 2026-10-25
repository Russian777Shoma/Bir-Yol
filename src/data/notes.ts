export type NoteTone = "positive" | "negative";

export type TravelNote = {
  id: string;
  author: string;
  date: string;
  tone: NoteTone;
  text: string;
};

const authors = [
  "Səyahətçi A",
  "Səyahətçi B",
  "Səyahətçi C",
  "Səyahətçi D",
  "Səyahətçi E",
  "Səyahətçi F",
];

const dates = [
  "İyul 2026",
  "İyun 2026",
  "May 2026",
  "Aprel 2026",
  "Mart 2026",
  "Fevral 2026",
];

const positiveDestination = [
  "Səhər erkən yola çıxdıq — yolda mənzərəli dayanacaqlar var, mütləq foto üçün vaxt ayırın.",
  "Lokal mətbəxi kənd restoranlarında yeməyi məsləhət görürəm, şəhər mərkəzindən daha ucuz və dadlı idi.",
  "Aktivlikləri əvvəlcədən qrup şəklində razılaşdırdıq, qiymət nəzərəçarpacaq dərəcədə aşağı düşdü.",
  "Həftə içi getmək daha rahatdır: növbə yox, otel qiymətləri də sərfəli olur.",
];

const negativeDestination = [
  "Həftəsonu çox izdiham olur, populyar nöqtələrdə 40 dəqiqə növbədə gözlədik — məsləhət görmürəm.",
  "Bəzi yerlərdə kart ödənişi işləmirdi, nağd pul götürməyi unutmayın.",
  "Axşam saatlarında ictimai nəqliyyat azdır, geri dönüşü əvvəlcədən planlamaq lazımdır.",
  "Yağışlı havada torpaq cığırlar sürüşkən olur, yüngül ayaqqabı ilə getməyi məsləhət görmürəm.",
];

const positiveHotel = [
  "Otaqlar təmiz idi, səhər yeməyi seçimi gözlədiyimdən daha zəngin çıxdı.",
  "Resepşn qrupumuz üçün gec check-out düzəltdi, münasibət çox səmimi idi.",
  "Balkondan mənzərə əladır — mümkünsə yuxarı mərtəbə istəyin.",
  "Mərkəzə piyada məsafə olduğu üçün maşın kirayələməyə ehtiyac qalmadı.",
];

const negativeHotel = [
  "Yol tərəfindəki otaqlarda səs gəlirdi, arxa tərəfdən otaq istəməyi məsləhət görürəm.",
  "Wi-Fi lobbidə yaxşı, otaqda zəif tuturdu.",
  "Parking yerləri məhduddur, gec gəlsəniz kənarda saxlamalı olacaqsınız.",
  "Restoran axşam tez bağlanır, gec qayıdanlar üçün əlverişli deyil — əvvəlcədən yemək planlayın.",
];

function build(
  prefix: string,
  positives: string[],
  negatives: string[],
  seed: number,
): TravelNote[] {
  const notes: TravelNote[] = [];
  positives.forEach((text, i) => {
    notes.push({
      id: `${prefix}-p-${i + 1}`,
      author: authors[(seed + i) % authors.length]!,
      date: dates[(seed + i) % dates.length]!,
      tone: "positive",
      text,
    });
  });
  negatives.forEach((text, i) => {
    notes.push({
      id: `${prefix}-n-${i + 1}`,
      author: authors[(seed + i + 2) % authors.length]!,
      date: dates[(seed + i + 1) % dates.length]!,
      tone: "negative",
      text,
    });
  });
  return notes;
}

const seedOf = (key: string) =>
  key.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % authors.length;

export function getDestinationNotes(slug: string, name: string): TravelNote[] {
  const seed = seedOf(slug);
  return build(
    `${slug}-dest`,
    [
      `${name} üçün 2 gün planlaşdırdıq, tələsmədən gəzmək üçün kifayət etdi.`,
      ...positiveDestination,
    ],
    [...negativeDestination],
    seed,
  );
}

export function getHotelNotes(hotelId: string): TravelNote[] {
  return build(hotelId, positiveHotel, negativeHotel, seedOf(hotelId));
}
