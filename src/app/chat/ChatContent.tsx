"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useChat } from "./useChat";
import { useTheme } from "../hooks/useTheme";

interface ReplyMessage {
  id: string;
  user: string;
  text: string;
}

function ChatContentInner({ username, room }: { username: string; room: string }) {
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
      <ChatHeader room={room} isConnected={isConnected} users={users} />
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
      />
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
