import { NextRequest, NextResponse } from "next/server";
import { triggerEvent } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  try {
    const { room, userId, userName, isTyping } = await request.json();

    if (!room || !userId || !userName) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await triggerEvent(`chat-${room}`, "user-typing", {
      userId,
      userName,
      isTyping,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error broadcasting typing:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
