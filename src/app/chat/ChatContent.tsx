"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useChat } from "./useChat";
import { useTheme } from "../hooks/useTheme";

function ChatContentInner({ username, room }: { username: string; room: string }) {
  const { messages, isConnected, users, sendMessage, addReaction } = useChat(username, room);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-900">
      <ChatHeader room={room} isConnected={isConnected} users={users} />
      <MessageList 
        messages={messages} 
        currentUserName={username} 
        onReact={(messageId, emoji) => addReaction(messageId, emoji)} 
      />
      <MessageInput onSend={sendMessage} />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
      <div className="text-gray-500 dark:text-gray-400">Cargando...</div>
    </div>
  );
}

export default function ChatContent() {
  const { mounted } = useTheme();
  
  if (!mounted) {
    return <LoadingState />;
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <ChatContentWithParams />
    </Suspense>
  );
}

function ChatContentWithParams() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "Anonimo";
  const room = searchParams.get("room") || "general";

  return <ChatContentInner username={username} room={room} />;
}
