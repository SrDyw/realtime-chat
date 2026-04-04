import Pusher from "pusher-js";

export function createPusherClient() {
  console.log("Creating Pusher client with:", {
    key: process.env.NEXT_PUBLIC_PUSHER_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  });

  return new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    forceTLS: true,
    authEndpoint: "/api/pusher/auth",
    wsHost: "ws-us3.pusher.com",
    wsPort: 443,
    wssPort: 443,
    httpHost: "sockjs-us3.pusher.com",
    httpPort: 80,
    httpsPort: 443,
  });
}

export function subscribeToChannel(channelName: string) {
  const pusher = createPusherClient();
  return pusher.subscribe(channelName);
}
