"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { UsernamePrompt } from "./UsernamePrompt";
import { useChat } from "./useChat";
import { useTheme } from "../hooks/useTheme";
import { ReplyMessage } from "@/types/types";



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
  const room = searchParams.get("room") || "general";
  
  const [savedUsername, setSavedUsername] = useState<string | null | undefined>(undefined);
  const [confirmedUsername, setConfirmedUsername] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("quickchat_username");
    setSavedUsername(stored);
  }, []);

  const handleUsernameSubmit = useCallback((name: string) => {
    localStorage.setItem("quickchat_username", name);
    setConfirmedUsername(name);
  }, []);

  const handleUsernameRequired = useCallback(() => {
    setConfirmedUsername(null);
  }, []);

  if (savedUsername === undefined) {
    return <LoadingState />;
  }

  if (confirmedUsername === null) {
    return <UsernamePrompt room={room} onSubmit={handleUsernameSubmit} savedUsername={savedUsername} />;
  }

  return <ChatView username={confirmedUsername} room={room} onUsernameRequired={handleUsernameRequired} />;
}

function ChatView({ username, room, onUsernameRequired }: { username: string; room: string; onUsernameRequired: () => void }) {
  const { messages, isConnected, users, typingUsers, sendMessage, addReaction, setTyping } = useChat(username, room);
  const [replyMessage, setReplyMessage] = useState<ReplyMessage | undefined>();

  const handleReply = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setReplyMessage({ id: message.id, user: message.user, text: message.text });
    }
  };

  const handleCancelReply = () => {
    setReplyMessage(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-900">
      <ChatHeader 
        room={room} 
        isConnected={isConnected} 
        users={users} 
        onChangeUsername={onUsernameRequired}
      />
      <MessageList 
        messages={messages} 
        currentUserName={username} 
        users={users}
        typingUsers={typingUsers}
        onReact={(messageId, emoji) => addReaction(messageId, emoji)} 
        onReply={handleReply}
      />
      <MessageInput 
        onSend={sendMessage} 
        onTyping={setTyping}
        replyMessage={replyMessage}
        onCancelReply={handleCancelReply}
        users={users}
      />
    </div>
  );
}
