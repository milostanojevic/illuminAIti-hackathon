import { NextResponse } from "next/server";

const UPSTREAM =
  "https://www.supersportbet.com/en-zm/sports/home/api/widget-data-loader?widgetType=games&eventsLimit=10";

export async function GET() {
  try {
    const res = await fetch(UPSTREAM, {
      headers: {
        Accept: "application/json",
        "User-Agent": "illuminAIti-hackathon/1.0 (homepage games widget)",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "upstream", status: res.status },
        { status: 502 }
      );
    }

    const data: unknown = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }
}
