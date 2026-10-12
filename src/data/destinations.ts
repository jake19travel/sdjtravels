// Destination catalogue. Price ranges are TYPICAL estimates (per person, return economy from Delhi/Mumbai),
// not live prices. Weather is typical climate. Both are read through src/lib/providers so live APIs can replace them.
import thailand from "@/assets/dest/thailand.jpg";
import vietnam from "@/assets/dest/vietnam.jpg";
import sriLanka from "@/assets/dest/sri-lanka.jpg";
import indonesia from "@/assets/dest/indonesia.jpg";
import maldives from "@/assets/dest/maldives.jpg";
import japan from "@/assets/dest/japan.jpg";
import uae from "@/assets/dest/uae.jpg";
import malaysia from "@/assets/dest/malaysia.jpg";

export const TRIP_STYLES = [
  "Solo", "Women travelling solo", "Couples", "Families", "Friends and groups",
  "Students", "Seniors", "Work trips", "Weekend getaways", "Cultural trips",
] as const;
export type TripStyle = (typeof TRIP_STYLES)[number];

export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"] as const;

export type Destination = {
  slug: string;
  name: string;
  country: string;
  photo: string;
  blurb: string;
  styles: TripStyle[];
  adventure: 1 | 2 | 3; // 1 relaxed, 3 adventurous
  flightHours: number;
  stops: 0 | 1;
  layoverMinutes: number; // typical, when stops = 1
  flightInr: [number, number];
  stayPerNightInr: [number, number];
  baggageInr: [number, number]; // 0 when a checked bag is usually included
  highC: number[]; // typical daily high per month, Jan..Dec
  rain: (0 | 1 | 2)[]; // 0 dry, 1 some showers, 2 wet season
  score: { safety: number; social: number; fitness: number; cultural: number }; // out of 10
  priceDropPct?: number;
};

export const DESTINATIONS: Destination[] = [
  { slug: "thailand", name: "Bangkok & Phuket", country: "Thailand", photo: thailand, blurb: "Street food, temples and easy beaches.",
    styles: ["Solo","Couples","Friends and groups","Students","Weekend getaways","Families"], adventure: 2, flightHours: 4.5, stops: 0, layoverMinutes: 0,
    flightInr: [18000, 32000], stayPerNightInr: [2500, 6000], baggageInr: [0, 3500],
    highC: [32,33,34,35,34,33,33,32,32,32,32,31], rain: [0,0,0,1,2,2,2,2,2,2,1,0],
    score: { safety: 8, social: 9.5, fitness: 7, cultural: 8.5 }, priceDropPct: 12 },
  { slug: "vietnam", name: "Hoi An & Da Nang", country: "Vietnam", photo: vietnam, blurb: "Lantern-lit old towns, beaches and great food.",
    styles: ["Solo","Women travelling solo","Couples","Cultural trips","Students"], adventure: 2, flightHours: 6, stops: 1, layoverMinutes: 120,
    flightInr: [22000, 38000], stayPerNightInr: [2000, 5000], baggageInr: [0, 3500],
    highC: [25,26,29,31,33,34,34,34,32,29,27,25], rain: [1,0,0,0,0,1,1,1,2,2,2,2],
    score: { safety: 8.5, social: 8.5, fitness: 7.5, cultural: 9 } },
  { slug: "sri-lanka", name: "Ella & the South Coast", country: "Sri Lanka", photo: sriLanka, blurb: "Tea hills, train rides and quiet beaches.",
    styles: ["Couples","Families","Seniors","Cultural trips","Weekend getaways","Solo"], adventure: 2, flightHours: 2, stops: 0, layoverMinutes: 0,
    flightInr: [12000, 25000], stayPerNightInr: [3000, 7000], baggageInr: [0, 2500],
    highC: [31,31,32,32,31,30,30,30,30,30,30,30], rain: [0,0,0,1,2,2,1,1,1,2,2,1],
    score: { safety: 8, social: 7, fitness: 8, cultural: 9 } },
  { slug: "indonesia", name: "Bali", country: "Indonesia", photo: indonesia, blurb: "Rice terraces, surf and wellness retreats.",
    styles: ["Couples","Friends and groups","Solo","Women travelling solo","Work trips"], adventure: 3, flightHours: 9, stops: 1, layoverMinutes: 150,
    flightInr: [25000, 45000], stayPerNightInr: [3000, 7000], baggageInr: [0, 4000],
    highC: [31,31,31,32,31,30,29,30,31,32,32,31], rain: [2,2,2,1,0,0,0,0,0,1,2,2],
    score: { safety: 8, social: 9, fitness: 8.5, cultural: 8.5 }, priceDropPct: 8 },
  { slug: "maldives", name: "Maldives", country: "Maldives", photo: maldives, blurb: "Calm lagoons and slow, restful days.",
    styles: ["Couples","Families","Seniors"], adventure: 1, flightHours: 3.5, stops: 0, layoverMinutes: 0,
    flightInr: [22000, 40000], stayPerNightInr: [8000, 20000], baggageInr: [0, 3000],
    highC: [30,31,31,32,31,30,30,30,30,30,30,30], rain: [0,0,0,1,2,2,2,2,2,2,1,1],
    score: { safety: 9, social: 5.5, fitness: 6, cultural: 6 } },
  { slug: "japan", name: "Tokyo & Kyoto", country: "Japan", photo: japan, blurb: "Shrines, trains and spotless streets.",
    styles: ["Solo","Women travelling solo","Cultural trips","Couples","Seniors","Families","Work trips"], adventure: 2, flightHours: 8, stops: 0, layoverMinutes: 0,
    flightInr: [45000, 80000], stayPerNightInr: [6000, 12000], baggageInr: [0, 0],
    highC: [9,10,14,20,25,28,32,33,29,23,17,12], rain: [0,0,1,1,1,2,2,1,1,1,0,0],
    score: { safety: 9.5, social: 7, fitness: 8, cultural: 9.5 } },
  { slug: "uae", name: "Dubai & Abu Dhabi", country: "United Arab Emirates", photo: uae, blurb: "Easy short-haul city break with desert days.",
    styles: ["Families","Work trips","Weekend getaways","Friends and groups","Seniors"], adventure: 1, flightHours: 3.5, stops: 0, layoverMinutes: 0,
    flightInr: [18000, 35000], stayPerNightInr: [5000, 11000], baggageInr: [0, 0],
    highC: [24,25,28,33,37,40,41,41,39,35,30,26], rain: [0,0,0,0,0,0,0,0,0,0,0,0],
    score: { safety: 9.5, social: 7.5, fitness: 5.5, cultural: 7 } },
  { slug: "malaysia", name: "Kuala Lumpur & Penang", country: "Malaysia", photo: malaysia, blurb: "Hawker food, heritage streets and easy travel.",
    styles: ["Solo","Students","Families","Cultural trips","Weekend getaways","Work trips","Women travelling solo"], adventure: 1, flightHours: 5, stops: 1, layoverMinutes: 90,
    flightInr: [16000, 30000], stayPerNightInr: [2500, 6000], baggageInr: [0, 3500],
    highC: [32,33,33,33,33,32,32,32,32,32,32,32], rain: [1,0,1,1,1,1,1,1,2,2,2,1],
    score: { safety: 8.5, social: 8, fitness: 6.5, cultural: 8.5 } },
];

export const destinationBySlug = (slug: string) => DESTINATIONS.find((d) => d.slug === slug);
export const tripScore = (s: Destination["score"]) => Math.round(((s.safety + s.social + s.fitness + s.cultural) / 4) * 10) / 10;
export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
