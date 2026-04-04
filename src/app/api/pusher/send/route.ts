import { NextResponse } from "next/server";
import { triggerEvent } from "@/lib/pusher";

export async function POST(request: Request) {
  const { room, message } = await request.json();

  try {
    await triggerEvent(`chat-${room}`, "new-message", message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
