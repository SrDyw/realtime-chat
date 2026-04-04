import { useEffect, useState, useRef, useCallback } from "react";
import { subscribeToChannel, unsubscribeFromChannel } from "@/lib/pusher-client";

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
}

let messageCounter = 0;
let currentUserId: string | null = null;
let currentRoom: string | null = null;

function generateMessageId(): string {
  return `${Date.now()}-${++messageCounter}`;
}

export function useChat(username: string, room: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const lastMessageIdRef = useRef<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<ReturnType<typeof subscribeToChannel> | null>(null);
  const pendingMessageIdsRef = useRef<Set<string>>(new Set());
  const pendingReactionsRef = useRef<Set<string>>(new Set());
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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
    } catch {
      console.error("Error fetching messages");
    }
  }, [username, room]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`/api/presence?room=${room}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch {
      // Silently fail
    }
  }, [room]);

  const registerPresence = useCallback(async () => {
    try {
      await fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: username, userName: username, room }),
      });
    } catch {
      // Silently fail
    }
  }, [username, room]);

  const handleDisconnect = useCallback(async () => {
    try {
      await fetch(`/api/presence?userId=${encodeURIComponent(username)}&userName=${encodeURIComponent(username)}&room=${encodeURIComponent(room)}`, {
        method: "DELETE",
      });
    } catch {
      // Silently fail
    }
  }, [username, room]);

  const addReaction = useCallback((messageId: string, emoji: string) => {
    const msg = messagesRef.current.find(m => m.id === messageId);
    const existingUserReaction = msg?.reactions?.find(r => r.userId === username);
    
    const reactionKey = `${messageId}-${emoji}-${username}`;
    
    if (existingUserReaction?.emoji === emoji) {
      pendingReactionsRef.current.add(reactionKey);
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === messageId) {
            return {
              ...m,
              reactions: (m.reactions || []).filter((r) => !(r.emoji === emoji && r.userId === username)),
            };
          }
          return m;
        })
      );
      
      fetch(`/api/messages/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room, messageId, emoji, userId: username, userName: username }),
      });
      return;
    }

    pendingReactionsRef.current.add(reactionKey);
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const filteredReactions = (m.reactions || []).filter(r => r.userId !== username);
          return {
            ...m,
            reactions: [...filteredReactions, { emoji, userId: username, userName: username }],
          };
        }
        return m;
      })
    );

    fetch(`/api/messages/reaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room, messageId, emoji, userId: username, userName: username }),
    });
  }, [room, username]);

  useEffect(() => {
    const channelName = `chat-${room}`;
    currentUserId = username;
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
        if (prev.some(m => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });

      if (message.id > lastMessageIdRef.current) {
        lastMessageIdRef.current = message.id;
      }
    });

    channel.bind("user-joined", () => {
      fetchUsers();
    });

    channel.bind("user-left", () => {
      fetchUsers();
    });

    channel.bind("message-reaction", (data: { messageId: string; emoji: string; userId: string; userName: string }) => {
      const reactionKey = `${data.messageId}-${data.emoji}-${data.userId}`;
      
      if (pendingReactionsRef.current.has(reactionKey)) {
        pendingReactionsRef.current.delete(reactionKey);
        return;
      }

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === data.messageId) {
            const reactions = msg.reactions || [];
            const filteredReactions = reactions.filter(r => r.userId !== data.userId);
            
            return {
              ...msg,
              reactions: [...filteredReactions, { emoji: data.emoji, userId: data.userId, userName: data.userName }],
            };
          }
          return msg;
        })
      );
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    registerPresence();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages().then(() => setIsConnected(true));

    fetchUsers();

    intervalRef.current = setInterval(() => {
      fetchMessages();
      fetchUsers();
    }, 5000);

    const handleBeforeUnload = () => {
      if (currentUserId === username && currentRoom === room) {
        handleDisconnect();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (currentUserId === username && currentRoom === room) {
        handleDisconnect();
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (channelRef.current) {
        unsubscribeFromChannel(channelName);
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [room, username, fetchMessages, registerPresence, handleDisconnect, fetchUsers]);

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
    } catch {
      pendingMessageIdsRef.current.delete(message.id);
      setMessages((prev) => prev.filter(m => m.id !== message.id));
      console.error("Error sending message");
    }
  }, [username, room]);

  return { messages, isConnected, users, sendMessage, addReaction };
}
