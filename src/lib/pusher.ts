import Pusher from "pusher";
import "server-only";

const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export { pusherServer };

export async function triggerEvent(channel: string, event: string, data: unknown) {
  await pusherServer.trigger(channel, event, data);
}
