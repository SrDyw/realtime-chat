import { NextResponse } from "next/server";
import { triggerEvent } from "@/lib/pusher";

interface UserPresence {
  id: string;
  name: string;
  room: string;
  disconnected: boolean;
}

interface JoinEvent {
  userId: string;
  userName: string;
  room: string;
}

interface DisconnectEvent {
  userId: string;
  userName: string;
  room: string;
  timestamp: string;
}

const users = new Map<string, UserPresence>();
const joinEvents: JoinEvent[] = [];

export async function POST(request: Request) {
  const { userId, userName, room } = await request.json();

  const existingUser = users.get(userId);
  const wasDisconnected = existingUser?.disconnected;

  users.set(userId, {
    id: userId,
    name: userName,
    room,
    disconnected: false,
  });

  const usersInRoom = Array.from(users.values()).filter((u) => u.room === room && !u.disconnected);

  if (!existingUser || wasDisconnected) {
    const event: JoinEvent = { userId, userName, room };
    joinEvents.push(event);
    await triggerEvent(`chat-${room}`, "user-joined", event);
  }

  return NextResponse.json({
    count: usersInRoom.length,
    isFirstJoin: !existingUser || wasDisconnected,
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const userName = searchParams.get("userName");
  const room = searchParams.get("room");

  if (userId && users.has(userId)) {
    const user = users.get(userId)!;
    user.disconnected = true;

    if (userName && room) {
      const event: DisconnectEvent = {
        userId,
        userName,
        room,
        timestamp: new Date().toISOString(),
      };
      await triggerEvent(`chat-${room}`, "user-left", event);
    }
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const room = searchParams.get("room") || "general";

  const usersInRoom = Array.from(users.values()).filter((u) => u.room === room && !u.disconnected);
  return NextResponse.json({ count: usersInRoom.length });
}
