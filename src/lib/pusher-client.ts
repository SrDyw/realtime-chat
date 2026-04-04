import Pusher from "pusher-js";

let pusherClient: Pusher | null = null;

export function getPusherClient(): Pusher {
  if (pusherClient) {
    return pusherClient;
  }

  pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    forceTLS: true,
    authEndpoint: "/api/pusher/auth",
  });

  return pusherClient;
}

export function subscribeToChannel(channelName: string) {
  const pusher = getPusherClient();
  return pusher.subscribe(channelName);
}

export function unsubscribeFromChannel(channelName: string) {
  const pusher = getPusherClient();
  pusher.unsubscribe(channelName);
}
