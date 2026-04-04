import { useEffect, useState, useRef, useCallback } from "react";
import { subscribeToChannel, unsubscribeFromChannel } from "@/lib/pusher-client";

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  isOwn?: boolean;
}

let messageCounter = 0;

function generateMessageId(): string {
  return `${Date.now()}-${++messageCounter}`;
}

export function useChat(username: string, room: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userCount] = useState(1);
  const lastMessageIdRef = useRef<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<ReturnType<typeof subscribeToChannel> | null>(null);
  const pendingMessageIdsRef = useRef<Set<string>>(new Set());

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
            const existingIds = new Set(prev.map(m => m.id));
            const uniqueNew = processed.filter(m => !existingIds.has(m.id));
            if (uniqueNew.length === 0) return prev;
            return [...prev, ...uniqueNew];
          });
          
          const maxId = newMessages[newMessages.length - 1]?.id || lastMessageIdRef.current;
          lastMessageIdRef.current = maxId;
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [username, room]);

  useEffect(() => {
    const channelName = `chat-${room}`;

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
        if (prev.some(m => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });

      if (message.id > lastMessageIdRef.current) {
        lastMessageIdRef.current = message.id;
      }
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages().then(() => setIsConnected(true));
    intervalRef.current = setInterval(fetchMessages, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (channelRef.current) {
        unsubscribeFromChannel(channelName);
      }
    };
  }, [room, fetchMessages, username]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const message: Message = {
      id: generateMessageId(),
      user: username,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isOwn: true,
    };

    pendingMessageIdsRef.current.add(message.id);
    setMessages((prev) => [...prev, message]);

    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room, message }),
      });
    } catch (error) {
      pendingMessageIdsRef.current.delete(message.id);
      setMessages((prev) => prev.filter(m => m.id !== message.id));
      console.error("Error sending message:", error);
    }
  }, [username, room]);

  return { messages, isConnected, userCount, sendMessage };
}
