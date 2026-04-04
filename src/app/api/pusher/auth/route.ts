import { NextResponse } from "next/server";
import Pusher from "pusher";

export async function POST(request: Request) {
  const { socketId, channelName } = await request.json();

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID || "2136796",
    key: process.env.PUSHER_KEY || "ba23fd7d4676497d9857",
    secret: process.env.PUSHER_SECRET || "e095304d03be1fe6819f",
    cluster: process.env.PUSHER_CLUSTER || "us3",
    useTLS: true,
  });

  const auth = pusher.authenticate(socketId, channelName);
  return NextResponse.json(auth);
}
