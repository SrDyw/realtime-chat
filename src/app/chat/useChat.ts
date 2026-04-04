import { useEffect, useState, useRef, useCallback } from "react";

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  isOwn?: boolean;
}

export function useChat(username: string, room: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userCount, setUserCount] = useState(1);
  const lastMessageIdRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const url = lastMessageIdRef.current > 0 
        ? `/api/messages?room=${room}&since=${lastMessageIdRef.current}`
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
            return [...prev, ...uniqueNew];
          });
          
          const maxId = Math.max(...newMessages.map(m => parseInt(m.id)), 0);
          if (maxId > lastMessageIdRef.current) {
            lastMessageIdRef.current = maxId;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [username, room]);

  useEffect(() => {
    setIsConnected(true);
    fetchMessages();
    
    intervalRef.current = setInterval(fetchMessages, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [room]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const message = {
      id: Date.now().toString(),
      user: username,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/pusher/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room, message }),
      });

      if (response.ok) {
        setMessages((prev) => [...prev, { ...message, isOwn: true }]);
        lastMessageIdRef.current = parseInt(message.id);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [username, room]);

  return { messages, isConnected, userCount, sendMessage };
}
