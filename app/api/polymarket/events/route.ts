import { NextResponse } from "next/server";
import { GAMMA_API_URL } from "@/constants/polymarket";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") ?? "20";
  const closed = searchParams.get("closed") ?? "false";
  const tagId = searchParams.get("tag_id") ?? "";

  const params = new URLSearchParams({
    limit,
    closed,
    order: "volume24hr",
    ascending: "false",
  });
  if (tagId) params.set("tag_id", tagId);

  const url = `${GAMMA_API_URL}/events?${params}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`Gamma API error: ${res.status}`);
    }
    const events = await res.json();
    return NextResponse.json(events);
  } catch (err) {
    console.error("Polymarket events fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
