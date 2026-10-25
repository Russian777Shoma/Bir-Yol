import qebeleImg from "@/assets/qebele.jpg";
import sekiImg from "@/assets/seki.jpg";
import qubaImg from "@/assets/quba.jpg";
import lenkeranImg from "@/assets/lenkeran.jpg";
import samaxiImg from "@/assets/samaxi.jpg";
import naftalanImg from "@/assets/naftalan.jpg";
import bakiImg from "@/assets/baki.jpg";
import qusarImg from "@/assets/qusar.jpg";

export type CategoryKey = "oteller" | "eylenceler" | "turlar";

export const categoryLabels: Record<CategoryKey, string> = {
  oteller: "Yerləşmə",
  eylenceler: "Əyləncələr",
  turlar: "Turlar",
};

export const categoryTitleSuffix: Record<CategoryKey, string> = {
  oteller: "Yerləşmə seçimləri",
  eylenceler: "Əyləncələri",
  turlar: "Turları",
};

export type Hotel = {
  id: string;
  name: string;
  rating: number;
  location: string;
  priceFrom: number;
  features: string[];
  accommodationType: "Hotel" | "Mənzil" | "Ev" | "Hostel" | "Yataqxana" | "Qonaq evi";
  distanceKm: number;
  freeCancellation: boolean;
};

export type Activity = {
  id: string;
  name: string;
  type: string;
  price: number;
  duration: string;
  note: string;
  rating: number;
  familyFriendly: boolean;
};

export type Tour = {
  id: string;
  name: string;
  price: number;
  duration: string;
  includes: string[];
  rating: number;
  category: "Təbiət" | "Mədəniyyət" | "Macəra" | "Sağlamlıq" | "Qastronomiya";
  familyFriendly: boolean;
};

export type Destination = {
  slug: string;
  name: string;
  nameDative: string; // "Qəbələyə"
  nameGenitive: string; // "Qəbələnin"
  region: string;
  tagline: string;
  description: string;
  image: string;
  highlights: string[];
  bestSeason: string;
  distanceFromBaku: string;
  hotels: Hotel[];
  activities: Activity[];
  tours: Tour[];
};

const featurePool = [
  ["Səhər yeməyi daxil", "Wi-Fi", "Pulsuz parking"],
  ["Hovuz", "Spa", "Ailə nömrələri"],
  ["Balkon", "Restoran", "Mərkəzə yaxın"],
  ["Mətbəx", "Paltaryuyan", "Wi-Fi"],
  ["Ayrıca həyət", "Parking", "Mətbəx"],
  ["Ortaq mətbəx", "Şəxsi dolab", "Wi-Fi"],
];

function hotels(
  slug: string,
  city: string,
  names: [string, string, string],
  locations: [string, string, string],
  base: number,
): Hotel[] {
  const allNames = [
    ...names,
    `${city} Mərkəz Mənzili`,
    `${city} Bağ Evi`,
    `${city} Travel Dorm`,
  ];
  const allLocations = [...locations, "Şəhər mərkəzi", "Sakit yaşayış zonası", "Avtovağzal yaxınlığı"];
  const ratings = [8.8, 8.4, 9.2, 8.1, 8.7, 7.6];
  const types: Hotel["accommodationType"][] = [
    "Hotel",
    "Hotel",
    "Qonaq evi",
    "Mənzil",
    "Ev",
    "Yataqxana",
  ];
  const priceOffsets = [0, 35, 70, -20, 15, -50];
  return allNames.map((name, i) => ({
    id: `${slug}-hotel-${i + 1}`,
    name,
    rating: ratings[i]!,
    location: allLocations[i]!,
    priceFrom: Math.max(25, base + priceOffsets[i]!),
    features: featurePool[i]!,
    accommodationType: types[i]!,
    distanceKm: [1.2, 4.8, 7.1, 0.8, 5.3, 2.4][i]!,
    freeCancellation: i !== 1,
  }));
}

function activities(slug: string, items: [string, string, number][]): Activity[] {
  const durations = ["1 saat", "2 saat", "3 saat", "yarım gün", "1 saat", "2 saat"];
  return items.map(([name, type, price], i) => ({
    id: `${slug}-act-${i + 1}`,
    name,
    type,
    price,
    duration: durations[i % durations.length]!,
    note: "Qrup halında endirim mümkündür",
    rating: [8.6, 9.1, 8.3, 9.4, 7.9, 8.8][i % 6]!,
    familyFriendly: i !== 1 && i !== 4,
  }));
}

function tours(slug: string, items: [string, number, string, string[]][]): Tour[] {
  const categories: Tour["category"][] = ["Təbiət", "Mədəniyyət", "Macəra", "Qastronomiya", "Sağlamlıq"];
  return items.map(([name, price, duration, includes], i) => ({
    id: `${slug}-tour-${i + 1}`,
    name,
    price,
    duration,
    includes,
    rating: [9.2, 8.7, 8.3][i % 3]!,
    category: categories[(i + slug.length) % categories.length]!,
    familyFriendly: i !== 2,
  }));
}

export const destinations: Destination[] = [
  {
    slug: "qebele",
    name: "Qəbələ",
    nameDative: "Qəbələyə",
    nameGenitive: "Qəbələnin",
    region: "Şəki-Zaqatala",
    tagline: "Meşə, dağ havası və aktiv istirahət",
    description:
      "Qəbələ meşə cığırları, dağ mənzərələri və aktiv əyləncələri ilə tanınır. Ailə istirahəti, qısa həftəsonu səfəri və dost qrupları üçün uyğundur.",
    image: qebeleImg,
    highlights: ["Meşə cığırları", "Aktiv əyləncə", "Dağ mənzərəsi"],
    bestSeason: "May – Oktyabr",
    distanceFromBaku: "≈ 220 km",
    hotels: hotels(
      "qebele",
      "Qəbələ",
      ["Qafqaz Meşə Oteli", "Tufandağ Panorama", "Nohur Boutique Hotel"],
      ["Mərkəzdən 6 km", "Tufandağ yolu", "Nohur gölü yaxınlığı"],
      95,
    ),
    activities: activities("qebele", [
      ["Zipline", "Adrenalin", 25],
      ["Kvadrosikl", "Adrenalin", 40],
      ["At sürmə", "Təbiət", 30],
      ["Təbiət gəzintisi", "Təbiət", 15],
      ["Muzey", "Mədəniyyət", 5],
      ["Boat tour", "Su", 20],
    ]),
    tours: tours("qebele", [
      ["Qəbələ meşə və şəlalə turu", 60, "1 gün", ["Nəqliyyat", "Bələdçi", "Nahar"]],
      ["Nohur gölü + kənd mətbəxi", 75, "1 gün", ["Nəqliyyat", "Nahar"]],
      ["Həftəsonu aktiv paket", 180, "2 gün", ["Otel", "3 aktivlik", "Bələdçi"]],
    ]),
  },
  {
    slug: "seki",
    name: "Şəki",
    nameDative: "Şəkiyə",
    nameGenitive: "Şəkinin",
    region: "Şəki-Zaqatala",
    tagline: "Tarixi memarlıq və sənətkarlıq",
    description:
      "Şəki qədim karvansaralar, Xan sarayı və şirniyyat mətbəxi ilə seçilir. Mədəni səyahət və rahat şəhər gəzintisi üçün ideal marşrutdur.",
    image: sekiImg,
    highlights: ["Tarixi mərkəz", "Sənətkarlıq", "Lokal mətbəx"],
    bestSeason: "Aprel – Noyabr",
    distanceFromBaku: "≈ 300 km",
    hotels: hotels(
      "seki",
      "Şəki",
      ["Karvansara Guest House", "Şəki Palace View", "Yuxarı Baş Hotel"],
      ["Tarixi mərkəz", "Xan sarayı yaxınlığı", "Yuxarı Baş məhəlləsi"],
      70,
    ),
    activities: activities("seki", [
      ["Muzey", "Mədəniyyət", 5],
      ["Təbiət gəzintisi", "Təbiət", 12],
      ["At sürmə", "Təbiət", 28],
      ["Şəbəkə emalatxanası", "Sənətkarlıq", 18],
      ["Kvadrosikl", "Adrenalin", 38],
      ["Boat tour", "Su", 18],
    ]),
    tours: tours("seki", [
      ["Şəki tarixi mərkəz turu", 45, "yarım gün", ["Bələdçi", "Muzey bileti"]],
      ["Kiş kəndi və məbəd turu", 55, "1 gün", ["Nəqliyyat", "Bələdçi"]],
      ["Şəki halva ustad dərsi", 30, "2 saat", ["Materiallar", "Dequstasiya"]],
    ]),
  },
  {
    slug: "quba",
    name: "Quba",
    nameDative: "Qubaya",
    nameGenitive: "Qubanın",
    region: "Quba-Xaçmaz",
    tagline: "Kanyonlar, alma bağları və sərin dağ havası",
    description:
      "Quba dağ kəndləri, kanyon mənzərələri və alma bağları ilə tanınır. Həm rahat, həm aktiv marşrutlar üçün əlverişli baza sayılır.",
    image: qubaImg,
    highlights: ["Kanyon", "Dağ kəndləri", "Alma bağları"],
    bestSeason: "May – Oktyabr",
    distanceFromBaku: "≈ 170 km",
    hotels: hotels(
      "quba",
      "Quba",
      ["Quba Canyon Lodge", "Alma Bağı Resort", "Xınalıq Yolu Hotel"],
      ["Kanyon yaxınlığı", "Şəhər mərkəzi", "Xınalıq yolu"],
      85,
    ),
    activities: activities("quba", [
      ["Kvadrosikl", "Adrenalin", 45],
      ["Zipline", "Adrenalin", 22],
      ["Təbiət gəzintisi", "Təbiət", 14],
      ["At sürmə", "Təbiət", 32],
      ["Muzey", "Mədəniyyət", 4],
      ["Boat tour", "Su", 16],
    ]),
    tours: tours("quba", [
      ["Xınalıq kəndi turu", 65, "1 gün", ["Nəqliyyat", "Bələdçi"]],
      ["Afurca şəlaləsi yürüşü", 40, "yarım gün", ["Bələdçi", "Su və snack"]],
      ["Quba kanyon foto turu", 50, "1 gün", ["Nəqliyyat", "Foto dayanacaqları"]],
    ]),
  },
  {
    slug: "lenkeran",
    name: "Lənkəran",
    nameDative: "Lənkərana",
    nameGenitive: "Lənkəranın",
    region: "Lənkəran-Astara",
    tagline: "Çay plantasiyaları və Xəzər sahili",
    description:
      "Lənkəran subtropik iqlim, çay plantasiyaları və sahil zonası ilə fərqlənir. Sakit istirahət və təbiət marşrutları üçün uyğundur.",
    image: lenkeranImg,
    highlights: ["Çay plantasiyaları", "Sahil", "Milli park"],
    bestSeason: "Aprel – Oktyabr",
    distanceFromBaku: "≈ 270 km",
    hotels: hotels(
      "lenkeran",
      "Lənkəran",
      ["Xəzər Sahil Hotel", "Çay Bağı Guest House", "Hirkan Park Hotel"],
      ["Sahil zonası", "Şəhər mərkəzi", "Hirkan parkı yaxınlığı"],
      65,
    ),
    activities: activities("lenkeran", [
      ["Boat tour", "Su", 24],
      ["Təbiət gəzintisi", "Təbiət", 12],
      ["Muzey", "Mədəniyyət", 4],
      ["At sürmə", "Təbiət", 26],
      ["Çay dequstasiyası", "Mətbəx", 15],
      ["Kvadrosikl", "Adrenalin", 35],
    ]),
    tours: tours("lenkeran", [
      ["Hirkan Milli Parkı turu", 50, "1 gün", ["Nəqliyyat", "Bələdçi"]],
      ["Çay plantasiyası turu", 35, "yarım gün", ["Bələdçi", "Dequstasiya"]],
      ["Sahil və kənd mətbəxi turu", 45, "1 gün", ["Nəqliyyat", "Nahar"]],
    ]),
  },
  {
    slug: "samaxi",
    name: "Şamaxı",
    nameDative: "Şamaxıya",
    nameGenitive: "Şamaxının",
    region: "Şirvan",
    tagline: "Üzüm bağları və tarixi izlər",
    description:
      "Şamaxı üzüm bağları, tarixi abidələr və ulduz müşahidə mərkəzi ilə tanınır. Bakıdan qısa həftəsonu səfəri üçün rahat variantdır.",
    image: samaxiImg,
    highlights: ["Üzüm bağları", "Tarixi abidələr", "Ulduz müşahidəsi"],
    bestSeason: "Aprel – Noyabr",
    distanceFromBaku: "≈ 120 km",
    hotels: hotels(
      "samaxi",
      "Şamaxı",
      ["Şirvan Vineyard Hotel", "Pirqulu Hill Resort", "Şamaxı Central Inn"],
      ["Üzüm bağları zonası", "Pirqulu yolu", "Şəhər mərkəzi"],
      75,
    ),
    activities: activities("samaxi", [
      ["Təbiət gəzintisi", "Təbiət", 12],
      ["Muzey", "Mədəniyyət", 5],
      ["At sürmə", "Təbiət", 30],
      ["Şərab dequstasiyası", "Mətbəx", 25],
      ["Kvadrosikl", "Adrenalin", 40],
      ["Zipline", "Adrenalin", 20],
    ]),
    tours: tours("samaxi", [
      ["Şamaxı tarixi turu", 40, "yarım gün", ["Bələdçi", "Muzey bileti"]],
      ["Pirqulu observatoriya turu", 45, "1 gün", ["Nəqliyyat", "Bələdçi"]],
      ["Üzüm bağları turu", 55, "1 gün", ["Nəqliyyat", "Dequstasiya"]],
    ]),
  },
  {
    slug: "naftalan",
    name: "Naftalan",
    nameDative: "Naftalana",
    nameGenitive: "Naftalanın",
    region: "Gəncə-Daşkəsən",
    tagline: "Sağlamlıq və sakit istirahət",
    description:
      "Naftalan sağlamlıq mərkəzləri və sakit park zonaları ilə tanınır. Yavaş templi, dincəlmə fokuslu səfərlər üçün seçilir.",
    image: naftalanImg,
    highlights: ["Sağlamlıq mərkəzləri", "Park zonaları", "Sakit mühit"],
    bestSeason: "İl boyu",
    distanceFromBaku: "≈ 310 km",
    hotels: hotels(
      "naftalan",
      "Naftalan",
      ["Naftalan Health Resort", "Park Wellness Hotel", "Şəfa Boutique Hotel"],
      ["Sanatoriya zonası", "Şəhər parkı yaxınlığı", "Mərkəz"],
      110,
    ),
    activities: activities("naftalan", [
      ["Spa proseduru", "Sağlamlıq", 35],
      ["Təbiət gəzintisi", "Təbiət", 10],
      ["Muzey", "Mədəniyyət", 4],
      ["Velosiped turu", "Aktiv", 18],
      ["At sürmə", "Təbiət", 28],
      ["Yoga sessiyası", "Sağlamlıq", 15],
    ]),
    tours: tours("naftalan", [
      ["Sağlamlıq həftəsonu paketi", 190, "2 gün", ["Otel", "2 prosedur"]],
      ["Gəncə birgünlük turu", 55, "1 gün", ["Nəqliyyat", "Bələdçi"]],
      ["Park və şəhər gəzintisi", 25, "yarım gün", ["Bələdçi"]],
    ]),
  },
  {
    slug: "baki",
    name: "Bakı",
    nameDative: "Bakıya",
    nameGenitive: "Bakının",
    region: "Abşeron",
    tagline: "Şəhər həyatı, sahil və mədəniyyət",
    description:
      "Bakı İçərişəhər, bulvar və müasir memarlığı bir araya gətirir. Şəhər səyahəti, gecə həyatı və mədəni marşrutlar üçün əsas nöqtədir.",
    image: bakiImg,
    highlights: ["İçərişəhər", "Dəniz bulvarı", "Muzeylər"],
    bestSeason: "İl boyu",
    distanceFromBaku: "Başlanğıc nöqtə",
    hotels: hotels(
      "baki",
      "Bakı",
      ["Bulvar Sea View Hotel", "İçərişəhər Boutique", "Yasamal City Hotel"],
      ["Dəniz bulvarı", "İçərişəhər", "Mərkəzdən 4 km"],
      100,
    ),
    activities: activities("baki", [
      ["Boat tour", "Su", 22],
      ["Muzey", "Mədəniyyət", 8],
      ["Təbiət gəzintisi", "Təbiət", 10],
      ["Kvadrosikl", "Adrenalin", 45],
      ["At sürmə", "Təbiət", 30],
      ["Gecə şəhər turu", "Mədəniyyət", 20],
    ]),
    tours: tours("baki", [
      ["İçərişəhər piyada turu", 30, "yarım gün", ["Bələdçi"]],
      ["Qobustan və Yanardağ turu", 60, "1 gün", ["Nəqliyyat", "Biletlər"]],
      ["Abşeron sahil turu", 45, "1 gün", ["Nəqliyyat", "Nahar"]],
    ]),
  },
  {
    slug: "qusar",
    name: "Qusar",
    nameDative: "Qusara",
    nameGenitive: "Qusarın",
    region: "Quba-Xaçmaz",
    tagline: "Şahdağ, dağ yürüşü və qış idmanı",
    description:
      "Qusar Şahdağ ətrafındaki dağ marşrutları və mövsümi idman imkanları ilə tanınır. Aktiv qruplar üçün güclü seçimdir.",
    image: qusarImg,
    highlights: ["Şahdağ", "Dağ yürüşü", "Mövsümi idman"],
    bestSeason: "Dekabr – Mart və İyun – Sentyabr",
    distanceFromBaku: "≈ 200 km",
    hotels: hotels(
      "qusar",
      "Qusar",
      ["Şahdağ Alpine Hotel", "Laza Valley Lodge", "Qusar Mountain Inn"],
      ["Şahdağ zonası", "Laza kəndi", "Şəhər mərkəzi"],
      120,
    ),
    activities: activities("qusar", [
      ["Dağ yürüşü", "Təbiət", 18],
      ["Zipline", "Adrenalin", 28],
      ["Kvadrosikl", "Adrenalin", 48],
      ["At sürmə", "Təbiət", 32],
      ["Muzey", "Mədəniyyət", 4],
      ["Təbiət gəzintisi", "Təbiət", 14],
    ]),
    tours: tours("qusar", [
      ["Laza şəlalələri turu", 55, "1 gün", ["Nəqliyyat", "Bələdçi"]],
      ["Şahdağ panorama turu", 70, "1 gün", ["Nəqliyyat", "Kabin bileti"]],
      ["Aktiv dağ həftəsonu", 200, "2 gün", ["Otel", "2 aktivlik", "Bələdçi"]],
    ]),
  },
];

export const getDestination = (slug: string) =>
  destinations.find((d) => d.slug === slug);

export const isCategoryKey = (value: string): value is CategoryKey =>
  value === "oteller" || value === "eylenceler" || value === "turlar";
