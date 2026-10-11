// PLACEHOLDER visa data for Indian passport holders. Edit freely — not verified.
export type VisaEntry = {
  slug: string;
  country: string;
  status: "Visa-free" | "Visa on arrival" | "e-Visa" | "Visa required";
  maxStay: number; // days allowed per entry
  passportRule: string;
  transitNote: string;
  officialUrl: string;
};

export const VISA_DATA: VisaEntry[] = [
  { slug: "thailand", country: "Thailand", status: "Visa-free", maxStay: 60, passportRule: "Passport valid for at least 6 months from arrival.", transitNote: "Airside transit in Bangkok usually needs no transit visa.", officialUrl: "https://www.thaievisa.go.th" },
  { slug: "vietnam", country: "Vietnam", status: "e-Visa", maxStay: 90, passportRule: "Passport valid for at least 6 months from arrival, with 2 blank pages.", transitNote: "Layovers via Singapore or Kuala Lumpur generally don't need a transit visa if you stay airside.", officialUrl: "https://evisa.gov.vn" },
  { slug: "sri-lanka", country: "Sri Lanka", status: "e-Visa", maxStay: 30, passportRule: "Passport valid for at least 6 months from arrival.", transitNote: "Mostly direct flights from India — no layover needed.", officialUrl: "https://www.eta.gov.lk" },
  { slug: "indonesia", country: "Indonesia (Bali)", status: "Visa on arrival", maxStay: 30, passportRule: "Passport valid for at least 6 months from arrival.", transitNote: "Airside transit in Singapore or KL is usually fine without a transit visa.", officialUrl: "https://evisa.imigrasi.go.id" },
  { slug: "maldives", country: "Maldives", status: "Visa on arrival", maxStay: 30, passportRule: "Passport valid for at least 1 month beyond your stay; return ticket and hotel booking needed.", transitNote: "Direct flights from India are common.", officialUrl: "https://imuga.immigration.gov.mv" },
  { slug: "japan", country: "Japan", status: "e-Visa", maxStay: 90, passportRule: "Passport valid for the full length of your stay.", transitNote: "Layovers in Hong Kong or Bangkok are usually airside-only — check your airline.", officialUrl: "https://www.mofa.go.jp/j_info/visit/visa/index.html" },
  { slug: "uae", country: "United Arab Emirates", status: "Visa required", maxStay: 30, passportRule: "Passport valid for at least 6 months from arrival.", transitNote: "Most flights are direct; airside transit in Dubai needs no visa.", officialUrl: "https://icp.gov.ae" },
  { slug: "nepal", country: "Nepal", status: "Visa-free", maxStay: 180, passportRule: "Valid passport or Voter ID card accepted for Indian citizens.", transitNote: "Direct flights and road crossings from India — no transit needed.", officialUrl: "https://www.immigration.gov.np" },
];
