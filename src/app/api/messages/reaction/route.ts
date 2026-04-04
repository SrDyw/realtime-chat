import { NextResponse } from "next/server";
import { triggerEvent } from "@/lib/pusher";

export async function POST(request: Request) {
  const { room, messageId, emoji, userId, userName } = await request.json();

  try {
    await triggerEvent(`chat-${room}`, "message-reaction", {
      messageId,
      emoji,
      userId,
      userName,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to add reaction" }, { status: 500 });
  }
}
