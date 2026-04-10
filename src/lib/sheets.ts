import { Place } from "@/types";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY!;

// 컬럼 순서: id | name | lat | lng | address | category | country | city | reviews | instagram | twitter | facebook
export async function fetchPlacesFromSheet(): Promise<Place[]> {
  const range = "places_output!A2:L";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch places from Google Sheets");

  const data = await res.json();
  const rows: string[][] = data.values ?? [];

  return rows.map((row) => ({
    id: row[0] ?? "",
    name: row[1] ?? "",
    lat: parseFloat(row[2]) || 0,
    lng: parseFloat(row[3]) || 0,
    address: row[4] ?? "",
    category: (row[5] as Place["category"]) ?? "other",
    country: row[6] ?? "",
    city: row[7] ?? "",
    reviews: row[8] ?? "",
    instagram: row[9] ?? "",
    twitter: row[10] ?? "",
    facebook: row[11] ?? "",
  }));
}
