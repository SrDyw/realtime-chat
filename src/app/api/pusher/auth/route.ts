import { NextResponse } from "next/server";
import Pusher from "pusher";

export async function POST(request: Request) {
  const body = await request.json();
  const { socket_id, channel_name } = body;

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  });

  if (channel_name.startsWith("presence-")) {
    const presenceData = {
      user_id: socket_id,
      user_info: body.user_info || { name: body.username || "Usuario" },
    };
    const auth = pusher.authenticate(socket_id, channel_name, presenceData);
    return NextResponse.json(auth);
  }

  const auth = pusher.authenticate(socket_id, channel_name);
  return NextResponse.json(auth);
}
