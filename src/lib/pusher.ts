import Pusher from "pusher";

const pusherServer = new Pusher({
  appId: "2136796",
  key: "ba23fd7d4676497d9857",
  secret: "e095304d03be1fe6819f",
  cluster: "us3",
  useTLS: true,
});

export { pusherServer };

export async function triggerEvent(channel: string, event: string, data: any) {
  console.log("Trigger event");
  await pusherServer.trigger(channel, event, data);
}
