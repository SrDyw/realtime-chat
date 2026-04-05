import { NextResponse } from "next/server";
import { triggerEvent } from "@/lib/pusher";

export async function POST(request: Request) {
  const { event, data, room } = await request.json();

  try {
    if (event === "user-joined") {
      await triggerEvent(`chat-${room}`, "user-joined", data);
    } else if (event === "user-left") {
      await triggerEvent(`chat-${room}`, "user-left", data);
    } else if (event === "heartbeat") {
      await triggerEvent(`chat-${room}`, "heartbeat", data);
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to broadcast" }, { status: 500 });
  }
}
