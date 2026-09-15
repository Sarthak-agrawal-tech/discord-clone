import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function pingDB() {
  await db.profile.findFirst({
    select: { id: true },
  });
}

export async function GET() {
  await pingDB();

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
  });
}

export async function HEAD() {
  await pingDB();
  return new NextResponse(null, { status: 200 });
}