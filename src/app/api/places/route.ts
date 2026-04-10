import { NextResponse } from "next/server";
import { fetchPlacesFromSheet } from "@/lib/sheets";

export async function GET() {
  try {
    const places = await fetchPlacesFromSheet();
    return NextResponse.json(places);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 });
  }
}
