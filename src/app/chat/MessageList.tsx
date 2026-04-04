"use client";

import { MessageReactions } from "./MessageReactions";

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
  currentUserId: string;
  onReact: (messageId: string, emoji: string) => void;
}

export function MessageBubble({ message, currentUserId, onReact }: MessageBubbleProps) {
  if (message.isSystem) {
    return (
      <div className="flex justify-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">{message.text}</p>
      </div>
    );
  }

  return (
    <MessageReactions
      isOwn={message.isOwn}
      reactions={message.reactions}
      currentUserId={currentUserId}
      onReact={(emoji) => onReact(message.id, emoji)}
    >
      <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
            message.isOwn
              ? "bg-violet-600 text-white rounded-br-md"
              : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-bl-md shadow-sm"
          }`}
        >
          {!message.isOwn && (
            <p className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-1">
              {message.user}
            </p>
          )}
          <p className="text-sm">{message.text}</p>
          <p className={`text-xs mt-1 ${message.isOwn ? "text-violet-200" : "text-gray-400"}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>
    </MessageReactions>
  );
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onReact: (messageId: string, emoji: string) => void;
}

export function MessageList({ messages, currentUserId, onReact }: MessageListProps) {
  return (
    <main className="flex-1 overflow-y-auto p-4">
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
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} currentUserId={currentUserId} onReact={onReact} />
            ))}
          </>
        )}
      </div>
    </main>
  );
}
