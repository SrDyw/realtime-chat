import { NextResponse } from "next/server";

interface UserPresence {
  id: string;
  name: string;
  room: string;
  disconnected: boolean;
}

const users = new Map<string, UserPresence>();

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

  return NextResponse.json({
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
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/pusher/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room,
          message: {
            id: `${Date.now()}-${Math.random()}`,
            user: "Sistema",
            text: `${userName} ha abandonado el chat`,
            timestamp: new Date().toISOString(),
            isSystem: true,
          },
        }),
      });
    }
  }

  return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const room = searchParams.get("room") || "general";

  const usersInRoom = Array.from(users.values())
    .filter((u) => u.room === room && !u.disconnected)
    .map((u) => ({ id: u.id, name: u.name }));

  return NextResponse.json({ users: usersInRoom });
}
