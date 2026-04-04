import { NextResponse } from "next/server";
import Pusher from "pusher";

export async function POST(request: Request) {
  const { socketId, channelName } = await request.json();

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  });

  try {
    const auth = pusher.authenticate(socketId, channelName);
    return NextResponse.json(auth);
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 403 });
  }
}
