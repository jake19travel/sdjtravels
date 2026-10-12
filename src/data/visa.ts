// Visa rules for Indian passport holders (ordinary passports, tourism).
// Checked against official government sources on CHECKED_ON. Rules change — recheck every few months.
export const CHECKED_ON = "12 Oct 2026";

export type VisaEntry = {
  slug: string;
  country: string;
  status: "Visa-free" | "Visa on arrival" | "e-Visa" | "Visa required";
  maxStay: number; // days per entry
  feeInr: number | null; // approx. INR; null = shown when you apply
  feeNote: string;
  passportMonths: number; // months of validity needed beyond arrival (0 = valid for stay)
  passportRule: string;
  transitNote: string;
  extra?: string;
  officialUrl: string;
  sourceName: string;
};

export const VISA_DATA: VisaEntry[] = [
  {
    slug: "thailand", country: "Thailand", status: "Visa-free", maxStay: 60, feeInr: 0,
    feeNote: "No visa fee for tourist stays up to 60 days.",
    passportMonths: 6, passportRule: "Passport valid for at least 6 months from arrival.",
    transitNote: "Most trips from India are direct. Airside transit needs no visa.",
    extra: "Fill in the free Thailand Digital Arrival Card before you fly.",
    officialUrl: "https://image.mfa.go.th/mfa/0/91fPdh6NtO/VISA_Information/Visa_Exemption_Revised_16_July_2024.pdf",
    sourceName: "Ministry of Foreign Affairs, Thailand",
  },
  {
    slug: "vietnam", country: "Vietnam", status: "e-Visa", maxStay: 90, feeInr: 2100,
    feeNote: "Single-entry e-visa costs US$25 (about ₹2,100).",
    passportMonths: 6, passportRule: "Passport valid for at least 6 months from arrival.",
    transitNote: "Direct flights to Hanoi and Ho Chi Minh City; Da Nang usually has one stop. Airside transit needs no visa.",
    extra: "Apply only on the official site — allow 3–5 working days.",
    officialUrl: "https://evisa.gov.vn", sourceName: "Vietnam National e-Visa system",
  },
  {
    slug: "sri-lanka", country: "Sri Lanka", status: "Visa-free", maxStay: 30, feeInr: 0,
    feeNote: "Free tourist visa for Indian citizens — register an ETA online before you fly.",
    passportMonths: 6, passportRule: "Passport valid for at least 6 months from arrival.",
    transitNote: "Short direct flights from many Indian cities.",
    officialUrl: "https://www.eta.gov.lk/slvisa/", sourceName: "Sri Lanka Department of Immigration (ETA)",
  },
  {
    slug: "indonesia", country: "Indonesia (Bali)", status: "Visa on arrival", maxStay: 30, feeInr: 2700,
    feeNote: "Visa on arrival or e-VoA costs IDR 500,000 (about ₹2,700). Bali also charges a separate tourist levy.",
    passportMonths: 6, passportRule: "Passport valid for at least 6 months from arrival.",
    transitNote: "Usually one stop via Singapore or Kuala Lumpur. Airside transit there needs no visa.",
    extra: "Can be extended once for another 30 days.",
    officialUrl: "https://evisa.imigrasi.go.id/front/info/evoa", sourceName: "Directorate General of Immigration, Indonesia",
  },
  {
    slug: "maldives", country: "Maldives", status: "Visa on arrival", maxStay: 30, feeInr: 0,
    feeNote: "Free 30-day tourist visa on arrival.",
    passportMonths: 1, passportRule: "Passport valid for at least 1 month beyond your stay, plus return ticket and hotel booking.",
    transitNote: "Direct flights from India to Malé.",
    extra: "Complete the IMUGA traveller form within 96 hours before arrival.",
    officialUrl: "https://immigration.gov.mv/visa/tourist-visa", sourceName: "Maldives Immigration",
  },
  {
    slug: "japan", country: "Japan", status: "e-Visa", maxStay: 90, feeInr: null,
    feeNote: "Single-entry tourist eVISA, applied through the official centre in India. Fee shown when you apply.",
    passportMonths: 0, passportRule: "Passport valid for your whole stay.",
    transitNote: "Direct flights from Delhi and Mumbai to Tokyo. Other routes may stop in Bangkok or Singapore.",
    extra: "Apply well ahead — processing takes several working days.",
    officialUrl: "https://www.mofa.go.jp/j_info/visit/visa/visaonline.html", sourceName: "Ministry of Foreign Affairs of Japan",
  },
  {
    slug: "uae", country: "United Arab Emirates", status: "Visa required", maxStay: 30, feeInr: null,
    feeNote: "Most travellers need a tourist visa arranged before travel. Visa on arrival (14 days) only if you hold a valid US visa or a UK/EU residence or visa.",
    passportMonths: 6, passportRule: "Passport valid for at least 6 months from arrival.",
    transitNote: "Direct flights from most Indian cities. Airside transit in Dubai needs no visa.",
    officialUrl: "https://gdrfad.gov.ae/en/services/727c91b1-52eb-11ea-0320-0050569629e8", sourceName: "GDRFA Dubai",
  },
  {
    slug: "malaysia", country: "Malaysia", status: "Visa-free", maxStay: 30, feeInr: 0,
    feeNote: "Visa-free for Indian citizens until 31 Dec 2026.",
    passportMonths: 6, passportRule: "Passport valid for more than 6 months from arrival.",
    transitNote: "Direct to Kuala Lumpur; Penang usually one short stop via KL.",
    extra: "Submit the free Malaysia Digital Arrival Card within 3 days before arrival.",
    officialUrl: "https://www.imi.gov.my/index.php/en/main-services/visa/visa-requirement-by-country/", sourceName: "Immigration Department of Malaysia",
  },
];

export const visaFor = (slug: string) => VISA_DATA.find((v) => v.slug === slug);

/** True when the passport meets the destination's validity rule for the given return date. */
export function passportOk(entry: Pick<VisaEntry, "passportMonths">, passportExpiry: Date, arrival: Date, returnDate: Date) {
  const needed = new Date(entry.passportMonths === 0 ? returnDate : arrival);
  if (entry.passportMonths > 0) needed.setMonth(needed.getMonth() + entry.passportMonths);
  return passportExpiry.getTime() >= needed.getTime();
}
