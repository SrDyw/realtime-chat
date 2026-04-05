"use client";

import { useState, useRef, useEffect } from "react";
import { MessageReactions } from "./MessageReactions";
import { Modal } from "./Modal";
import ChatTypingBubble from "./ChatTypingBubble";

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

interface MessageBubbleProps {
  message: Message;
  currentUserName: string;
  userColor?: string;
  onReact: (messageId: string, emoji: string) => void;
}

export function MessageBubble({ message, currentUserName, userColor, onReact }: MessageBubbleProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (message.isSystem) {
    return (
      <div className="flex justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">{message.text}</p>
      </div>
    );
  }

  const groupedReactions = message.reactions?.reduce((acc, r) => {
    if (!acc[r.emoji]) {
      acc[r.emoji] = [];
    }
    acc[r.emoji].push(r);
    return acc;
  }, {} as Record<string, Reaction[]>) || {};

  return (
    <>
      <MessageReactions
        isOwn={message.isOwn}
        reactions={message.reactions}
        currentUserName={currentUserName}
        onReact={(emoji) => onReact(message.id, emoji)}
        onShowDetails={() => setShowDetails(true)}
      >
        <div
          onClick={() => setShowDetails(true)}
          className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[70%] rounded-2xl px-4 py-2 cursor-pointer hover:bg-opacity-90 transition-colors ${
              message.isOwn
                ? "bg-violet-600 text-white rounded-br-md"
                : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-bl-md shadow-sm"
            }`}
          >
            {!message.isOwn && (
              <p 
                className="text-xs font-medium mb-1"
                style={{ color: userColor || "#8b5cf6" }}
              >
                {message.user}
              </p>
            )}
            <p className="text-sm break-words">{message.text}</p>
            <p className={`text-xs mt-1 ${message.isOwn ? "text-violet-200" : "text-gray-400"}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      </MessageReactions>

      <Modal isOpen={showDetails} onClose={() => setShowDetails(false)} title="Detalles del mensaje">
        <div className="bg-white dark:bg-zinc-700 rounded-2xl px-4 py-2 max-w-full">
            <p className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-1">
              {message.user}
            </p>
            <p className="text-gray-800 dark:text-white break-words">{message.text}</p>
            <p className="text-xs mt-1 text-gray-400">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          {message.reactions && message.reactions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(groupedReactions).map(([emoji, users]) => (
                <div key={emoji} className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded-full">
                  <span className="text-sm">{emoji}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {users.map(u => u.userName === currentUserName ? "Tú" : u.userName).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          )}
      </Modal>
    </>
  );
}

interface UserPresence {
  userId: string;
  userName: string;
  lastSeen: number;
  color: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserName: string;
  users: UserPresence[];
  typingUsers: { userId: string; userName: string; timestamp: number }[];
  onReact: (messageId: string, emoji: string) => void;
}

export function MessageList({ messages, currentUserName, users, typingUsers, onReact }: MessageListProps) {
  const containerRef = useRef<HTMLElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastMessageCountRef = useRef(0);

  const getUserColor = (userName: string): string => {
    const user = users.find(u => u.userName === userName);
    return user?.color || "#8b5cf6";
  };

  const isNearBottom = () => {
    const container = containerRef.current;
    if (!container) return true;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom < 100;
  };

  const scrollToBottom = (smooth = true) => {
    if (smooth) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      endRef.current?.scrollIntoView();
    }
  };

  useEffect(() => {
    if (lastMessageCountRef.current === 0 && messages.length > 0) {
      lastMessageCountRef.current = messages.length;
      scrollToBottom(false);
      return;
    }

    if (messages.length > lastMessageCountRef.current) {
      const newMessage = messages[messages.length - 1];
      lastMessageCountRef.current = messages.length;

      if (newMessage?.isOwn) {
        scrollToBottom(true);
      } else if (isNearBottom()) {
        scrollToBottom(true);
      }
    }
  }, [messages]);

  useEffect(() => {
  }, [typingUsers]);

  return (
    <main 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4"
    >
      <div className="max-w-4xl mx-auto space-y-4 pb-12">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 dark:bg-zinc-800 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">No hay mensajes aún</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">¡Sé el primero en enviar uno!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              currentUserName={currentUserName} 
              userColor={getUserColor(msg.user)}
              onReact={onReact} 
            />
          ))
        )}

        {typingUsers.length > 0 && (
          <div className="flex justify-start pl-2">
            <ChatTypingBubble users={typingUsers.map(u => u.userName)} />
          </div>
        )}

        <div ref={endRef} />
      </div>
    </main>
  );
}
