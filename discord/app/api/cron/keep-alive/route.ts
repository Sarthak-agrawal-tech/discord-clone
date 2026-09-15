export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Match your exact environment variable names from Supabase
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseSecretKey);

export async function GET(request: Request) {
  // Extract secret token from URL query string
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('secret');

  // Guard against unauthorized pings
  if (!token || token !== process.env.CRON_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Ping your database to keep it active
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Supabase pinged successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
