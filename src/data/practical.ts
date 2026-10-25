import type { Destination } from "./destinations";

export type PracticalInfo = { label: string; text: string };

export function getPracticalInfo(destination: Destination): PracticalInfo[] {
  return [
    {
      label: "Yerli nəqliyyat",
      text: `${destination.name} daxilində taksi və mikroavtobuslar əsas variantdır. Axşam saatlarında marşrutlar azalır, geri dönüşü əvvəlcədən planlaşdırın. Bakıdan məsafə: ${destination.distanceFromBaku}.`,
    },
    {
      label: "Uyğun geyim",
      text: `${destination.bestSeason} aralığında rahat gəzinti ayaqqabısı və yüngül yağış gödəkçəsi tövsiyə olunur. Dağ və meşə marşrutlarında axşamlar sərin olur.`,
    },
    {
      label: "Təxmini hava şəraiti",
      text: `Səfərdən 1–2 gün əvvəl hava proqnozunu yenidən yoxlayın. ${destination.nameGenitive} iqlimi eyni gün ərzində dəyişə bilər.`,
    },
    {
      label: "Təcili yardım",
      text: "Vahid təcili yardım nömrəsi 112. Tibbi yardım üçün 103, polis üçün 102. Nömrələri offline halda da telefonunuzda saxlayın.",
    },
    {
      label: "Təhlükəsizlik tövsiyəsi",
      text: "Aktiv fəaliyyətlərdə yalnız rəsmi operatorların təhlükəsizlik avadanlığından istifadə edin. Cığırlardan kənara çıxmayın, qrupdan ayrılmayın.",
    },
    {
      label: "Ailə ilə səfər",
      text: "Uşaqlarla səfərdə park, muzey və boat tour kimi sakit fəaliyyətlər daha uyğundur. Otel rezervasiyasında ailə nömrəsini əvvəlcədən soruşun.",
    },
    {
      label: "Yerli etiket",
      text: "Dini və tarixi məkanlarda örtülü geyim seçin, foto çəkməzdən əvvəl icazə istəyin. Kənd evlərində qonaqpərvərliyə kiçik hədiyyə ilə cavab vermək yaxşı qarşılanır.",
    },
  ];
}
