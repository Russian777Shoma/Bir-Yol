export type WeatherDay = {
  label: "Bu gün" | "Sabah";
  temp: number;
  condition: string;
  rainChance: number;
  wind: string;
  advice: string;
  preferredTypes: string[];
};

type Profile = { conditions: [string, string]; base: number; rain: [number, number] };

const profiles: Record<string, Profile> = {
  qebele: { conditions: ["Yağışlı", "Günəşli"], base: 18, rain: [70, 15] },
  seki: { conditions: ["Buludlu", "Günəşli"], base: 21, rain: [35, 10] },
  quba: { conditions: ["Günəşli", "Buludlu"], base: 19, rain: [10, 30] },
  qusar: { conditions: ["Sərin və küləkli", "Günəşli"], base: 15, rain: [25, 15] },
  lenkeran: { conditions: ["Rütubətli", "Yağışlı"], base: 24, rain: [40, 65] },
  samaxi: { conditions: ["Günəşli", "Küləkli"], base: 22, rain: [10, 20] },
  baki: { conditions: ["Günəşli", "Küləkli"], base: 26, rain: [5, 15] },
  naftalan: { conditions: ["Günəşli", "Buludlu"], base: 27, rain: [8, 25] },
};

const indoorTypes = ["Mədəniyyət", "Sağlamlıq", "Mətbəx", "Sənətkarlıq"];
const outdoorTypes = ["Adrenalin", "Təbiət", "Su", "Aktiv"];

export function getWeather(slug: string): WeatherDay[] | null {
  const p = profiles[slug];
  if (!p) return null;
  return ([0, 1] as const).map((i) => {
    const rain = p.rain[i]!;
    const wet = rain >= 40;
    return {
      label: i === 0 ? "Bu gün" : "Sabah",
      temp: p.base + (i === 0 ? 0 : 3),
      condition: p.conditions[i]!,
      rainChance: rain,
      wind: `${8 + i * 5} km/s`,
      advice: wet
        ? "Bu gün qapalı fəaliyyətlər, muzeylər və mətbəx təcrübələri daha uyğun ola bilər."
        : "Zipline, hiking və digər outdoor fəaliyyətlər üçün uyğun gündür.",
      preferredTypes: wet ? indoorTypes : outdoorTypes,
    };
  });
}
