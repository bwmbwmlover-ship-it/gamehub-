import { NextResponse } from "next/server";
import { seed } from "@/lib/seed";

export async function POST() {
  try {
    await seed();
    return NextResponse.json({ ok: true, message: "Seeding complete" });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
