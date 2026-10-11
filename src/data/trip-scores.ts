// SAMPLE Trip Score data. Replace with real data later.
export type TripScore = {
  slug: string;
  destination: string;
  country: string;
  month: string;
  traveller: string;
  question: string;
  overall: number;
  scores: { social: number; safety: number; fitness: number; cultural: number };
  explanation: string;
  price: { flight: number; baggage: number; visa: number; stay: number };
};

export const TRIP_SCORES: TripScore[] = [
  {
    slug: "vietnam-november-solo-women",
    destination: "Vietnam",
    country: "Vietnam",
    month: "November",
    traveller: "Solo women",
    question: "Is Vietnam safe for solo women in November?",
    overall: 86,
    scores: { social: 84, safety: 88, fitness: 76, cultural: 92 },
    explanation:
      "November is dry season in the south and centre, so Ho Chi Minh City, Hoi An and Da Nang are warm and pleasant. Busy hostels make it easy to meet people, and well-lit old towns feel comfortable after dark. Expect some rain in the far north.",
    price: { flight: 28000, baggage: 3500, visa: 2100, stay: 22000 },
  },
  {
    slug: "thailand-december-friends",
    destination: "Thailand",
    country: "Thailand",
    month: "December",
    traveller: "Friends group",
    question: "Is Thailand good for a friends trip in December?",
    overall: 90,
    scores: { social: 95, safety: 84, fitness: 82, cultural: 88 },
    explanation:
      "Peak season with dry, sunny days on the Andaman coast. Great nightlife, island hopping and street food. Book early — prices rise close to Christmas.",
    price: { flight: 22000, baggage: 3000, visa: 0, stay: 26000 },
  },
  {
    slug: "sri-lanka-february-couples",
    destination: "Sri Lanka",
    country: "Sri Lanka",
    month: "February",
    traveller: "Couples",
    question: "Is Sri Lanka worth it for couples in February?",
    overall: 84,
    scores: { social: 72, safety: 86, fitness: 85, cultural: 90 },
    explanation:
      "Clear skies on the south and west coasts, plus cool hill-country train rides. Quieter than peak months and very easy to reach from India.",
    price: { flight: 14000, baggage: 2000, visa: 1700, stay: 24000 },
  },
];

export const allInPrice = (p: TripScore["price"]) => p.flight + p.baggage + p.visa + p.stay;
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
