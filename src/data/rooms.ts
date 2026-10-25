export type TravelRoom = {
  id: string;
  destinationSlug: string;
  title: string;
  host: string;
  dates: string;
  joined: number;
  capacity: number;
  budget: string;
  language: string;
  ageRule: string;
  description: string;
  plan: string[];
  criteria: string[];
};

const defaultPlan = (destination: string) => [
  `1-ci gün: ${destination}-ya gəliş və yerləşmə`,
  "2-ci gün: Təbiət gəzintisi",
  "3-cü gün: Aktivlik",
  "4-cü gün: Sərbəst plan",
  "5-ci gün: Geri dönüş",
];

const defaultCriteria = [
  "Plan qrup daxilində birlikdə müzakirə olunur",
  "Ortaq büdcə aralığına uyğunluq",
  "Qrup qaydalarına hörmət",
];

export const travelRooms: TravelRoom[] = [
  {
    id: "qebele-1",
    destinationSlug: "qebele",
    title: "5 günlük Qəbələ istirahəti",
    host: "Elvin",
    dates: "12–17 sentyabr",
    joined: 3,
    capacity: 6,
    budget: "300–500 AZN",
    language: "Azərbaycan dili",
    ageRule: "18+",
    description:
      "Təbiət gəzintisi, zipline və kvadrosikl planlaşdırılır. Otel və fəaliyyət seçimləri qrup daxilində birlikdə müzakirə ediləcək.",
    plan: defaultPlan("Qəbələ"),
    criteria: defaultCriteria,
  },
  {
    id: "qebele-2",
    destinationSlug: "qebele",
    title: "Həftəsonu meşə yürüşü",
    host: "Nurlan",
    dates: "20–22 sentyabr",
    joined: 2,
    capacity: 5,
    budget: "150–250 AZN",
    language: "Azərbaycan dili, İngilis dili",
    ageRule: "20+",
    description:
      "Qısa həftəsonu marşrutu. Səhər yürüşü, meşə cığırları və axşam ortaq şam planlaşdırılır.",
    plan: [
      "1-ci gün: Gəliş və yerləşmə",
      "2-ci gün: Meşə yürüşü",
      "3-cü gün: Sərbəst plan və geri dönüş",
    ],
    criteria: defaultCriteria,
  },
  {
    id: "qebele-3",
    destinationSlug: "qebele",
    title: "Ailə üçün sakit 4 gün",
    host: "Aysel",
    dates: "1–4 oktyabr",
    joined: 4,
    capacity: 8,
    budget: "250–400 AZN",
    language: "Azərbaycan dili",
    ageRule: "Ailə üçün uyğun",
    description:
      "Uşaqlarla uyğun sakit marşrut. Park gəzintisi, muzey və boat tour nəzərdə tutulur.",
    plan: [
      "1-ci gün: Gəliş və yerləşmə",
      "2-ci gün: Park və muzey",
      "3-cü gün: Boat tour",
      "4-cü gün: Geri dönüş",
    ],
    criteria: defaultCriteria,
  },
  {
    id: "seki-1",
    destinationSlug: "seki",
    title: "Şəki mədəni marşrutu",
    host: "Rəşad",
    dates: "8–11 sentyabr",
    joined: 3,
    capacity: 6,
    budget: "200–350 AZN",
    language: "Azərbaycan dili",
    ageRule: "18+",
    description:
      "Tarixi mərkəz, karvansaralar və Kiş kəndi planlaşdırılır. Marşrut qrupla birlikdə dəqiqləşdiriləcək.",
    plan: [
      "1-ci gün: Gəliş və tarixi mərkəz",
      "2-ci gün: Xan sarayı və muzeylər",
      "3-cü gün: Kiş kəndi",
      "4-cü gün: Geri dönüş",
    ],
    criteria: defaultCriteria,
  },
  {
    id: "seki-2",
    destinationSlug: "seki",
    title: "Foto həftəsonu",
    host: "Günel",
    dates: "26–28 sentyabr",
    joined: 2,
    capacity: 4,
    budget: "180–260 AZN",
    language: "Azərbaycan dili, İngilis dili",
    ageRule: "21+",
    description:
      "Səhər işığında foto çəkiliş dayanacaqları, memarlıq detalları və lokal mətbəx nəzərdə tutulur.",
    plan: defaultPlan("Şəki").slice(0, 3),
    criteria: defaultCriteria,
  },
  {
    id: "seki-3",
    destinationSlug: "seki",
    title: "Sənətkarlıq və mətbəx turu",
    host: "Kamran",
    dates: "5–8 oktyabr",
    joined: 1,
    capacity: 6,
    budget: "220–380 AZN",
    language: "Azərbaycan dili",
    ageRule: "18+",
    description:
      "Şəbəkə emalatxanası, halva ustad dərsi və lokal restoran seçimləri qrupla müzakirə olunacaq.",
    plan: defaultPlan("Şəki"),
    criteria: defaultCriteria,
  },
  {
    id: "quba-1",
    destinationSlug: "quba",
    title: "Quba kanyon və Xınalıq",
    host: "Tural",
    dates: "14–17 sentyabr",
    joined: 4,
    capacity: 7,
    budget: "250–420 AZN",
    language: "Azərbaycan dili",
    ageRule: "18+",
    description:
      "Kanyon marşrutu, kvadrosikl və Xınalıq kəndi gəzintisi planlaşdırılır.",
    plan: defaultPlan("Quba").slice(0, 4),
    criteria: defaultCriteria,
  },
  {
    id: "quba-2",
    destinationSlug: "quba",
    title: "Kvadrosikl həftəsonu",
    host: "Orxan",
    dates: "27–29 sentyabr",
    joined: 3,
    capacity: 5,
    budget: "160–280 AZN",
    language: "Azərbaycan dili",
    ageRule: "20+",
    description:
      "Aktiv temp: kvadrosikl marşrutları və qısa dağ yürüşü. Təcrübə tələb olunmur.",
    plan: defaultPlan("Quba").slice(0, 3),
    criteria: defaultCriteria,
  },
  {
    id: "quba-3",
    destinationSlug: "quba",
    title: "Payız alma bağları səfəri",
    host: "Lalə",
    dates: "10–13 oktyabr",
    joined: 2,
    capacity: 6,
    budget: "200–330 AZN",
    language: "Azərbaycan dili",
    ageRule: "18+",
    description:
      "Payız mövsümündə bağ gəzintisi, lokal mətbəx və sakit təbiət marşrutları.",
    plan: defaultPlan("Quba").slice(0, 4),
    criteria: defaultCriteria,
  },
];

const genericRooms = (
  slug: string,
  name: string,
  dative: string,
): TravelRoom[] => [
  {
    id: `${slug}-1`,
    destinationSlug: slug,
    title: `4 günlük ${name} səfəri`,
    host: "Elvin",
    dates: "12–15 sentyabr",
    joined: 3,
    capacity: 6,
    budget: "250–400 AZN",
    language: "Azərbaycan dili",
    ageRule: "18+",
    description: `${dative} birlikdə gedən qrup. Marşrut, otel və fəaliyyət seçimləri qrup daxilində birlikdə müzakirə ediləcək.`,
    plan: defaultPlan(name).slice(0, 4),
    criteria: defaultCriteria,
  },
  {
    id: `${slug}-2`,
    destinationSlug: slug,
    title: `${name} həftəsonu qrupu`,
    host: "Aysel",
    dates: "20–22 sentyabr",
    joined: 2,
    capacity: 5,
    budget: "150–260 AZN",
    language: "Azərbaycan dili, İngilis dili",
    ageRule: "20+",
    description:
      "Qısa həftəsonu marşrutu. Sakit temp, birgə nəqliyyat və ortaq büdcə planı.",
    plan: defaultPlan(name).slice(0, 3),
    criteria: defaultCriteria,
  },
  {
    id: `${slug}-3`,
    destinationSlug: slug,
    title: `${name} — 5 günlük plan`,
    host: "Kamran",
    dates: "1–5 oktyabr",
    joined: 4,
    capacity: 8,
    budget: "300–500 AZN",
    language: "Azərbaycan dili",
    ageRule: "18+",
    description:
      "Daha uzun marşrut: təbiət gəzintisi, lokal mətbəx və bir aktivlik günü nəzərdə tutulur.",
    plan: defaultPlan(name),
    criteria: defaultCriteria,
  },
];

export function getRoomsForDestination(
  slug: string,
  name: string,
  dative: string,
): TravelRoom[] {
  const existing = travelRooms.filter((r) => r.destinationSlug === slug);
  return existing.length >= 3 ? existing : genericRooms(slug, name, dative);
}

export const languageOptions = [
  "Azərbaycan dili",
  "İngilis dili",
  "Rus dili",
  "Türk dili",
];
