export const dynamic = 'force-dynamic';
import { NextResponse,NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Match your exact environment variable names from Supabase
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Real database query to keep Supabase active
  await db.profile.findFirst({
    select: { id: true },
  });

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
  });
}