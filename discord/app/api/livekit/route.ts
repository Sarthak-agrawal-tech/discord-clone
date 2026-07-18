import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const room = searchParams.get("room");
  const username = searchParams.get("username");

  // 1. Validation
  if (!room || !username) {
    return NextResponse.json(
      { error: 'Query parameters "room" and "username" are required' },
      { status: 400 }
    );
  }

  // 2. Validate environment keys are loaded
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  try {
    // 3. Modern token generation instantiation
    const at = new AccessToken(apiKey, apiSecret, {
      identity: username,
    });

    // 4. Attach grants
    at.addGrant({ 
      roomJoin: true, 
      room: room,
      canPublish: true,
      canSubscribe: true
    });

    // 5. Serialize token to JWT
    const token = await at.toJwt();

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token Generation Failure:", error);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
