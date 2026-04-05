import { useEffect, useState, useRef, useCallback } from "react";
import {
  subscribeToChannel,
  unsubscribeFromChannel,
} from "@/lib/pusher-client";

interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  isOwn?: boolean;
  reactions?: Reaction[];
  replyTo?: {
    id: string;
    user: string;
    text: string;
  };
}

interface UserPresence {
  userId: string;
  userName: string;
  lastSeen: number;
  color: string;
}

interface TypingUser {
  userId: string;
  userName: string;
  timestamp: number;
}

let messageCounter = 0;
let currentRoom: string | null = null;

const userColorsMap = new Map<string, string>();

function generateMessageId(): string {
  return `${Date.now()}-${++messageCounter}`;
}

const userColors = [
  "#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", 
  "#ef4444", "#6366f1", "#14b8a6", "#f97316", "#84cc16",
  "#a855f7", "#22c55e", "#3b82f6", "#f43f5e", "#eab308"
];

function getRandomColor(): string {
  return userColors[Math.floor(Math.random() * userColors.length)];
}

function getUserColor(userId: string): string {
  if (!userColorsMap.has(userId)) {
    userColorsMap.set(userId, getRandomColor());
  }
  return userColorsMap.get(userId)!;
}

export function useChat(username: string | null, room: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<UserPresence[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  
  const lastMessageIdRef = useRef<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<ReturnType<typeof subscribeToChannel> | null>(null);
  const pendingMessageIdsRef = useRef<Set<string>>(new Set());
  const pendingReactionsRef = useRef<Set<string>>(new Set());
  const messagesRef = useRef<Message[]>([]);
  const currentUserRef = useRef<UserPresence | null>(null);
  const pendingUserEventsRef = useRef<Set<string>>(new Set());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const generateUUID = (): string => {
    return crypto.randomUUID();
  };

  const joinChat = useCallback((userName: string) => {
    const userId = generateUUID();
    currentUserRef.current = {
      userId,
      userName: userName,
      lastSeen: Date.now(),
      color: getUserColor(userId),
    };

    fetch("/api/presence/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "user-joined",
        room,
        data: {
          userId,
          userName: userName,
          timestamp: Date.now(),
        },
      }),
    });

    if (heartbeatIntervalRef.current) return;
    heartbeatIntervalRef.current = setInterval(() => {
      if (currentUserRef.current) {
        currentUserRef.current.lastSeen = Date.now();
        fetch("/api/presence/broadcast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "heartbeat",
            room,
            data: {
              userId: currentUserRef.current.userId,
              userName: currentUserRef.current.userName,
              timestamp: Date.now(),
            },
          }),
        });
      }
    }, 10000);
  }, [room]);

  const cleanupStaleUsers = useCallback(() => {
    const now = Date.now();
    const staleThreshold = 30000;

    setUsers((prev) => {
      const filtered = prev.filter(
        (u) => now - u.lastSeen < staleThreshold
      );
      if (filtered.length !== prev.length) {
        return filtered;
      }
      return prev;
    });
  }, []);

  const handleDisconnect = useCallback(() => {
    if (currentUserRef.current) {
      fetch("/api/presence/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "user-left",
          room,
          data: {
            userId: currentUserRef.current.userId,
            userName: currentUserRef.current.userName,
            timestamp: Date.now(),
          },
        }),
      });
      currentUserRef.current = null;
    }

    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    if (cleanupIntervalRef.current) {
      clearInterval(cleanupIntervalRef.current);
      cleanupIntervalRef.current = null;
    }
  }, [room]);

  const fetchMessages = useCallback(async () => {
    try {
      const url = lastMessageIdRef.current
        ? `/api/messages?room=${room}&sinceId=${lastMessageIdRef.current}`
        : `/api/messages?room=${room}`;

      const response = await fetch(url);
      if (response.ok) {
        const newMessages: Message[] = await response.json();

        if (newMessages.length > 0) {
          const processed = newMessages.map((msg) => ({
            ...msg,
            isOwn: msg.user === username && !msg.isSystem,
          }));

          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const uniqueNew = processed.filter((m) => !existingIds.has(m.id));
            if (uniqueNew.length === 0) return prev;
            return [...prev, ...uniqueNew];
          });

          const maxId =
            newMessages[newMessages.length - 1]?.id ||
            lastMessageIdRef.current;
          lastMessageIdRef.current = maxId;
        }
      }
    } catch {
      console.error("Error fetching messages");
    }
  }, [username, room]);

  const addReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!currentUserRef.current || !username) return;
      
      const msg = messagesRef.current.find((m) => m.id === messageId);
      const existingUserReaction = msg?.reactions?.find(
        (r) => r.userId === username
      );

      const reactionKey = `${messageId}-${emoji}-${username}`;

      if (existingUserReaction?.emoji === emoji) {
        pendingReactionsRef.current.add(reactionKey);
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === messageId) {
              return {
                ...m,
                reactions: (m.reactions || []).filter(
                  (r) => !(r.emoji === emoji && r.userId === username)
                ),
              };
            }
            return m;
          })
        );

        fetch(`/api/messages/reaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room,
            messageId,
            emoji,
            userId: username,
            userName: username,
          }),
        });
        return;
      }

      pendingReactionsRef.current.add(reactionKey);
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
            const filteredReactions = (m.reactions || []).filter(
              (r) => r.userId !== username
            );
            return {
              ...m,
              reactions: [
                ...filteredReactions,
                { emoji, userId: username, userName: username },
              ],
            };
          }
          return m;
        })
      );

      fetch(`/api/messages/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room,
          messageId,
          emoji,
          userId: username,
          userName: username,
        }),
      });
    },
    [room, username]
  );

  useEffect(() => {
    const channelName = `chat-${room}`;
    currentRoom = room;

    const channel = subscribeToChannel(channelName);
    channelRef.current = channel;

    channel.bind("new-message", (data: Message) => {
      if (pendingMessageIdsRef.current.has(data.id)) {
        pendingMessageIdsRef.current.delete(data.id);
        return;
      }

      const message: Message = {
        ...data,
        isOwn: data.user === username && !data.isSystem,
      };

      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });

      if (message.id > lastMessageIdRef.current) {
        lastMessageIdRef.current = message.id;
      }
    });

    channel.bind(
      "user-joined",
      (data: { userId: string; userName: string; timestamp: number }) => {
        if (data.userId === currentUserRef.current?.userId) return;

        const eventKey = `join-${data.userId}-${data.timestamp}`;
        if (pendingUserEventsRef.current.has(eventKey)) {
          return;
        }
        pendingUserEventsRef.current.add(eventKey);
        setTimeout(() => pendingUserEventsRef.current.delete(eventKey), 100);

        setUsers((prev) => {
          const exists = prev.some((u) => u.userId === data.userId);
          if (exists) {
            return prev.map((u) =>
              u.userId === data.userId
                ? { ...u, lastSeen: data.timestamp }
                : u
            );
          }
          return [
            ...prev,
            {
              userId: data.userId,
              userName: data.userName,
              lastSeen: data.timestamp,
              color: getUserColor(data.userId),
            },
          ];
        });
      }
    );

    channel.bind(
      "user-left",
      (data: { userId: string; userName: string }) => {
        setUsers((prev) =>
          prev.filter((u) => u.userId !== data.userId)
        );
      }
    );

    channel.bind(
      "heartbeat",
      (data: { userId: string; userName: string; timestamp: number }) => {
        if (data.userId === currentUserRef.current?.userId) return;

        const eventKey = `heartbeat-${data.userId}-${data.timestamp}`;
        if (pendingUserEventsRef.current.has(eventKey)) {
          return;
        }
        pendingUserEventsRef.current.add(eventKey);
        setTimeout(() => pendingUserEventsRef.current.delete(eventKey), 100);

        setUsers((prev) => {
          const exists = prev.some((u) => u.userId === data.userId);
          if (!exists) {
            return [
              ...prev,
              {
                userId: data.userId,
                userName: data.userName,
                lastSeen: data.timestamp,
                color: getUserColor(data.userId),
              },
            ];
          }
          return prev.map((u) =>
            u.userId === data.userId
              ? { ...u, lastSeen: data.timestamp }
              : u
          );
        });
      }
    );

    channel.bind(
      "message-reaction",
      (data: {
        messageId: string;
        emoji: string;
        userId: string;
        userName: string;
      }) => {
        const reactionKey = `${data.messageId}-${data.emoji}-${data.userId}`;

        if (pendingReactionsRef.current.has(reactionKey)) {
          pendingReactionsRef.current.delete(reactionKey);
          return;
        }

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === data.messageId) {
              const reactions = msg.reactions || [];
              const filteredReactions = reactions.filter(
                (r) => r.userId !== data.userId
              );

              return {
                ...msg,
                reactions: [
                  ...filteredReactions,
                  {
                    emoji: data.emoji,
                    userId: data.userId,
                    userName: data.userName,
                  },
                ],
              };
            }
            return msg;
          })
        );
      }
    );

    channel.bind(
      "user-typing",
      (data: { userId: string; userName: string; isTyping: boolean }) => {
        if (data.userId === currentUserRef.current?.userId) return;

        if (data.isTyping) {
          setTypingUsers((prev) => {
            const filtered = prev.filter((u) => u.userId !== data.userId);
            return [
              ...filtered,
              { userId: data.userId, userName: data.userName, timestamp: Date.now() },
            ];
          });
        } else {
          setTypingUsers((prev) =>
            prev.filter((u) => u.userId !== data.userId)
          );
        }
      }
    );

    fetchMessages().then(() => setIsConnected(true));
    cleanupIntervalRef.current = setInterval(cleanupStaleUsers, 15000);
    intervalRef.current = setInterval(fetchMessages, 5000);

    const handleBeforeUnload = () => {
      handleDisconnect();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleDisconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (channelRef.current) {
        unsubscribeFromChannel(channelName);
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    room,
    username,
    fetchMessages,
    cleanupStaleUsers,
    handleDisconnect,
  ]);

  useEffect(() => {
    if (username && !currentUserRef.current) {
      joinChat(username);
    }
  }, [username, joinChat]);

  const sendMessage = useCallback(
    async (text: string, replyTo?: { id: string; user: string; text: string }) => {
      if (!text.trim() || !username) return;

      const message: Message = {
        id: generateMessageId(),
        user: username,
        text: text.trim(),
        timestamp: new Date().toISOString(),
        isOwn: true,
        replyTo,
      };

      pendingMessageIdsRef.current.add(message.id);
      setMessages((prev) => [...prev, message]);

      try {
        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ room, message }),
        });
      } catch {
        pendingMessageIdsRef.current.delete(message.id);
        setMessages((prev) => prev.filter((m) => m.id !== message.id));
        console.error("Error sending message");
      }
    },
    [username, room]
  );

  const setTyping = useCallback(
    async (isTyping: boolean) => {
      if (!currentUserRef.current) return;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      try {
        await fetch("/api/typing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room,
            userId: currentUserRef.current.userId,
            userName: currentUserRef.current.userName,
            isTyping,
          }),
        });
      } catch (error) {
        console.error("Error sending typing status:", error);
      }
    },
    [room]
  );

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const timeout = 3000;
      setTypingUsers((prev) =>
        prev.filter((u) => now - u.timestamp < timeout)
      );
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return { 
    messages, 
    isConnected, 
    users, 
    typingUsers, 
    sendMessage, 
    addReaction, 
    setTyping,
    joinChat 
  };
}
