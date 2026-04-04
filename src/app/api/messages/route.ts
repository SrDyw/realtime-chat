import { NextResponse } from "next/server";

const rooms = new Map<string, any[]>();

export async function POST(request: Request) {
  const { room, message } = await request.json();

  if (!rooms.has(room)) {
    rooms.set(room, []);
  }

  const roomMessages = rooms.get(room)!;
  roomMessages.push(message);

  if (roomMessages.length > 100) {
    roomMessages.shift();
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const room = searchParams.get("room") || "general";
  const since = searchParams.get("since");

  const roomMessages = rooms.get(room) || [];
  
  if (since) {
    const sinceId = parseInt(since);
    const newMessages = roomMessages.filter((m) => parseInt(m.id) > sinceId);
    return NextResponse.json(newMessages);
  }

  return NextResponse.json(roomMessages);
}
