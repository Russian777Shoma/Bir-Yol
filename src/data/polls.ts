export type Poll = {
  id: string;
  roomId: string;
  question: string;
  endsAt: string;
  options: { id: string; label: string; votes: number }[];
};

export type GroupPlanItem = {
  id: string;
  day: number;
  time: string;
  title: string;
  place: string;
  price: number;
  joining: string[];
};

const basePolls = (roomId: string): Poll[] => [
  {
    id: `${roomId}-poll-1`,
    roomId,
    question: "Hansı oteli seçək?",
    endsAt: "2 gün sonra bitir",
    options: [
      { id: "a", label: "Hotel A — 95 AZN / gecə", votes: 4 },
      { id: "b", label: "Hotel B — 130 AZN / gecə", votes: 2 },
      { id: "c", label: "Hotel C — 75 AZN / gecə", votes: 1 },
    ],
  },
  {
    id: `${roomId}-poll-2`,
    roomId,
    question: "Sabah nə edək?",
    endsAt: "Bu axşam bitir",
    options: [
      { id: "zipline", label: "Zipline", votes: 3 },
      { id: "kvadro", label: "Kvadrosikl", votes: 3 },
      { id: "hiking", label: "Hiking", votes: 2 },
    ],
  },
];

export function getPolls(roomId: string): Poll[] {
  return basePolls(roomId);
}

export function getGroupPlan(roomId: string, destination: string): GroupPlanItem[] {
  return [
    {
      id: `${roomId}-gp-1`,
      day: 1,
      time: "12:00",
      title: `${destination}-ya gəliş və yerləşmə`,
      place: "Otel A",
      price: 95,
      joining: ["Host A", "İstifadəçi A", "İstifadəçi E"],
    },
    {
      id: `${roomId}-gp-2`,
      day: 1,
      time: "19:00",
      title: "Ortaq şam yeməyi",
      place: "Lokal restoran",
      price: 25,
      joining: ["Host A", "İstifadəçi A"],
    },
    {
      id: `${roomId}-gp-3`,
      day: 2,
      time: "10:00",
      title: "Təbiət gəzintisi",
      place: "Meşə cığırı",
      price: 15,
      joining: ["Host A", "İstifadəçi E"],
    },
    {
      id: `${roomId}-gp-4`,
      day: 2,
      time: "14:30",
      title: "Zipline",
      place: "Aktivlik zonası",
      price: 25,
      joining: ["Host A"],
    },
    {
      id: `${roomId}-gp-5`,
      day: 3,
      time: "11:00",
      title: "Sərbəst plan və geri dönüş",
      place: "Şəhər mərkəzi",
      price: 0,
      joining: ["Host A", "İstifadəçi A", "İstifadəçi E"],
    },
  ];
}
