import { NextResponse } from "next/server";
import { triggerEvent } from "@/lib/pusher";

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

const rooms = new Map<string, Message[]>();

function saveMessage(room: string, message: Message) {
  if (!rooms.has(room)) {
    rooms.set(room, []);
  }

  const roomMessages = rooms.get(room)!;
  roomMessages.push(message);

  if (roomMessages.length > 100) {
    roomMessages.shift();
  }
}

export async function POST(request: Request) {
  const { room, message } = await request.json();

  try {
    saveMessage(room, message);
    await triggerEvent(`chat-${room}`, "new-message", message);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const room = searchParams.get("room") || "general";
  const sinceId = searchParams.get("sinceId");

  const roomMessages = rooms.get(room) || [];
  
  if (sinceId) {
    const index = roomMessages.findIndex((m) => m.id === sinceId);
    const newMessages = index >= 0 ? roomMessages.slice(index + 1) : [];
    return NextResponse.json(newMessages);
  }

  return NextResponse.json(roomMessages);
}
