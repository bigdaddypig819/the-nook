import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const client = await db();
    const r = await client.execute("SELECT count(*) as n FROM bookings");
    const n = Number((r.rows[0] as unknown as { n: number }).n);
    return NextResponse.json({ ok: true, bookings: n });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
