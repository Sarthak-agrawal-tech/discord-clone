import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function keepAlive() {
  await db.profile.findFirst({
    select: { id: true },
  });

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return keepAlive();
}

export async function HEAD() {
  await db.profile.findFirst({
    select: { id: true },
  });

  return new NextResponse(null, { status: 200 });
}