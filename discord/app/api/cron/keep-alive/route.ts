import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  await db.profile.findFirst({
    select: { id: true },
  });

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
  });
}